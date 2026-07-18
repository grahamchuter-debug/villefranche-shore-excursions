/**
 * Server-controlled excursion catalogue for Checkout.
 * Browser-supplied excursionName / price are never authoritative.
 */

export type ExcursionProduct = {
  id: string;
  /** Official product name for Stripe + bookings */
  name: string;
  /** Path under SITE_BASE_URL for cancel redirect */
  bookingPath: string;
  /** Path under SITE_BASE_URL for success redirect */
  successPath: string;
};

export const EXCURSION_CATALOGUE: Readonly<Record<string, ExcursionProduct>> = {
  "monaco-monte-carlo-eze-small-group": {
    id: "monaco-monte-carlo-eze-small-group",
    name: "Monaco, Monte Carlo & Èze Small Group Shore Excursion",
    bookingPath: "/book/small-group-monaco-monte-carlo-eze",
    successPath: "/book/small-group-monaco-monte-carlo-eze/success",
  },
} as const;

export function getExcursionProduct(excursionId: string): ExcursionProduct | null {
  const id = excursionId.trim();
  return EXCURSION_CATALOGUE[id] ?? null;
}
