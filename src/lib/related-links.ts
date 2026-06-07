import { featuredTour } from "@/lib/featured-tour";
import { meetingPointPath, portGuidePath } from "@/lib/site-paths";

export const coreGuideLinks = [
  { label: "Shore excursions", href: "/excursions" },
  { label: "Port guide", href: portGuidePath },
  { label: "One day in Villefranche", href: "/one-day-in-villefranche" },
  {
    label: "Is Villefranche worth visiting?",
    href: "/is-villefranche-worth-visiting",
  },
  { label: "Tender information", href: "/villefranche-tender-information" },
  { label: "Meeting point", href: meetingPointPath },
  { label: "Cruise planner", href: "/cruise-planner" },
  { label: "Ship schedules", href: "/ship-schedules" },
  { label: "FAQ", href: "/faq" },
] as const;

export const shipScheduleLinks = [
  { label: "Ship schedules hub", href: "/ship-schedules" },
  { label: "Cruise ships", href: "/cruise-ships" },
  { label: "2026 schedules", href: "/ship-schedules/2026" },
  { label: "2027 schedules", href: "/ship-schedules/2027" },
] as const;

export const tenderLinks = [
  { label: "Tender information", href: "/villefranche-tender-information" },
  { label: "Meeting point", href: meetingPointPath },
  {
    label: "What if my tender is late?",
    href: "/what-if-my-tender-is-late",
  },
] as const;

export const comparisonLinks = [
  { label: "Villefranche vs Nice", href: "/villefranche-vs-nice" },
  { label: "Villefranche vs Monaco", href: "/villefranche-vs-monaco" },
  { label: "Monaco vs Eze", href: "/monaco-vs-eze" },
] as const;

export const excursionLinks = [
  {
    label: featuredTour.fullName,
    href: featuredTour.path,
  },
  {
    label: "Monaco & Monte Carlo Highlights",
    href: "/excursions/monaco-monte-carlo-highlights",
  },
  {
    label: "Eze Village & Riviera Coast",
    href: "/excursions/eze-village-riviera-coast",
  },
] as const;
