import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
} from "@/lib/featured-tour-facts";
import { meetingPointPath } from "@/lib/site-paths";
import { buildCruiseShipSummaries } from "@/lib/villefranche-cruise-ships";
import type { CruiseShipSummary } from "@/lib/cruise-ship-types";
import { getCruiseShipPath } from "@/lib/cruise-ship-utils";

export type CruiseLineVillefranchePage = {
  slug: string;
  path: string;
  cruiseLineName: string;
  /** Matches `cruiseLine` values in schedule CSV data */
  cruiseLineMatches: readonly string[];
  h1: string;
  title: string;
  description: string;
  intro: string;
  tenderIntro: string;
  whyTenderDifferent: string;
  faqs: readonly { question: string; answer: string }[];
};

const cruisePlannerPath = "/cruise-planner";
const tenderInfoPath = "/villefranche-tender-information";
const shipSchedulesPath = "/ship-schedules";

function shipsForLine(
  matches: readonly string[],
  ships: CruiseShipSummary[],
): CruiseShipSummary[] {
  const matchSet = new Set(matches);
  return ships.filter((ship) => matchSet.has(ship.cruiseLine));
}

export const cruiseLineVillefranchePages: CruiseLineVillefranchePage[] = [
  {
    slug: "celebrity-cruises-villefranche",
    path: "/cruise-lines/celebrity-cruises-villefranche",
    cruiseLineName: "Celebrity Cruises",
    cruiseLineMatches: ["Celebrity Cruises", "Celebrity"],
    h1: "Celebrity Cruises Villefranche Shore Excursions",
    title: "Celebrity Cruises Villefranche Shore Excursions & Tender Guide",
    description:
      "Plan your Celebrity Cruises Villefranche port day: tender logistics, meeting point directions, and the recommended small-group Monaco, Monte Carlo and Eze shore excursion.",
    intro:
      "Celebrity Cruises ships calling at Villefranche-sur-Mer typically anchor in the bay and tender passengers ashore. Build tender time into your port day before booking a French Riviera excursion.",
    tenderIntro:
      "Villefranche-sur-Mer is typically a tender port — there is no large-ship dock in the harbour. Celebrity passengers disembark by tender boat, then walk to shore excursion meeting points near the landing.",
    whyTenderDifferent:
      "Unlike docked ports where you step straight onto a pier, Villefranche requires tender boats in both directions. That means queuing, walking from the landing, and returning well before all aboard — especially on busy days when several ships share the anchorage.",
    faqs: [
      {
        question: "Do Celebrity ships dock in Villefranche-sur-Mer?",
        answer:
          "No. Celebrity Cruises vessels typically anchor offshore and use tender boats to reach Villefranche harbour. Allow time for tender transfers when planning shore excursions.",
      },
      {
        question: "Which Celebrity shore excursion fits a Villefranche call?",
        answer: `The ${featuredTour.fullName} is designed for tender-port timing — ${featuredTourFacts.durationLabel}, ${featuredTourGroupSizeLine}, visiting Monaco, Monte Carlo and Eze.`,
      },
      {
        question: "Where do I meet my excursion after tendering?",
        answer: `Meet near the Villefranche tender landing (${featuredTourFacts.meetingPoint.walkFromTender}). Exact details are confirmed on booking. See our meeting point guide.`,
      },
    ],
  },
  {
    slug: "princess-cruises-villefranche",
    path: "/cruise-lines/princess-cruises-villefranche",
    cruiseLineName: "Princess Cruises",
    cruiseLineMatches: ["Princess Cruises", "Princess"],
    h1: "Princess Cruises Villefranche Shore Excursions",
    title: "Princess Cruises Villefranche Shore Excursions & Tender Guide",
    description:
      "Plan your Princess Cruises Villefranche port day: tender logistics, excursion timing, and the small-group Monaco, Monte Carlo and Eze tour for cruise passengers.",
    intro:
      "Princess Cruises itineraries that include Villefranche-sur-Mer use tender operations into the harbour. Plan your shore time around tender ashore, excursion meeting points, and return queues before all aboard.",
    tenderIntro:
      "Villefranche-sur-Mer is typically a tender port. Princess passengers reach the harbour by tender boat — not by walking off the ship onto a dock.",
    whyTenderDifferent:
      "Tender ports add queuing and walking time that docked ports do not. For Villefranche, that means reaching your meeting point after disembarking and allowing margin to return to the tender pier before your ship's all-aboard time.",
    faqs: [
      {
        question: "Is Villefranche a tender port for Princess Cruises?",
        answer:
          "Yes. Large cruise ships typically anchor in the bay and transfer passengers to Villefranche-sur-Mer by tender.",
      },
      {
        question: "How much time do I need for a French Riviera excursion?",
        answer: `The recommended small-group tour is ${featuredTourFacts.durationLabel}. Use our cruise planner with your ship's published arrival and departure times to see whether a Monaco–Monte Carlo–Eze tour fits your call.`,
      },
      {
        question: "Where is the excursion meeting point?",
        answer: `Near the Villefranche tender landing — ${featuredTourFacts.meetingPoint.walkFromTender}. Full directions are confirmed on booking and on our meeting point page.`,
      },
    ],
  },
  {
    slug: "viking-cruises-villefranche",
    path: "/cruise-lines/viking-cruises-villefranche",
    cruiseLineName: "Viking Cruises",
    cruiseLineMatches: ["Viking Ocean Cruises", "Viking Cruises", "Viking"],
    h1: "Viking Cruises Villefranche Shore Excursions",
    title: "Viking Cruises Villefranche Shore Excursions & Tender Guide",
    description:
      "Plan your Viking Cruises Villefranche port day: tender operations, meeting point directions, and the small-group Monaco, Monte Carlo and Eze shore excursion.",
    intro:
      "Viking Cruises calls at Villefranche-sur-Mer use the same bay anchorage and harbour tender landing as other cruise lines. Shore excursion timing should account for tender ashore and return queues.",
    tenderIntro:
      "Villefranche-sur-Mer is typically a tender port — Viking passengers reach the harbour by boat from the anchored ship.",
    whyTenderDifferent:
      "At docked ports you step directly onto land. At Villefranche, every minute ashore starts after a tender transfer and a short walk to meeting points near the harbour — plan accordingly.",
    faqs: [
      {
        question: "How do Viking passengers get ashore in Villefranche?",
        answer:
          "By tender boat from the ship to the Villefranche-sur-Mer landing. There is no cruise pier for large ships in the harbour itself.",
      },
      {
        question: "What shore excursion do you recommend?",
        answer: `The ${featuredTour.fullName} — a shared small-group tour to Monaco, Monte Carlo and Eze, designed around tender-port logistics.`,
      },
      {
        question: "How early should I take a tender for a booked excursion?",
        answer: featuredTourFacts.arrivalAdvice,
      },
    ],
  },
  {
    slug: "holland-america-villefranche",
    path: "/cruise-lines/holland-america-villefranche",
    cruiseLineName: "Holland America Line",
    cruiseLineMatches: ["Holland America Line", "Holland America"],
    h1: "Holland America Line Villefranche Shore Excursions",
    title: "Holland America Villefranche Shore Excursions & Tender Guide",
    description:
      "Plan your Holland America Line Villefranche port day: tender information, meeting point walk from the pier, and the small-group Monaco, Monte Carlo and Eze excursion.",
    intro:
      "Holland America Line ships calling at Villefranche-sur-Mer typically anchor offshore and tender into the harbour. Oosterdam and other HAL vessels in our published schedules typically allow a standard port day — check your call length before booking a multi-destination tour.",
    tenderIntro:
      "Villefranche-sur-Mer is typically a tender port for Holland America Line. Passengers reach the harbour by tender boat, then walk to excursion meeting points near the landing.",
    whyTenderDifferent:
      "Tender operations mean your port day starts after queuing and the boat ride — not the moment the ship arrives. Build that into excursion timing and return planning.",
    faqs: [
      {
        question: "Does Holland America dock in Villefranche-sur-Mer?",
        answer:
          "No — ships typically anchor in the bay and use tenders. See our tender information guide for passenger planning tips.",
      },
      {
        question: "Which Holland America ships visit Villefranche?",
        answer:
          "Check our Villefranche ship schedules and Holland America ship pages below for published calls in our data.",
      },
      {
        question: "Where do shore excursions meet?",
        answer: `Near the Villefranche tender landing (${featuredTourFacts.meetingPoint.walkFromTender}). See the meeting point page for guidance — exact details confirmed on booking.`,
      },
    ],
  },
  {
    slug: "cunard-villefranche",
    path: "/cruise-lines/cunard-villefranche",
    cruiseLineName: "Cunard",
    cruiseLineMatches: ["Cunard Line", "Cunard"],
    h1: "Cunard Villefranche Shore Excursions",
    title: "Cunard Villefranche Shore Excursions & Tender Guide",
    description:
      "Plan your Cunard Villefranche port day: tender logistics, excursion meeting point, and the recommended small-group Monaco, Monte Carlo and Eze shore excursion.",
    intro:
      "Cunard itineraries that call at Villefranche-sur-Mer use tender operations into the harbour. Plan shore time around tender transfers, walking to your meeting point, and return queues before all aboard.",
    tenderIntro:
      "Villefranche-sur-Mer is typically a tender port — Cunard passengers reach the harbour by tender boat from the anchored ship.",
    whyTenderDifferent:
      "Unlike docked calls, Villefranche requires tender boats and walking time from the landing. Excursion meeting points are near the tender pier, not at the ship's gangway.",
    faqs: [
      {
        question: "Is Villefranche a tender port for Cunard?",
        answer:
          "Yes. Cruise ships typically anchor offshore and passengers tender into Villefranche-sur-Mer.",
      },
      {
        question: "What is the recommended Villefranche shore excursion?",
        answer: `${featuredTour.fullName} — ${featuredTourFacts.durationLabel}, shared small-group format, visiting Monaco, Monte Carlo and Eze.`,
      },
      {
        question: "How do I find my guide after tendering?",
        answer: `Walk to the meeting point near the tender landing (${featuredTourFacts.meetingPoint.walkFromTender}). Full directions and FAQs are on our meeting point page.`,
      },
    ],
  },
];

export function getCruiseLineVillefranchePage(
  slug: string,
): CruiseLineVillefranchePage | undefined {
  return cruiseLineVillefranchePages.find((page) => page.slug === slug);
}

export function getCruiseLinePageForShip(
  cruiseLine: string,
): CruiseLineVillefranchePage | undefined {
  return cruiseLineVillefranchePages.find((page) =>
    page.cruiseLineMatches.includes(cruiseLine),
  );
}

export function getCruiseLineVillefrancheShips(
  page: CruiseLineVillefranchePage,
): CruiseShipSummary[] {
  return shipsForLine(page.cruiseLineMatches, buildCruiseShipSummaries());
}

export const cruiseLineVillefrancheHubLinks = cruiseLineVillefranchePages.map(
  (page) => ({
    label: page.cruiseLineName,
    href: page.path,
  }),
);

export const cruiseLineVillefrancheRelatedPaths = {
  cruisePlannerPath,
  tenderInfoPath,
  shipSchedulesPath,
  meetingPointPath,
  featuredTourPath: featuredTour.path,
  featuredTourBookingPath: featuredTour.bookingPath,
} as const;
