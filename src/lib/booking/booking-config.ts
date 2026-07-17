/**
 * Booking engine configuration — Phase 2 premium experience.
 *
 * Pricing and capacity live here so the UI never hardcodes commercial values.
 */
import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

/**
 * Headline candidates considered for Phase 2 (kept for iteration):
 * 1. "Three Riviera icons. One unhurried day."
 * 2. "A luminous day between sea and sky."
 * 3. "Monaco, Monte Carlo & Eze — as they should be seen."
 * 4. "The Riviera, quietly arranged."
 * Chosen: 1 — clearest aspiration without cliché.
 */
export const bookingPrototypeTour = {
  id: "monaco-monte-carlo-eze-small-group",
  slug: featuredTour.slug,
  name: "Monaco, Monte Carlo & Eze",
  subtitle: "Small Group Shore Excursion",
  headline: "Three Riviera icons. One unhurried day.",
  fullName: featuredTour.fullName,
  path: featuredTour.path,
  bookingPath: featuredTour.bookingPath,
  /** Bright daytime Port Hercules — not night photography. */
  image: siteImages.hero,
  imageAlt:
    "Sunlit Port Hercules in Monaco with luxury yachts and the Monte Carlo skyline on the French Riviera",
  secondaryImage: siteImages.ezeVillage,
  secondaryImageAlt:
    "The medieval hilltop village of Eze above the Mediterranean on a bright day",
  tagline: "Monaco · Monte Carlo · Eze",
  reassurance: [
    "Maximum 6 guests per vehicle",
    "Return to ship guarantee",
    "Free cancellation",
    "Carefully timed for cruise passengers",
  ],
} as const;

/**
 * Capacity model — single vehicle at checkout today; multi-vehicle ready later.
 *
 * Checkout currently sells one vehicle only (guest selector 1–6).
 * To support additional vehicles later:
 * 1. Raise `maxVehiclesSelectableAtCheckout` (and wire vehicle inventory).
 * 2. Recompute `checkoutGuestLimit` = guestsPerVehicle * vehicles allocated.
 * 3. Keep `guestsPerVehicle` as the per-van cap for messaging and allocation.
 * Do not raise the guest stepper above one vehicle until inventory exists.
 */
export const bookingCapacityConfig = {
  guestsPerVehicle: 6,
  /** Phase 1: one vehicle per checkout session. */
  maxVehiclesSelectableAtCheckout: 1,
  minGuests: 1,
  capacityLabel: "Maximum 6 guests per vehicle.",
  overCapacityMessage:
    "Travelling with more than six people? Contact us and we’ll check additional vehicle availability.",
  overCapacityContactHref: `mailto:${siteConfig.bookingEmail}`,
  overCapacityContactLabel: "Contact us",
} as const;

/** Hard cap for the guest stepper — one vehicle today. */
export const bookingCheckoutGuestLimit =
  bookingCapacityConfig.guestsPerVehicle *
  bookingCapacityConfig.maxVehiclesSelectableAtCheckout;

/**
 * NOT AN APPROVED RETAIL PRICE.
 *
 * Temporary €149 value for local design/testing of the booking UI only.
 * Do not treat this as a published, agreed, or live selling price.
 * Replace with an approved rate (or CMS/API) before any production launch.
 * Customer-facing screens must read this value exclusively from this file —
 * never hardcode amounts in components.
 */
export const bookingPricingConfig = {
  currencyCode: "EUR",
  currencySymbol: "€",
  /** Temporary design-test amount in major currency units (euros). */
  pricePerGuest: 149,
  freeCancellationLabel: "Free cancellation",
  freeCancellationDetail: "Full refund up to 24 hours before departure.",
  returnGuaranteeLabel: "Return to ship guarantee",
  returnGuaranteeDetail: "Your day is paced around all-aboard.",
  securePaymentLabel: "Secure payment",
  securePaymentDetail: "Encrypted checkout. Your details stay protected.",
} as const;

export const bookingPaymentMethods = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "paypal", label: "PayPal" },
] as const;

/** Phase 2 journey — summary folded into payment. */
export const bookingSteps = [
  { id: "tour", label: "Tour" },
  { id: "date", label: "Date" },
  { id: "guests", label: "Guests" },
  { id: "payment", label: "Payment" },
  { id: "confirmed", label: "Confirmed" },
] as const;

export type BookingStepId = (typeof bookingSteps)[number]["id"];

/** Session key scoped per tour so drafts never leak across tour routes. */
export function bookingSessionStorageKey(tourId: string): string {
  return `vf-booking:v2:${tourId}`;
}
