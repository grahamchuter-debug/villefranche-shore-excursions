import {
  getBookingShipImage,
  type BookingShipImage,
} from "@/lib/booking/booking-ship-imagery";
import { slugifyShipName } from "@/lib/cruise-ship-utils";
import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";

/** Ship visiting Villefranche on a bookable date — stored with the booking. */
export type BookingShipVisit = {
  name: string;
  slug: string;
  cruiseLine: string;
  arrival: string;
  departure: string;
  /** Present when optional ship photography exists */
  image?: BookingShipImage;
};

export type BookingShipsByDate = Record<string, BookingShipVisit[]>;

/** Display helper — hides unconfirmed schedule times. */
export function formatShipPortTime(value: string): string | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === "tbc" || normalized === "tb") return null;
  return value.trim();
}

export function toBookingShipVisit(
  entry: CruiseScheduleEntry,
): BookingShipVisit {
  const slug = slugifyShipName(entry.ship);
  const image = getBookingShipImage(slug);
  return {
    name: entry.ship,
    slug,
    cruiseLine: entry.cruiseLine,
    arrival: entry.arrival,
    departure: entry.departure,
    ...(image ? { image } : {}),
  };
}
