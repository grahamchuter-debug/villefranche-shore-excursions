import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { OperatorPhoto } from "@/components/operator-photo";
import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
} from "@/lib/featured-tour-facts";
import {
  meetingPointFaqs,
  meetingPointVerifiedDescription,
  meetingPointWalkingDirections,
  meetingPointWalkSummary,
} from "@/lib/meeting-point-content";
import { operatorImageSlots } from "@/lib/operator-images";
import { coreGuideLinks, tenderLinks } from "@/lib/related-links";
import { buildPageMetadata } from "@/lib/site-metadata";
import { meetingPointPath } from "@/lib/site-paths";
import {
  villefrancheTenderExplainer,
  villefrancheTenderLanding,
} from "@/lib/tender-port-copy";

const pageMeta = {
  title: "Villefranche Shore Excursion Meeting Point",
  description:
    "Where to meet your Villefranche shore excursion guide after tendering ashore — walking directions from the tender pier and arrival advice. Exact details confirmed on booking.",
  path: meetingPointPath,
  ogImage: operatorImageSlots.meetingPointLanding.src,
  ogImageAlt: operatorImageSlots.meetingPointLanding.alt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: featuredTour.fullName, href: featuredTour.path },
  { label: "Check Availability", href: featuredTour.bookingPath },
  ...tenderLinks.filter((l) => l.href !== meetingPointPath),
  { label: "Shore excursions", href: "/excursions" },
  ...coreGuideLinks.filter((l) => l.href !== meetingPointPath),
] as const;

export default function VillefrancheMeetingPointPage() {
  return (
    <ContentPage
      title="Villefranche Shore Excursion Meeting Point"
      lead="Where to meet your guide after tendering ashore — walking directions from the pier, tender timing, and arrival advice for the Small Group Monaco, Monte Carlo and Eze tour."
      heroImage={operatorImageSlots.meetingPointLanding.src}
      heroImageAlt={operatorImageSlots.meetingPointLanding.alt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={meetingPointFaqs}
      ctaText="Meeting point and departure time are confirmed after we check your ship schedule."
      belowHero={
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 pb-8 sm:px-6">
          <Link
            href={featuredTour.path}
            className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            View Small Group Tour
          </Link>
          <Link
            href={featuredTour.bookingPath}
            className="rounded-full border-2 border-gray-900 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Check Availability
          </Link>
        </div>
      }
    >
      <section>
        <h2>Where to meet your guide</h2>
        <p>{meetingPointVerifiedDescription}</p>
        <p className="text-sm text-gray-600">
          {featuredTourFacts.meetingPoint.streetAddress}. We do not publish a
          fixed street address or guide sign until your booking is confirmed.
        </p>
      </section>

      <section>
        <h2>Walking from the tender pier</h2>
        <p>
          {meetingPointWalkSummary}. {meetingPointWalkingDirections}
        </p>
        <OperatorPhoto
          slot={operatorImageSlots.tenderPierWalk}
          className="mt-6 rounded-xl"
        />
      </section>

      <section>
        <h2>After you tender ashore</h2>
        <p>{villefrancheTenderExplainer}</p>
        <p>{villefrancheTenderLanding}.</p>
        <p>{featuredTourFacts.arrivalAdvice}</p>
      </section>

      <section>
        <h2>Tour details at a glance</h2>
        <ul>
          <li>{featuredTour.fullName}</li>
          <li>{featuredTourFacts.durationLabel}</li>
          <li>{featuredTourGroupSizeLine}</li>
          <li>{featuredTourFacts.meetingPoint.streetAddress}</li>
        </ul>
      </section>

      <section>
        <h2>Before port day</h2>
        <p>
          Read our{" "}
          <Link href="/villefranche-tender-information">
            tender information
          </Link>{" "}
          guide and use the{" "}
          <Link href="/cruise-planner">cruise planner</Link> to confirm your
          schedule allows enough time ashore.
        </p>
      </section>
    </ContentPage>
  );
}
