import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { CruisePortDayPlanner } from "@/components/cruise-port-day-planner";
import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
  featuredTourGuideMeetAdvice,
  featuredTourMeetingPointLine,
} from "@/lib/featured-tour-facts";
import {
  ezeVillageRivieraCoastExcursion,
  monacoMonteCarloHighlightsExcursion,
  smallGroupMonacoMonteCarloEzeExcursion,
} from "@/lib/excursions/villefranche-excursions";
import { buildPageMetadata } from "@/lib/site-metadata";
import { meetingPointPath } from "@/lib/site-paths";
import { coreGuideLinks } from "@/lib/related-links";
import { siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Villefranche Shore Excursions | Small Group Monaco, Monte Carlo & Eze",
  description:
    `Compare Villefranche shore excursions for cruise passengers. Our top pick: the ${featuredTour.fullName} (${featuredTourFacts.durationLabel.toLowerCase()}) with return-to-ship timing.`,
  path: "/excursions",
  ogImage: siteImages.monacoHarbour,
  ogImageAlt:
    "Monaco harbour on the small-group Villefranche shore excursion for cruise passengers",
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: featuredTour.cardName, href: featuredTour.path },
  ...coreGuideLinks.slice(0, 5),
  { label: "Is Villefranche worth visiting?", href: "/is-villefranche-worth-visiting" },
] as const;

const faqs = [
  {
    question: "What is the best Villefranche shore excursion for cruise passengers?",
    answer: `The ${featuredTour.fullName} is our top recommendation. It covers Monaco, Monte Carlo and Eze in ${featuredTourFacts.durationLabel.toLowerCase()} with a local guide and return-to-ship timing.`,
  },
  {
    question: "Should cruise passengers book Villefranche excursions in advance?",
    answer:
      "Yes, especially on days when multiple ships anchor in the bay. Small-group tours have limited capacity, and booking ahead secures your meeting point and departure time.",
  },
  {
    question: "How long do Villefranche shore excursions take?",
    answer:
      "Duration is confirmed at booking for each tour. All durations exclude tender transfer time to and from the ship — allow generous time each way.",
  },
  {
    question: "Do Villefranche tours guarantee return to the cruise ship?",
    answer:
      "Ship-sponsored excursions include a ship guarantee. Independent and third-party tours do not — you are responsible for meeting your vessel's all aboard time. Always build a generous buffer for the return tender queue.",
  },
] as const;

const excursions = [
  smallGroupMonacoMonteCarloEzeExcursion,
  monacoMonteCarloHighlightsExcursion,
  ezeVillageRivieraCoastExcursion,
] as const;

export default function ExcursionsPage() {
  return (
    <ContentPage
      title="Villefranche Shore Excursions"
      lead={`Small-group Villefranche shore excursions for cruise ship guests — starting with our recommended ${featuredTour.fullName}.`}
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
      ctaText="Monaco, Monte Carlo and Eze in one French Riviera cruise day — send your cruise details and we will confirm availability."
    >
      <section>
        <h2>Our recommended tour: {featuredTour.fullName}</h2>
        <p>
          This is the excursion we recommend most for cruise passengers calling
          at Villefranche-sur-Mer. You tender into the harbour, meet near the
          tender landing, and visit Monaco, Monte Carlo and Eze in one port day
          with coordinated transport and return-to-ship timing built in.
        </p>
        <ul>
          <li>Three French Riviera destinations in one cruise day</li>
          <li>{featuredTourGroupSizeLine} · {featuredTourFacts.vehicle.largerGroupsNote}</li>
          <li>{featuredTourFacts.durationLabel} tour time (excluding tender transfers)</li>
          <li>Best when you have enough usable hours ashore after tender time is counted</li>
          <li>Meet at {featuredTourMeetingPointLine} — {featuredTourGuideMeetAdvice}</li>
          <li>
            <Link href={featuredTour.path}>View full tour details</Link>
          </li>
        </ul>
      </section>

      <section>
        <h2>Why Villefranche is ideal for cruise shore excursions</h2>
        <p>
          Villefranche-sur-Mer is one of the most beautiful harbours on the
          French Riviera, yet reaching Monaco, Monte Carlo and Eze as a cruise
          passenger requires careful planning. Ships anchor offshore and tender
          into the village — the colourful waterfront is right where you step
          ashore.
        </p>
        <p>
          Before booking, read our{" "}
          <Link href="/villefranche-tender-information">tender information</Link>{" "}
          guide and check{" "}
          <Link href={meetingPointPath}>meeting point guide</Link>.
        </p>
      </section>

      <CruisePortDayPlanner />

      {excursions.slice(1).map((excursion) => (
        <section key={excursion.slug}>
          <h2>{excursion.title}</h2>
          <p>{excursion.lead}</p>
          <ul>
            <li>{excursion.summary.bestFor}</li>
            <li>{excursion.summary.duration}</li>
            <li>
              <Link href={excursion.path}>View full tour details</Link>
            </li>
          </ul>
        </section>
      ))}

      <section>
        <h2>Why many cruise passengers choose a small-group excursion</h2>
        <p>
          Independent travel from the tender pier requires navigating local
          transport with tight schedules and return timing on your own. On a
          port day where every minute counts, a small-group tour with a local
          guide removes that stress. Use the{" "}
          <Link href="/cruise-planner">cruise planner</Link> to match tours to
          your ship&apos;s schedule.
        </p>
      </section>
    </ContentPage>
  );
}
