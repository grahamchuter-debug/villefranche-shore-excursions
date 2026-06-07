import type { Metadata } from "next";
import Link from "next/link";

import { WhyWeCreatedThisTourSection } from "@/components/why-we-created-this-tour-section";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { featuredTour } from "@/lib/featured-tour";
import { featuredTourFacts } from "@/lib/featured-tour-facts";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildTouristAttractionSchema } from "@/lib/site-schema";
import { excursionLinks, tenderLinks } from "@/lib/related-links";
import { portGuidePath, meetingPointPath } from "@/lib/site-paths";
import { siteImages } from "@/lib/site-images";
import {
  villefrancheTenderExplainer,
  villefrancheTenderLanding,
  villefrancheTenderPortAlt,
} from "@/lib/tender-port-copy";

const pageMeta = {
  title: "Villefranche Cruise Port Guide for Shore Excursions",
  description:
    "Complete Villefranche cruise port guide for tender passengers: where you arrive, how long tendering takes, what to do near the pier, port day plans by call length, and shore excursion advice.",
  path: portGuidePath,
  ogImage: siteImages.villefrancheCruisePort,
  ogImageAlt: villefrancheTenderPortAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: featuredTour.fullName, href: featuredTour.path },
  { label: "Check availability", href: featuredTour.bookingPath },
  { label: "Cruise planner", href: "/cruise-planner" },
  ...tenderLinks,
  ...excursionLinks.filter((l) => l.href !== featuredTour.path),
] as const;

const faqs = [
  {
    question: "Is Villefranche-sur-Mer a tender port?",
    answer:
      "Yes. Most large cruise ships anchor in the bay and transfer passengers into Villefranche-sur-Mer by tender boat. There is no large-ship dock in the harbour itself.",
  },
  {
    question: "Where do cruise passengers arrive in Villefranche?",
    answer:
      "Tender boats land in Villefranche-sur-Mer, near the harbour and old town. From the landing area you can walk to waterfront cafés, the citadel, and harbour viewpoints within minutes.",
  },
  {
    question: "How long does tendering take at Villefranche?",
    answer:
      "Allow generous time each way for the tender boat, plus queuing on busy days when several ships anchor in the bay. Our cruise planner builds in a 30-minute ashore delay after arrival and a 60-minute return window before departure.",
  },
  {
    question: "What is the best shore excursion for first-time visitors?",
    answer: `The ${featuredTour.fullName} covers Monaco, Monte Carlo and Eze in ${featuredTourFacts.durationLabel.toLowerCase()} — ideal when you have enough usable hours ashore after tender delays.`,
  },
  {
    question: "How early should I return to the tender pier?",
    answer:
      "Be at the Villefranche harbour tender landing well before your ship's published departure on a cautious plan — longer if your cruise line announces an earlier all-aboard time. Return queues can stretch when multiple ships share tender operations.",
  },
  {
    question: "What if my tender is delayed?",
    answer:
      "Contact your excursion provider immediately with your revised arrival time. If you booked independently ashore, head straight to the meeting point once you land. See our guide on what to do if your tender is late for step-by-step advice.",
  },
] as const;

export default function VillefrancheCruisePortGuidePage() {
  return (
    <>
      <JsonLd
        data={[
          buildTouristAttractionSchema({
            name: "Villefranche-sur-Mer Cruise Port (Tender Landing)",
            description:
              "Cruise passengers visiting Villefranche-sur-Mer typically anchor offshore and tender ashore into the harbour on the French Riviera.",
          }),
        ]}
      />
      <ContentPage
        title="Villefranche Cruise Port Guide"
        lead="Everything cruise passengers need to know about tendering into Villefranche-sur-Mer — where you step ashore, how much time you really have, and how to plan a French Riviera port day that fits your ship schedule."
        heroImage={pageMeta.ogImage}
        heroImageAlt={pageMeta.ogImageAlt}
        pagePath={pageMeta.path}
        pageDescription={pageMeta.description}
        relatedLinks={relatedLinks}
        faqs={faqs}
        ctaText="Send your cruise details and we will confirm availability, meeting point, and return-to-ship timing for your Villefranche port day."
      >
        <section>
          <h2>Villefranche for cruise passengers</h2>
          <p>
            Villefranche-sur-Mer is one of the most beautiful harbours on the
            French Riviera — and for cruise passengers, it is almost always a
            tender port. Your ship anchors offshore; you reach the colourful
            waterfront by small boat. That single fact shapes everything about
            your port day: how early you can start, how much time you truly
            have ashore, and whether a Monaco–Eze excursion is realistic.
          </p>
          <p>
            This guide is written for passengers stepping off a tender in
            Villefranche-sur-Mer, not for yacht guests or hotel visitors. Use our{" "}
            <Link href="/cruise-planner">cruise planner</Link> with your ship
            times to see usable hours ashore after tender delays are calculated
            for you.
          </p>
        </section>

        <section>
          <h2>Is Villefranche a tender port?</h2>
          <p>{villefrancheTenderExplainer}</p>
          <p>
            There is no cruise pier large enough for mainstream ships inside
            Villefranche harbour. Passengers are transferred by tender boat from
            the anchored ship to the harbour landing. Confirm tender ticket
            distribution and departure times on your cruise app the night
            before arrival.
          </p>
        </section>

        <section>
          <h2>Where do cruise passengers arrive?</h2>
          <p>
            {villefrancheTenderLanding}. You step ashore in the heart of
            Villefranche-sur-Mer — the harbour, old town, and waterfront cafés are
            within a few minutes&apos; walk of the tender landing.
          </p>
          <p>
            Shore excursion guides meet passengers near the harbour, not at
            the ship. See our{" "}
            <Link href={meetingPointPath}>meeting point guide</Link>{" "}
            for where to find your guide after tendering ashore.
          </p>
        </section>

        <section>
          <h2>How long does tendering take?</h2>
          <p>
            Plan on losing meaningful time to tender operations — not just the
            boat ride, but queues in both directions. On busy days when
            multiple ships anchor in the bay, morning departure queues can
            add significant time.
          </p>
          <ul>
            <li>
              <strong>Tender each way:</strong> allow generous time plus queuing
            </li>
            <li>
              <strong>Realistically ashore:</strong> allow 30 minutes after
              published arrival before planning activities
            </li>
            <li>
              <strong>Return buffer:</strong> be at the tender pier 60 minutes
              before departure on a cautious plan
            </li>
          </ul>
          <p>
            Actual timing varies by cruise line, ship size, and local tender
            operations. Read our full{" "}
            <Link href="/villefranche-tender-information">
              Villefranche tender information
            </Link>{" "}
            guide for queuing advice.
          </p>
        </section>

        <section>
          <h2>What can you do close to the tender pier?</h2>
          <p>
            Villefranche-sur-Mer is compact and walkable from the landing area.
            Without leaving the harbour area you can:
          </p>
          <ul>
            <li>Stroll the waterfront and photograph the colourful harbour</li>
            <li>Visit the citadel and harbour viewpoints</li>
            <li>Enjoy waterfront cafés near the tender landing</li>
            <li>Explore the old town lanes on foot</li>
          </ul>
          <p>
            This is the right focus on shorter port calls. Monaco, Monte Carlo
            and Eze are not reachable on foot — they require transport along
            the coastal road.
          </p>
        </section>

        <section>
          <h2>Why many cruise passengers add Monaco, Monte Carlo and Eze</h2>
          <p>
            Villefranche alone is beautiful but compact. Monaco and Monte Carlo
            offer the Principality&apos;s harbour, palace quarter, and famous
            casino district. Eze is a medieval hilltop village with panoramic
            views over the Côte d&apos;Azur that many cruise passengers never
            reach without a guided tour.
          </p>
          <p>
            Visiting all three independently from the tender pier means
            navigating local transport on a tight schedule. Compare
            destinations on our{" "}
            <Link href="/villefranche-vs-monaco">
              Villefranche vs Monaco
            </Link>{" "}
            and{" "}
            <Link href="/monaco-vs-eze">Monaco vs Eze</Link>{" "}
            guides.
          </p>
        </section>

        <section>
          <h2>Best shore excursion for first-time visitors</h2>
          <p>
            When your port call gives you enough usable time ashore, our
            recommendation is the{" "}
            <Link href={featuredTour.path}>{featuredTour.fullName}</Link>.
            It covers Monaco, Monte Carlo and Eze in{" "}
            {featuredTourFacts.durationLabel.toLowerCase()} on a coordinated
            small-group excursion — with a meeting point near the tender landing
            and return-to-ship timing built around typical cruise schedules.
          </p>
          <p>
            This is not the right choice on very short calls. Use the port day
            plans below to match your schedule, then{" "}
            <Link href={featuredTour.bookingPath}>check availability</Link> if
            the tour fits.
          </p>
        </section>

        <section>
          <h2>Suggested port day plans</h2>
          <h3>Short call — under 5 usable hours ashore</h3>
          <p>
            After tender delays, you may have only a few hours in the village.
            Stay close to the tender pier:
          </p>
          <ul>
            <li>Explore Villefranche harbour and old town on foot</li>
            <li>Citadel viewpoints if timing allows</li>
            <li>Waterfront lunch or espresso with harbour views</li>
            <li>
              Return to the tender pier early — do not attempt Monaco or a
              full Riviera tour
            </li>
          </ul>

          <h3>Standard call — 5 to 7 usable hours ashore</h3>
          <p>
            This range may suit the{" "}
            <Link href={featuredTour.path}>{featuredTour.cardName}</Link> tour
            if tendering is smooth and your departure time allows. Check
            availability and confirm meeting time before booking.
          </p>
          <ul>
            <li>Tender ashore as early as practical</li>
            <li>Meet your guide near the tender landing for the small-group tour</li>
            <li>Allow margin for return tender queues</li>
          </ul>

          <h3>Long call — 7+ usable hours ashore</h3>
          <p>
            An excellent window for the full{" "}
            <Link href={featuredTour.path}>{featuredTour.fullName}</Link>.
            You have room for Monaco, Monte Carlo, Eze and Villefranche free
            time with sensible return-to-ship planning.
          </p>
          <ul>
            <li>Book the small-group tour in advance — spaces are limited</li>
            <li>Disembark on an early tender on busy port days</li>
            <li>Keep the final hour free near the tender pier</li>
          </ul>
          <p>
            Use our{" "}
            <Link href="/cruise-planner">cruise planner</Link> with your ship
            times to see which band your call falls into.
          </p>
        </section>

        <section>
          <h2>Meeting point advice</h2>
          <p>
            Small-group tours meet near the Villefranche harbour tender landing,
            not at the ship. Arrive promptly after disembarking — guides
            cannot wait indefinitely when schedules are tight. Exact meeting
            point details are confirmed on booking.
          </p>
          <p>
            Read our{" "}
            <Link href={meetingPointPath}>meeting point guide</Link>{" "}
            before port day.
          </p>
        </section>

        <section>
          <h2>What if your tender is delayed?</h2>
          <p>
            Tender delays happen — especially when several ships share the
            anchorage. Contact your excursion provider immediately with your ship
            name and revised arrival time. Stay near the harbour once you land;
            do not wander far from the village centre while waiting for your
            guide.
          </p>
          <p>
            See{" "}
            <Link href="/what-if-my-tender-is-late">
              what to do if your tender is late
            </Link>{" "}
            for immediate steps.
          </p>
        </section>

        <section>
          <h2>Return-to-ship planning</h2>
          <p>
            The return tender is where most passengers feel time pressure. Be
            at the harbour landing well before your ship&apos;s published
            departure — we recommend 60 minutes on a cautious plan, and always
            follow your cruise line&apos;s all-aboard announcement as your hard
            deadline.
          </p>
          <p>
            For a realistic itinerary, see{" "}
            <Link href="/one-day-in-villefranche">one day in Villefranche</Link>{" "}
            and check{" "}
            <Link href="/ship-schedules">ship schedules</Link> for your arrival
            month.
          </p>
        </section>
      </ContentPage>

      <WhyWeCreatedThisTourSection variant="muted" />
    </>
  );
}
