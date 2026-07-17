const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SHIP_SCHEDULE_YEARS = [2026, 2027, 2028] as const;

/** First month the site publishes schedules — June 2026 (monthIndex 5). */
export const SHIP_SCHEDULE_START = {
  year: 2026,
  monthIndex: 5,
} as const;

/** Last published month from the current CruiseTimetables index — November 2028. */
export const SHIP_SCHEDULE_END = {
  year: 2028,
  monthIndex: 10,
} as const;

export type ShipScheduleYear = (typeof SHIP_SCHEDULE_YEARS)[number];

export type ShipScheduleMonth = {
  slug: string;
  label: string;
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  monthKey: string;
  csvFile: string;
  year: ShipScheduleYear;
  monthIndex: number;
};

export const shipScheduleHub = {
  path: "/ship-schedules",
  title: "Villefranche-sur-Mer Cruise Ship Schedule",
  description:
    "Browse Villefranche-sur-Mer cruise ship schedules by month and year. View arrival times, departure times, and cruise lines visiting Villefranche-sur-Mer, France to plan your port day.",
} as const;

function buildMonthConfig(
  monthIndex: number,
  year: ShipScheduleYear,
): ShipScheduleMonth {
  const monthName = MONTH_NAMES[monthIndex];
  const monthLabel = MONTH_LABELS[monthIndex];
  const slug = `${monthName}-${year}`;
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

  return {
    slug,
    label: `${monthLabel} ${year}`,
    title: `Villefranche-sur-Mer Cruise Ship Schedule ${monthLabel} ${year}`,
    description: `View the Villefranche-sur-Mer cruise ship schedule for ${monthLabel} ${year} including arrival times, departure times, and cruise lines visiting Villefranche-sur-Mer, France.`,
    cardTitle: `${monthLabel} ${year} Schedule`,
    cardDescription: `View all ${monthLabel} cruise ship calls at Villefranche-sur-Mer`,
    monthKey,
    csvFile: `${slug}.csv`,
    year,
    monthIndex,
  };
}

function isPublishedScheduleMonth(
  monthIndex: number,
  year: ShipScheduleYear,
): boolean {
  const start = SHIP_SCHEDULE_START;
  const end = SHIP_SCHEDULE_END;

  if (year < start.year || year > end.year) {
    return false;
  }

  if (year === start.year && monthIndex < start.monthIndex) {
    return false;
  }

  if (year === end.year && monthIndex > end.monthIndex) {
    return false;
  }

  return true;
}

export const shipScheduleMonths: ShipScheduleMonth[] =
  SHIP_SCHEDULE_YEARS.flatMap((year) =>
    MONTH_NAMES.map((_, monthIndex) => buildMonthConfig(monthIndex, year)).filter(
      (month) => isPublishedScheduleMonth(month.monthIndex, month.year),
    ),
  );

export const shipScheduleYearHubs = SHIP_SCHEDULE_YEARS.map((year) => ({
  year,
  slug: String(year),
  path: `/ship-schedules/${year}`,
  title: `Villefranche-sur-Mer Cruise Ship Schedule ${year}`,
  description:
    year === SHIP_SCHEDULE_START.year
      ? `Browse Villefranche-sur-Mer cruise ship schedules from June ${year} onwards. View arrival and departure times for cruise ships visiting Villefranche-sur-Mer on the French Riviera.`
      : year === SHIP_SCHEDULE_END.year
        ? `Browse Villefranche-sur-Mer cruise ship schedules for ${year} through November. View arrival and departure times for cruise ships visiting Villefranche-sur-Mer on the French Riviera.`
        : `Browse all ${year} Villefranche-sur-Mer cruise ship schedules by month. View arrival and departure times for cruise ships visiting Villefranche-sur-Mer on the French Riviera.`,
  label: `${year} Schedules`,
}));

export function getShipScheduleMonth(slug: string): ShipScheduleMonth | undefined {
  return shipScheduleMonths.find((month) => month.slug === slug);
}

export function requireShipScheduleMonth(slug: string): ShipScheduleMonth {
  const month = getShipScheduleMonth(slug);

  if (!month) {
    throw new Error(`Missing ship schedule config for ${slug}`);
  }

  return month;
}

export function getShipScheduleYear(
  slug: string,
): (typeof shipScheduleYearHubs)[number] | undefined {
  return shipScheduleYearHubs.find((yearHub) => yearHub.slug === slug);
}

export function requireShipScheduleYear(slug: string) {
  const yearHub = getShipScheduleYear(slug);

  if (!yearHub) {
    throw new Error(`Missing ship schedule year config for ${slug}`);
  }

  return yearHub;
}

export function getShipScheduleMonthsForYear(
  year: number,
): ShipScheduleMonth[] {
  return shipScheduleMonths.filter((month) => month.year === year);
}

export function getShipScheduleMonthPath(slug: string): string {
  return `/ship-schedules/${slug}`;
}

export function getShipScheduleYearPath(year: number): string {
  return `/ship-schedules/${year}`;
}

export function getAllShipScheduleSlugs(): string[] {
  return [
    ...shipScheduleYearHubs.map((yearHub) => yearHub.slug),
    ...shipScheduleMonths.map((month) => month.slug),
  ];
}

export function isShipScheduleYearSlug(
  slug: string,
): slug is `${ShipScheduleYear}` {
  return SHIP_SCHEDULE_YEARS.some((year) => String(year) === slug);
}

export function isShipScheduleMonthSlug(slug: string): boolean {
  return shipScheduleMonths.some((month) => month.slug === slug);
}
