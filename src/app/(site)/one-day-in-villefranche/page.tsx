import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { coreGuideLinks, excursionLinks } from "@/lib/related-links";
import { siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "One Day in Villefranche for Cruise Passengers",
  description:
    "Realistic one-day Villefranche itinerary for cruise passengers: tender transfers, what to see in 4 to 8 hours, and shore excursion options for Monaco, Monte Carlo and Eze.",
  path: "/one-day-in-villefranche",
  ogImage: siteImages.villefrancheHarbour,
  ogImageAlt:
    "Villefranche-sur-Mer harbour with colourful waterfront buildings for cruise passengers",
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: "Cruise planner", href: "/cruise-planner" },
  ...excursionLinks.map((l) => ({ label: l.label, href: l.href })),
  ...coreGuideLinks.filter((l) => l.href !== "/one-day-in-villefranche"),
] as const;

const faqs = [
  {
    question: "How much time do cruise passengers actually have in Villefranche?",
    answer:
      "Subtract tender transfer time (both directions) from your published port time. Use our cruise planner with your ship times for a personalised estimate.",
  },
  {
    question: "Can I visit Nice on a Villefranche port day?",
    answer:
      "Nice is nearby but requires transport and time. On shorter calls, staying in Villefranche or taking a guided excursion is usually safer. See our Villefranche vs Nice comparison.",
  },
  {
    question: "What is the best one-day plan for first-time visitors?",
    answer: `Tender ashore and take the ${featuredTour.cardName} — our top recommendation for standard port calls when you have enough usable hours ashore.`,
  },
  {
    question: "Is it worth visiting Monaco on a Villefranche port day?",
    answer:
      "On longer port calls, yes — as an excursion from Villefranche. Monaco and Monte Carlo are the most popular destinations from the tender landing. A guided tour combines them without transport stress.",
  },
] as const;

export default function OneDayInVillefranchePage() {
  return (
    <ContentPage
      title="One Day in Villefranche"
      lead="A realistic itinerary for cruise passengers arriving by tender — what you can actually see in 4 to 8 hours on the French Riviera without missing your ship."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Start with your real port time</h2>
        <p>
          Your cruise itinerary shows hours in port, but tender passengers lose
          time to boat transfers. Use our{" "}
          <Link href="/cruise-planner">cruise planner</Link> to calculate your
          actual usable time before choosing activities.
        </p>
      </section>

      <section>
        <h2>4 to 5 hours ashore (6-hour port call)</h2>
        <p>Stick to one focused activity:</p>
        <ul>
          <li>
            <strong>Option A:</strong> Explore Villefranche harbour and old town
            on foot from the tender landing
          </li>
          <li>
            <strong>Option B:</strong>{" "}
            <Link href="/excursions/eze-village-riviera-coast">
              Eze Village &amp; Riviera Coast
            </Link>{" "}
            if your schedule allows and availability is confirmed
          </li>
          <li>Return to the tender pier with a generous buffer before all aboard</li>
        </ul>
      </section>

      <section>
        <h2>5 to 7 hours ashore (standard port call)</h2>
        <p>
          This range may suit the{" "}
          <Link href={featuredTour.path}>{featuredTour.cardName}</Link> or the{" "}
          <Link href="/excursions/monaco-monte-carlo-highlights">
            Monaco &amp; Monte Carlo Highlights
          </Link>{" "}
          tour if tendering is smooth.
        </p>
        <ul>
          <li>Tender ashore as early as practical</li>
          <li>Meet your guide near the tender landing</li>
          <li>Allow margin for return tender queues</li>
        </ul>
      </section>

      <section>
        <h2>7+ hours ashore (long port call)</h2>
        <p>
          An excellent window for the full{" "}
          <Link href={featuredTour.path}>{featuredTour.fullName}</Link> —
          Monaco, Monte Carlo and Eze with time to enjoy Villefranche harbour
          before or after the tour.
        </p>
      </section>

      <section>
        <h2>Return-to-ship reminder</h2>
        <p>
          Be at the tender pier well before all aboard. Read our{" "}
          <Link href="/villefranche-tender-information">tender information</Link>{" "}
          and{" "}
          <Link href="/what-if-my-tender-is-late">
            what to do if your tender is late
          </Link>{" "}
          guides before port day.
        </p>
      </section>
    </ContentPage>
  );
}
