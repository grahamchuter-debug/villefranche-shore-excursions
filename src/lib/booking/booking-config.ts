/**
 * Booking engine configuration — checkout experience (cruise-day confirmation).
 *
 * Pricing, capacity, departures, meeting point, and legal routes live here
 * so UI components never hardcode commercial or operational values.
 * Structure is reusable for Signature Tours and third-party excursions later.
 */
import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export type BookingHeroSlide = {
  id: string;
  width: number;
  height: number;
  fallbackSrc: string;
  webpSrcSet: string;
  avifSrcSet: string;
  priority?: boolean;
};

/** One bookable departure — startTime omitted when not yet confirmed. */
export type BookingDeparture = {
  date: string;
  /** Display time such as "9:00 AM". Omit when voucher confirms later. */
  startTime?: string;
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
    fallbackSrc: `${base}-1920.webp`,
    webpSrcSet: `${base}-1280.webp 1280w, ${base}-1920.webp 1920w, ${base}-2560.webp 2560w`,
    avifSrcSet: `${base}-1280.avif 1280w, ${base}-1920.avif 1920w, ${base}-2560.avif 2560w`,
    priority,
  };
}

export const bookingPrototypeTour = {
  id: "monaco-monte-carlo-eze-small-group",
  slug: featuredTour.slug,
  name: "Monaco, Monte Carlo & Eze",
  /** Full experience name for the cruise-day summary */
  experienceName:
    "Monaco, Monte Carlo & Èze Small Group Shore Excursion",
  backLabel: "← Monaco, Monte Carlo & Èze",
  experienceTitleLines: ["Monaco,", "Monte Carlo", "& Èze"] as const,
  experienceSubheading:
    "Three iconic Riviera destinations. One unforgettable day.",
  fullName: featuredTour.fullName,
  path: featuredTour.path,
  bookingPath: featuredTour.bookingPath,
  image: siteImages.hero,
  imageAlt:
    "Sunlit Port Hercule in Monaco with luxury yachts and the Monte Carlo skyline on the French Riviera",
  /**
   * Opening gallery — excursion day story only (Monaco → Monte Carlo → Èze).
   * Sources: Wikimedia Commons daylight photographs of Port Hercule,
   * Casino de Monte-Carlo, Èze village, and Èze Exotic Garden viewpoints.
   * Portofino / Italian Riviera imagery must never appear here.
   */
  heroGallery: [
    bookingHeroSlide("monaco-port-hercule", { width: 2560, height: 1160 }, true),
    bookingHeroSlide("monte-carlo-casino", { width: 2560, height: 1967 }),
    bookingHeroSlide("eze-village", { width: 2560, height: 1356 }),
    bookingHeroSlide("eze-viewpoint", { width: 2560, height: 1347 }),
  ] as const,
  /** Soft panorama used just before payment — Èze Mediterranean viewpoint */
  checkoutReconnectImage: "/images/booking/eze-viewpoint-1920.webp",
  checkoutReconnectImageAlt:
    "Panoramic Mediterranean view from Èze across the French Riviera coastline",
  ctaLabel: "Choose Your Cruise Date",
  /** Prototype duration for design review — replace with approved figure. */
  durationLabel: "Approximately 6–7 hours",
} as const;

/**
 * Optional date-specific start times.
 * Dates not listed (or listed without startTime) use the voucher fallback.
 */
export const bookingDepartures: readonly BookingDeparture[] = [
  { date: "2026-09-15", startTime: "9:00 AM" },
  { date: "2026-09-22", startTime: "9:30 AM" },
  { date: "2026-10-06", startTime: "9:00 AM" },
  { date: "2026-10-13" },
  { date: "2026-11-03", startTime: "10:00 AM" },
] as const;

export const bookingMeetingConfig = {
  label: "Meeting Point",
  place: "Villefranche Cruise Port",
  instructionsNote:
    "Full meeting instructions will be included with your booking confirmation.",
} as const;

export const bookingStartTimeConfig = {
  label: "Start Time",
  /** Calm fallback when a departure time is not yet confirmed */
  unconfirmedLabel: "Confirmed on your final voucher",
} as const;

export const bookingCapacityConfig = {
  guestsPerVehicle: 6,
  maxVehiclesSelectableAtCheckout: 1,
  minGuests: 1,
  capacityLabel: "Maximum 6 guests per vehicle",
  groupSizeLabel: "Maximum 6 guests per vehicle",
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
 * Temporary €149 for design/testing only.
 */
export const bookingPricingConfig = {
  currencyCode: "EUR",
  currencySymbol: "€",
  pricePerGuest: 149,
  freeCancellationLabel: "Free Cancellation",
  freeCancellationDetail: "Full refund up to 24 hours before departure.",
  returnGuaranteeLabel: "Return to Ship Guarantee",
  returnGuaranteeDetail:
    "Your itinerary is planned to return you to Villefranche with time before your ship departs.",
  securePaymentLabel: "Secure Online Booking",
  securePaymentDetail: "Encrypted checkout. Your details stay protected.",
  cruisePortPickupLabel: "Cruise-Port Pickup",
} as const;

export const bookingReassuranceConfig = {
  heading: "Designed Around Your Cruise",
  supportingCopy:
    "Your experience is carefully planned around your ship’s schedule. We monitor cruise arrivals, keep groups small and allow suitable time for your return to port.",
  promises: [
    {
      id: "return-guarantee",
      label: bookingPricingConfig.returnGuaranteeLabel,
      detail: bookingPricingConfig.returnGuaranteeDetail,
      featured: true,
    },
    {
      id: "group-size",
      label: "Maximum 6 Guests per Vehicle",
      detail: null,
      featured: false,
    },
    {
      id: "cancellation",
      label: bookingPricingConfig.freeCancellationLabel,
      detail: bookingPricingConfig.freeCancellationDetail,
      featured: false,
    },
    {
      id: "cruise-port",
      label: bookingPricingConfig.cruisePortPickupLabel,
      detail: bookingMeetingConfig.place,
      featured: false,
    },
    {
      id: "secure",
      label: bookingPricingConfig.securePaymentLabel,
      detail: bookingPricingConfig.securePaymentDetail,
      featured: false,
    },
  ],
} as const;

export const bookingCheckoutCopy = {
  heading: "Complete Your Booking",
  supportingLine:
    "Review your cruise day and enter your details securely.",
  cruiseDayHeading: "Your Cruise Day",
  reconnectLine: "Your Riviera day is almost booked.",
  payButtonLabel: "Continue to Secure Payment",
  payingLabel: "Preparing…",
  securePaymentHeading: "Secure payment",
  securePaymentNote:
    "You will complete payment on the next step. No charge is taken on this screen.",
  /** Launch payment method — card only via Stripe; no brand/wallet picker. */
  paymentMethodLabel: "Credit or debit card",
  paymentProviderNote: "Secure payment powered by Stripe",
  supportLine: "Need help before booking? Contact our cruise excursion team.",
  supportLinkLabel: "Contact us",
} as const;

/** Understated policy / support routes — pages ship as clear placeholders. */
export const bookingCheckoutLinks = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Return to Ship Guarantee", href: "/return-to-ship-guarantee" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const bookingContactPath = "/contact" as const;

export const bookingSteps = [
  { id: "tour", label: "Experience" },
  { id: "date", label: "Date" },
  { id: "ship", label: "Ship" },
  { id: "guests", label: "Guests" },
  { id: "payment", label: "Payment" },
  { id: "confirmed", label: "Confirmed" },
] as const;

export type BookingStepId = (typeof bookingSteps)[number]["id"];

export function bookingSessionStorageKey(tourId: string): string {
  return `vf-booking:v6:${tourId}`;
}

/** Resolve display start time for a selected ISO date. */
export function getBookingStartTimeLabel(isoDate: string): string {
  const match = bookingDepartures.find((d) => d.date === isoDate);
  if (match?.startTime) return match.startTime;
  return bookingStartTimeConfig.unconfirmedLabel;
}
