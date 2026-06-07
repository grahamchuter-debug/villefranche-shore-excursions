import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { featuredTour } from "@/lib/featured-tour";
import { featuredTourFacts } from "@/lib/featured-tour-facts";
import { buildPageMetadata } from "@/lib/site-metadata";
import { meetingPointPath } from "@/lib/site-paths";
import { coreGuideLinks, tenderLinks } from "@/lib/related-links";
import { siteImages } from "@/lib/site-images";
import {
  villefrancheTenderExplainer,
  villefrancheTenderLanding,
  villefrancheTenderPortAlt,
} from "@/lib/tender-port-copy";

const pageMeta = {
  title: "Villefranche Tender Information for Cruise Passengers",
  description:
    "How cruise ship tender operations work at Villefranche-sur-Mer: ships anchor offshore and tender passengers into the harbour, with transfer times, queuing, and return-to-ship advice.",
  path: "/villefranche-tender-information",
  ogImage: siteImages.villefrancheCruisePort,
  ogImageAlt: villefrancheTenderPortAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  ...tenderLinks.filter((l) => l.href !== "/villefranche-tender-information"),
  ...coreGuideLinks.filter((l) => l.href !== "/villefranche-tender-information"),
] as const;

const faqs = [
  {
    question: "Do cruise ships dock or tender at Villefranche-sur-Mer?",
    answer: villefrancheTenderExplainer,
  },
  {
    question: "How long does the tender boat take?",
    answer:
      "The tender ride between ship and shore typically takes a short time. Allow generous time each way including boarding and disembarkation, plus queuing time on busy days.",
  },
  {
    question: "Where do tender boats land?",
    answer: `${villefrancheTenderLanding}. Your cruise line will confirm the exact landing point on the morning of arrival.`,
  },
  {
    question: "How early should I queue for the return tender?",
    answer:
      "Be at the tender pier in Villefranche well before all aboard. On days when multiple ships anchor in the bay, return queues can take significant time.",
  },
  {
    question: "What happens if tender operations are delayed?",
    answer:
      "Weather, sea conditions, or high passenger volume can delay tenders. Contact your excursion operator immediately if you are ashore and your ship's schedule changes. See our guide on what to do if your tender is late.",
  },
] as const;

export default function VillefrancheTenderInformationPage() {
  return (
    <ContentPage
      title="Villefranche Tender Information"
      lead="How cruise ship tender operations work at this port — where you land in Villefranche-sur-Mer, how long transfers take, and what to expect on port day."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Why Villefranche is typically a tender port</h2>
        <p>{villefrancheTenderExplainer}</p>
        <p>
          This is normal and well-established — but tender transfers add
          meaningful time to your port day compared with a docked port. Build that
          margin into your excursion planning.
        </p>
      </section>

      <section>
        <h2>Where you step ashore</h2>
        <p>{villefrancheTenderLanding}.</p>
        <p>
          Shore excursions meet near the harbour, not at the ship. See our{" "}
          <Link href={meetingPointPath}>meeting point guide</Link> for
          directions after you land.
        </p>
      </section>

      <section>
        <h2>Planning your port day around tenders</h2>
        <p>
          Use our{" "}
          <Link href="/cruise-planner">cruise planner</Link> to calculate usable
          time ashore after tender delays. The planner deducts 30 minutes after
          arrival and recommends reaching the tender pier 60 minutes before
          departure.
        </p>
        <p>
          For the recommended{" "}
          <Link href={featuredTour.path}>{featuredTour.fullName}</Link>, you
          need enough usable hours ashore once tender time is counted. Duration
          is {featuredTourFacts.durationLabel.toLowerCase()}.
        </p>
      </section>

      <section>
        <h2>Return-to-ship priorities</h2>
        <p>
          The return tender queue is where most passengers feel time pressure.
          Be at the harbour landing well before all aboard — treat your cruise
          line&apos;s announcement as your hard deadline, not the published port
          departure time alone.
        </p>
        <p>
          If your tender is delayed on arrival, see{" "}
          <Link href="/what-if-my-tender-is-late">
            what to do if your tender is late
          </Link>
          .
        </p>
      </section>
    </ContentPage>
  );
}
