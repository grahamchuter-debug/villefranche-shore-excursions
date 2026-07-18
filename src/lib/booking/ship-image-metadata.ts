/**
 * Source and licence metadata for booking ship photography.
 *
 * Exact-vessel rule: only publish when verifiedExactShip is true AND
 * source/licence fields are filled. Sister ships and unverified files
 * must never be assigned silently.
 */

export type ShipImageMetadata = {
  shipName: string;
  cruiseLine: string;
  /** Slug matching public/images/ships/{slug}-* assets */
  slug: string;
  /** Primary published WebP filename under /images/ships/ */
  file: string;
  sourceName: string;
  sourcePage: string;
  author: string;
  licence: string;
  attributionRequired: boolean;
  attributionText: string;
  /** Human confirmed this photograph depicts this exact vessel */
  verifiedExactShip: boolean;
  imagePosition: string;
  /** Optional notes for operators — never shown to customers */
  internalNotes?: string;
};

/**
 * Catalogue of ship images considered for booking.
 * Incomplete source/licence rows remain in the catalogue for audit but
 * are not returned by getBookingShipImage until publishable.
 */
export const shipImageMetadataCatalog: readonly ShipImageMetadata[] = [
  {
    shipName: "Norwegian Epic",
    cruiseLine: "Norwegian Cruise Line",
    slug: "norwegian-epic",
    file: "norwegian-epic-1920.webp",
    sourceName: "",
    sourcePage: "",
    author: "",
    licence: "",
    attributionRequired: true,
    attributionText: "",
    verifiedExactShip: true,
    imagePosition: "center 42%",
    internalNotes:
      "Asset on disk from earlier booking imagery pass. Source/licence must be completed before publish.",
  },
  {
    shipName: "Celebrity Equinox",
    cruiseLine: "Celebrity Cruises",
    slug: "celebrity-equinox",
    file: "celebrity-equinox-1920.webp",
    sourceName: "",
    sourcePage: "",
    author: "",
    licence: "",
    attributionRequired: true,
    attributionText: "",
    verifiedExactShip: true,
    imagePosition: "center 48%",
    internalNotes:
      "Asset on disk from earlier booking imagery pass. Source/licence must be completed before publish.",
  },
  {
    shipName: "Azamara Journey",
    cruiseLine: "Azamara",
    slug: "azamara-journey",
    file: "azamara-journey-1920.webp",
    sourceName: "",
    sourcePage: "",
    author: "",
    licence: "",
    attributionRequired: true,
    attributionText: "",
    verifiedExactShip: true,
    imagePosition: "center 40%",
    internalNotes:
      "Asset on disk from earlier booking imagery pass. Source/licence must be completed before publish.",
  },
  {
    shipName: "Silver Shadow",
    cruiseLine: "Silversea",
    slug: "silver-shadow",
    file: "silver-shadow-1920.webp",
    sourceName: "",
    sourcePage: "",
    author: "",
    licence: "",
    attributionRequired: true,
    attributionText: "",
    verifiedExactShip: true,
    imagePosition: "center 55%",
    internalNotes:
      "Asset on disk from earlier booking imagery pass. Source/licence must be completed before publish.",
  },
] as const;

export function getShipImageMetadata(
  slug: string,
): ShipImageMetadata | undefined {
  return shipImageMetadataCatalog.find((entry) => entry.slug === slug);
}

/** True when metadata is complete enough to show the photo to customers. */
export function isShipImageMetadataPublishable(
  meta: ShipImageMetadata,
): boolean {
  return (
    meta.verifiedExactShip &&
    Boolean(meta.file.trim()) &&
    Boolean(meta.sourceName.trim()) &&
    Boolean(meta.sourcePage.trim()) &&
    Boolean(meta.author.trim()) &&
    Boolean(meta.licence.trim()) &&
    Boolean(meta.attributionText.trim())
  );
}

export function listPublishableShipImageCredits(): ShipImageMetadata[] {
  return shipImageMetadataCatalog.filter(isShipImageMetadataPublishable);
}
