import type { Metadata } from "next";

import type { CruiseShipProfile } from "@/lib/cruise-ship-types";
import { featuredTour } from "@/lib/featured-tour";
import { featuredTourFacts } from "@/lib/featured-tour-facts";
import { portGuidePath } from "@/lib/site-paths";
import { villefrancheTenderExplainer } from "@/lib/tender-port-copy";
import { cruiseShipsHub } from "@/lib/villefranche-cruise-ships";
import { buildPageMetadata } from "@/lib/site-metadata";
import { villefrancheCruisePortAlt, siteImages } from "@/lib/site-images";

export function buildCruiseShipsHubMetadata(): Metadata {
  return buildPageMetadata({
    title: cruiseShipsHub.title,
    description: cruiseShipsHub.description,
    path: cruiseShipsHub.path,
    ogImage: siteImages.villefrancheCruisePort,
    ogImageAlt: villefrancheCruisePortAlt,
  });
}

export function buildCruiseShipMetadata(ship: CruiseShipProfile): Metadata {
  const title = `${ship.name} in Villefranche-sur-Mer`;
  const description = `Planning guide for ${ship.name} passengers visiting Villefranche-sur-Mer: ${ship.callCount} known port call${ship.callCount === 1 ? "" : "s"}, tender advice, shore excursions, and return-to-ship timing for ${ship.cruiseLine}.`;

  return buildPageMetadata({
    title,
    description,
    path: `/cruise-ships/${ship.slug}`,
    ogImage: siteImages.villefrancheCruisePort,
    ogImageAlt: `${ship.name} cruise ship at Villefranche-sur-Mer`,
  });
}

export function getCruiseShipLead(ship: CruiseShipProfile): string {
  return `Cruise planning guide for passengers visiting Villefranche-sur-Mer aboard ${ship.name}.`;
}

export function getCruiseShipFaqs(ship: CruiseShipProfile) {
  return [
    {
      question: `Does ${ship.name} tender at Villefranche-sur-Mer?`,
      answer: `${villefrancheTenderExplainer} Allow extra time for queuing on busy days.`,
    },
    {
      question: `How long is ${ship.name} usually in Villefranche?`,
      answer: `Based on published schedules, ${ship.name} typically spends ${ship.typicalVisitLength.toLowerCase()} in port when call times are confirmed. Always verify arrival and departure times with your cruise line before booking an excursion.`,
    },
    {
      question: `What shore excursions suit ${ship.name} passengers?`,
      answer: `The ${featuredTour.fullName} works well when your port call is long enough once tender time is counted. Tour duration is confirmed before booking. See tour details for full information.`,
    },
    {
      question: `When should ${ship.name} passengers return to the tender pier?`,
      answer:
        "Be at the tender landing well before all aboard. Build in generous time each way for the tender transfer, plus queue time when multiple ships anchor in the bay.",
    },
  ] as const;
}

export const cruiseShipRelatedLinks = [
  { label: featuredTour.cardName, href: featuredTour.path },
  { label: "Shore excursions", href: "/excursions" },
  { label: "Port guide", href: portGuidePath },
  { label: "Ship schedules", href: "/ship-schedules" },
  { label: "Tender information", href: "/villefranche-tender-information" },
  { label: "One day in Villefranche", href: "/one-day-in-villefranche" },
  { label: "Villefranche vs Monaco", href: "/villefranche-vs-monaco" },
  { label: "Monaco vs Eze", href: "/monaco-vs-eze" },
] as const;

export const cruiseShipExcursionRecommendations = [
  {
    title: featuredTour.fullName,
    description:
      "Our top recommendation — Monaco, Monte Carlo and Eze in one small-group shore excursion with coordinated transport from the tender landing.",
    href: featuredTour.path,
    bestFor: "Longer calls",
    featured: true,
  },
  {
    title: "Monaco & Monte Carlo Highlights",
    description:
      "Ideal when you want Monaco and Monte Carlo without the full three-destination itinerary.",
    href: "/excursions/monaco-monte-carlo-highlights",
    bestFor: "Standard calls",
  },
  {
    title: "Eze Village & Riviera Coast",
    description:
      "Compact guided tour to Eze hill village with coastal scenery.",
    href: "/excursions/eze-village-riviera-coast",
    bestFor: "Moderate calls",
  },
  {
    title: "Independent Villefranche harbour walk",
    description:
      "Explore the harbour, old town, and citadel viewpoints at your own pace after tendering ashore.",
    href: "/one-day-in-villefranche",
    bestFor: "Short to standard calls",
  },
] as const;

export function getVisitLengthAdvice(
  category: CruiseShipProfile["visitLengthCategory"],
) {
  return {
    short: {
      title: "Short call under 6 hours",
      items: [
        "Prioritise tender transfer time — you may have only a few usable hours ashore.",
        "Stay in Villefranche-sur-Mer — explore the harbour and old town near the tender landing.",
        "A harbour stroll is safer than a full French Riviera tour on a tight schedule.",
        "Skip Monaco and Eze — both need more time than a short call allows.",
      ],
    },
    standard: {
      title: "Standard call 6–9 hours",
      items: [
        `Enough time may allow the ${featuredTour.cardName} tour with return margin — confirm with our cruise planner.`,
        "Book an excursion that meets near the tender pier rather than relying on local transport.",
        "Allow generous time before all aboard at the tender landing, plus queue time.",
        "Monaco highlights tour may work on the longer end of this range.",
      ],
    },
    long: {
      title: "Long call 9+ hours",
      items: [
        "Best window for the full Monaco, Monte Carlo and Eze tour or a relaxed French Riviera day.",
        "You can combine village time, coastal scenery, and lunch without rushing.",
        "Still build in tender queue time — long port days attract more passengers ashore.",
        "Use the cruise planner to confirm your personal return deadline.",
      ],
    },
    mixed: {
      title: "Mixed call lengths",
      items: [
        "This ship's published calls vary in length — check your specific sailing before booking.",
        "Compare your arrival and departure times against excursion durations on our cruise planner.",
        "Shorter calls favour Villefranche village; longer calls open up Monaco, Monte Carlo and Eze.",
        "When times are listed as TBC, wait for final confirmation from your cruise line before committing.",
      ],
    },
  }[category];
}
