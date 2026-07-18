import { featuredTour } from "@/lib/featured-tour";
import { cruiseLineVillefranchePages } from "@/lib/cruise-line-villefranche-pages";
import { portGuidePath, meetingPointPath } from "@/lib/site-paths";
import {
  buildCruiseShipSummaries,
  cruiseShipsHub,
} from "@/lib/villefranche-cruise-ships";
import { shipScheduleHub, shipScheduleMonths, shipScheduleYearHubs } from "@/lib/ship-schedule-months";

const cruiseShipRoutes = buildCruiseShipSummaries().map((ship) => ({
  path: `/cruise-ships/${ship.slug}`,
  priority: 0.75,
  changeFrequency: "weekly" as const,
}));

export const siteRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  {
    path: "/excursions",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: featuredTour.bookingPath,
    priority: 0.95,
    changeFrequency: "weekly" as const,
  },
  {
    path: featuredTour.path,
    priority: 0.95,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/monaco-monte-carlo-highlights",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/eze-village-riviera-coast",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: portGuidePath,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/one-day-in-villefranche",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/is-villefranche-worth-visiting",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/villefranche-tender-information",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: meetingPointPath,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/what-if-my-tender-is-late",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/villefranche-vs-nice",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/villefranche-vs-monaco",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/monaco-vs-eze",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/cruise-planner",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  {
    path: "/terms-and-conditions",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/cancellation-policy",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/privacy-policy",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/contact",
    priority: 0.5,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/return-to-ship-guarantee",
    priority: 0.5,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/image-credits",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: shipScheduleHub.path,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  ...shipScheduleYearHubs.map((yearHub) => ({
    path: yearHub.path,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  })),
  ...shipScheduleMonths.map((month) => ({
    path: `/ship-schedules/${month.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  })),
  {
    path: cruiseShipsHub.path,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  ...cruiseLineVillefranchePages.map((page) => ({
    path: page.path,
    priority: 0.75,
    changeFrequency: "monthly" as const,
  })),
  ...cruiseShipRoutes,
] as const;
