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
    "Sunlit Port Hercules in Monaco with luxury yachts and the Monte Carlo skyline on the French Riviera",
  heroGallery: [
    bookingHeroSlide("monaco-harbour", { width: 1920, height: 1331 }, true),
    bookingHeroSlide("eze-village", { width: 1920, height: 1187 }),
    bookingHeroSlide("villefranche-harbour", { width: 1920, height: 1292 }),
    bookingHeroSlide("riviera-coast", { width: 1920, height: 1256 }),
  ] as const,
  /** Soft panorama used just before payment */
  checkoutReconnectImage: "/images/booking/riviera-coast-1920.webp",
  checkoutReconnectImageAlt:
    "Bright panoramic view of the French Riviera coastline",
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
  supportLine: "Need help before booking? Contact our cruise excursion team.",
  supportLinkLabel: "Contact us",
} as const;

/** Understated policy / support routes — pages ship as clear placeholders. */
export const bookingCheckoutLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return to Ship Guarantee", href: "/return-to-ship-guarantee" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const bookingContactPath = "/contact" as const;

export const bookingPaymentMethods = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "paypal", label: "PayPal" },
] as const;

export const bookingSteps = [
  { id: "tour", label: "Experience" },
  { id: "date", label: "Date" },
  { id: "guests", label: "Guests" },
  { id: "payment", label: "Booking" },
  { id: "confirmed", label: "Confirmed" },
] as const;

export type BookingStepId = (typeof bookingSteps)[number]["id"];

export function bookingSessionStorageKey(tourId: string): string {
  return `vf-booking:v3:${tourId}`;
}

/** Resolve display start time for a selected ISO date. */
export function getBookingStartTimeLabel(isoDate: string): string {
  const match = bookingDepartures.find((d) => d.date === isoDate);
  if (match?.startTime) return match.startTime;
  return bookingStartTimeConfig.unconfirmedLabel;
}
