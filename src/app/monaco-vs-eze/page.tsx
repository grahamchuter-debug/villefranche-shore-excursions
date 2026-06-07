import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { comparisonLinks, coreGuideLinks } from "@/lib/related-links";
import { ezeVillageAlt, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Monaco vs Eze for Cruise Passengers",
  description:
    "Monaco vs Eze for cruise passengers calling at Villefranche-sur-Mer: Principality glamour vs medieval hill village, and how to choose on a French Riviera port day.",
  path: "/monaco-vs-eze",
  ogImage: siteImages.ezeVillage,
  ogImageAlt: ezeVillageAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  ...comparisonLinks.filter((l) => l.href !== "/monaco-vs-eze"),
  ...coreGuideLinks,
] as const;

const faqs = [
  {
    question: "Should I choose Monaco or Eze on a Villefranche port day?",
    answer:
      "Monaco suits passengers who want harbour glamour and the casino district. Eze suits those who prefer a medieval hill village and panoramic coastal views. Many first-time visitors want both.",
  },
  {
    question: "Can I visit Monaco and Eze in one day?",
    answer: `Yes — the ${featuredTour.fullName} covers Monaco, Monte Carlo and Eze in one coordinated excursion when your port call allows enough usable hours ashore.`,
  },
  {
    question: "Which is harder to reach independently?",
    answer:
      "Both require transport from the Villefranche tender landing. Eze involves uphill walking in the village. A guided tour handles routes and return timing on a tight cruise schedule.",
  },
] as const;

export default function MonacoVsEzePage() {
  return (
    <ContentPage
      title="Monaco vs Eze"
      lead="Principality harbour or medieval hill village? How cruise passengers calling at Villefranche-sur-Mer choose between two iconic French Riviera destinations."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Two icons of the French Riviera</h2>
        <p>
          Monaco and Eze are the destinations most cruise passengers want from
          Villefranche-sur-Mer — but they offer very different experiences.
          Monaco is urban glamour at sea level; Eze is a perched medieval
          village with cobbled lanes and panoramic views.
        </p>
      </section>

      <section>
        <h2>Monaco &amp; Monte Carlo</h2>
        <ul>
          <li>Harbour, palace quarter, and casino district</li>
          <li>Easy walking once you arrive — mostly flat</li>
          <li>Best for: glamour, yachts, and first-time Riviera visitors</li>
        </ul>
      </section>

      <section>
        <h2>Eze village</h2>
        <ul>
          <li>Medieval hilltop lanes and artisan shops</li>
          <li>Moderate uphill walking on cobbled paths</li>
          <li>Panoramic views over the Côte d&apos;Azur</li>
          <li>Best for: photography and village atmosphere</li>
        </ul>
      </section>

      <section>
        <h2>Our recommendation</h2>
        <p>
          If you can only pick one independently, Monaco is easier to reach and
          navigate on a tight schedule. If you want both, the{" "}
          <Link href={featuredTour.path}>{featuredTour.cardName}</Link> is the
          most efficient use of a standard port day. For Eze only, see the{" "}
          <Link href="/excursions/eze-village-riviera-coast">
            Eze Village &amp; Riviera Coast
          </Link>{" "}
          tour.
        </p>
      </section>
    </ContentPage>
  );
}
