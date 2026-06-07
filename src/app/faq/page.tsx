import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { comparisonLinks, coreGuideLinks, tenderLinks } from "@/lib/related-links";
import { siteHeroAlt, siteImages } from "@/lib/site-images";
import { featuredTour } from "@/lib/featured-tour";
import { featuredTourMeetingInstructions } from "@/lib/featured-tour-facts";
import { portGuidePath } from "@/lib/site-paths";
import { villefrancheTenderExplainer } from "@/lib/tender-port-copy";

const pageMeta = {
  title: "Villefranche Shore Excursions FAQ",
  description:
    "Frequently asked questions about Villefranche cruise port visits: tender operations, shore excursions, meeting points, return-to-ship timing, and French Riviera planning.",
  path: "/faq",
  ogImage: siteImages.hero,
  ogImageAlt: siteHeroAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  ...coreGuideLinks.filter((l) => l.href !== "/faq"),
  ...comparisonLinks,
] as const;

const faqs = [
  {
    question: "Do cruise ships dock in Villefranche-sur-Mer?",
    answer: `${villefrancheTenderExplainer} See our tender information guide for full details.`,
  },
  {
    question: "How long does the tender transfer take?",
    answer:
      "Allow generous time each way for the tender boat, plus queuing time on busy days. Build tender time into your port day planning for both directions.",
  },
  {
    question: "What are the best Villefranche shore excursions?",
    answer:
      "For first-time visitors, the Small Group Monaco, Monte Carlo and Eze tour is most popular. Passengers wanting Monaco only prefer the highlights tour. Moderate port calls suit the Eze village tour.",
  },
  {
    question: "Can I visit Nice and Monaco from Villefranche in one day?",
    answer:
      "On a standard port call, covering both independently is ambitious once tender time is counted. A guided excursion focusing on Monaco, Monte Carlo and Eze is usually the better use of limited hours ashore.",
  },
  {
    question: "Where do shore excursions meet after tendering?",
    answer: `${featuredTourMeetingInstructions} See our meeting point page for walking directions from the tender pier.`,
  },
  {
    question: "How early should I return to the tender pier?",
    answer:
      "Be at the pier well before all aboard. Return queues can take significant time when multiple ships anchor in the bay on the same day.",
  },
  {
    question: "What if my tender is delayed?",
    answer:
      "Contact your excursion guide immediately. Small-group operators may wait briefly but cannot hold indefinitely. See our dedicated guide on what to do if your tender is late.",
  },
  {
    question: "Why book a small-group excursion instead of going independently?",
    answer:
      "Independent travel from the tender pier requires navigating local transport while watching the clock. Small-group tours with local guides handle transport and build return-to-ship margins into the itinerary.",
  },
  {
    question: "Is Villefranche worth visiting on a cruise?",
    answer:
      "Yes, with realistic planning. You tender into Villefranche-sur-Mer itself. The harbour and old town are compact but beautiful. A half-day is enough for most visitors who stay local.",
  },
  {
    question: "How much can I see in one port day?",
    answer:
      "A six-hour scheduled call may give enough usable time for the small-group French Riviera tour once tender delays are counted. Use our cruise planner to match activities to your schedule.",
  },
] as const;

export default function FaqPage() {
  return (
    <ContentPage
      title="Villefranche Shore Excursions FAQ"
      lead="Answers to the most common questions from cruise passengers visiting Villefranche-sur-Mer by tender — excursions, logistics, timing, and planning."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
      ctaTitle={`Book the ${featuredTour.cardName} tour`}
      ctaText="The recommended Villefranche shore excursion — Monaco, Monte Carlo and Eze in one port day with return-to-ship planning."
      ctaHref={featuredTour.path}
      ctaSecondaryHref={featuredTour.bookingPath}
    >
      <section>
        <h2>Quick links by topic</h2>
        <h3>Tender and port logistics</h3>
        <ul>
          {tenderLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
          <li>
            <Link href={portGuidePath}>Port guide</Link>
          </li>
        </ul>

        <h3>Excursions and planning</h3>
        <ul>
          <li>
            <Link href="/excursions">All shore excursions</Link>
          </li>
          <li>
            <Link href="/cruise-planner">Cruise planner</Link>
          </li>
          <li>
            <Link href="/ship-schedules">Ship schedules</Link>
          </li>
          <li>
            <Link href="/one-day-in-villefranche">One day in Villefranche</Link>
          </li>
        </ul>

        <h3>Comparisons</h3>
        <ul>
          {comparisonLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </ContentPage>
  );
}
