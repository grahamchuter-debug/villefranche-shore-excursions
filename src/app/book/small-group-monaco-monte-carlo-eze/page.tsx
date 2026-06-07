import type { Metadata } from "next";
import Link from "next/link";

import { BookingEnquiryForm } from "@/components/booking-enquiry-form";
import { BookingReassurance } from "@/components/booking-reassurance";
import { WhyThisExcursionIsDifferentSection } from "@/components/why-this-excursion-is-different-section";
import { WhyThisTourBooksEarlySection } from "@/components/why-this-tour-books-early-section";
import { JsonLd } from "@/components/json-ld";
import { ShipScheduleBreadcrumbs } from "@/components/ship-schedule-breadcrumbs";
import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
  featuredTourMeetingPointSummary,
} from "@/lib/featured-tour-facts";
import { bookingPreConfirmReassurance } from "@/lib/featured-tour-content";
import { buildPageMetadata } from "@/lib/site-metadata";
import { meetingPointPath } from "@/lib/site-paths";
import { buildFeaturedTourTripSchema, buildWebPageSchema } from "@/lib/site-schema";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Book Small Group Monaco, Monte Carlo & Eze Tour",
  description:
    `Book the small-group Monaco, Monte Carlo and Eze shore excursion directly. ${featuredTourFacts.durationLabel} — send your cruise details and we will confirm availability and meeting point.`,
  path: featuredTour.bookingPath,
  ogImage: siteImages.monacoHarbour,
  ogImageAlt:
    "Book the small-group Villefranche shore excursion to Monaco, Monte Carlo and Eze",
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

export default function BookFeaturedTourPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: pageMeta.path,
            title: pageMeta.title,
            description: pageMeta.description,
          }),
          buildFeaturedTourTripSchema(),
        ]}
      />
      <main className="min-h-screen bg-white text-gray-900">
        <ShipScheduleBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shore Excursions", href: siteConfig.excursionsHubPath },
            { label: featuredTour.cardName, href: featuredTour.path },
            { label: "Book" },
          ]}
        />

        <section
          role="img"
          aria-label={pageMeta.ogImageAlt}
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url('${pageMeta.ogImage}')` }}
        >
          <div className="bg-black/55">
            <div className="mx-auto max-w-6xl px-4 py-16 text-white sm:px-6 sm:py-20">
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                Book {featuredTour.cardName}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                Send your cruise details and we will confirm availability,
                meeting point near the tender landing, and return-to-ship timing
                for your port day.
              </p>
              <p className="mt-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
                {featuredTourFacts.durationLabel} · {featuredTourFacts.vehicle.label} · {featuredTourFacts.meetingPoint.landmark}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {featuredTour.fullName}
            </h2>
            <ul className="mt-3 space-y-1 text-sm leading-6 text-gray-700">
              <li>Monaco, Monte Carlo and Eze in one French Riviera cruise day</li>
              <li>{featuredTourFacts.durationLabel} · {featuredTourFacts.portType}</li>
              <li>{featuredTourGroupSizeLine}</li>
              <li>{featuredTourMeetingPointSummary}</li>
            </ul>
            <Link
              href={featuredTour.path}
              className="mt-4 inline-block text-sm font-medium text-blue-700 underline underline-offset-2"
            >
              View full tour details
            </Link>
          </div>

          <WhyThisExcursionIsDifferentSection
            className="mb-8 !border-0 !bg-transparent"
            showCta={false}
          />

          <WhyThisTourBooksEarlySection
            className="mb-8 !border-0 !bg-transparent"
            variant="bordered"
            showCta
          />

          <p className="mb-8 text-sm leading-6 text-gray-600">
            After booking, see our{" "}
            <Link
              href={meetingPointPath}
              className="font-medium text-blue-700 underline underline-offset-2"
            >
              meeting point guide
            </Link>{" "}
            for walking directions from the tender pier.
          </p>

          <div className="mb-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-5 sm:p-6">
            <p className="text-base font-semibold text-gray-900 sm:text-lg">
              Before we confirm your booking
            </p>
            <p className="mt-2 text-sm leading-7 text-gray-700 sm:text-base">
              {bookingPreConfirmReassurance}
            </p>
          </div>

          <BookingReassurance className="mb-8" />

          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Send your enquiry
          </h2>
          <BookingEnquiryForm tourName={featuredTour.fullName} />

          <p className="mt-8 text-center text-sm text-gray-600">
            Prefer email only? Contact{" "}
            <a
              href={`mailto:${siteConfig.bookingEmail}`}
              className="font-medium text-blue-700 underline"
            >
              {siteConfig.bookingEmail}
            </a>
          </p>
        </section>
      </main>
    </>
  );
}
