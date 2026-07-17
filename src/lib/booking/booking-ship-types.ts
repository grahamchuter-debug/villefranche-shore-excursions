import {
  getBookingShipImage,
  type BookingShipImage,
} from "@/lib/booking/booking-ship-imagery";
import { findVerifiedShipTiming } from "@/lib/booking/booking-verified-ship-timings";
import { slugifyShipName } from "@/lib/cruise-ship-utils";
import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";

/**
 * Ship visiting Villefranche on a bookable date — stored with the booking.
 * Arrival/departure are independently optional and only set when verified.
 */
export type BookingShipVisit = {
  name: string;
  slug: string;
  cruiseLine: string;
  /** Verified arrival only — null when unknown */
  arrivalTime: string | null;
  /** Verified departure only — null when unknown */
  departureTime: string | null;
  /** True only when times come from a verified import */
  timesVerified: boolean;
  /** Present when optional ship photography exists for this exact vessel */
  image?: BookingShipImage;
};

export type BookingShipsByDate = Record<string, BookingShipVisit[]>;

/**
 * Format a verified port time for display.
 * Returns null for missing, placeholder, or unverified values.
 */
export function formatVerifiedShipTime(
  value: string | null | undefined,
): string | null {
  if (value == null) return null;
  const normalized = value.trim().toLowerCase();
  if (
    !normalized ||
    normalized === "tbc" ||
    normalized === "tb" ||
    normalized === "00:00" ||
    normalized === "0:00" ||
    normalized === "arrival" ||
    normalized === "departure"
  ) {
    return null;
  }
  return value.trim();
}

/** Build Arrives / Departs line only from verified times. */
export function formatVerifiedShipTimingLine(
  ship: Pick<BookingShipVisit, "arrivalTime" | "departureTime" | "timesVerified">,
): string | null {
  if (!ship.timesVerified) return null;
  const arrival = formatVerifiedShipTime(ship.arrivalTime);
  const departure = formatVerifiedShipTime(ship.departureTime);
  const parts = [
    arrival ? `Arrives ${arrival}` : null,
    departure ? `Departs ${departure}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function toBookingShipVisit(
  entry: CruiseScheduleEntry,
): BookingShipVisit {
  const slug = slugifyShipName(entry.ship);
  const image = getBookingShipImage(slug);
  const verified = findVerifiedShipTiming(entry.date, slug);

  return {
    name: entry.ship,
    slug,
    cruiseLine: entry.cruiseLine,
    arrivalTime: verified
      ? formatVerifiedShipTime(verified.arrivalTime)
      : null,
    departureTime: verified
      ? formatVerifiedShipTime(verified.departureTime)
      : null,
    timesVerified: Boolean(verified),
    ...(image ? { image } : {}),
  };
}
