import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { comparisonLinks, coreGuideLinks } from "@/lib/related-links";
import { siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Is Villefranche Worth Visiting on a Cruise?",
  description:
    "Is Villefranche-sur-Mer worth visiting for cruise passengers? Honest guide to tender logistics, what you can see in one day, and when a small-group excursion makes sense.",
  path: "/is-villefranche-worth-visiting",
  ogImage: siteImages.coastalScenery,
  ogImageAlt: "French Riviera coastal scenery near Villefranche-sur-Mer",
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: "Shore excursions", href: "/excursions" },
  ...comparisonLinks,
  ...coreGuideLinks.filter((l) => l.href !== "/is-villefranche-worth-visiting"),
] as const;

const faqs = [
  {
    question: "Is Villefranche worth visiting on a cruise?",
    answer:
      "Yes, for most passengers — but manage expectations. You tender directly into Villefranche-sur-Mer. The harbour is beautiful but the village is compact. A half-day is enough for most visitors who stay local.",
  },
  {
    question: "Is Villefranche overrated for cruise passengers?",
    answer:
      "Villefranche is genuinely stunning, but the village alone may feel small on a long port day. Monaco, Monte Carlo and Eze offer more depth when you have enough usable hours ashore.",
  },
  {
    question: "When is Villefranche NOT worth visiting?",
    answer:
      "If your port call is very short, or if tender operations are significantly delayed. In those cases, explore Villefranche harbour on foot near the landing instead of booking a longer excursion.",
  },
  {
    question: "What makes Villefranche special for cruise passengers?",
    answer:
      "The combination of colourful harbourfront, French Riviera scenery, and proximity to Monaco and Eze makes this one of the Mediterranean's most photogenic tender ports.",
  },
] as const;

export default function IsVillefrancheWorthVisitingPage() {
  return (
    <ContentPage
      title="Is Villefranche Worth Visiting?"
      lead="An honest assessment for cruise passengers — the beauty, the logistics, the crowds, and when a small-group excursion is worth the investment."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>The short answer: yes, with planning</h2>
        <p>
          Villefranche-sur-Mer delivers one of the French Riviera&apos;s most
          iconic harbour views. For cruise passengers willing to navigate tender
          logistics and accept that the village itself is compact, it is a
          memorable port day. The key is matching your expectations to your
          actual time ashore.
        </p>
      </section>

      <section>
        <h2>What makes it worth the tender hassle</h2>
        <ul>
          <li>The harbour and old town are genuinely beautiful</li>
          <li>You tender directly into Villefranche — the waterfront is right at the landing</li>
          <li>Monaco, Monte Carlo and Eze are within reach on longer port days</li>
          <li>The coastal scenery along the Corniche is spectacular</li>
          <li>Small-group tours make the logistics manageable</li>
        </ul>
      </section>

      <section>
        <h2>When to book an excursion</h2>
        <p>
          If you have five or more usable hours ashore after tender time, the{" "}
          <Link href={featuredTour.path}>{featuredTour.cardName}</Link> is our
          top recommendation. Use the{" "}
          <Link href="/cruise-planner">cruise planner</Link> to check your
          schedule before booking.
        </p>
      </section>

      <section>
        <h2>When to stay in the village</h2>
        <p>
          Short port calls or tight schedules favour exploring Villefranche on
          foot — harbour stroll, citadel viewpoints, waterfront cafés. See{" "}
          <Link href="/one-day-in-villefranche">one day in Villefranche</Link>{" "}
          for sample plans.
        </p>
      </section>
    </ContentPage>
  );
}
