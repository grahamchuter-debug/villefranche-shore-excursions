import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
  featuredTourMeetingPointLine,
} from "@/lib/featured-tour-facts";

/** Minutes after ship arrival before passengers are realistically ashore in Villefranche. */
export const TENDER_ASHORE_DELAY_MINUTES = 30;

/** Be at the tender pier this many minutes before published departure. */
export const TENDER_PIER_RETURN_BUFFER_MINUTES = 60;

export const PLANNER_DISCLAIMER =
  "Estimates assume Villefranche tender operations. Actual timing may vary by cruise line, ship size, weather, and local tender queues." as const;

export type PlannerFitBand = "short" | "good" | "excellent";

export type PlannerExcursionLink = {
  label: string;
  href?: string;
};

export type VillefranchePlannerResult = {
  scheduledPortMinutes: number;
  scheduledPortLabel: string;
  tenderPlanningMinutes: number;
  usableAshoreMinutes: number;
  usableAshoreLabel: string;
  ashoreFromLabel: string;
  recommendedTenderPierReturn: string;
  departureLabel: string;
  confidenceScore: number;
  confidenceLabel: string;
  band: PlannerFitBand;
  recommendationCardTitle: string;
  recommendationHeading: string | null;
  fitMessage: string;
  shortStayNote: string | null;
  recommendMainTour: boolean;
  mainTourStrength: "none" | "good" | "strong";
  mainTourBenefits: readonly string[] | null;
  shortStaySuggestions: readonly string[] | null;
  excursions: readonly PlannerExcursionLink[];
  dayPlan: readonly string[];
};

export type VillefranchePlannerError = {
  error: string;
};

export const villefranchePortDayPlannerConfig = {
  portName: "Villefranche-sur-Mer",
  heading: "Villefranche Cruise Day Planner",
  subtitle:
    "Enter your ship arrival and departure times. We calculate tender delays and return-to-ship margins — then recommend excursions that fit your schedule.",
} as const;

export const PLANNER_GOOD_MIN_HOURS = 5;
export const PLANNER_EXCELLENT_MIN_HOURS = 6;

export const plannerMainTourBenefits = [
  featuredTourFacts.durationLabel,
  featuredTourGroupSizeLine,
  "Shared small-group excursion",
  "Visits Monaco, Monte Carlo and Eze",
  "Designed for cruise passengers arriving by tender",
  "Return-to-ship planning built in",
] as const;

export const plannerShortStaySuggestions = [
  "Villefranche harbour and old town",
  "Citadel and harbour viewpoints",
  "Shorter independent sightseeing near the tender pier",
] as const;

export function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function formatTimeLabel(time: string): string {
  const minutes = parseTimeToMinutes(time);
  if (minutes === null) {
    return time;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function addMinutesToTime(
  time: string,
  addMinutes: number,
): string | null {
  const totalMinutes = parseTimeToMinutes(time);
  if (totalMinutes === null) {
    return null;
  }

  const result = (totalMinutes + addMinutes) % (24 * 60);
  const hours = Math.floor(result / 60);
  const minutes = result % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function subtractMinutesFromTime(
  time: string,
  subtractMinutes: number,
): string | null {
  const totalMinutes = parseTimeToMinutes(time);
  if (totalMinutes === null) {
    return null;
  }

  let result = totalMinutes - subtractMinutes;
  if (result < 0) {
    result += 24 * 60;
  }

  const hours = Math.floor(result / 60) % 24;
  const minutes = result % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function calculatePortMinutes(
  arrival: string,
  departure: string,
): number | null {
  const arrivalMinutes = parseTimeToMinutes(arrival);
  const departureMinutes = parseTimeToMinutes(departure);

  if (arrivalMinutes === null || departureMinutes === null) {
    return null;
  }

  let diff = departureMinutes - arrivalMinutes;

  if (diff <= 0) {
    diff += 24 * 60;
  }

  return diff;
}

export function formatPortDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function getUsableTimeBand(usableHours: number): PlannerFitBand {
  if (usableHours < PLANNER_GOOD_MIN_HOURS) {
    return "short";
  }
  if (usableHours < PLANNER_EXCELLENT_MIN_HOURS) {
    return "good";
  }
  return "excellent";
}

function getBandDetails(usableHours: number, band: PlannerFitBand) {
  if (band === "short") {
    return {
      confidenceScore: usableHours < 3 ? 3 : 4,
      confidenceLabel: "Tight schedule",
      recommendationCardTitle: "Stay Close to Villefranche",
      recommendationHeading: null,
      fitMessage:
        "With under five hours ashore after tender time, we recommend staying close to the tender pier and focusing on Villefranche harbour, the old town, citadel viewpoints, or shorter independent sightseeing.",
      shortStayNote:
        "This does not mean the main tour is impossible, but we recommend checking carefully before booking because tender queues and return timing can make the schedule tight.",
      recommendMainTour: false,
      mainTourStrength: "none" as const,
      mainTourBenefits: null,
      shortStaySuggestions: plannerShortStaySuggestions,
      excursions: [
        { label: "Villefranche harbour and old town" },
        { label: "Harbour viewpoints and waterfront cafés" },
        { label: "Citadel and coastal paths" },
        {
          label: "Eze Village & Riviera Coast",
          href: "/excursions/eze-village-riviera-coast",
        },
      ],
      dayPlan: [
        "Take an early tender after the ship clears passengers ashore",
        "Explore Villefranche-sur-Mer on foot from the tender landing",
        "Optional short coastal walk if energy and timing allow",
        "Return to the tender pier by your recommended time",
      ],
    };
  }

  if (band === "good") {
    return {
      confidenceScore: 7,
      confidenceLabel: "Workable schedule",
      recommendationCardTitle: "May Work — Check Availability",
      recommendationHeading: `${featuredTour.cardName} may work for your schedule`,
      fitMessage:
        `Your usable time ashore may allow the small-group tour (${featuredTourFacts.durationLabel.toLowerCase()}), but tender timing, meeting point and return arrangements need to be checked before booking.`,
      shortStayNote: null,
      recommendMainTour: true,
      mainTourStrength: "good" as const,
      mainTourBenefits: plannerMainTourBenefits,
      shortStaySuggestions: null,
      excursions: [
        {
          label: featuredTour.cardName,
          href: featuredTour.path,
        },
        {
          label: "Monaco & Monte Carlo Highlights",
          href: "/excursions/monaco-monte-carlo-highlights",
        },
      ],
      dayPlan: [
        `Tender ashore as early as practical and walk to ${featuredTourMeetingPointLine}`,
        `Book the ${featuredTour.cardName} if availability is confirmed`,
        "Allow margin for tender queues on the return journey",
        "Be at the tender pier by your recommended return time",
      ],
    };
  }

  return {
    confidenceScore: usableHours >= 8 ? 10 : 9,
    confidenceLabel: "Comfortable schedule",
    recommendationCardTitle: "Excellent Fit",
    recommendationHeading: `${featuredTour.cardName} fits your schedule well`,
    fitMessage:
      `Your estimated usable time ashore gives a comfortable window for this small-group French Riviera excursion (${featuredTourFacts.durationLabel.toLowerCase()}), with time allowed for Villefranche tender operations and return-to-ship planning.`,
    shortStayNote: null,
    recommendMainTour: true,
    mainTourStrength: "strong" as const,
    mainTourBenefits: plannerMainTourBenefits,
    shortStaySuggestions: null,
    excursions: [
      {
        label: featuredTour.cardName,
        href: featuredTour.path,
      },
      {
        label: "Monaco & Monte Carlo Highlights",
        href: "/excursions/monaco-monte-carlo-highlights",
      },
    ],
    dayPlan: [
      "Tender ashore early on busy port days",
      `Morning: ${featuredTour.cardName}`,
      "Free time in Villefranche harbour if the schedule allows",
      "Return to the tender pier well before your recommended time",
    ],
  };
}

export function calculateVillefranchePlannerResult(
  arrival: string,
  departure: string,
): VillefranchePlannerResult | VillefranchePlannerError {
  const scheduledPortMinutes = calculatePortMinutes(arrival, departure);

  if (scheduledPortMinutes === null) {
    return { error: "Enter valid arrival and departure times." };
  }

  const tenderPlanningMinutes =
    TENDER_ASHORE_DELAY_MINUTES + TENDER_PIER_RETURN_BUFFER_MINUTES;

  if (scheduledPortMinutes <= tenderPlanningMinutes) {
    return {
      error:
        "Your port call is too short once tender ashore and return margins are included. Confirm times with your cruise line.",
    };
  }

  const usableAshoreMinutes = scheduledPortMinutes - tenderPlanningMinutes;
  const usableHours = usableAshoreMinutes / 60;
  const band = getUsableTimeBand(usableHours);
  const bandDetails = getBandDetails(usableHours, band);

  const ashoreFromLabel =
    addMinutesToTime(arrival, TENDER_ASHORE_DELAY_MINUTES) ?? "—";
  const recommendedTenderPierReturn =
    subtractMinutesFromTime(departure, TENDER_PIER_RETURN_BUFFER_MINUTES) ?? "—";

  return {
    scheduledPortMinutes,
    scheduledPortLabel: formatPortDuration(scheduledPortMinutes),
    tenderPlanningMinutes,
    usableAshoreMinutes,
    usableAshoreLabel: formatPortDuration(usableAshoreMinutes),
    ashoreFromLabel: formatTimeLabel(ashoreFromLabel),
    recommendedTenderPierReturn: formatTimeLabel(recommendedTenderPierReturn),
    departureLabel: formatTimeLabel(departure),
    confidenceScore: bandDetails.confidenceScore,
    confidenceLabel: bandDetails.confidenceLabel,
    band,
    recommendationCardTitle: bandDetails.recommendationCardTitle,
    recommendationHeading: bandDetails.recommendationHeading,
    fitMessage: bandDetails.fitMessage,
    shortStayNote: bandDetails.shortStayNote,
    recommendMainTour: bandDetails.recommendMainTour,
    mainTourStrength: bandDetails.mainTourStrength,
    mainTourBenefits: bandDetails.mainTourBenefits,
    shortStaySuggestions: bandDetails.shortStaySuggestions,
    excursions: bandDetails.excursions,
    dayPlan: bandDetails.dayPlan,
  };
}

export function getConfidenceTone(score: number): {
  badge: string;
  bar: string;
} {
  if (score >= 9) {
    return { badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500" };
  }
  if (score >= 6) {
    return { badge: "bg-amber-100 text-amber-800", bar: "bg-amber-500" };
  }
  return { badge: "bg-orange-100 text-orange-800", bar: "bg-orange-500" };
}
