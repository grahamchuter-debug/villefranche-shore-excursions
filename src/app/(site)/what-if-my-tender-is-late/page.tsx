import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { coreGuideLinks, tenderLinks } from "@/lib/related-links";
import { villefrancheCruisePortAlt, siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "What If My Tender Is Late? Villefranche Cruise Passenger Guide",
  description:
    "What to do if your tender is late at Villefranche-sur-Mer: missed excursions, contacting your guide, return-to-ship priorities, and contingency planning for cruise passengers.",
  path: "/what-if-my-tender-is-late",
  ogImage: siteImages.villefrancheCruisePort,
  ogImageAlt: villefrancheCruisePortAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  ...tenderLinks.filter((l) => l.href !== "/what-if-my-tender-is-late"),
  ...coreGuideLinks,
] as const;

const faqs = [
  {
    question: "What causes tender delays at Villefranche?",
    answer:
      "Sea conditions, high passenger volume when multiple ships anchor in the bay, tender boat maintenance, and staggered departure schedules all cause delays. Delays are not uncommon on busy days.",
  },
  {
    question: "Will my shore excursion wait if my tender is late?",
    answer:
      "Small-group operators may wait briefly for delayed passengers, but cannot hold indefinitely. Contact your guide immediately by phone if you know your tender is delayed.",
  },
  {
    question: "Should I skip my excursion if the tender is very late?",
    answer:
      "If the delay eats into most of your excursion time, consider exploring Villefranche village independently instead. Contact your operator about cancellation or partial refund policies.",
  },
  {
    question: "What if the return tender queue is long?",
    answer:
      "Join the queue immediately — do not wait until all aboard time. If the queue is not moving, alert ship staff at the pier or contact the ship directly. This is separate from arrival delays but equally critical.",
  },
] as const;

export default function WhatIfMyTenderIsLatePage() {
  return (
    <ContentPage
      title="What If My Tender Is Late?"
      lead="Practical steps for cruise passengers when tender operations delay your arrival or return — how to protect your excursion and your ship."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
    >
      <section>
        <h2>Tender delays are common — plan for them</h2>
        <p>
          At Villefranche-sur-Mer, tender delays are a normal part of port day —
          not an exception. When several ships anchor in the bay
          simultaneously, hundreds of passengers compete for the same tender
          boats. Build delay contingency into your planning from the start.
        </p>
      </section>

      <section>
        <h2>If your arrival tender is delayed</h2>
        <ol>
          <li>
            <strong>Contact your excursion guide immediately</strong> — use the
            phone number on your booking confirmation
          </li>
          <li>
            <strong>Do not leave the tender queue</strong> — you cannot control
            the delay, but you can control whether you board the next available
            boat
          </li>
          <li>
            <strong>Head to the meeting point once you land</strong> — do not
            wander far from the harbour area
          </li>
          <li>
            <strong>Consider a shorter activity</strong> if the delay has consumed
            most of your usable time ashore
          </li>
        </ol>
      </section>

      <section>
        <h2>If you are worried about the return tender</h2>
        <p>
          Return queues are the critical risk. Be at the Villefranche harbour
          landing well before all aboard — not at the published departure time.
          If your excursion is running late, tell your guide immediately.
        </p>
        <p>
          Read our{" "}
          <Link href="/villefranche-tender-information">tender information</Link>{" "}
          guide and use the{" "}
          <Link href="/cruise-planner">cruise planner</Link> to build return
          margins into your port day from the start.
        </p>
      </section>

      <section>
        <h2>Prevention on port day</h2>
        <ul>
          <li>Take an early tender where appropriate</li>
          <li>Confirm all aboard on your cruise app the night before</li>
          <li>Keep your guide&apos;s contact number accessible</li>
          <li>Stay near the harbour if waiting for a delayed meeting time</li>
        </ul>
      </section>
    </ContentPage>
  );
}
