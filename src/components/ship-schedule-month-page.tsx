import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { portGuidePath } from "@/lib/site-paths";
import {
  ShipScheduleMonthLinks,
} from "@/components/ship-schedule-month-links";
import { ShipScheduleShell } from "@/components/ship-schedule-shell";
import { ShipScheduleTable } from "@/components/ship-schedule-table";
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
import { siteConfig } from "@/lib/site-config";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";

type ShipScheduleMonthPageProps = {
  monthSlug: string;
};

export function ShipScheduleMonthPage({ monthSlug }: ShipScheduleMonthPageProps) {
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
            title: `${month.title} | ${siteConfig.name}`,
            description: month.description,
          }),
          buildBreadcrumbSchema(breadcrumbs, path),
        ]}
      />
      <ShipScheduleShell
        title={month.title}
        lead={getShipScheduleMonthLead(month)}
        breadcrumbs={[...breadcrumbs]}
        ctaTitle="See Villefranche-sur-Mer shore excursions for your cruise day"
        ctaHref={siteConfig.excursionsHubPath}
        ctaLabel="View Villefranche-sur-Mer shore excursions"
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
              Daily cruise ship schedule
            </h2>
            <ShipScheduleTable entries={schedule} />
          </div>

          <p className="mt-6 text-sm leading-6 text-gray-500">
            Times are indicative for planning purposes. Your cruise line app
            remains the authoritative source for arrival, all aboard, and
            departure.
          </p>

          <div className="mx-auto mt-12 max-w-3xl space-y-4 border-t border-gray-200 pt-10 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              Cruise passenger planning
            </h2>
            {getShipScheduleMonthPlanning(month).map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 sm:text-lg">
                {paragraph}
              </p>
            ))}
            <p className="text-base leading-7 sm:text-lg">
              Browse{" "}
              <Link
                href={siteConfig.excursionsHubPath}
                className="w2-link underline underline-offset-2"
              >
                Villefranche-sur-Mer shore excursions
              </Link>
              , read the{" "}
              <Link
                href={portGuidePath}
                className="w2-link underline underline-offset-2"
              >
                port guide
              </Link>
              , check{" "}
              <Link
                href="/villefranche-tender-information"
                className="w2-link underline underline-offset-2"
              >
                tender information
              </Link>
              , or plan your day with our{" "}
              <Link
                href="/one-day-in-villefranche"
                className="w2-link underline underline-offset-2"
              >
                one day in Villefranche-sur-Mer
              </Link>{" "}
              itinerary.
            </p>
          </div>
        </section>

        <ShipScheduleMonthLinks currentSlug={monthSlug} year={month.year} />
      </ShipScheduleShell>
    </>
  );
}
