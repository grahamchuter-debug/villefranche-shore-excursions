#!/usr/bin/env python3
"""Export Villefranche Ship Schedule.xlsx into a JSON URL index for fetching."""

from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "data/ship-schedules/Villefranche Ship Schedule.xlsx"
OUT = ROOT / "data/ship-schedules/url-index.json"

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

MONTH_ABBREV = {
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "may": 5,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "sept": 9,
    "oct": 10,
    "nov": 11,
    "nove": 11,
    "dec": 12,
}


def excel_serial_to_date(serial: float | int) -> str:
    return (date(1899, 12, 30) + timedelta(days=int(serial))).isoformat()


def month_from_url(url: str | None) -> str | None:
    if not url:
        return None
    match = re.search(r"-([a-z]{3})(\d{4})\.html", url, re.I)
    if not match:
        return None
    month = MONTH_ABBREV.get(match.group(1).lower())
    if not month:
        return None
    return f"{match.group(2)}-{month:02d}"


def month_from_label(raw: str | None) -> str | None:
    if raw is None:
        return None
    text = str(raw).strip()
    try:
        return excel_serial_to_date(float(text))[:7]
    except ValueError:
        pass

    match = re.search(
        r"\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nove?|dec)[a-z]*\s+(\d{4})\b",
        text,
        re.I,
    )
    if match:
        month = MONTH_ABBREV.get(match.group(1).lower()[:4]) or MONTH_ABBREV.get(
            match.group(1).lower()[:3]
        )
        if month:
            return f"{match.group(2)}-{month:02d}"
    return text or None


def load_shared_strings(z: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in z.namelist():
        return []
    root = ET.fromstring(z.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for si in root.findall("m:si", NS):
        texts = [t.text or "" for t in si.findall(".//m:t", NS)]
        strings.append("".join(texts))
    return strings


def cell_value(cell: ET.Element, shared: list[str]) -> str | None:
    v = cell.find("m:v", NS)
    if v is None or v.text is None:
        return None
    if cell.get("t") == "s":
        return shared[int(v.text)]
    return v.text


def main() -> None:
    ports: list[dict] = []
    with zipfile.ZipFile(XLSX) as z:
        shared = load_shared_strings(z)
        wb = ET.fromstring(z.read("xl/workbook.xml"))
        sheets = [
            (s.get("name"), s.get(f"{REL_NS}id"))
            for s in wb.findall("m:sheets/m:sheet", NS)
        ]
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rns = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}
        rid_to_target = {
            r.get("Id"): r.get("Target") for r in rels.findall("r:Relationship", rns)
        }

        for sheet_name, rid in sheets:
            target = rid_to_target[rid]
            if not target.startswith("xl/"):
                target = f"xl/{target}"
            root = ET.fromstring(z.read(target))
            rows = root.findall("m:sheetData/m:row", NS)
            port_label = None
            months: list[dict] = []
            for i, row in enumerate(rows):
                vals = [cell_value(c, shared) for c in row.findall("m:c", NS)]
                if i == 0:
                    port_label = (vals[0] or sheet_name or "").strip()
                    continue
                if not vals:
                    continue
                raw_date, raw_url = (vals + [None, None])[:2]
                status = "url"
                url = None
                if not raw_url or not str(raw_url).strip():
                    status = "blank"
                elif str(raw_url).strip().lower() == "no visits":
                    status = "no_visits"
                elif str(raw_url).startswith("http"):
                    url = str(raw_url).strip()
                else:
                    status = "other"

                month_key = month_from_url(url) or month_from_label(raw_date)
                months.append(
                    {
                        "month": month_key,
                        "status": status,
                        "url": url,
                        "rawDate": raw_date,
                    }
                )

            slug = (sheet_name or "villefranche").lower().replace(" ", "-")
            if "villefranche" in slug:
                slug = "villefranche"
            ports.append(
                {
                    "sheet": sheet_name,
                    "name": port_label or sheet_name,
                    "slug": slug,
                    "months": months,
                }
            )

    payload = {
        "source": str(XLSX.name),
        "portCount": len(ports),
        "urlCount": sum(1 for p in ports for m in p["months"] if m["status"] == "url"),
        "noVisitCount": sum(
            1 for p in ports for m in p["months"] if m["status"] == "no_visits"
        ),
        "ports": ports,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Wrote {OUT} ({payload['portCount']} ports, {payload['urlCount']} urls)")


if __name__ == "__main__":
    main()
