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
  return `This ${month.label} timetable shows every cruise ship scheduled to visit Villefranche-sur-Mer, with arrival and departure times to help you plan shore excursions around your port day. Search by ship name, date, or cruise line, then sort any column to find your call quickly.`;
}

export function getShipScheduleMonthPlanning(month: ShipScheduleMonth): string[] {
  return [
    `Use this ${month.label} schedule to match Villefranche shore excursions to your ship's hours ashore. Treat your cruise line app as the source of truth for all aboard times, and build a personal buffer before that deadline to allow for the return tender queue.`,
    `On busy days when multiple ships visit Villefranche-sur-Mer, disembark early and head straight to your excursion meeting point. Compare overlapping calls across months if your itinerary is flexible.`,
    `Times listed here are indicative for planning. Weather, sea conditions, and operational changes can shift arrival or departure after schedules are published.`,
  ];
}

export function getShipScheduleMonthLead(month: ShipScheduleMonth): string {
  return `Plan your ${month.label.split(" ")[0]} port day at Villefranche-sur-Mer with arrival and departure times for every cruise call. Match small-group shore excursions to your ship's hours ashore.`;
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
