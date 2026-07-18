# Ship image library — Wikimedia import workflow

Manual, human-verified imports only. **Do not scrape Google Images** or auto-download arbitrary results.

## Exact vessel rule

Only import a photograph when you can confirm it depicts the **exact named vessel**.

Never use:

- a sister ship
- another ship from the same cruise line
- a generic cruise ship labelled as the named vessel
- AI-generated vessel photography
- an image whose identity cannot be verified

## Folder layout

| Path | Purpose |
|------|---------|
| `wikimedia-inbox/` | Drop original downloads + a filled metadata JSON per candidate |
| `sources/` | Keep a copy of the Commons file page text / licence screenshot notes |
| `../audit-latest.md` | Latest schedule ↔ image audit (`node scripts/audit-ship-images.cjs`) |

## Candidate checklist (required)

For every candidate image, confirm and record:

1. **Exact vessel identity** — name matches the booking schedule ship
2. **Image quality** — sharp enough for a wide booking card crop; daylight preferred
3. **Licence suitability** — read the Commons file page; licences differ
4. **Attribution requirements** — whether credit is required and the exact wording
5. **Author and source** — photographer/author + Commons file URL

## Metadata JSON template

Place beside the original file as `{slug}.meta.json`:

```json
{
  "shipName": "",
  "cruiseLine": "",
  "file": "",
  "sourceName": "Wikimedia Commons",
  "sourcePage": "https://commons.wikimedia.org/wiki/File:...",
  "author": "",
  "licence": "",
  "attributionRequired": true,
  "attributionText": "",
  "verifiedExactShip": true,
  "imagePosition": "center center"
}
```

Do **not** add the ship to `shipImageMetadataCatalog` until this JSON is complete and a human has set `verifiedExactShip: true`.

## Processing after approval

1. Curate candidates in `wikimedia-candidates.json` (exact vessel + free licence only).
2. Run `npm run import:ship-images` (downloads, optimises WebP/AVIF, writes inbox metas).
3. Sync `src/lib/booking/ship-image-metadata.ts` from inbox metas (or re-run the sync helper used in import workflow).
4. Re-run `npm run audit:ship-images`.
5. Confirm vessels appear on `/image-credits` when publishable.

Discovery aid (noisy — always human-curate before import):

```bash
npm run search:ship-images
```

## Publishing gate

Customer-facing booking cards only show an image when metadata is **publishable**:

- `verifiedExactShip === true`
- `sourceName`, `sourcePage`, `author`, `licence`, `attributionText` all non-empty
- primary file exists on disk

Otherwise the premium fallback card is used.

Latest completion numbers: see `completion-report.md`.
