/**
 * Display pricing for the static site.
 *
 * Authoritative charge amount is always recalculated on the payments Worker
 * from BOOKING_PRICE_PER_GUEST_EUR. This public env must match that value.
 *
 * Approved retail: €149 per guest. Set
 * NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR=149 (must match Worker).
 */

function parsePricePerGuest(): number | null {
  const raw = process.env.NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR?.trim();
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

/** null when the approved retail price env is not set. */
export const bookingPricePerGuestEur = parsePricePerGuest();

export const isBookingPriceConfigured = bookingPricePerGuestEur !== null;
