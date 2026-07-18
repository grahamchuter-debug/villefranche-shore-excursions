import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { portGuidePath } from "@/lib/site-paths";
import { ShipScheduleMonthLinks } from "@/components/ship-schedule-month-links";
import { ShipScheduleShell } from "@/components/ship-schedule-shell";
import { ShipScheduleTable } from "@/components/ship-schedule-table";
import { featuredTour } from "@/lib/featured-tour";
import { loadVillefrancheCruiseSchedule } from "@/lib/villefranche-cruise-schedule";
import {
  getShipScheduleMonthBreadcrumbLabel,
  getShipScheduleMonthLead,
  getShipScheduleMonthOverview,
  getShipScheduleMonthPlanning,
} from "@/lib/ship-schedule-page";
import {
  getShipScheduleYearPath,
  requireShipScheduleMonth,
  shipScheduleHub,
} from "@/lib/ship-schedule-months";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";

type ShipScheduleMonthPageProps = {
  monthSlug: string;
};

export function ShipScheduleMonthPage({
  monthSlug,
}: ShipScheduleMonthPageProps) {
  const month = requireShipScheduleMonth(monthSlug);
  const schedule = loadVillefrancheCruiseSchedule(month);
  const path = `/ship-schedules/${monthSlug}`;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ship Schedules", href: shipScheduleHub.path },
    { label: String(month.year), href: getShipScheduleYearPath(month.year) },
    { label: getShipScheduleMonthBreadcrumbLabel(month) },
  ] as const;

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path,
            title: month.title,
            description: month.description,
          }),
          buildBreadcrumbSchema(breadcrumbs, path),
        ]}
      />
      <ShipScheduleShell
        title={month.title}
        lead={getShipScheduleMonthLead(month)}
        breadcrumbs={[...breadcrumbs]}
        ctaTitle="Ready to plan your Villefranche cruise day?"
        ctaHref={featuredTour.path}
        ctaLabel="View excursions for your Villefranche cruise day"
        ctaSecondaryHref={featuredTour.bookingPath}
        ctaSecondaryLabel="Check availability"
      >
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              {month.label} overview
            </h2>
            <p className="text-base leading-7 sm:text-lg">
              {getShipScheduleMonthOverview(month)}
            </p>
          </div>

          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
              Daily cruise ship schedule — {month.label}
            </h2>
            <ShipScheduleTable entries={schedule} />
          </div>

          <p className="mt-6 text-sm leading-6 text-gray-500">
            Times shown are from the published Villefranche schedule dataset.
            Blank cells mean no verified clock time is available. Your cruise
            line app remains the authoritative source for arrival, all aboard,
            and departure.
          </p>

          <div className="mx-auto mt-12 max-w-3xl space-y-4 border-t border-gray-200 pt-10 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Planning your {month.label.split(" ")[0]} port day
            </h2>
            {getShipScheduleMonthPlanning(month).map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 sm:text-lg">
                {paragraph}
              </p>
            ))}
            <p className="text-base leading-7 sm:text-lg">
              <Link
                href={featuredTour.bookingPath}
                className="w2-link font-medium underline underline-offset-2"
              >
                View excursions for your Villefranche cruise day
              </Link>
              , read the{" "}
              <Link
                href={portGuidePath}
                className="w2-link underline underline-offset-2"
              >
                Villefranche port guide
              </Link>
              , or check{" "}
              <Link
                href="/villefranche-tender-information"
                className="w2-link underline underline-offset-2"
              >
                tender information
              </Link>
              .
            </p>
          </div>
        </section>

        <ShipScheduleMonthLinks currentSlug={monthSlug} year={month.year} />
      </ShipScheduleShell>
    </>
  );
}
