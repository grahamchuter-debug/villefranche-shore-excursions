import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { featuredTour } from "@/lib/featured-tour";
import { businessIdentity } from "@/lib/legal/business-identity";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/site-schema";
import { siteImages, villefrancheCruisePortAlt } from "@/lib/site-images";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const path = "/return-to-ship-guarantee";

const pageMeta = {
  title: "Return to Ship Commitment",
  description:
    "How Villefranche Shore Excursions plans the Monaco, Monte Carlo & Èze shore excursion around your cruise ship’s schedule and your return to Villefranche.",
  path,
  ogImage: siteImages.villefrancheHarbour,
  ogImageAlt: villefrancheCruisePortAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const plannedAroundPoints = [
  {
    title: "Cruise-specific departure planning",
    body: "We work from the information available for your sailing when arranging the day.",
  },
  {
    title: "Small-group operation",
    body: "A compact group keeps the itinerary easier to pace around your port visit.",
  },
  {
    title: "Local route awareness",
    body: "Your driver and local operator know the practical routes between Monaco, Monte Carlo, Èze and Villefranche.",
  },
  {
    title: "Time allowed for returning to port",
    body: "The excursion is shaped with suitable time for the journey back to Villefranche.",
  },
] as const;

const confidenceItems = [
  "Designed for cruise passengers",
  "Villefranche cruise-port meeting point",
  "Maximum 6 guests per vehicle",
  // BUSINESS CONFIRM: align “free cancellation” wording with the published cancellation policy before launch.
  "Free cancellation under the published cancellation policy",
  "Clear meeting instructions after booking",
] as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 shrink-0 text-[var(--w2-primary)]"
    >
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReturnToShipGuaranteePage() {
  const schema = [
    buildWebPageSchema({
      path,
      title: pageMeta.title,
      description: pageMeta.description,
    }),
    buildBreadcrumbSchema(
      [
        { label: "Home", href: "/" },
        { label: "Return to Ship Commitment" },
      ],
      path,
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <main className="bg-[var(--w2-bg)] text-[var(--w2-navy)]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={siteImages.villefrancheHarbour}
              alt={villefrancheCruisePortAlt}
              width={1920}
              height={1080}
              className="h-full w-full object-cover object-center"
              decoding="async"
              fetchPriority="high"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--w2-navy)]/80 via-[var(--w2-navy)]/45 to-[var(--w2-navy)]/25"
              aria-hidden="true"
            />
          </div>

          <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 lg:pb-24">
            <p className="text-[11px] font-medium tracking-[0.2em] text-white/75 uppercase">
              Cruise passenger peace of mind
            </p>
            <h1
              className={`${display.className} mt-4 max-w-3xl text-4xl font-medium leading-[1.05] text-white sm:text-5xl md:text-6xl`}
            >
              Our Return to Ship Commitment
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/90 sm:text-xl sm:leading-8">
              Your shore excursion is planned around the operating times of your
              cruise ship, with appropriate time allowed for your return to
              Villefranche.
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="max-w-2xl">
            <h2
              className={`${display.className} text-3xl font-medium tracking-tight text-[var(--w2-navy)] sm:text-4xl`}
            >
              Planned Around Your Cruise
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--w2-muted)]">
              Before confirming your excursion, we review the information
              available for your sailing, including your ship, scheduled visit,
              tour duration and the practical journey back to Villefranche.
            </p>
          </div>

          <ul className="mt-14 grid gap-10 sm:grid-cols-2">
            {plannedAroundPoints.map((item) => (
              <li key={item.title} className="flex gap-4">
                <CheckIcon />
                <div>
                  <p className="font-medium text-[var(--w2-navy)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[var(--w2-muted)]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 2 */}
        <section className="border-y border-[var(--w2-border)] bg-[var(--w2-bg-warm)]">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
            <div className="max-w-2xl">
              <h2
                className={`${display.className} text-3xl font-medium tracking-tight text-[var(--w2-navy)] sm:text-4xl`}
              >
                We Keep Your Cruise Day in Mind
              </h2>
              <p className="mt-5 text-lg leading-8 text-[var(--w2-muted)]">
                {/* BUSINESS CONFIRM: do not add “live monitoring” language unless operations genuinely provide it. */}
                Your driver and local operator work to an itinerary designed for
                cruise passengers. Where circumstances require it, the day may
                be adjusted to protect the planned return to port.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="max-w-2xl">
            <h2
              className={`${display.className} text-3xl font-medium tracking-tight text-[var(--w2-navy)] sm:text-4xl`}
            >
              If Your Ship’s Schedule Changes
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--w2-muted)]">
              {/* BUSINESS CONFIRM: refund/compensation rules belong in Booking Terms — not on this page. */}
              Cruise itineraries and arrival arrangements can occasionally
              change. Contact us as soon as possible if your cruise line alters
              your visit so we can review the arrangements for your booking.
            </p>
            <p className="mt-6">
              <Link href="/contact" className="w2-link font-medium">
                Contact our cruise excursion team
              </Link>
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="border-t border-[var(--w2-border)] bg-[var(--w2-grey-light)]">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
            <h2
              className={`${display.className} max-w-2xl text-3xl font-medium tracking-tight text-[var(--w2-navy)] sm:text-4xl`}
            >
              Book With Confidence
            </h2>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {confidenceItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-[var(--w2-surface)] px-5 py-4 shadow-[0_16px_40px_-36px_rgba(12,26,36,0.35)]"
                >
                  <CheckIcon />
                  <span className="text-[15px] leading-6 text-[var(--w2-navy)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Terms note + CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-24">
          <p className="max-w-2xl text-sm leading-6 text-[var(--w2-muted)]">
            {/* BUSINESS CONFIRM: final commitment scope must match the published Booking Terms. */}
            The full scope and conditions of this commitment form part of our{" "}
            <Link href="/terms-and-conditions" className="w2-link">
              Booking Terms and Conditions
            </Link>
            .
          </p>
          <p className="mt-6 max-w-2xl text-xs leading-5 text-[var(--w2-muted)]">
            {businessIdentity.companyDisclosure}
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-[var(--w2-muted)]">
            {businessIdentity.agentStatus} Questions:{" "}
            <a
              href={businessIdentity.customerServiceEmailHref}
              className="w2-link"
            >
              {businessIdentity.customerServiceEmail}
            </a>
            .
          </p>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={featuredTour.path}
              className="w2-btn w2-btn-primary px-8 py-3.5 text-base"
            >
              View Monaco, Monte Carlo &amp; Èze
            </Link>
            <Link
              href={featuredTour.bookingPath}
              className="w2-btn w2-btn-secondary px-8 py-3.5 text-base"
            >
              Return to Booking
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
