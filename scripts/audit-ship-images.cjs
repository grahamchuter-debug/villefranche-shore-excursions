#!/usr/bin/env node
/**
 * Audit Villefranche schedule ships against the ship-image catalogue and disk.
 *
 * Usage: node scripts/audit-ship-images.mjs
 *
 * Does not download or assign images. Writes:
 *   data/ship-images/audit-latest.json
 *   data/ship-images/audit-latest.md
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "public/data");
const SHIP_DIR = path.join(ROOT, "public/images/ships");
const OUT_DIR = path.join(ROOT, "data/ship-images");

/** Synced from wikimedia-inbox metas → data/ship-images/catalog.json */
const CATALOG = fs.existsSync(path.join(OUT_DIR, "catalog.json"))
  ? JSON.parse(fs.readFileSync(path.join(OUT_DIR, "catalog.json"), "utf8"))
  : [];

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublishable(meta) {
  return (
    meta.verifiedExactShip &&
    Boolean(meta.file?.trim()) &&
    Boolean(meta.sourceName?.trim()) &&
    Boolean(meta.sourcePage?.trim()) &&
    Boolean(meta.author?.trim()) &&
    Boolean(meta.licence?.trim()) &&
    Boolean(meta.attributionText?.trim())
  );
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length <= 1) return [];
  return lines.slice(1).map((line) => {
    const [date, ship, arrival, departure, cruiseLine = ""] = line.split(",");
    return {
      date: (date || "").trim(),
      ship: (ship || "").trim(),
      cruiseLine: (cruiseLine || "").trim(),
    };
  });
}

function main() {
  const byShip = new Map();

  for (const file of fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".csv"))) {
    const rows = parseCsv(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
    for (const row of rows) {
      if (!row.ship) continue;
      const existing = byShip.get(row.ship) ?? {
        shipName: row.ship,
        slug: slugify(row.ship),
        cruiseLines: new Set(),
        dates: new Set(),
      };
      if (row.cruiseLine) existing.cruiseLines.add(row.cruiseLine);
      if (row.date) existing.dates.add(row.date);
      byShip.set(row.ship, existing);
    }
  }

  const catalogBySlug = new Map(CATALOG.map((entry) => [entry.slug, entry]));
  const diskFiles = fs.existsSync(SHIP_DIR)
    ? fs.readdirSync(SHIP_DIR)
    : [];

  const fileUsage = new Map();
  for (const entry of CATALOG) {
    const key = entry.file;
    fileUsage.set(key, (fileUsage.get(key) ?? 0) + 1);
  }

  const ships = [...byShip.values()]
    .sort((a, b) => a.shipName.localeCompare(b.shipName))
    .map((ship) => {
      const meta = catalogBySlug.get(ship.slug);
      const matchingFiles = diskFiles.filter((name) =>
        name.startsWith(`${ship.slug}-`),
      );
      const primaryExists = meta
        ? fs.existsSync(path.join(SHIP_DIR, meta.file))
        : false;
      const publishable = meta ? isPublishable(meta) && primaryExists : false;
      const missingMetadataFields = meta
        ? [
            !meta.sourceName && "sourceName",
            !meta.sourcePage && "sourcePage",
            !meta.author && "author",
            !meta.licence && "licence",
            !meta.attributionText && "attributionText",
          ].filter(Boolean)
        : ["not-in-catalogue"];

      return {
        shipName: ship.shipName,
        slug: ship.slug,
        cruiseLine: [...ship.cruiseLines].sort().join(" / ") || "Not listed",
        dates: [...ship.dates].sort(),
        dateCount: ship.dates.size,
        imageAssigned: meta?.file ?? null,
        imageExistsOnDisk: primaryExists || matchingFiles.length > 0,
        diskFiles: matchingFiles,
        verifiedExactShip: meta?.verifiedExactShip ?? false,
        appearsExactVessel: meta?.verifiedExactShip
          ? "catalogue claims exact vessel — human re-check recommended when sourcing"
          : "no verified exact-vessel image",
        missingImage: !publishable,
        usingFallback: !publishable,
        duplicateImageUsage:
          meta && (fileUsage.get(meta.file) ?? 0) > 1
            ? "same file referenced more than once in catalogue"
            : null,
        sourceMetadata: meta
          ? {
              sourceName: meta.sourceName || null,
              sourcePage: meta.sourcePage || null,
              author: meta.author || null,
              licence: meta.licence || null,
              attributionRequired: meta.attributionRequired,
              attributionText: meta.attributionText || null,
              imagePosition: meta.imagePosition,
              missingFields: missingMetadataFields,
            }
          : null,
        publishable,
      };
    });

  const orphanDisk = diskFiles.filter((name) => {
    const slug = name.replace(/-\d+\.(webp|avif)$/i, "");
    return !catalogBySlug.has(slug);
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    totalShipsReferenced: ships.length,
    shipsWithVerifiedPublishableImages: ships.filter((s) => s.publishable)
      .length,
    shipsMissingImages: ships.filter((s) => s.missingImage).length,
    shipsUsingFallbacks: ships.filter((s) => s.usingFallback).length,
    imagesMissingSourceOrLicence: ships.filter(
      (s) =>
        s.sourceMetadata &&
        Array.isArray(s.sourceMetadata.missingFields) &&
        s.sourceMetadata.missingFields.length > 0 &&
        s.sourceMetadata.missingFields[0] !== "not-in-catalogue",
    ).length,
    catalogueEntries: CATALOG.length,
    orphanDiskFiles: orphanDisk,
    possibleDuplicateOrIncorrectMatches: ships.filter(
      (s) => s.duplicateImageUsage,
    ),
  };

  const report = { summary, ships };
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "audit-latest.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  const md = [
    "# Villefranche ship-image audit",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Total ships referenced: **${summary.totalShipsReferenced}**`,
    `- Ships with verified publishable images: **${summary.shipsWithVerifiedPublishableImages}**`,
    `- Ships missing images / using fallbacks: **${summary.shipsMissingImages}**`,
    `- Catalogue entries missing source or licence: **${summary.imagesMissingSourceOrLicence}**`,
    `- Orphan disk files not in catalogue: **${summary.orphanDiskFiles.length}**`,
    "",
    "## Exact vessel rule",
    "",
    "Do not assign sister-ship, same-line, generic, or AI vessel photography.",
    "Publish only when `verifiedExactShip` and complete source/licence metadata are set.",
    "",
    "## Ships",
    "",
    "| Ship | Line | Dates | Image | On disk | Publishable | Missing meta |",
    "| --- | --- | ---: | --- | --- | --- | --- |",
    ...ships.map((s) => {
      const missing = s.sourceMetadata?.missingFields?.join(", ") || "—";
      return `| ${s.shipName} | ${s.cruiseLine} | ${s.dateCount} | ${s.imageAssigned ?? "—"} | ${s.imageExistsOnDisk ? "yes" : "no"} | ${s.publishable ? "yes" : "no"} | ${missing} |`;
    }),
    "",
  ].join("\n");

  fs.writeFileSync(path.join(OUT_DIR, "audit-latest.md"), md);

  console.log(JSON.stringify(summary, null, 2));
  console.log(`Wrote ${path.join(OUT_DIR, "audit-latest.json")}`);
  console.log(`Wrote ${path.join(OUT_DIR, "audit-latest.md")}`);
}

main();
