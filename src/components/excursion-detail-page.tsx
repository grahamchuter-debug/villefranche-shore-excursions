import Link from "next/link";

import { BookingReassurance } from "@/components/booking-reassurance";
import { JsonLd } from "@/components/json-ld";
import { ShipScheduleBreadcrumbs } from "@/components/ship-schedule-breadcrumbs";
import { WhyThisExcursionIsDifferentSection } from "@/components/why-this-excursion-is-different-section";
import { WhyThisTourBooksEarlySection } from "@/components/why-this-tour-books-early-section";
import { WhyWeCreatedThisTourSection } from "@/components/why-we-created-this-tour-section";
import type { ExcursionData } from "@/lib/excursion-types";
import { featuredTour } from "@/lib/featured-tour";
import { featuredTourReturnToShipReassurance } from "@/lib/featured-tour-content";
import { meetingPointPath } from "@/lib/site-paths";
import { siteConfig } from "@/lib/site-config";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildFeaturedTourTripSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";

type ExcursionDetailPageProps = {
  excursion: ExcursionData;
};

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function SnapshotCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-gray-900">{value}</p>
    </div>
  );
}

export function ExcursionDetailPage({ excursion }: ExcursionDetailPageProps) {
  const isFeaturedTour = excursion.slug === featuredTour.slug;
  const schema = [
    buildWebPageSchema({
      path: excursion.path,
      title: `${excursion.metaTitle} | ${siteConfig.name}`,
      description: excursion.metaDescription,
    }),
    buildBreadcrumbSchema(excursion.breadcrumbs, excursion.path),
    buildFaqSchema(excursion.faqs),
    ...(isFeaturedTour ? [buildFeaturedTourTripSchema()] : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <main className="min-h-screen bg-white text-gray-900">
        <ShipScheduleBreadcrumbs items={excursion.breadcrumbs} />

        <section
          role="img"
          aria-label={excursion.heroImageAlt}
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url('${excursion.heroImage}')` }}
        >
          <div className="bg-black/55">
            <div className="mx-auto max-w-6xl px-4 py-16 text-white sm:px-6 sm:py-20">
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                {excursion.headline}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                {excursion.lead}
              </p>
              {excursion.heroBadge ? (
                <p className="mt-5 inline-flex rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm sm:text-sm">
                  {excursion.heroBadge}
                </p>
              ) : null}
              <p
                className={`${excursion.heroBadge ? "mt-3" : "mt-5"} inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm`}
              >
                Return to ship on time, cruise passenger friendly
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {excursion.bookingHref?.startsWith("http") ? (
                  <a
                    href={excursion.bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:text-base"
                  >
                    {excursion.bookingLabel ?? "Book this excursion"}
                  </a>
                ) : (
                  <Link
                    href={excursion.bookingHref ?? siteConfig.excursionsHubPath}
                    className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:text-base"
                  >
                    {excursion.bookingLabel ?? "Book this excursion"}
                  </Link>
                )}
                <Link
                  href={siteConfig.excursionsHubPath}
                  className="inline-block rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 sm:text-base"
                >
                  View all excursions
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b bg-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <h2 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl">
              Cruise passenger snapshot
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SnapshotCard label="Duration" value={excursion.summary.duration} />
              <SnapshotCard
                label="Meeting point"
                value={excursion.summary.meetingPoint}
              />
              <SnapshotCard
                label="Return to ship"
                value={excursion.summary.returnReassurance}
              />
              <SnapshotCard label="Best for" value={excursion.summary.bestFor} />
            </div>
            {excursion.snapshotCards && excursion.snapshotCards.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {excursion.snapshotCards.map((card) => (
                  <SnapshotCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {isFeaturedTour ? (
          <>
            <WhyThisExcursionIsDifferentSection variant="muted" />
            <WhyThisTourBooksEarlySection variant="light" />
            <WhyWeCreatedThisTourSection variant="light" showCta={false} />
          </>
        ) : null}

        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Photo gallery</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {excursion.gallery.map((image) => (
              <figure
                key={`${image.src}-${image.alt}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </section>

        <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-14 text-gray-700 sm:space-y-16">
            <ContentSection title="Highlights">
              <ul className="list-disc space-y-2 pl-5 leading-7">
                {excursion.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </ContentSection>

            <ContentSection title="About this tour">
              <div className="space-y-4 leading-7">
                {excursion.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ContentSection>

            {excursion.whyCruisePassengers &&
            excursion.whyCruisePassengers.length > 0 ? (
              <ContentSection title="Why this tour works well for cruise passengers">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {excursion.whyCruisePassengers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>
            ) : null}

            {excursion.itinerary && excursion.itinerary.length > 0 ? (
              <ContentSection
                title={
                  isFeaturedTour ? "Suggested itinerary" : "Itinerary"
                }
              >
                <ol className="list-none space-y-6 pl-0 leading-7">
                  {excursion.itinerary.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-gray-700">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </ContentSection>
            ) : null}

            {excursion.bestForDetails && excursion.bestForDetails.length > 0 ? (
              <ContentSection title="Who this tour is best for">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {excursion.bestForDetails.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>
            ) : null}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <ContentSection title="What's included">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {excursion.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>

              <ContentSection title="What's not included">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {excursion.notIncluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>
            </div>

            <ContentSection title="Tender and meeting point advice">
              <div className="space-y-4 leading-7">
                {excursion.timingAdvice.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="leading-7">
                Review our{" "}
                <Link
                  href="/villefranche-tender-information"
                  className="font-medium text-blue-700 underline underline-offset-2"
                >
                  tender information
                </Link>
                , check{" "}
                <Link
                  href={meetingPointPath}
                  className="font-medium text-blue-700 underline underline-offset-2"
                >
                  meeting point guide
                </Link>
                , and plan your day with our{" "}
                <Link
                  href="/cruise-planner"
                  className="font-medium text-blue-700 underline underline-offset-2"
                >
                  cruise planner
                </Link>
                .
              </p>
            </ContentSection>

            {isFeaturedTour ? (
              <ContentSection title="Return-to-ship reassurance">
                <ul className="list-disc space-y-2 pl-5 leading-7">
                  {featuredTourReturnToShipReassurance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ContentSection>
            ) : null}
          </div>
        </article>

        <section className="border-t bg-gray-50">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {excursion.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <dt className="font-semibold text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 leading-7 text-gray-700">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-y bg-gray-900 text-white">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {excursion.ctaTitle ?? `Ready to book your ${excursion.title}?`}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {excursion.ctaText ??
                "Secure your place before port day and explore more cruise friendly excursions designed around your ship's timetable."}
            </p>
            {isFeaturedTour ? (
              <div className="mx-auto mt-6 max-w-xl text-left">
                <BookingReassurance />
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {excursion.bookingHref?.startsWith("http") ? (
                <a
                  href={excursion.bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:px-8 sm:py-3.5 sm:text-base"
                >
                  {excursion.bookingLabel ?? "Book this excursion"}
                </a>
              ) : (
                <Link
                  href={excursion.bookingHref ?? siteConfig.excursionsHubPath}
                  className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:px-8 sm:py-3.5 sm:text-base"
                >
                  {excursion.bookingLabel ?? "Book this excursion"}
                </Link>
              )}
              <Link
                href={siteConfig.excursionsHubPath}
                className="inline-block rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition hover:bg-white/10 sm:px-8 sm:py-3.5 sm:text-base"
              >
                View all shore excursions
              </Link>
            </div>
          </div>
        </section>

        {excursion.relatedLinks.length > 0 ? (
          <section className="bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Plan your Villefranche port day
              </h2>
              <ul className="flex flex-wrap gap-3">
                {excursion.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
