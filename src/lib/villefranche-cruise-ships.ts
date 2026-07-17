import type { CruiseScheduleEntry } from "@/lib/cruise-schedule-types";
import { formatScheduleDate } from "@/lib/cruise-schedule-types";
import type {
  CruiseShipCall,
  CruiseShipProfile,
  CruiseShipSummary,
} from "@/lib/cruise-ship-types";
import { slugifyShipName } from "@/lib/cruise-ship-utils";
import { loadVillefrancheCruiseSchedule } from "@/lib/villefranche-cruise-schedule";
import {
  shipScheduleMonths,
  type ShipScheduleMonth,
} from "@/lib/ship-schedule-months";

export type {
  CruiseShipCall,
  CruiseShipProfile,
  CruiseShipSummary,
} from "@/lib/cruise-ship-types";
export { getCruiseShipPath, groupShipsByCruiseLine, slugifyShipName } from "@/lib/cruise-ship-utils";

export const cruiseShipsHub = {
  path: "/cruise-ships",
  title: "Villefranche Cruise Ships",
  description:
    "Browse cruise ships that visit Villefranche-sur-Mer on the French Riviera. See port call history, tender planning advice, and shore excursion recommendations for each vessel.",
} as const;

function parseMinutesFromTime(value: string): number | null {
  const normalized = value.trim().toLowerCase();

  if (
    !normalized ||
    normalized === "tbc" ||
    normalized === "tb" ||
    normalized === "00:00" ||
    normalized === "0:00"
  ) {
    return null;
  }

  const match = normalized.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

export function formatTimeInPort(arrival: string, departure: string): string {
  const arrivalMinutes = parseMinutesFromTime(arrival);
  const departureMinutes = parseMinutesFromTime(departure);

  if (arrivalMinutes === null || departureMinutes === null) {
    return "Times to be confirmed";
  }

  let totalMinutes = departureMinutes - arrivalMinutes;

  if (totalMinutes <= 0) {
    totalMinutes += 24 * 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hours`;
  }

  return `${hours}h ${minutes}m`;
}

function getVisitLengthCategory(
  hours: number,
): "short" | "standard" | "long" {
  if (hours < 6) {
    return "short";
  }

  if (hours < 9) {
    return "standard";
  }

  return "long";
}

function formatTypicalVisitLength(hoursList: number[]): string {
  if (hoursList.length === 0) {
    return "Varies by sailing — check your call times";
  }

  const sorted = [...hoursList].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];

  if (min === max) {
    return `Approx. ${formatHoursLabel(median)}`;
  }

  return `Approx. ${formatHoursLabel(median)} (range ${formatHoursLabel(min)}–${formatHoursLabel(max)})`;
}

function formatHoursLabel(hours: number): string {
  const whole = Math.floor(hours);
  const fraction = hours - whole;

  if (fraction === 0) {
    return `${whole} hours`;
  }

  const minutes = Math.round(fraction * 60);
  return minutes === 0 ? `${whole} hours` : `${whole}h ${minutes}m`;
}

function hoursFromCall(entry: CruiseScheduleEntry): number | null {
  const arrivalMinutes = parseMinutesFromTime(entry.arrival);
  const departureMinutes = parseMinutesFromTime(entry.departure);

  if (arrivalMinutes === null || departureMinutes === null) {
    return null;
  }

  let totalMinutes = departureMinutes - arrivalMinutes;

  if (totalMinutes <= 0) {
    totalMinutes += 24 * 60;
  }

  return totalMinutes / 60;
}

function resolveMonthLabel(monthKey: string): string {
  const month = shipScheduleMonths.find((item) => item.monthKey === monthKey);

  return month?.label ?? monthKey;
}

function resolveMonthSlug(monthKey: string): string {
  const month = shipScheduleMonths.find((item) => item.monthKey === monthKey);

  return month?.slug ?? monthKey;
}

export function loadAllVillefrancheScheduleEntries(): CruiseScheduleEntry[] {
  return shipScheduleMonths.flatMap((month) =>
    loadVillefrancheCruiseSchedule(month),
  );
}

function buildCallEntry(
  entry: CruiseScheduleEntry,
  month: ShipScheduleMonth,
): CruiseShipCall {
  return {
    ...entry,
    timeInPort: formatTimeInPort(entry.arrival, entry.departure),
    scheduleMonthSlug: month.slug,
    scheduleMonthLabel: month.label,
  };
}

export function buildCruiseShipSummaries(): CruiseShipSummary[] {
  const ships = new Map<
    string,
    {
      name: string;
      cruiseLine: string;
      calls: CruiseScheduleEntry[];
      monthKeys: Set<string>;
    }
  >();

  for (const month of shipScheduleMonths) {
    for (const entry of loadVillefrancheCruiseSchedule(month)) {
      const slug = slugifyShipName(entry.ship);
      const monthKey = entry.date.slice(0, 7);
      const existing = ships.get(slug);

      if (existing) {
        existing.calls.push(entry);
        existing.monthKeys.add(monthKey);

        if (!existing.cruiseLine && entry.cruiseLine) {
          existing.cruiseLine = entry.cruiseLine;
        }

        continue;
      }

      ships.set(slug, {
        name: entry.ship,
        cruiseLine: entry.cruiseLine,
        calls: [entry],
        monthKeys: new Set([monthKey]),
      });
    }
  }

  return [...ships.entries()]
    .map(([slug, ship]) => ({
      slug,
      name: ship.name,
      cruiseLine: ship.cruiseLine || "Not listed",
      callCount: ship.calls.length,
      monthLabels: [...ship.monthKeys]
        .sort()
        .map((monthKey) => resolveMonthLabel(monthKey)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function getAllCruiseShipSlugs(): string[] {
  return buildCruiseShipSummaries().map((ship) => ship.slug);
}

export function getCruiseShipBySlug(slug: string): CruiseShipProfile | undefined {
  const summaries = buildCruiseShipSummaries();
  const summary = summaries.find((ship) => ship.slug === slug);

  if (!summary) {
    return undefined;
  }

  const calls: CruiseShipCall[] = [];

  for (const month of shipScheduleMonths) {
    for (const entry of loadVillefrancheCruiseSchedule(month)) {
      if (slugifyShipName(entry.ship) !== slug) {
        continue;
      }

      calls.push(buildCallEntry(entry, month));
    }
  }

  calls.sort((a, b) => a.date.localeCompare(b.date));

  const hoursList = calls
    .map((call) => hoursFromCall(call))
    .filter((hours): hours is number => hours !== null);

  const categories = hoursList.map(getVisitLengthCategory);
  const uniqueCategories = new Set(categories);
  let visitLengthCategory: CruiseShipProfile["visitLengthCategory"] = "mixed";

  if (uniqueCategories.size === 1 && categories.length > 0) {
    visitLengthCategory = categories[0];
  } else if (categories.length === 0) {
    visitLengthCategory = "mixed";
  }

  return {
    ...summary,
    calls,
    typicalVisitLength: formatTypicalVisitLength(hoursList),
    visitLengthCategory,
  };
}

export function requireCruiseShipBySlug(slug: string): CruiseShipProfile {
  const ship = getCruiseShipBySlug(slug);

  if (!ship) {
    throw new Error(`Missing cruise ship profile for ${slug}`);
  }

  return ship;
}

export function formatCruiseShipCallHeading(call: CruiseShipCall): string {
  return `${formatScheduleDate(call.date)} · ${call.timeInPort} in port`;
}

export function getScheduleMonthForEntry(
  entry: CruiseScheduleEntry,
): ShipScheduleMonth | undefined {
  const monthKey = entry.date.slice(0, 7);
  return shipScheduleMonths.find((month) => month.monthKey === monthKey);
}
