/**
 * Booking engine configuration — Version 4 premium presentation.
 *
 * Pricing and capacity live here so the UI never hardcodes commercial values.
 */
import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export type BookingHeroSlide = {
  id: string;
  width: number;
  height: number;
  /** Native-ish JPEG/PNG fallback for older browsers */
  fallbackSrc: string;
  webpSrcSet: string;
  avifSrcSet: string;
  priority?: boolean;
};

function bookingHeroSlide(
  id: string,
  dims: { width: number; height: number },
  priority = false,
): BookingHeroSlide {
  const base = `/images/booking/${id}`;
  return {
    id,
    width: dims.width,
    height: dims.height,
    fallbackSrc: `${base}-1280.webp`,
    webpSrcSet: `${base}-1280.webp 1280w, ${base}-1920.webp 1920w`,
    avifSrcSet: `${base}-1280.avif 1280w, ${base}-1920.avif 1920w`,
    priority,
  };
}

export const bookingPrototypeTour = {
  id: "monaco-monte-carlo-eze-small-group",
  slug: featuredTour.slug,
  name: "Monaco, Monte Carlo & Eze",
  /** Breadcrumb / back-link label to the excursion page */
  backLabel: "← Monaco, Monte Carlo & Èze",
  /**
   * Display title — stacked lines on the opening desire scene.
   * Uses Èze for the authentic Riviera spelling in the aspirational moment.
   */
  experienceTitleLines: ["Monaco,", "Monte Carlo", "& Èze"] as const,
  /**
   * One supporting sentence for the opening scene.
   * Booking chrome (dates, guests, payment) appears only after the CTA.
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
   * Soft crossfade gallery for the opening scene.
   * Pre-encoded AVIF/WebP at 1280 / 1920 for crisp full-bleed delivery.
   */
  heroGallery: [
    bookingHeroSlide("monaco-harbour", { width: 1920, height: 1331 }, true),
    bookingHeroSlide("eze-village", { width: 1920, height: 1187 }),
    bookingHeroSlide("villefranche-harbour", { width: 1920, height: 1292 }),
    bookingHeroSlide("riviera-coast", { width: 1920, height: 1256 }),
  ] as const,
  /** Single primary action into the booking journey */
  ctaLabel: "Choose Your Cruise Date",
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

/** Placeholder policy routes — pages can be added later without UI churn. */
export const bookingCheckoutLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact Us", href: "/contact" },
] as const;

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
