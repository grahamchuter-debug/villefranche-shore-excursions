#!/usr/bin/env node
/**
 * Write schedule data-quality audit (no silent conflict fixes).
 * Usage: node scripts/audit-schedule-data.cjs
 */

const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const ROOT = path.resolve(__dirname, "..");
  const DATA_DIR = path.join(ROOT, "public/data");

  function parseCsvLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
        continue;
      }
      current += char;
    }
    values.push(current.trim());
    return values;
  }

  function formatTime(value) {
    if (value == null) return null;
    const n = String(value).trim().toLowerCase();
    if (
      !n ||
      n === "tbc" ||
      n === "tb" ||
      n === "00:00" ||
      n === "0:00" ||
      n === "arrival" ||
      n === "departure"
    ) {
      return null;
    }
    return String(value).trim();
  }

  function slugify(name) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const entries = [];
  for (const file of fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".csv"))) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    for (const line of lines.slice(1)) {
      const [date, ship, arrival, departure, cruiseLine = ""] =
        parseCsvLine(line);
      if (!date || !ship) continue;
      entries.push({
        date,
        ship,
        arrival: arrival || "",
        departure: departure || "",
        cruiseLine: cruiseLine.trim(),
      });
    }
  }

  // Load publishable image slugs from catalog.json if present
  const catalogPath = path.join(ROOT, "data/ship-images/catalog.json");
  const catalog = fs.existsSync(catalogPath)
    ? JSON.parse(fs.readFileSync(catalogPath, "utf8"))
    : [];
  const publishable = new Set(
    catalog
      .filter(
        (m) =>
          m.verifiedExactShip &&
          m.file &&
          m.sourceName &&
          m.sourcePage &&
          m.author &&
          m.licence &&
          m.attributionText &&
          fs.existsSync(path.join(ROOT, "public/images/ships", m.file)),
      )
      .map((m) => m.slug),
  );

  const byDateShip = new Map();
  const ships = new Set();
  const dates = new Set();
  const shipsOnDate = new Map();
  const spelling = new Map();
  const sailingsBySlug = new Map();
  let missingArrival = 0;
  let missingDeparture = 0;

  for (const entry of entries) {
    ships.add(entry.ship);
    dates.add(entry.date);
    const key = `${entry.date}::${entry.ship}`;
    const list = byDateShip.get(key) || [];
    list.push(entry);
    byDateShip.set(key, list);
    const ds = shipsOnDate.get(entry.date) || new Set();
    ds.add(entry.ship);
    shipsOnDate.set(entry.date, ds);
    if (!formatTime(entry.arrival)) missingArrival += 1;
    if (!formatTime(entry.departure)) missingDeparture += 1;
    const norm = entry.ship.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const variants = spelling.get(norm) || new Set();
    variants.add(entry.ship);
    spelling.set(norm, variants);
    const slug = slugify(entry.ship);
    const sailing = sailingsBySlug.get(slug) || { ship: entry.ship, count: 0 };
    sailing.count += 1;
    sailingsBySlug.set(slug, sailing);
  }

  const duplicates = [];
  const conflicts = [];
  for (const [, group] of byDateShip) {
    if (group.length < 2) continue;
    const first = group[0];
    const identical = group.every(
      (row) =>
        (formatTime(row.arrival) || "") === (formatTime(first.arrival) || "") &&
        (formatTime(row.departure) || "") ===
          (formatTime(first.departure) || "") &&
        row.cruiseLine.trim().toLowerCase() ===
          first.cruiseLine.trim().toLowerCase(),
    );
    duplicates.push({
      date: first.date,
      ship: first.ship,
      count: group.length,
      identical,
    });
    if (!identical) {
      for (let i = 1; i < group.length; i += 1) {
        const other = group[i];
        const arrivalConflict =
          (formatTime(first.arrival) || "") !==
            (formatTime(other.arrival) || "") &&
          ((formatTime(first.arrival) || "") !== "" ||
            (formatTime(other.arrival) || "") !== "");
        const departureConflict =
          (formatTime(first.departure) || "") !==
            (formatTime(other.departure) || "") &&
          ((formatTime(first.departure) || "") !== "" ||
            (formatTime(other.departure) || "") !== "");
        const lineConflict =
          first.cruiseLine.trim().toLowerCase() !==
          other.cruiseLine.trim().toLowerCase();
        if (arrivalConflict || departureConflict || lineConflict) {
          conflicts.push({
            date: first.date,
            ship: first.ship,
            arrivalA: first.arrival || "(blank)",
            arrivalB: other.arrival || "(blank)",
            departureA: first.departure || "(blank)",
            departureB: other.departure || "(blank)",
            note: [
              arrivalConflict ? "arrival differs" : null,
              departureConflict ? "departure differs" : null,
              lineConflict ? "cruise line differs" : null,
            ]
              .filter(Boolean)
              .join("; "),
          });
        }
      }
    }
  }

  const unmatched = [...sailingsBySlug.entries()]
    .filter(([slug]) => !publishable.has(slug))
    .map(([, info]) => ({ ship: info.ship, sailings: info.count }))
    .sort((a, b) => b.sailings - a.sailings);

  const spellings = [...spelling.entries()]
    .filter(([, v]) => v.size > 1)
    .map(([normalized, variants]) => ({
      normalized,
      variants: [...variants].sort(),
    }));

  const report = {
    generatedAt: new Date().toISOString(),
    totalRecords: entries.length,
    uniqueShips: ships.size,
    uniqueSailingDates: dates.size,
    datesWithMultipleShips: [...shipsOnDate.values()].filter((s) => s.size > 1)
      .length,
    recordsMissingArrival: missingArrival,
    recordsMissingDeparture: missingDeparture,
    duplicateRecords: duplicates,
    conflictingRecords: conflicts,
    unmatchedShipImages: unmatched,
    inconsistentShipSpellings: spellings,
  };

  const outDir = path.join(ROOT, "data/ship-schedules");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "data-quality-audit.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  const md = [
    "# Villefranche schedule data-quality audit",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Total schedule records | ${report.totalRecords} |`,
    `| Unique ships | ${report.uniqueShips} |`,
    `| Unique sailing dates | ${report.uniqueSailingDates} |`,
    `| Dates with multiple ships | ${report.datesWithMultipleShips} |`,
    `| Records missing arrival times | ${report.recordsMissingArrival} |`,
    `| Records missing departure times | ${report.recordsMissingDeparture} |`,
    `| Duplicate date+ship groups | ${report.duplicateRecords.length} |`,
    `| Conflicting records | ${report.conflictingRecords.length} |`,
    `| Ships without publishable images | ${report.unmatchedShipImages.length} |`,
    `| Inconsistent ship-name spellings | ${report.inconsistentShipSpellings.length} |`,
    "",
    "## Conflicting records (review — not auto-fixed)",
    "",
  ];

  if (conflicts.length === 0) md.push("None.", "");
  else {
    md.push(
      "| Date | Ship | Arrival A | Arrival B | Departure A | Departure B | Note |",
      "| --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const c of conflicts) {
      md.push(
        `| ${c.date} | ${c.ship} | ${c.arrivalA} | ${c.arrivalB} | ${c.departureA} | ${c.departureB} | ${c.note} |`,
      );
    }
    md.push("");
  }

  md.push("## Duplicate date+ship groups", "");
  if (duplicates.length === 0) md.push("None.", "");
  else {
    md.push("| Date | Ship | Count | Identical? |", "| --- | --- | ---: | --- |");
    for (const d of duplicates) {
      md.push(
        `| ${d.date} | ${d.ship} | ${d.count} | ${d.identical ? "yes" : "no"} |`,
      );
    }
    md.push("");
  }

  md.push("## Ships without publishable booking images", "");
  md.push("| Ship | Sailings |", "| --- | ---: |");
  for (const s of unmatched) md.push(`| ${s.ship} | ${s.sailings} |`);
  md.push("");

  md.push("## Inconsistent ship-name spellings", "");
  if (spellings.length === 0) md.push("None.", "");
  else {
    for (const row of spellings) {
      md.push(`- \`${row.normalized}\`: ${row.variants.join(" · ")}`);
    }
    md.push("");
  }

  fs.writeFileSync(path.join(outDir, "data-quality-audit.md"), md.join("\n"));
  console.log(JSON.stringify({
    totalRecords: report.totalRecords,
    uniqueShips: report.uniqueShips,
    uniqueSailingDates: report.uniqueSailingDates,
    datesWithMultipleShips: report.datesWithMultipleShips,
    recordsMissingArrival: report.recordsMissingArrival,
    recordsMissingDeparture: report.recordsMissingDeparture,
    duplicates: report.duplicateRecords.length,
    conflicts: report.conflictingRecords.length,
    unmatchedImages: report.unmatchedShipImages.length,
    spellingVariants: report.inconsistentShipSpellings.length,
  }, null, 2));
  console.log(`Wrote ${path.join(outDir, "data-quality-audit.md")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
