import type { PaymentsEnv } from "./types";

/** Minimum / maximum guests for this excursion product (v1 single vehicle). */
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 6;

/**
 * Server-trusted retail price in EUR major units (approved: 149).
 * Must match the display price baked into the static site via
 * NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR.
 */
export function getPricePerGuestEur(env: PaymentsEnv): number {
  const raw = env.BOOKING_PRICE_PER_GUEST_EUR?.trim();
  if (!raw) {
    throw new Error(
      "BOOKING_PRICE_PER_GUEST_EUR is required (approved retail EUR per guest)",
    );
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("BOOKING_PRICE_PER_GUEST_EUR must be a positive number");
  }
  return value;
}

/** Convert EUR major units to integer cents (Stripe minor units). */
export function eurToCents(eur: number): number {
  return Math.round(eur * 100);
}

/**
 * Stripe amounts: integer minor units only.
 * Example at €149: unitAmountCents = 14900; total = 14900 * guests.
 */
export function calculateAmountCents(
  guests: number,
  pricePerGuestEur: number,
): { unitAmountCents: number; amountTotalCents: number } {
  const unitAmountCents = eurToCents(pricePerGuestEur);
  return {
    unitAmountCents,
    amountTotalCents: unitAmountCents * guests,
  };
}

export function getCurrency(env: PaymentsEnv): string {
  return (env.CHECKOUT_CURRENCY ?? "eur").toLowerCase();
}
