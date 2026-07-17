#!/usr/bin/env python3
"""
Implant parsed Villefranche schedule JSON into public/data monthly CSVs.

Usage:
  python3 scripts/implant_villefranche_schedule.py
"""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARSED = ROOT / "data/ship-schedules/parsed/villefranche.json"
OUT_DIR = ROOT / "public/data"

MONTH_NAMES = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
]


def csv_name_for_month(month_key: str) -> str:
    year, month = month_key.split("-")
    return f"{MONTH_NAMES[int(month) - 1]}-{year}.csv"


def normalize_clock(value: str | None) -> str:
    if not value:
        return ""
    text = value.strip()
    lower = text.lower()
    if not lower or lower in {"tbc", "tb", "00:00", "0:00"}:
        return ""
    return text


def main() -> None:
    if not PARSED.exists():
        raise SystemExit(f"Missing parsed schedule: {PARSED}")

    entries = json.loads(PARSED.read_text())
    by_month: dict[str, list[dict]] = defaultdict(list)

    for entry in entries:
        date = entry.get("date") or ""
        if len(date) < 7:
            continue
        month_key = date[:7]
        by_month[month_key].append(
            {
                "date": date,
                "ship": (entry.get("ship") or "").strip(),
                "arrival": normalize_clock(entry.get("arrival")),
                "departure": normalize_clock(entry.get("departure")),
                "cruiseline": (entry.get("cruiseLine") or "").strip(),
            }
        )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = 0
    timed = 0

    for month_key in sorted(by_month):
        rows = sorted(
            by_month[month_key],
            key=lambda row: (row["date"], row["ship"].lower()),
        )
        # Dedupe exact ship/date pairs preferring rows with times
        deduped: dict[tuple[str, str], dict] = {}
        for row in rows:
            key = (row["date"], row["ship"])
            existing = deduped.get(key)
            if existing is None:
                deduped[key] = row
                continue
            existing_score = bool(existing["arrival"]) + bool(existing["departure"])
            new_score = bool(row["arrival"]) + bool(row["departure"])
            if new_score > existing_score:
                deduped[key] = row

        final_rows = sorted(
            deduped.values(),
            key=lambda row: (row["date"], row["ship"].lower()),
        )
        path = OUT_DIR / csv_name_for_month(month_key)
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(
                handle,
                fieldnames=["date", "ship", "arrival", "departure", "cruiseline"],
                lineterminator="\n",
            )
            writer.writeheader()
            writer.writerows(final_rows)
        written += 1
        timed += sum(1 for row in final_rows if row["arrival"] or row["departure"])
        print(f"{path.name}: {len(final_rows)} calls")

    # Ensure no-visit months from the index still exist as empty CSVs when listed
    index_path = ROOT / "data/ship-schedules/url-index.json"
    if index_path.exists():
        index = json.loads(index_path.read_text())
        for port in index.get("ports", []):
            if port.get("slug") != "villefranche":
                continue
            for month_row in port.get("months", []):
                month_key = month_row.get("month")
                if not month_key or not re_fullmatch_month(month_key):
                    continue
                path = OUT_DIR / csv_name_for_month(month_key)
                if path.exists():
                    continue
                with path.open("w", newline="", encoding="utf-8") as handle:
                    writer = csv.DictWriter(
                        handle,
                        fieldnames=["date", "ship", "arrival", "departure", "cruiseline"],
                        lineterminator="\n",
                    )
                    writer.writeheader()
                print(f"{path.name}: 0 calls (placeholder)")

    print(f"Wrote {written} month CSV(s); {timed} calls have at least one clock time")


def re_fullmatch_month(value: str) -> bool:
    return bool(__import__("re").fullmatch(r"\d{4}-\d{2}", value))


if __name__ == "__main__":
    main()
