import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";
import { formatVerifiedShipTime } from "@/lib/booking/booking-ship-types";
import { slugifyShipName } from "@/lib/cruise-ship-utils";
import { loadAllVillefrancheScheduleEntries } from "@/lib/villefranche-cruise-ships";
import { getShipImageMetadata, isShipImageMetadataPublishable } from "@/lib/booking/ship-image-metadata";

export type ScheduleConflict = {
  date: string;
  ship: string;
  cruiseLineA: string;
  cruiseLineB: string;
  arrivalA: string;
  arrivalB: string;
  departureA: string;
  departureB: string;
  note: string;
};

export type ScheduleDuplicate = {
  date: string;
  ship: string;
  count: number;
  identical: boolean;
};

export type ScheduleDataQualityReport = {
  generatedAt: string;
  totalRecords: number;
  uniqueShips: number;
  uniqueSailingDates: number;
  datesWithMultipleShips: number;
  recordsMissingArrival: number;
  recordsMissingDeparture: number;
  duplicateRecords: ScheduleDuplicate[];
  conflictingRecords: ScheduleConflict[];
  unmatchedShipImages: { ship: string; slug: string; sailings: number }[];
  inconsistentShipSpellings: { normalized: string; variants: string[] }[];
};

function timeKey(value: string): string {
  return formatVerifiedShipTime(value) ?? "";
}

export function auditVillefrancheScheduleData(
  entries: readonly CruiseScheduleEntry[] = loadAllVillefrancheScheduleEntries(),
): ScheduleDataQualityReport {
  const byDateShip = new Map<string, CruiseScheduleEntry[]>();
  const ships = new Set<string>();
  const dates = new Set<string>();
  const shipsOnDate = new Map<string, Set<string>>();
  const spelling = new Map<string, Set<string>>();
  const sailingsBySlug = new Map<string, { ship: string; count: number }>();

  let missingArrival = 0;
  let missingDeparture = 0;

  for (const entry of entries) {
    ships.add(entry.ship);
    dates.add(entry.date);

    const key = `${entry.date}::${entry.ship}`;
    const list = byDateShip.get(key) ?? [];
    list.push(entry);
    byDateShip.set(key, list);

    const dateShips = shipsOnDate.get(entry.date) ?? new Set();
    dateShips.add(entry.ship);
    shipsOnDate.set(entry.date, dateShips);

    if (!formatVerifiedShipTime(entry.arrival)) missingArrival += 1;
    if (!formatVerifiedShipTime(entry.departure)) missingDeparture += 1;

    const norm = entry.ship.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const variants = spelling.get(norm) ?? new Set();
    variants.add(entry.ship);
    spelling.set(norm, variants);

    const slug = slugifyShipName(entry.ship);
    const sailing = sailingsBySlug.get(slug) ?? { ship: entry.ship, count: 0 };
    sailing.count += 1;
    sailingsBySlug.set(slug, sailing);
  }

  const duplicateRecords: ScheduleDuplicate[] = [];
  const conflictingRecords: ScheduleConflict[] = [];

  for (const [, group] of byDateShip) {
    if (group.length < 2) continue;
    const first = group[0]!;
    const identical = group.every(
      (row) =>
        timeKey(row.arrival) === timeKey(first.arrival) &&
        timeKey(row.departure) === timeKey(first.departure) &&
        row.cruiseLine.trim().toLowerCase() ===
          first.cruiseLine.trim().toLowerCase(),
    );

    duplicateRecords.push({
      date: first.date,
      ship: first.ship,
      count: group.length,
      identical,
    });

    if (!identical) {
      for (let i = 1; i < group.length; i += 1) {
        const other = group[i]!;
        const arrivalConflict =
          timeKey(first.arrival) !== timeKey(other.arrival) &&
          (timeKey(first.arrival) !== "" || timeKey(other.arrival) !== "");
        const departureConflict =
          timeKey(first.departure) !== timeKey(other.departure) &&
          (timeKey(first.departure) !== "" || timeKey(other.departure) !== "");
        const lineConflict =
          first.cruiseLine.trim().toLowerCase() !==
          other.cruiseLine.trim().toLowerCase();

        if (arrivalConflict || departureConflict || lineConflict) {
          conflictingRecords.push({
            date: first.date,
            ship: first.ship,
            cruiseLineA: first.cruiseLine,
            cruiseLineB: other.cruiseLine,
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

  const unmatchedShipImages = [...sailingsBySlug.entries()]
    .filter(([slug]) => {
      const meta = getShipImageMetadata(slug);
      return !meta || !isShipImageMetadataPublishable(meta);
    })
    .map(([, info]) => ({
      ship: info.ship,
      slug: slugifyShipName(info.ship),
      sailings: info.count,
    }))
    .sort((a, b) => b.sailings - a.sailings);

  const inconsistentShipSpellings = [...spelling.entries()]
    .filter(([, variants]) => variants.size > 1)
    .map(([normalized, variants]) => ({
      normalized,
      variants: [...variants].sort(),
    }));

  return {
    generatedAt: new Date().toISOString(),
    totalRecords: entries.length,
    uniqueShips: ships.size,
    uniqueSailingDates: dates.size,
    datesWithMultipleShips: [...shipsOnDate.values()].filter((s) => s.size > 1)
      .length,
    recordsMissingArrival: missingArrival,
    recordsMissingDeparture: missingDeparture,
    duplicateRecords,
    conflictingRecords,
    unmatchedShipImages,
    inconsistentShipSpellings,
  };
}

export function formatScheduleDataQualityMarkdown(
  report: ScheduleDataQualityReport,
): string {
  const lines = [
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
    "## Duplicate records",
    "",
  ];

  if (report.duplicateRecords.length === 0) {
    lines.push("None.", "");
  } else {
    lines.push("| Date | Ship | Count | Identical? |", "| --- | --- | ---: | --- |");
    for (const d of report.duplicateRecords) {
      lines.push(
        `| ${d.date} | ${d.ship} | ${d.count} | ${d.identical ? "yes" : "no"} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Conflicting records (review — not auto-fixed)", "");
  if (report.conflictingRecords.length === 0) {
    lines.push("None.", "");
  } else {
    lines.push(
      "| Date | Ship | Arrival A | Arrival B | Departure A | Departure B | Note |",
      "| --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const c of report.conflictingRecords) {
      lines.push(
        `| ${c.date} | ${c.ship} | ${c.arrivalA} | ${c.arrivalB} | ${c.departureA} | ${c.departureB} | ${c.note} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Ships without publishable booking images", "");
  lines.push("| Ship | Sailings |", "| --- | ---: |");
  for (const s of report.unmatchedShipImages) {
    lines.push(`| ${s.ship} | ${s.sailings} |`);
  }
  lines.push("");

  lines.push("## Inconsistent ship-name spellings", "");
  if (report.inconsistentShipSpellings.length === 0) {
    lines.push("None.", "");
  } else {
    for (const row of report.inconsistentShipSpellings) {
      lines.push(`- \`${row.normalized}\`: ${row.variants.join(" · ")}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
