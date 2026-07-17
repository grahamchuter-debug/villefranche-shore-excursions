import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";
import {
  toBookingShipVisit,
  type BookingShipVisit,
  type BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";
import { loadAllVillefrancheScheduleEntries } from "@/lib/villefranche-cruise-ships";

export type { BookingShipVisit, BookingShipsByDate } from "@/lib/booking/booking-ship-types";
export { formatShipPortTime, toBookingShipVisit } from "@/lib/booking/booking-ship-types";

/** Ships calling at Villefranche on an ISO date (deduped by ship name). */
export function getVillefrancheShipsOnDate(
  isoDate: string,
  entries: readonly CruiseScheduleEntry[] = loadAllVillefrancheScheduleEntries(),
): BookingShipVisit[] {
  const seen = new Set<string>();
  const visits: BookingShipVisit[] = [];

  for (const entry of entries) {
    if (entry.date !== isoDate) continue;
    if (seen.has(entry.ship)) continue;
    seen.add(entry.ship);
    visits.push(toBookingShipVisit(entry));
  }

  return visits.sort((a, b) => a.name.localeCompare(b.name, "en"));
}

/** Compact date → ships map for the client booking engine. */
export function buildBookingShipsByDate(
  entries: readonly CruiseScheduleEntry[] = loadAllVillefrancheScheduleEntries(),
): BookingShipsByDate {
  const map: BookingShipsByDate = {};

  for (const entry of entries) {
    const list = map[entry.date] ?? [];
    if (!list.some((ship) => ship.name === entry.ship)) {
      list.push(toBookingShipVisit(entry));
      map[entry.date] = list;
    }
  }

  for (const date of Object.keys(map)) {
    map[date] = map[date].sort((a, b) => a.name.localeCompare(b.name, "en"));
  }

  return map;
}
