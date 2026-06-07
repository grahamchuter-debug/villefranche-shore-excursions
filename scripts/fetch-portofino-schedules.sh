#!/usr/bin/env bash
# Fetch Portofino cruise schedules from CruiseTimetables into public/data/.
# Requires: node and scripts/parse-cruisetimetables-schedule.js (local parser or set PARSER env)
# Usage: PORTOFINO_NEXT=/path/to/portofino-next ./scripts/fetch-portofino-schedules.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PARSER="${PARSER:-$ROOT/scripts/parse-cruisetimetables-schedule.js}"
OUT="$ROOT/public/data"
BASE="https://www.cruisetimetables.com/portofinoitalyschedule"

declare -A MONTHS=(
  [jan]=january [feb]=february [mar]=march [apr]=april [may]=may
  [jun]=june [jul]=july [aug]=august [sep]=september [oct]=october
  [nov]=november [dec]=december
)

fetch() {
  local abbrev="$1" year="$2"
  local full="${MONTHS[$abbrev]}"
  local url="${BASE}-${abbrev}${year}.html"
  local out="${OUT}/${full}-${year}.csv"
  echo "Fetching ${full} ${year}..."
  node "$PARSER" "$url" "$out"
  sleep 5
}

mkdir -p "$OUT"

for abbrev in jun jul aug sep oct nov dec; do
  fetch "$abbrev" 2026
done

for abbrev in jan feb mar apr may jun jul aug sep oct nov dec; do
  fetch "$abbrev" 2027
done

echo "Done. CSV files written to $OUT"
