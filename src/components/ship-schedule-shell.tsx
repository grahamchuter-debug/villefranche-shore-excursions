import Link from "next/link";

import { FeaturedTourRecommendationBox } from "@/components/featured-tour-recommendation-box";
import { ShipScheduleBreadcrumbs } from "@/components/ship-schedule-breadcrumbs";
import { featuredTour } from "@/lib/featured-tour";
import { villefrancheCruisePortAlt, siteImages } from "@/lib/site-images";

type ShipScheduleShellProps = {
  title: string;
  lead: string;
  breadcrumbs: { label: string; href?: string }[];
  children: React.ReactNode;
  showReassurance?: boolean;
  ctaTitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaSecondaryHref?: string;
  ctaSecondaryLabel?: string;
};

export function ShipScheduleShell({
  title,
  lead,
  breadcrumbs,
  children,
  showReassurance = true,
  ctaTitle = `Book the ${featuredTour.cardName} tour`,
  ctaHref = featuredTour.path,
  ctaLabel = "View recommended tour",
  ctaSecondaryHref = featuredTour.bookingPath,
  ctaSecondaryLabel = "Check availability",
}: ShipScheduleShellProps) {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <ShipScheduleBreadcrumbs items={breadcrumbs} />

      <section
        role="img"
        aria-label={villefrancheCruisePortAlt}
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url('${siteImages.villefrancheCruisePort}')` }}
      >
        <div className="bg-black/55">
          <div className="mx-auto max-w-6xl px-4 py-16 text-white sm:px-6 sm:py-20">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
              {lead}
            </p>
            {showReassurance ? (
              <p className="mt-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
                Return to ship on time, cruise passenger friendly
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <FeaturedTourRecommendationBox />
      </div>

      {children}

      <section className="border-y bg-gray-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14">
          <h2 className="text-2xl font-bold sm:text-3xl">{ctaTitle}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ctaHref}
              className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:px-8 sm:py-3.5 sm:text-base"
            >
              {ctaLabel}
            </Link>
            {ctaSecondaryHref ? (
              <Link
                href={ctaSecondaryHref}
                className="inline-block rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition hover:bg-white/10 sm:px-8 sm:py-3.5 sm:text-base"
              >
                {ctaSecondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
