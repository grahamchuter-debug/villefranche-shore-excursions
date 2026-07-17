/**
 * Optional ship photography for the booking ship-selection step.
 *
 * Progressive enhancement: ships without an entry fall back to the quiet card.
 * Add new entries keyed by slug as photography becomes available.
 */
export type BookingShipImage = {
  /** Primary WebP (or AVIF via picture) path */
  src: string;
  srcSet: string;
  avifSrcSet?: string;
  alt: string;
  width: number;
  height: number;
};

function shipImage(
  slug: string,
  alt: string,
  dims: { width: number; height: number },
): BookingShipImage {
  const base = `/images/ships/${slug}`;
  return {
    src: `${base}-1920.webp`,
    srcSet: `${base}-1280.webp 1280w, ${base}-1920.webp 1920w`,
    avifSrcSet: `${base}-1280.avif 1280w, ${base}-1920.avif 1920w`,
    alt,
    width: dims.width,
    height: dims.height,
  };
}

/**
 * Ship-specific imagery registry.
 * Prefer Villefranche Bay / Mediterranean daylight photography when available.
 */
export const bookingShipImagery: Record<string, BookingShipImage> = {
  "norwegian-epic": shipImage(
    "norwegian-epic",
    "Norwegian Epic on open Mediterranean water under a clear blue sky",
    { width: 1920, height: 1080 },
  ),
  "celebrity-equinox": shipImage(
    "celebrity-equinox",
    "Celebrity Equinox in a sunlit Mediterranean harbour",
    { width: 1920, height: 1293 },
  ),
  "azamara-journey": shipImage(
    "azamara-journey",
    "Azamara Journey approaching a Mediterranean harbour in warm daylight",
    { width: 1920, height: 1280 },
  ),
};

export function getBookingShipImage(
  slug: string,
): BookingShipImage | undefined {
  return bookingShipImagery[slug];
}
