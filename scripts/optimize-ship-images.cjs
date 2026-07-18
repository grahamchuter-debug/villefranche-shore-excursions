#!/usr/bin/env node
/**
 * Optimise approved ship photographs into booking-card AVIF/WebP sizes.
 *
 * Usage:
 *   node scripts/optimize-ship-images.mjs <slug> <source-image-path>
 *
 * Example:
 *   node scripts/optimize-ship-images.mjs norwegian-epic ./data/ship-images/wikimedia-inbox/norwegian-epic.jpg
 *
 * Does not invent metadata or mark vessels verified — update
 * src/lib/booking/ship-image-metadata.ts after human review.
 */

const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const [, , slug, sourcePath] = process.argv;
  if (!slug || !sourcePath) {
    console.error(
      "Usage: node scripts/optimize-ship-images.mjs <slug> <source-image-path>",
    );
    process.exit(1);
  }

  if (!fs.existsSync(sourcePath)) {
    console.error(`Source not found: ${sourcePath}`);
    process.exit(1);
  }

  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error(
      "Install sharp first: npm install sharp --save-dev\nThen re-run this script.",
    );
    process.exit(1);
  }

  const outDir = path.resolve(__dirname, "../public/images/ships");
  fs.mkdirSync(outDir, { recursive: true });

  const widths = [1280, 1920];
  const image = sharp(sourcePath).rotate();

  for (const width of widths) {
    const pipeline = () =>
      image.clone().resize({
        width,
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      });

    const webpPath = path.join(outDir, `${slug}-${width}.webp`);
    const avifPath = path.join(outDir, `${slug}-${width}.avif`);

    await pipeline()
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(webpPath);
    await pipeline().avif({ quality: 58, effort: 6 }).toFile(avifPath);

    console.log(`Wrote ${path.basename(webpPath)} and ${path.basename(avifPath)}`);
  }

  console.log(
    `\nNext: complete shipImageMetadataCatalog for "${slug}" with source/licence, then run node scripts/audit-ship-images.mjs`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
