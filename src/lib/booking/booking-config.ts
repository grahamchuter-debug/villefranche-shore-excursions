/**
 * Booking engine configuration — Version 3 desire-led experience.
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
  /** Overlay label on the experience hero */
  experienceLabel: "Small Group Shore Excursion",
  /**
   * Display title — rendered as stacked elegant lines on the hero.
   * Uses Èze for the authentic Riviera spelling in the aspirational moment.
   */
  experienceTitleLines: ["Monaco,", "Monte Carlo", "& Èze"] as const,
  /**
   * Sub-heading candidates:
   * 1. "Three iconic Riviera destinations. One unforgettable day."
   * 2. "Harbour light. Hilltop silence. One perfect day ashore."
   * 3. "The Côte d'Azur, arranged for a single luminous day."
   * Chosen: 1 — clear desire, understated, matches the brief.
   */
  experienceSubheading:
    "Three iconic Riviera destinations. One unforgettable day.",
  fullName: featuredTour.fullName,
  path: featuredTour.path,
  bookingPath: featuredTour.bookingPath,
  /** Bright daytime Port Hercules — no night, no casino. */
  image: siteImages.hero,
  imageAlt:
    "Sunlit Port Hercules in Monaco with luxury yachts and the Monte Carlo skyline on the French Riviera",
  /**
   * Soft crossfade gallery for the experience hero.
   * Daytime Riviera only — harbour, Èze, coastline.
   */
  heroGallery: [
    {
      src: siteImages.hero,
      alt: "Sunlit Port Hercules in Monaco with luxury yachts on the French Riviera",
    },
    {
      src: siteImages.ezeVillage,
      alt: "The medieval hilltop village of Èze above the Mediterranean",
    },
    {
      src: siteImages.villefrancheHarbour,
      alt: "Villefranche-sur-Mer harbour and bay on a bright Mediterranean day",
    },
    {
      src: siteImages.frenchRivieraCoast,
      alt: "French Riviera coastline under warm sunshine",
    },
  ] as const,
  ctaLabel: "Choose your cruise date",
  reassurance: [
    "Maximum 6 guests",
    "Designed for cruise passengers",
    "Free cancellation",
    "Return to ship guarantee",
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
  maxVehiclesSelectableAtCheckout: 1,
  minGuests: 1,
  capacityLabel: "Maximum 6 guests per vehicle.",
  overCapacityMessage:
    "Travelling with more than six people? Contact us and we’ll check additional vehicle availability.",
  overCapacityContactHref: `mailto:${siteConfig.bookingEmail}`,
  overCapacityContactLabel: "Contact us",
} as const;

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

/** Experience → Date → Guests → Payment → Confirmation */
export const bookingSteps = [
  { id: "tour", label: "Experience" },
  { id: "date", label: "Date" },
  { id: "guests", label: "Guests" },
  { id: "payment", label: "Payment" },
  { id: "confirmed", label: "Confirmed" },
] as const;

export type BookingStepId = (typeof bookingSteps)[number]["id"];

export function bookingSessionStorageKey(tourId: string): string {
  return `vf-booking:v3:${tourId}`;
}
