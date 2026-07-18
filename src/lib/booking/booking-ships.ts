import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";
import {
  selectScheduleEntryForBooking,
  toBookingShipVisit,
  type BookingShipVisit,
  type BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";
import { loadAllVillefrancheScheduleEntries } from "@/lib/villefranche-cruise-ships";

export type {
  BookingShipVisit,
  BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";
export {
  formatVerifiedShipTime,
  formatVerifiedShipTimingLine,
  toBookingShipVisit,
} from "@/lib/booking/booking-ship-types";

/** Ships calling at Villefranche on an ISO date (deduped by ship name). */
export function getVillefrancheShipsOnDate(
  isoDate: string,
  entries: readonly CruiseScheduleEntry[] = loadAllVillefrancheScheduleEntries(),
): BookingShipVisit[] {
  const byShip = new Map<string, CruiseScheduleEntry[]>();

  for (const entry of entries) {
    if (entry.date !== isoDate) continue;
    const list = byShip.get(entry.ship) ?? [];
    list.push(entry);
    byShip.set(entry.ship, list);
  }

  return [...byShip.values()]
    .map((group) => toBookingShipVisit(selectScheduleEntryForBooking(group)))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

/** Compact date → ships map for the client booking engine. */
export function buildBookingShipsByDate(
  entries: readonly CruiseScheduleEntry[] = loadAllVillefrancheScheduleEntries(),
): BookingShipsByDate {
  const grouped = new Map<string, Map<string, CruiseScheduleEntry[]>>();

  for (const entry of entries) {
    const byShip = grouped.get(entry.date) ?? new Map();
    const list = byShip.get(entry.ship) ?? [];
    list.push(entry);
    byShip.set(entry.ship, list);
    grouped.set(entry.date, byShip);
  }

  const map: BookingShipsByDate = {};

  for (const [date, byShip] of grouped) {
    map[date] = [...byShip.values()]
      .map((group) => toBookingShipVisit(selectScheduleEntryForBooking(group)))
      .sort((a, b) => a.name.localeCompare(b.name, "en"));
  }

  return map;
}
