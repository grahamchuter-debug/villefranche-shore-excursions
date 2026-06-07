import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { comparisonLinks, coreGuideLinks } from "@/lib/related-links";
import { siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Villefranche vs Monaco for Cruise Passengers",
  description:
    "Villefranche vs Monaco for cruise passengers: charming harbour village vs the Principality's glamour, and which to choose on a French Riviera port day.",
  path: "/villefranche-vs-monaco",
  ogImage: siteImages.monacoHarbour,
  ogImageAlt: "Monaco harbour on the French Riviera",
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  ...comparisonLinks.filter((l) => l.href !== "/villefranche-vs-monaco"),
  ...coreGuideLinks,
] as const;

const faqs = [
  {
    question: "Should I stay in Villefranche or visit Monaco?",
    answer:
      "It depends on your port call length. Villefranche is where you tender — perfect for a short harbour stroll. Monaco is the headline destination most passengers want to reach on longer calls.",
  },
  {
    question: "How far is Monaco from the tender landing?",
    answer:
      "Monaco is a short drive along the coast — not walkable from Villefranche harbour. A guided excursion handles transport and return timing.",
  },
  {
    question: "Can I visit both in one port day?",
    answer: `Yes, when you have enough usable hours ashore. The ${featuredTour.cardName} includes Monaco and Monte Carlo alongside Eze, returning to Villefranche before all aboard.`,
  },
] as const;

export default function VillefrancheVsMonacoPage() {
  return (
    <ContentPage
      title="Villefranche vs Monaco"
      lead="Harbour village or Principality glamour? How to choose between Villefranche-sur-Mer and Monaco on your French Riviera port day."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Two very different experiences</h2>
        <p>
          Villefranche-sur-Mer is a picturesque harbour village where you step
          off the tender. Monaco is a sovereign city-state with yacht-filled
          harbours, palace views, and the famous casino quarter. Most cruise
          passengers want both — but not on every port call.
        </p>
      </section>

      <section>
        <h2>Villefranche: your tender landing</h2>
        <ul>
          <li>Colourful waterfront and old town lanes</li>
          <li>Compact — easy to explore on foot</li>
          <li>Ideal for short port calls</li>
          <li>Best for: relaxed harbour time and photography</li>
        </ul>
      </section>

      <section>
        <h2>Monaco &amp; Monte Carlo: the headline destination</h2>
        <ul>
          <li>Principality harbour and palace district</li>
          <li>Casino quarter and luxury shopping when timing allows</li>
          <li>Requires coastal transport from Villefranche</li>
          <li>Best for: first-time visitors with enough hours ashore</li>
        </ul>
      </section>

      <section>
        <h2>Our recommendation</h2>
        <p>
          Short call: stay in Villefranche village. Standard or long call: the{" "}
          <Link href={featuredTour.path}>{featuredTour.cardName}</Link> combines
          Monaco, Monte Carlo and Eze with return-to-ship planning. For Monaco
          only, see the{" "}
          <Link href="/excursions/monaco-monte-carlo-highlights">
            Monaco &amp; Monte Carlo Highlights
          </Link>{" "}
          tour.
        </p>
      </section>
    </ContentPage>
  );
}
