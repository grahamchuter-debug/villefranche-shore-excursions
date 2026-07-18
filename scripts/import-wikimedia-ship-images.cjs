#!/usr/bin/env node
/**
 * Import Wikimedia Commons ship candidates into public/images/ships + metadata stubs.
 *
 * Usage:
 *   node scripts/import-wikimedia-ship-images.cjs
 *   node scripts/import-wikimedia-ship-images.cjs --only=norwegian-epic,silver-shadow
 *
 * Reads: data/ship-images/wikimedia-candidates.json
 * Resolves missing downloadUrl/author/licence via Commons API.
 * Writes optimised AVIF/WebP + inbox meta JSON.
 * Does NOT edit ship-image-metadata.ts — sync catalogue after review.
 */

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const http = require("node:http");

const ROOT = path.resolve(__dirname, "..");
const CANDIDATES_PATH = path.join(
  ROOT,
  "data/ship-images/wikimedia-candidates.json",
);
const INBOX = path.join(ROOT, "data/ship-images/wikimedia-inbox");
const OUT_DIR = path.join(ROOT, "public/images/ships");
const RESULTS_PATH = path.join(ROOT, "data/ship-images/import-results.json");

const UA =
  "VillefrancheShoreExcursionsBot/1.0 (ship imagery licence import; contact info@villefrancheshoreexcursions.com)";

const args = process.argv.slice(2);
const allowMedium = args.includes("--allow-medium");
const onlyArg = args.find((a) => a.startsWith("--only="));
const onlySlugs = onlyArg
  ? new Set(
      onlyArg
        .slice("--only=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : null;

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchBuffer(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": UA } }, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          getJson(res.headers.location).then(resolve, reject);
          return;
        }
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function resolveCommonsFile(commonsFileTitle) {
  const q = new URLSearchParams({
    action: "query",
    format: "json",
    titles: commonsFileTitle,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
  });
  const data = await getJson(`https://commons.wikimedia.org/w/api.php?${q}`);
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url) throw new Error(`No imageinfo for ${commonsFileTitle}`);
  const artist = (info.extmetadata?.Artist?.value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const lic =
    info.extmetadata?.LicenseShortName?.value ||
    info.extmetadata?.License?.value ||
    "";
  const licenceUrl = info.extmetadata?.LicenseUrl?.value || "";
  return {
    downloadUrl: info.url,
    author: artist,
    licence: lic,
    licenceUrl,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function optimise(slug, sourcePath) {
  const sharp = require("sharp");
  const image = sharp(sourcePath).rotate();
  const widths = [1280, 1920];
  const written = [];
  for (const width of widths) {
    const pipeline = () =>
      image.clone().resize({
        width,
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      });
    const webpPath = path.join(OUT_DIR, `${slug}-${width}.webp`);
    const avifPath = path.join(OUT_DIR, `${slug}-${width}.avif`);
    await pipeline()
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(webpPath);
    await pipeline().avif({ quality: 58, effort: 6 }).toFile(avifPath);
    written.push(path.basename(webpPath), path.basename(avifPath));
  }
  return written;
}

async function main() {
  if (!fs.existsSync(CANDIDATES_PATH)) {
    console.error(`Missing ${CANDIDATES_PATH}`);
    process.exit(1);
  }

  try {
    require("sharp");
  } catch {
    console.error("Install sharp: npm install sharp --save-dev");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(CANDIDATES_PATH, "utf8"));
  const candidates = Array.isArray(raw) ? raw : raw.candidates || [];
  fs.mkdirSync(INBOX, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results = [];

  for (const c of candidates) {
    if (onlySlugs && !onlySlugs.has(c.slug)) continue;
    if (
      c.confidence !== "high" &&
      !(allowMedium && c.confidence === "medium")
    ) {
      results.push({
        slug: c.slug,
        shipName: c.shipName,
        status: "skipped",
        reason: `confidence=${c.confidence}`,
      });
      continue;
    }

    try {
      console.log(`Importing ${c.slug} …`);
      let downloadUrl = c.downloadUrl;
      let author = c.author;
      let licence = c.licence;
      let licenceUrl = c.licenceUrl || "";

      if (!downloadUrl || author?.startsWith("See Commons") || !licence) {
        await sleep(900);
        const resolved = await resolveCommonsFile(c.commonsFileTitle);
        downloadUrl = downloadUrl || resolved.downloadUrl;
        if (!author || author.startsWith("See Commons")) {
          author = resolved.author || author;
        }
        if (!licence) licence = resolved.licence || licence;
        licenceUrl = licenceUrl || resolved.licenceUrl;
      }

      const buf = await fetchBuffer(downloadUrl);
      const ext =
        path.extname(new URL(downloadUrl).pathname).toLowerCase() || ".jpg";
      const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext)
        ? ext
        : ".jpg";
      const sourcePath = path.join(INBOX, `${c.slug}-source${safeExt}`);
      fs.writeFileSync(sourcePath, buf);

      const attributionText = c.attributionText?.includes("See Commons")
        ? `${author} / Wikimedia Commons / ${licence}`
        : c.attributionText || `${author} / Wikimedia Commons / ${licence}`;

      const meta = {
        shipName: c.shipName,
        cruiseLine: c.cruiseLine,
        slug: c.slug,
        file: `${c.slug}-1920.webp`,
        sourceName: "Wikimedia Commons",
        sourcePage: c.commonsFileUrl,
        author,
        licence,
        attributionRequired: !/^(cc0|public domain)$/i.test(licence),
        attributionText,
        verifiedExactShip: true,
        imagePosition: c.imagePosition || "center 45%",
        commonsFileTitle: c.commonsFileTitle,
        notes: c.notes,
      };
      const metaPath = path.join(INBOX, `${c.slug}.meta.json`);
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

      const written = await optimise(c.slug, sourcePath);
      results.push({
        slug: c.slug,
        shipName: c.shipName,
        status: "imported",
        files: written,
        metaPath,
        meta,
      });
      console.log(`  ✓ ${c.slug}`);
      await sleep(700);
    } catch (error) {
      results.push({
        slug: c.slug,
        shipName: c.shipName,
        status: "error",
        reason: String(error.message || error),
      });
      console.error(`  ✗ ${c.slug}:`, error.message || error);
      await sleep(2000);
    }
  }

  fs.writeFileSync(RESULTS_PATH, JSON.stringify({ results }, null, 2));
  console.log(`\nWrote ${RESULTS_PATH}`);
  console.log(
    `Imported: ${results.filter((r) => r.status === "imported").length}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
