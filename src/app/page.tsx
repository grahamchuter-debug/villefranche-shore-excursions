import type { Metadata } from "next";
import Link from "next/link";

import { BookingReassurance } from "@/components/booking-reassurance";
import { ConversionCtaStrip } from "@/components/conversion-cta-strip";
import {
  FeaturedTourComparisonSection,
  FeaturedTourPassengerQuestionsSection,
  FeaturedTourSampleItinerarySection,
} from "@/components/homepage-conversion-sections";
import { WhyThisExcursionIsDifferentSection } from "@/components/why-this-excursion-is-different-section";
import { JsonLd } from "@/components/json-ld";
import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourPassengerQuestions,
  featuredTourProductBullets,
  featuredTourProductStatement,
} from "@/lib/featured-tour-content";
import { buildPageMetadata } from "@/lib/site-metadata";
import { meetingPointPath } from "@/lib/site-paths";
import {
  buildFaqSchema,
  buildFeaturedTourTripSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";
import { ezeVillageAlt, siteImages, siteHeroAlt } from "@/lib/site-images";

const pageMeta = {
  title:
    "Villefranche Shore Excursions | Small Group Monaco, Monte Carlo & Eze Tours",
  description:
    "Small-group Villefranche shore excursions for cruise passengers — Monaco, Monte Carlo and Eze in one French Riviera port day. Tender guides and return-to-ship planning.",
  path: "/",
} as const;

export const metadata: Metadata = buildPageMetadata({
  ...pageMeta,
  ogImage: siteImages.hero,
  ogImageAlt: siteHeroAlt,
  absoluteTitle: true,
});

const trustBadges = [
  "Most Popular Cruise Excursion",
  "Small Group Favourite",
  "French Riviera Highlights",
  "Tender-port aware",
  "Return-to-ship planning",
] as const;

const alternativeTours = [
  {
    name: "Monaco & Monte Carlo Highlights",
    description:
      "Intimate small-group excursion to Monaco and Monte Carlo — an alternative when you want the Principality without the full three-destination itinerary.",
    href: "/excursions/monaco-monte-carlo-highlights",
    image: siteImages.monacoHarbour,
    imageAlt: "Casino de Monte-Carlo at night on the French Riviera shore excursion from Villefranche",
    badge: "Monaco alternative",
  },
  {
    name: "Eze Village & Riviera Coast",
    description:
      "Medieval hill village and coastal scenery — ideal for moderate port calls when you want Eze without the full Monaco itinerary.",
    href: "/excursions/eze-village-riviera-coast",
    image: siteImages.ezeVillage,
    imageAlt: ezeVillageAlt,
    badge: "Best for moderate port calls",
  },
] as const;

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: pageMeta.path,
            title: pageMeta.title,
            description: pageMeta.description,
          }),
          buildItemListSchema([
            {
              name: featuredTour.fullName,
              description:
                "Small-group shore excursion covering Monaco, Monte Carlo and Eze in one French Riviera cruise day.",
            },
            ...alternativeTours.map((t) => ({
              name: t.name,
              description: t.description,
            })),
          ]),
          buildFeaturedTourTripSchema(),
          buildFaqSchema([...featuredTourPassengerQuestions]),
        ]}
      />
      <main className="min-h-screen bg-white text-gray-900">
        <section
          role="img"
          aria-label={siteHeroAlt}
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url('${siteImages.hero}')` }}
        >
          <div className="bg-black/50">
            <div className="mx-auto max-w-6xl px-4 py-20 text-center text-white sm:px-6 sm:py-28 md:py-32">
              <h1 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                Small Group Monaco, Monte Carlo &amp; Eze Shore Excursions from
                Villefranche
              </h1>

              <p className="mx-auto mb-4 max-w-3xl text-base font-semibold leading-relaxed text-white sm:text-xl">
                {featuredTourProductStatement}
              </p>
              <p className="mx-auto mb-6 max-w-3xl text-base font-medium leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl">
                Explore Monaco, Monte Carlo and Eze in one cruise day with a
                small-group French Riviera excursion designed for cruise
                passengers arriving in Villefranche-sur-Mer.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={featuredTour.path}
                  className="inline-block rounded-full bg-blue-600 px-6 py-3 text-base font-semibold transition hover:bg-blue-700 sm:px-8 sm:py-4 sm:text-lg"
                >
                  View Small Group Tour
                </Link>
                <Link
                  href="/cruise-planner"
                  className="inline-block rounded-full border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold backdrop-blur-sm transition hover:bg-white/20 sm:px-8 sm:py-4 sm:text-lg"
                >
                  Plan My Villefranche Cruise Day
                </Link>
              </div>

              <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
                {trustBadges.map((badge) => (
                  <li
                    key={badge}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:px-4 sm:text-sm"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="recommended-tour"
          className="border-b bg-gradient-to-b from-blue-50 to-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Recommended Villefranche Shore Excursion
            </h2>
            <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
              {featuredTourProductStatement} This is the excursion we recommend
              above all others for cruise passengers with enough usable time
              ashore after tendering.
            </p>
            <div className="overflow-hidden rounded-2xl border-2 border-blue-600 bg-white shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <img
                  src={siteImages.monacoHarbour}
                  alt="Casino de Monte-Carlo at night — Small Group Monaco, Monte Carlo and Eze shore excursion from Villefranche-sur-Mer"
                  className="h-56 w-full object-cover lg:h-full lg:min-h-[360px]"
                />
                <div className="flex flex-col p-6 sm:p-8">
                  <p className="mb-4 inline-flex w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular Cruise Excursion
                  </p>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {featuredTour.fullName}
                  </h3>
                  <ul className="mb-6 flex-1 space-y-2 text-sm leading-6 text-gray-700 sm:text-base">
                    {featuredTourProductBullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={featuredTour.path}
                      className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:text-base"
                    >
                      View Tour
                    </Link>
                    <Link
                      href={featuredTour.bookingPath}
                      className="rounded-full border border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:text-base"
                    >
                      Check Availability
                    </Link>
                  </div>
                  <BookingReassurance className="mt-6" compact />
                </div>
              </div>
            </div>
          </div>
        </section>

        <WhyThisExcursionIsDifferentSection showCta />

        <FeaturedTourComparisonSection />

        <FeaturedTourSampleItinerarySection />

        <section
          id="tours"
          className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24"
        >
          <h2 className="mb-2 text-3xl font-bold sm:mb-3 sm:text-4xl">
            Other excursions
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600">
            If your port call is shorter or you prefer a narrower itinerary,
            these alternatives may suit — but most passengers book the{" "}
            <Link
              href={featuredTour.path}
              className="font-medium text-blue-700 underline"
            >
              {featuredTour.cardName}
            </Link>{" "}
            tour above.
          </p>

          <h3 className="mb-4 text-lg font-semibold text-gray-500">
            Alternative options
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {alternativeTours.map((tour) => (
              <article
                key={tour.href}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50/80 shadow-sm"
              >
                <img
                  src={tour.image}
                  alt={tour.imageAlt}
                  className="h-36 w-full object-cover opacity-90"
                />

                <div className="flex flex-1 flex-col p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {tour.badge}
                  </p>
                  <h3 className="mb-2 text-base font-semibold text-gray-800">
                    {tour.name}
                  </h3>

                  <p className="mb-4 flex-1 text-sm leading-5 text-gray-600">
                    {tour.description}
                  </p>

                  <Link
                    href={tour.href}
                    className="w-fit rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-400"
                  >
                    View Tour
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FeaturedTourPassengerQuestionsSection />

        <section className="border-t bg-gray-900 py-12">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
              Ready to book your Villefranche port day?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base text-white/80">
              See Monaco, Monte Carlo and Eze in one cruise day — with tender-aware
              timing and return-to-ship planning built in.
            </p>
            <ConversionCtaStrip variant="dark" />
          </div>
        </section>

        <section id="tips" className="border-t bg-gray-50">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Tender Port Day Tips
            </h2>
            <p className="text-base leading-8 text-gray-700 sm:text-lg">
              Cruise ships do not dock in Villefranche-sur-Mer village. They anchor
              in the bay and tender passengers into the harbour, so it is
              important to allow enough time to get ashore and return before
              all aboard. Allow generous time each way for tender transfers.
              Read our{" "}
              <Link
                href="/villefranche-tender-information"
                className="font-medium text-blue-700 underline"
              >
                tender information guide
              </Link>{" "}
              before port day, and see our{" "}
              <Link
                href={featuredTour.path}
                className="font-medium text-blue-700 underline"
              >
                {featuredTour.cardName}
              </Link>{" "}
              for the best way to combine Monaco, Monte Carlo and Eze.
            </p>
          </div>
        </section>

        <section className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Plan your port day before you arrive
            </h2>
            <p className="mb-6 text-base leading-8 text-gray-700 sm:text-lg">
              Match excursions to your arrival and departure times so you can
              enjoy the French Riviera and still return before all aboard.
            </p>

            <ul className="flex flex-wrap gap-3">
              <li>
                <Link
                  href={featuredTour.bookingPath}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 transition hover:border-blue-300"
                >
                  Check availability
                </Link>
              </li>
              <li>
                <Link
                  href={featuredTour.path}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 transition hover:border-blue-300"
                >
                  View main excursion
                </Link>
              </li>
              <li>
                <Link
                  href="/cruise-planner"
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                >
                  Plan your Villefranche cruise day
                </Link>
              </li>
              <li>
                <Link
                  href="/ship-schedules"
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                >
                  Ship schedules
                </Link>
              </li>
              <li>
                <Link
                  href="/one-day-in-villefranche"
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                >
                  One day in Villefranche
                </Link>
              </li>
              <li>
                <Link
                  href={meetingPointPath}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                >
                  Meeting points
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
