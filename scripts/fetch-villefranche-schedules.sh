#!/usr/bin/env bash
# Fetch Villefranche cruise schedules from CruiseTimetables into public/data/.
# Usage: ./scripts/fetch-villefranche-schedules.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PARSER="${PARSER:-$ROOT/scripts/parse-cruisetimetables-schedule.js}"
OUT="$ROOT/public/data"
BASE="https://www.cruisetimetables.com/villefranchenicefranceschedule"

month_name() {
  case "$1" in
    jan) echo january ;;
    feb) echo february ;;
    mar) echo march ;;
    apr) echo april ;;
    may) echo may ;;
    jun) echo june ;;
    jul) echo july ;;
    aug) echo august ;;
    sep) echo september ;;
    oct) echo october ;;
    nov) echo november ;;
    dec) echo december ;;
    *) echo "Unknown month abbrev: $1" >&2; exit 1 ;;
  esac
}

fetch() {
  local abbrev="$1" year="$2"
  local full
  full="$(month_name "$abbrev")"
  local url="${BASE}-${abbrev}${year}.html"
  local out="${OUT}/${full}-${year}.csv"
  echo "Fetching ${full} ${year}..."
  node "$PARSER" --first-page-only "$url" "$out"
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
