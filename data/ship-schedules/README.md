# Mediterranean-style Cruise Timetables archive for Villefranche

Working archive used to refresh `public/data/*.csv` with itinerary-extracted
arrival and departure times (never invented defaults).

## Contents

| Path | Purpose |
|------|---------|
| `Villefranche Ship Schedule.xlsx` | Source URL index (month → CruiseTimetables page) |
| `url-index.json` | Machine-readable export of that sheet |
| `raw/villefranche/<yyyy-mm>-offset-NNN.html` | Cached HTML pages (gitignored) |
| `parsed/villefranche.json` | Schedule entries ready for CSV implant |
| `fetch-progress.json` | Resumable fetch checkpoint |

## Commands

```bash
# Rebuild URL index from Excel
python3 scripts/export_schedule_index.py

# Fetch + parse (polite delay; resumable)
python3 scripts/fetch_ship_schedules.py --ports villefranche

# Re-parse cached HTML only
python3 scripts/fetch_ship_schedules.py --ports villefranche --parse-only

# Implant into public/data monthly CSVs
python3 scripts/implant_villefranche_schedule.py
```

Port times are taken from the Villefranche stop inside each cruise itinerary.
Qualitative windows such as “early morning–evening” stay blank rather than
guessed clock times.
