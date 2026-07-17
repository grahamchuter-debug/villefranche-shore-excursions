import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { comparisonLinks, coreGuideLinks } from "@/lib/related-links";
import { siteImages } from "@/lib/site-images";
import { villefrancheTenderExplainer } from "@/lib/tender-port-copy";

const pageMeta = {
  title: "Villefranche vs Nice for Cruise Passengers",
  description:
    "Villefranche vs Nice: what each French Riviera destination offers cruise passengers tendering into Villefranche-sur-Mer, and how to choose on a short port day.",
  path: "/villefranche-vs-nice",
  ogImage: siteImages.nicePromenade,
  ogImageAlt: "Nice promenade on the French Riviera",
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  ...comparisonLinks.filter((l) => l.href !== "/villefranche-vs-nice"),
  ...coreGuideLinks,
] as const;

const faqs = [
  {
    question: "Do cruise ships tender into Villefranche or Nice?",
    answer: villefrancheTenderExplainer,
  },
  {
    question: "Is Nice worth visiting on a Villefranche port day?",
    answer:
      "Nice is a major city with the famous Promenade des Anglais, but reaching it from the tender landing takes time. On shorter calls, staying in Villefranche or taking a guided excursion is usually safer.",
  },
  {
    question: "Can I visit both in one port day?",
    answer:
      "Only on longer port calls with smooth tendering. Most passengers choose one focus — Villefranche village, a Monaco–Eze excursion, or independent time in Nice if transport allows.",
  },
  {
    question: "Which is better for a first visit?",
    answer:
      "Start in Villefranche, where you tender ashore. Add Nice only if you have enough usable hours ashore and are comfortable managing return timing independently.",
  },
] as const;

export default function VillefrancheVsNicePage() {
  return (
    <ContentPage
      title="Villefranche vs Nice"
      lead="Charming harbour village or bustling city — what each offers when you tender into Villefranche-sur-Mer and how to choose when your time is limited."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Two destinations, one port call</h2>
        <p>
          Cruise itineraries list Villefranche-sur-Mer, and that is where you
          tender ashore — into the harbour itself. Nice is a separate city
          along the coast, often reached by train or bus on longer port days.
          Many passengers explore Villefranche first, then consider Nice only if
          time allows.
        </p>
      </section>

      <section>
        <h2>Villefranche: where you tender ashore</h2>
        <ul>
          <li>Colourful harbour and old town at the tender landing</li>
          <li>Compact and walkable — citadel and waterfront viewpoints nearby</li>
          <li>Quieter, more village atmosphere</li>
          <li>Best for: harbour photography and relaxed port days</li>
        </ul>
      </section>

      <section>
        <h2>Nice: the larger city experience</h2>
        <ul>
          <li>Promenade des Anglais and broad urban beaches</li>
          <li>Larger museums, markets, and shopping</li>
          <li>Requires transport from the tender landing</li>
          <li>Best for: passengers who want a city day and have time to spare</li>
        </ul>
      </section>

      <section>
        <h2>Our recommendation</h2>
        <p>
          First visit with enough usable hours ashore: the{" "}
          <Link href={featuredTour.path}>{featuredTour.cardName}</Link> covers
          Monaco, Monte Carlo and Eze — the classic French Riviera combination.
          Short port call: Villefranche village on foot. Longer call with
          independent travel confidence: Nice is possible, but watch the clock
          for return tenders.
        </p>
      </section>
    </ContentPage>
  );
}
