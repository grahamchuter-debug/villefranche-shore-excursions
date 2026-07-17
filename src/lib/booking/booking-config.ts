/**
 * Booking engine configuration.
 *
 * Pricing and capacity live here so the UI never hardcodes commercial values.
 */
import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export const bookingPrototypeTour = {
  id: "monaco-monte-carlo-eze-small-group",
  slug: featuredTour.slug,
  name: "Monaco, Monte Carlo & Eze",
  subtitle: "Small Group Shore Excursion",
  fullName: featuredTour.fullName,
  path: featuredTour.path,
  bookingPath: featuredTour.bookingPath,
  image: siteImages.monacoHarbour,
  imageAlt:
    "Casino de Monte-Carlo at night — Small Group Monaco, Monte Carlo and Eze shore excursion",
  tagline:
    "See Monaco, Monte Carlo and Eze in one calm, coordinated French Riviera port day.",
  highlights: [
    "Maximum 6 guests per vehicle.",
    "Designed for cruise passengers",
    "Return to ship guarantee",
    "Free cancellation",
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
  freeCancellationDetail: "Cancel free of charge up to 24 hours before your tour.",
  returnGuaranteeLabel: "Return to ship guarantee",
  returnGuaranteeDetail:
    "Your guide plans the day around your all-aboard time.",
  securePaymentLabel: "Secure payment",
  securePaymentDetail: "Card details are handled securely at checkout.",
} as const;

/** Prefer bookingCapacityConfig + bookingCheckoutGuestLimit. */
export const bookingGuestLimits = {
  minGuests: bookingCapacityConfig.minGuests,
  maxGuestsPerVehicle: bookingCapacityConfig.guestsPerVehicle,
} as const;

export const bookingPaymentMethods = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "paypal", label: "PayPal" },
] as const;

export const bookingSteps = [
  { id: "tour", label: "Tour" },
  { id: "date", label: "Date" },
  { id: "guests", label: "Guests" },
  { id: "summary", label: "Summary" },
  { id: "payment", label: "Payment" },
  { id: "confirmed", label: "Confirmed" },
] as const;

export type BookingStepId = (typeof bookingSteps)[number]["id"];

/** Session key scoped per tour so drafts never leak across tour routes. */
export function bookingSessionStorageKey(tourId: string): string {
  return `vf-booking:${tourId}`;
}
