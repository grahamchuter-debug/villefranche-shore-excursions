#!/usr/bin/env node
/**
 * Search Wikimedia Commons for exact-vessel exterior photos for schedule ships.
 *
 * Strategy:
 * 1) Prefer Category:{Ship} (ship, YEAR) when discoverable
 * 2) Fall back to title search requiring ship name + cruise/ship cues
 * 3) Reject interiors, portraits, astronomy, historical non-cruise hits
 *
 * Usage: node scripts/search-wikimedia-ship-images.cjs
 */

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const ROOT = path.resolve(__dirname, "..");
const AUDIT = path.join(ROOT, "data/ship-images/audit-latest.json");
const OUT_CANDIDATES = path.join(
  ROOT,
  "data/ship-images/wikimedia-candidates.json",
);
const OUT_NOT_FOUND = path.join(
  ROOT,
  "data/ship-images/wikimedia-not-found.json",
);

const UA =
  "VillefrancheShoreExcursionsBot/1.0 (ship imagery licence research; contact info@villefrancheshoreexcursions.com)";

const FREE_LICENCE_HINTS = [
  "cc-by",
  "cc-by-sa",
  "cc0",
  "public domain",
  "pd-",
  "creative commons attribution",
];

const REJECT_TITLE =
  /cabin|suite|interior|restaurant|theatre|theater|spa|stateroom|corridor|lobby|atrium|dining|portrait|business room|artillery|constellation|corona|renaissance|perspective|funnel only|model|models aboard|deck plan/i;

const SHIP_CUE =
  /\b(ship|cruise|ms |mv |imo|dock|port|harbour|harbor|pier|yacht|clipper|at sea|maiden|vessel)\b/i;

const EXISTING_SLUGS = {
  "Norwegian Epic": "norwegian-epic",
  "Celebrity Equinox": "celebrity-equinox",
  "Azamara Journey": "azamara-journey",
  "Silver Shadow": "silver-shadow",
};

function slugifyShip(shipName) {
  if (EXISTING_SLUGS[shipName]) return EXISTING_SLUGS[shipName];
  return shipName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
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
    });
    req.on("error", reject);
  });
}

function api(params) {
  const q = new URLSearchParams({ format: "json", origin: "*", ...params });
  return getJson(`https://commons.wikimedia.org/w/api.php?${q}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleMentionsShip(title, shipName) {
  const t = norm(title);
  const n = norm(shipName);
  if (t.includes(n)) return true;
  return t.replace(/\s+/g, "").includes(n.replace(/\s+/g, ""));
}

function isPlausibleExterior(title, shipName) {
  if (!titleMentionsShip(title, shipName)) return false;
  if (REJECT_TITLE.test(title)) return false;
  // Require a ship/cruise cue OR filename starts with ship pattern
  if (SHIP_CUE.test(title)) return true;
  // Allow "MS Celebrity Equinox …" style without the word ship
  if (/^(file:)?(ms|mv|gts)\s/i.test(title)) return true;
  if (/cruise ship/i.test(title)) return true;
  // "Celebrity Equinox Istanbul.jpg" style — ship name + place
  const withoutShip = norm(title).replace(norm(shipName), "").trim();
  return withoutShip.length >= 3;
}

function licenceFromExtmeta(extmetadata) {
  const lic =
    extmetadata?.LicenseShortName?.value ||
    extmetadata?.License?.value ||
    "";
  const url = extmetadata?.LicenseUrl?.value || "";
  const artist = (extmetadata?.Artist?.value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return { lic, url, artist };
}

function isFreeLicence(lic) {
  const l = lic.toLowerCase();
  return FREE_LICENCE_HINTS.some((h) => l.includes(h));
}

function guessPosition(shipName) {
  if (/clipper|wind spirit|seadream/i.test(shipName)) return "center 40%";
  if (/viking|explora|silver/i.test(shipName)) return "center 48%";
  if (/norwegian epic/i.test(shipName)) return "center 42%";
  return "center 45%";
}

async function findShipCategory(shipName) {
  const data = await api({
    action: "query",
    list: "search",
    srsearch: `Category:${shipName} ship`,
    srnamespace: "14",
    srlimit: "8",
  });
  const hits = data.query?.search || [];
  const n = norm(shipName);
  const preferred = hits.find((h) => {
    const t = norm(h.title);
    return t.includes(n) && t.includes("ship");
  });
  return preferred?.title || null;
}

async function categoryFiles(categoryTitle) {
  const data = await api({
    action: "query",
    list: "categorymembers",
    cmtitle: categoryTitle,
    cmtype: "file",
    cmlimit: "40",
  });
  return (data.query?.categorymembers || []).map((m) => m.title);
}

async function searchTitles(shipName) {
  const queries = [
    `"${shipName}" cruise ship`,
    `"${shipName}" ship`,
    shipName,
  ];
  const seen = new Set();
  const titles = [];
  for (const q of queries) {
    const data = await api({
      action: "query",
      list: "search",
      srsearch: q,
      srnamespace: "6",
      srlimit: "15",
    });
    for (const h of data.query?.search || []) {
      if (!seen.has(h.title)) {
        seen.add(h.title);
        titles.push(h.title);
      }
    }
    await sleep(200);
  }
  return titles;
}

async function imageInfo(titles) {
  if (!titles.length) return [];
  // API title limit — batch
  const batches = [];
  for (let i = 0; i < titles.length; i += 10) {
    batches.push(titles.slice(i, i + 10));
  }
  const pages = [];
  for (const batch of batches) {
    const data = await api({
      action: "query",
      titles: batch.join("|"),
      prop: "imageinfo",
      iiprop: "url|extmetadata|size|mime",
    });
    pages.push(...Object.values(data.query?.pages || {}));
    await sleep(200);
  }
  return pages;
}

function scoreTitle(title, shipName) {
  let score = 0;
  if (titleMentionsShip(title, shipName)) score += 5;
  if (SHIP_CUE.test(title)) score += 3;
  if (/aboard|interior|cabin/i.test(title)) score -= 10;
  if (/and .+ docked|with /i.test(title) && titleMentionsShip(title, shipName)) {
    // multi-ship photo — still usable but prefer solo
    score -= 2;
  }
  if (/\b(ms|mv|gts)\b/i.test(title)) score += 2;
  return score;
}

async function pickCandidate(ship) {
  let titles = [];
  const category = await findShipCategory(ship.shipName);
  if (category) {
    const files = await categoryFiles(category);
    titles.push(...files);
  }
  const searched = await searchTitles(ship.shipName);
  for (const t of searched) {
    if (!titles.includes(t)) titles.push(t);
  }

  titles = titles
    .filter((t) => isPlausibleExterior(t, ship.shipName))
    .sort(
      (a, b) => scoreTitle(b, ship.shipName) - scoreTitle(a, ship.shipName),
    )
    .slice(0, 12);

  if (!titles.length) return null;

  const pages = await imageInfo(titles);
  const byTitle = new Map(pages.map((p) => [p.title, p]));

  for (const title of titles) {
    const page = byTitle.get(title);
    if (!page || page.missing != null) continue;
    const info = page.imageinfo?.[0];
    if (!info?.url) continue;
    const mime = info.mime || "";
    if (!mime.startsWith("image/") || mime.includes("svg")) continue;
    // Prefer landscape-ish exteriors
    if (info.width && info.height && info.width < info.height * 0.85) continue;

    const { lic, url: licenceUrl, artist } = licenceFromExtmeta(
      info.extmetadata || {},
    );
    if (!lic || !isFreeLicence(lic)) continue;

    const author = artist || "See Wikimedia Commons file page";
    const confidence = scoreTitle(title, ship.shipName) >= 7 ? "high" : "medium";

    return {
      shipName: ship.shipName,
      cruiseLine: ship.cruiseLine,
      slug: slugifyShip(ship.shipName),
      dateCount: ship.dateCount,
      commonsFileTitle: title,
      commonsFileUrl: `https://commons.wikimedia.org/wiki/${title.replace(/ /g, "_")}`,
      downloadUrl: info.url,
      width: info.width,
      height: info.height,
      author,
      licence: lic,
      licenceUrl,
      attributionText: `${author} / Wikimedia Commons / ${lic}`,
      imagePosition: guessPosition(ship.shipName),
      confidence,
      category: category || null,
      notes: category
        ? `From Commons category ${category}; free licence; title names vessel.`
        : "From Commons search; free licence; title names vessel.",
    };
  }
  return null;
}

async function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT, "utf8"));
  const ships = [...audit.ships].sort((a, b) => b.dateCount - a.dateCount);

  const candidates = [];
  const notFound = [];

  for (const ship of ships) {
    process.stdout.write(`Searching ${ship.shipName}… `);
    try {
      const c = await pickCandidate(ship);
      if (c) {
        candidates.push(c);
        console.log(`✓ ${c.commonsFileTitle} [${c.confidence}]`);
      } else {
        notFound.push({
          shipName: ship.shipName,
          cruiseLine: ship.cruiseLine,
          dateCount: ship.dateCount,
          reason:
            "No free-licence exterior candidate with exact vessel name verified in title",
        });
        console.log("— none");
      }
    } catch (e) {
      notFound.push({
        shipName: ship.shipName,
        cruiseLine: ship.cruiseLine,
        dateCount: ship.dateCount,
        reason: String(e.message || e),
      });
      console.log(`error: ${e.message || e}`);
    }
    await sleep(250);
  }

  candidates.sort((a, b) => b.dateCount - a.dateCount);
  notFound.sort((a, b) => b.dateCount - a.dateCount);

  fs.writeFileSync(
    OUT_CANDIDATES,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: candidates.length,
        highConfidence: candidates.filter((c) => c.confidence === "high").length,
        candidates,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    OUT_NOT_FOUND,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), count: notFound.length, ships: notFound },
      null,
      2,
    ),
  );

  console.log(`\nCandidates: ${candidates.length} (high: ${candidates.filter((c) => c.confidence === "high").length})`);
  console.log(`Not found: ${notFound.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
