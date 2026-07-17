#!/usr/bin/env python3
"""
Fetch Cruise Timetables month pages (with offset pagination) and parse
into ScheduleEntry-shaped JSON for Villefranche, ready for CSV implant.

Polite defaults: 12s between requests, stop after consecutive blocks.
Resumable via progress JSON.
"""

from __future__ import annotations

import argparse
import json
import random
import re
import subprocess
import time
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "data/ship-schedules/url-index.json"
RAW_DIR = ROOT / "data/ship-schedules/raw"
PARSED_DIR = ROOT / "data/ship-schedules/parsed"
PROGRESS = ROOT / "data/ship-schedules/fetch-progress.json"

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

# Port slug -> strings that identify this stop in itinerary links / labels
PORT_MATCHERS: dict[str, list[str]] = {
    "villefranche": [
        "villefranche-nice",
        "villefranche (nice)",
        "villefranche-sur-mer",
        "villefranche, france",
        "villefranche",
    ],
}

MONTH_NAMES = {
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "may": 5,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12,
}


def load_progress() -> dict:
    if PROGRESS.exists():
        return json.loads(PROGRESS.read_text())
    return {
        "completedPages": {},
        "failedPages": {},
        "portsDone": [],
        "consecutiveBlocks": 0,
        "stats": {"fetched": 0, "parsedEntries": 0, "blocked": 0, "errors": 0},
    }


def save_progress(progress: dict) -> None:
    PROGRESS.parent.mkdir(parents=True, exist_ok=True)
    PROGRESS.write_text(json.dumps(progress, indent=2) + "\n")


def fetch_html(url: str, timeout: int = 45) -> tuple[int, str]:
    """Fetch via curl — more reliable than urllib SSL on some macOS Python installs."""
    result = subprocess.run(
        [
            "curl",
            "-sL",
            "--compressed",
            "--max-time",
            str(timeout),
            "-A",
            USER_AGENT,
            "-H",
            "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "-H",
            "Accept-Language: en-GB,en;q=0.9",
            "-w",
            "\n__HTTP_STATUS__:%{http_code}",
            url,
        ],
        capture_output=True,
        text=True,
        errors="replace",
    )
    out = result.stdout or ""
    status = 0
    if "__HTTP_STATUS__:" in out:
        body, _, status_part = out.rpartition("__HTTP_STATUS__:")
        try:
            status = int(status_part.strip())
        except ValueError:
            status = 0
    else:
        body = out
        status = 0 if result.returncode != 0 else 200
    if result.returncode != 0 and not body.strip():
        raise RuntimeError(f"curl failed ({result.returncode}): {result.stderr.strip()}")
    return status, body


def is_blocked(status: int, html: str) -> bool:
    if status in {403, 429, 503}:
        return True
    lower = html.lower()
    markers = (
        "access denied",
        "sucuri website firewall",
        "request blocked",
        "attention required",
        "cf-browser-verification",
        "just a moment",
    )
    return any(m in lower for m in markers)


def showing_total(html: str) -> tuple[int, int, int] | None:
    m = re.search(
        r"Showing\s+(\d+)\s+to\s+(\d+)\s+of\s+total\s+(\d+)",
        html,
        re.I,
    )
    if not m:
        return None
    return int(m.group(1)), int(m.group(2)), int(m.group(3))


def page_offsets(total: int, page_size: int = 10) -> list[int]:
    """Cruise Timetables uses 1-based offsets: page2=?offset=11, page3=?offset=21, ..."""
    if total <= 0:
        return [0]
    offsets = [0]
    start = page_size + 1
    while start <= total:
        offsets.append(start)
        start += page_size
    return offsets


def raw_path(slug: str, month: str, offset: int) -> Path:
    return RAW_DIR / slug / f"{month}-offset-{offset:03d}.html"


def parse_arriving_date(text: str, fallback_year: int) -> str | None:
    """Parse 'Sun 5 Jul 2026' -> ISO date."""
    m = re.search(
        r"\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\b",
        text,
    )
    if not m:
        m = re.search(r"\b(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\b", text)
    if not m:
        return None
    day = int(m.group(1))
    mon = MONTH_NAMES.get(m.group(2)[:3].lower())
    year = int(m.group(3))
    if not mon:
        return None
    return f"{year:04d}-{mon:02d}-{day:02d}"


def normalize_time(token: str) -> str | None:
    token = token.strip().lower()
    token = re.sub(r"^[ad]", "", token)
    if not re.fullmatch(r"\d{3,4}", token):
        return None
    token = token.zfill(4)
    return f"{token[:2]}:{token[2:]}"


def compute_time_in_port(arrival: str | None, departure: str | None) -> str | None:
    if not arrival or not departure:
        return None
    try:
        ah, am = map(int, arrival.split(":"))
        dh, dm = map(int, departure.split(":"))
    except ValueError:
        return None
    minutes = dh * 60 + dm - (ah * 60 + am)
    if minutes < 0:
        minutes += 24 * 60
    hours, mins = divmod(minutes, 60)
    return f"{hours}h" if mins == 0 else f"{hours}h {mins}m"


def extract_port_times(itinerary_html: str, slug: str) -> tuple[str | None, str | None, str | None]:
    """Return (arrival, departure, notes) for this port from itinerary HTML."""
    matchers = PORT_MATCHERS.get(slug, [slug])
    # Each stop looks like: <a ...>Port Name</a>  (05 Jul 0500-1700);
    stops = re.findall(
        r"<a[^>]+href=['\"]([^'\"]+)['\"][^>]*>(.*?)</a>\s*\(([^)]*)\)",
        itinerary_html,
        re.I | re.S,
    )
    for href, label, paren in stops:
        hay = f"{unescape(href)} {unescape(re.sub('<[^>]+>', '', label))}".lower()
        if not any(m in hay for m in matchers):
            continue
        notes_bits: list[str] = []
        if "(+1)" in paren or "+1" in paren:
            notes_bits.append("overnight/next-day timing")
        # Examples: 05 Jul 0500-1700 | 05 Jul d1600 | 05 Jul a0800 | 05 Jul (+1)
        times = re.findall(r"[ad]?\d{3,4}", paren, re.I)
        arrival = departure = None
        if len(times) >= 2:
            arrival = normalize_time(times[0])
            departure = normalize_time(times[1])
        elif len(times) == 1:
            token = times[0].lower()
            if token.startswith("d"):
                departure = normalize_time(token)
                notes_bits.append("departure only")
            elif token.startswith("a"):
                arrival = normalize_time(token)
                notes_bits.append("arrival only")
            else:
                # ambiguous single time — treat as arrival
                arrival = normalize_time(token)
        notes = "; ".join(notes_bits) if notes_bits else None
        return arrival, departure, notes
    return None, None, "port time not found in itinerary"


def parse_cruise_line(listing_html: str) -> str:
    m = re.search(
        r"Cruise itinerary map for\s+(.+?)\s+\d+\s+Night",
        listing_html,
        re.I,
    )
    if m:
        return unescape(m.group(1)).strip()
    m = re.search(
        r"alt=['\"]More details for .+? at ([^'\"]+)['\"]",
        listing_html,
        re.I,
    )
    if m:
        return unescape(m.group(1)).strip()
    return ""


def parse_listings(html: str, slug: str, month: str) -> list[dict]:
    year = int(month.split("-")[0]) if month and month[0].isdigit() else datetime.now().year
    listings = re.findall(
        r"<div class='cd-listing'>.*?<!--End cd-listing-->",
        html,
        re.I | re.S,
    )
    entries: list[dict] = []
    for block in listings:
        info = re.search(r"<div class='cd-info'[^>]*>.*?<!-- End cd-info", block, re.I | re.S)
        info_html = info.group(0) if info else block
        arriving = re.search(r"Arriving\s*<b>([^<]+)</b>", info_html, re.I)
        ship = re.search(
            r"Ship\s*<a[^>]+>([^<]+)</a>",
            info_html,
            re.I,
        )
        if not arriving or not ship:
            continue
        date_iso = parse_arriving_date(unescape(arriving.group(1)), year)
        if not date_iso:
            continue
        itinerary = re.search(
            r"<div[^>]*class='cd-itinerary[^']*'[^>]*>.*?<!--End cd-itinerary-->",
            block,
            re.I | re.S,
        )
        itin_html = itinerary.group(0) if itinerary else ""
        arrival, departure, notes = extract_port_times(itin_html, slug)
        entry = {
            "date": date_iso,
            "ship": unescape(ship.group(1)).strip(),
            "cruiseLine": parse_cruise_line(block),
            "arrival": arrival or "",
            "departure": departure or "",
            "timeInPort": compute_time_in_port(arrival, departure),
            "callType": "Port of call",
        }
        if notes:
            entry["notes"] = notes
        entries.append(entry)
    return entries


def month_page_url(base_url: str, offset: int) -> str:
    if offset <= 0:
        return base_url
    sep = "&" if "?" in base_url else "?"
    return f"{base_url}{sep}offset={offset}"


def sleep_politely(delay: float) -> None:
    jitter = random.uniform(0, min(3.0, delay * 0.25))
    time.sleep(delay + jitter)


def dedupe_entries(entries: list[dict]) -> list[dict]:
    seen: set[tuple] = set()
    out: list[dict] = []
    for e in entries:
        key = (e.get("date"), e.get("ship"), e.get("arrival"), e.get("departure"))
        if key in seen:
            continue
        seen.add(key)
        out.append(e)
    out.sort(key=lambda e: (e["date"], e.get("ship") or ""))
    return out


def advance_offset(offsets_known: list[int] | None, offset: int) -> int | None:
    if not offsets_known or offset not in offsets_known:
        return None
    idx = offsets_known.index(offset)
    if idx + 1 >= len(offsets_known):
        return None
    return offsets_known[idx + 1]


def fetch_month(
    slug: str,
    month: str,
    base_url: str,
    progress: dict,
    delay: float,
    max_blocks: int,
) -> list[dict]:
    entries: list[dict] = []
    offsets_known: list[int] | None = None
    offset = 0
    page_block_attempts = 0
    live_fetches = 0
    progress.setdefault("skippedPages", {})

    while True:
        page_key = f"{slug}/{month}/offset-{offset}"
        path = raw_path(slug, month, offset)
        fetched_this_round = False

        if page_key in progress["skippedPages"] and page_key not in progress["completedPages"]:
            print(f"  skip known bad page {page_key}")
            if offsets_known is None:
                # Bootstrap totals from an earlier completed page in this month if needed
                for prior in sorted((RAW_DIR / slug).glob(f"{month}-offset-*.html")):
                    totals = showing_total(prior.read_text(errors="replace"))
                    if totals:
                        offsets_known = page_offsets(totals[2])
                        break
                if offsets_known is None:
                    offsets_known = page_offsets(0)
            nxt = advance_offset(offsets_known, offset)
            if nxt is None:
                break
            offset = nxt
            page_block_attempts = 0
            continue

        if page_key in progress["completedPages"] and path.exists():
            html = path.read_text(errors="replace")
        else:
            url = month_page_url(base_url, offset)
            # After replaying cache, pause before the first live request
            if live_fetches == 0:
                print(f"  warming up {int(delay * 2)}s before first live fetch…")
                sleep_politely(delay * 2)
            print(f"  fetch {url}")
            try:
                status, html = fetch_html(url)
            except RuntimeError as e:
                progress["stats"]["errors"] += 1
                page_block_attempts += 1
                progress["failedPages"][page_key] = {
                    "url": url,
                    "reason": str(e),
                    "at": datetime.now(timezone.utc).isoformat(),
                }
                save_progress(progress)
                print(f"  ERROR {e} (attempt {page_block_attempts}/{max_blocks})")
                if page_block_attempts >= max_blocks:
                    progress["skippedPages"][page_key] = {
                        "url": url,
                        "reason": str(e),
                        "at": datetime.now(timezone.utc).isoformat(),
                    }
                    progress["consecutiveBlocks"] = 0
                    save_progress(progress)
                    print(f"  SKIP {page_key} after repeated errors; cooling 3m")
                    time.sleep(180)
                    nxt = advance_offset(offsets_known, offset)
                    if nxt is None:
                        break
                    offset = nxt
                    page_block_attempts = 0
                    continue
                sleep_politely(delay * 3)
                continue

            progress["stats"]["fetched"] += 1
            live_fetches += 1
            fetched_this_round = True
            if is_blocked(status, html):
                progress["stats"]["blocked"] += 1
                progress["consecutiveBlocks"] += 1
                page_block_attempts += 1
                progress["failedPages"][page_key] = {
                    "url": url,
                    "status": status,
                    "reason": "blocked",
                    "at": datetime.now(timezone.utc).isoformat(),
                }
                save_progress(progress)
                print(
                    f"  BLOCKED status={status} "
                    f"page_attempts={page_block_attempts}/{max_blocks} "
                    f"run_consecutive={progress['consecutiveBlocks']}"
                )
                if page_block_attempts >= max_blocks:
                    progress["skippedPages"][page_key] = {
                        "url": url,
                        "status": status,
                        "reason": "blocked",
                        "at": datetime.now(timezone.utc).isoformat(),
                    }
                    progress["consecutiveBlocks"] = 0
                    save_progress(progress)
                    print(f"  SKIP {page_key}; cooling 5m then continuing")
                    time.sleep(300)
                    nxt = advance_offset(offsets_known, offset)
                    if nxt is None:
                        break
                    offset = nxt
                    page_block_attempts = 0
                    continue
                sleep_politely(delay * 4)
                continue

            progress["consecutiveBlocks"] = 0
            page_block_attempts = 0
            progress["skippedPages"].pop(page_key, None)
            progress["failedPages"].pop(page_key, None)
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(html)
            progress["completedPages"][page_key] = {
                "url": url,
                "bytes": len(html),
                "at": datetime.now(timezone.utc).isoformat(),
            }
            save_progress(progress)

        page_entries = parse_listings(html, slug, month)
        entries.extend(page_entries)

        totals = showing_total(html)
        if totals:
            _start, _end, total = totals
            if offsets_known is None:
                offsets_known = page_offsets(total)
                print(f"  {month}: {total} calls across {len(offsets_known)} pages")
        elif offsets_known is None:
            offsets_known = [0]

        nxt = advance_offset(offsets_known, offset)
        if nxt is None:
            if fetched_this_round:
                sleep_politely(delay)
            break
        offset = nxt
        if fetched_this_round:
            sleep_politely(delay)

    return entries


def write_port_json(slug: str, entries: list[dict]) -> Path:
    path = PARSED_DIR / f"{slug}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(entries, indent=2) + "\n")
    return path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--ports",
        default="villefranche",
        help="Comma-separated port slugs, or 'all'",
    )
    parser.add_argument("--delay", type=float, default=12.0)
    parser.add_argument("--max-blocks", type=int, default=3)
    parser.add_argument(
        "--parse-only",
        action="store_true",
        help="Re-parse existing raw HTML without fetching",
    )
    args = parser.parse_args()

    index = json.loads(INDEX.read_text())
    wanted = (
        [p["slug"] for p in index["ports"]]
        if args.ports.strip().lower() == "all"
        else [s.strip().lower() for s in args.ports.split(",") if s.strip()]
    )

    progress = load_progress()
    summary: list[dict] = []

    for port in index["ports"]:
        slug = port["slug"]
        if slug not in wanted:
            continue
        print(f"\n=== {port['name']} ({slug}) ===")
        all_entries: list[dict] = []

        for month_row in port["months"]:
            month = month_row["month"] or "unknown"
            if month_row["status"] == "no_visits":
                print(f"  {month}: no visits")
                continue
            if month_row["status"] != "url" or not month_row["url"]:
                print(f"  {month}: skip ({month_row['status']})")
                continue

            if args.parse_only:
                # parse every raw file for this month
                month_entries: list[dict] = []
                for path in sorted((RAW_DIR / slug).glob(f"{month}-offset-*.html")):
                    month_entries.extend(
                        parse_listings(path.read_text(errors="replace"), slug, month)
                    )
                print(f"  {month}: parsed {len(month_entries)} from raw")
                all_entries.extend(month_entries)
                continue

            try:
                month_entries = fetch_month(
                    slug,
                    month,
                    month_row["url"],
                    progress,
                    args.delay,
                    args.max_blocks,
                )
            except RuntimeError as e:
                print(f"STOP: {e}")
                write_port_json(slug, dedupe_entries(all_entries))
                save_progress(progress)
                return

            print(f"  {month}: {len(month_entries)} entries")
            all_entries.extend(month_entries)

        entries = dedupe_entries(all_entries)
        out = write_port_json(slug, entries)
        progress["stats"]["parsedEntries"] = progress["stats"].get("parsedEntries", 0) + len(
            entries
        )
        if slug not in progress["portsDone"]:
            progress["portsDone"].append(slug)
        save_progress(progress)
        summary.append({"slug": slug, "entries": len(entries), "path": str(out)})
        print(f"Wrote {out} ({len(entries)} entries)")

    print("\nDone.")
    for row in summary:
        print(f"  {row['slug']}: {row['entries']} entries")
    print(json.dumps(progress["stats"], indent=2))


if __name__ == "__main__":
    main()
