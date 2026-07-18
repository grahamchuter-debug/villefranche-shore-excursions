import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/site-metadata";
import { villefrancheCruisePortAlt, siteImages } from "@/lib/site-images";
import {
  requireShipScheduleMonth,
  requireShipScheduleYear,
  SHIP_SCHEDULE_START,
  shipScheduleHub,
  type ShipScheduleMonth,
} from "@/lib/ship-schedule-months";

const scheduleHeroAlt = villefrancheCruisePortAlt;

export function buildShipScheduleHubMetadata(): Metadata {
  return buildPageMetadata({
    title: shipScheduleHub.title,
    description: shipScheduleHub.description,
    path: shipScheduleHub.path,
    ogImage: siteImages.villefrancheCruisePort,
    ogImageAlt: scheduleHeroAlt,
  });
}

export function buildShipScheduleYearMetadata(yearSlug: string): Metadata {
  const yearHub = requireShipScheduleYear(yearSlug);

  return buildPageMetadata({
    title: yearHub.title,
    description: yearHub.description,
    path: yearHub.path,
    ogImage: siteImages.villefrancheCruisePort,
    ogImageAlt: scheduleHeroAlt,
  });
}

export function buildShipScheduleMonthMetadata(monthSlug: string): Metadata {
  const month = requireShipScheduleMonth(monthSlug);

  return buildPageMetadata({
    title: month.title,
    description: month.description,
    path: `/ship-schedules/${monthSlug}`,
    ogImage: siteImages.villefrancheCruisePort,
    ogImageAlt: scheduleHeroAlt,
  });
}

export function getShipScheduleMonthOverview(month: ShipScheduleMonth): string {
  return `This ${month.label} timetable lists every cruise ship scheduled to call at Villefranche-sur-Mer, with published arrival and departure times where available. Use it to match shore plans to your port day — then confirm times in your cruise line app before you go ashore.`;
}

export function getShipScheduleMonthPlanning(
  month: ShipScheduleMonth,
): string[] {
  return [
    `Villefranche-sur-Mer is commonly accessed by tender. Follow your cruise line’s disembarkation instructions for tender numbers, meeting decks, and all-aboard timing.`,
    `Scheduled arrival and departure times can change with weather, sea conditions, and operational decisions. Treat the figures on this ${month.label} page as planning guidance, not a guarantee.`,
    `If you book an independent shore excursion, allow appropriate time to return to the tender embarkation point before all aboard. Villefranche Shore Excursions does not control ship schedules or tender operations.`,
  ];
}

export function getShipScheduleMonthLead(month: ShipScheduleMonth): string {
  return `Plan your ${month.label} port day at Villefranche-sur-Mer with ship names, cruise lines, and published arrival and departure times. Match small-group shore excursions to your hours ashore — and leave a sensible buffer for the tender return.`;
}

export function getShipScheduleYearLead(year: number): string {
  if (year === SHIP_SCHEDULE_START.year) {
    return `Browse Villefranche cruise ship schedules from June ${year}. Find when your ship visits Villefranche-sur-Mer, then plan shore excursions with enough time to return before all aboard.`;
  }

  return `Browse all ${year} Villefranche cruise ship schedules by month. Find when your ship visits Villefranche-sur-Mer, then plan shore excursions with enough time to return before all aboard.`;
}

export function getShipScheduleHubLead(): string {
  return "Browse Villefranche cruise ship schedules by year and month. Find arrival and departure times for ships visiting Villefranche-sur-Mer, then plan small-group shore excursions that fit your port day.";
}

export function getShipScheduleMonthBreadcrumbLabel(
  month: ShipScheduleMonth,
): string {
  return month.label;
}
