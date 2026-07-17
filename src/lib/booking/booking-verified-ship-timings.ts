/**
 * Optional verified ship arrival/departure overrides for booking.
 *
 * Current Villefranche CSV schedule does not contain verified operational times.
 * When Mediterranean times are confirmed, add entries here (or import into this
 * structure) with verified: true — the booking UI will then display them.
 *
 * Never invent, estimate, or default times.
 */
export type VerifiedShipTiming = {
  date: string;
  shipSlug: string;
  arrivalTime: string | null;
  departureTime: string | null;
  verified: true;
};

/**
 * Populate only with independently verified Villefranche call times.
 * Empty until a verified import is available.
 */
export const bookingVerifiedShipTimings: readonly VerifiedShipTiming[] = [];

export function findVerifiedShipTiming(
  date: string,
  shipSlug: string,
): VerifiedShipTiming | undefined {
  return bookingVerifiedShipTimings.find(
    (entry) => entry.date === date && entry.shipSlug === shipSlug && entry.verified,
  );
}
