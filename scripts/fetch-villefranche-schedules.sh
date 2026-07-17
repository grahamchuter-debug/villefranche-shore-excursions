#!/usr/bin/env bash
# Refresh Villefranche schedules from the CruiseTimetables URL index.
# Same workflow as the Mediterranean shore-excursion archive.
#
# Usage: ./scripts/fetch-villefranche-schedules.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

python3 "$ROOT/scripts/export_schedule_index.py"
python3 "$ROOT/scripts/fetch_ship_schedules.py" --ports villefranche "$@"
python3 "$ROOT/scripts/implant_villefranche_schedule.py"

echo "Done. Monthly CSVs updated in $ROOT/public/data"
