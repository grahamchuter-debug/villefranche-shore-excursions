import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import {
  ShipScheduleMonthCards,
  ShipScheduleMonthLinks,
  ShipSchedulePortInfo,
} from "@/components/ship-schedule-month-links";
import { ShipScheduleShell } from "@/components/ship-schedule-shell";
import {
  countVillefrancheCruiseSchedule,
} from "@/lib/villefranche-cruise-schedule";
import { getShipScheduleYearLead } from "@/lib/ship-schedule-page";
import {
  getShipScheduleMonthsForYear,
  requireShipScheduleYear,
  shipScheduleHub,
} from "@/lib/ship-schedule-months";
import { siteConfig } from "@/lib/site-config";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";

type ShipScheduleYearPageProps = {
  yearSlug: string;
};

export function ShipScheduleYearPage({ yearSlug }: ShipScheduleYearPageProps) {
  const yearHub = requireShipScheduleYear(yearSlug);
  const months = getShipScheduleMonthsForYear(yearHub.year)
    .map((month) => ({
      ...month,
      shipCount: countVillefrancheCruiseSchedule(month),
    }))
    .filter((month) => month.shipCount > 0);
  const path = yearHub.path;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ship Schedules", href: shipScheduleHub.path },
    { label: String(yearHub.year) },
  ] as const;

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path,
            title: `${yearHub.title} | ${siteConfig.name}`,
            description: yearHub.description,
          }),
          buildBreadcrumbSchema(breadcrumbs, path),
        ]}
      />
      <ShipScheduleShell
        title={yearHub.title}
        lead={getShipScheduleYearLead(yearHub.year)}
        breadcrumbs={[...breadcrumbs]}
        ctaTitle="Plan shore excursions around your ship's port times"
        ctaHref={siteConfig.excursionsHubPath}
        ctaLabel="View Villefranche-sur-Mer shore excursions"
      >
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
            <p className="text-base leading-7 sm:text-lg">
              Select a month below to view the full Villefranche-sur-Mer cruise ship
              schedule for {yearHub.year}. Each timetable lists ships visiting
              Villefranche-sur-Mer with arrival and departure times to help you plan shore
              excursions.
            </p>
            <p className="text-base leading-7 sm:text-lg">
              Times are indicative for planning — always confirm final port
              times on your cruise line app before booking excursions.
            </p>
          </div>

          <div className="mt-8">
            <ShipSchedulePortInfo />
          </div>

          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {yearHub.year === 2026
                ? `${yearHub.year} monthly schedules from June`
                : `${yearHub.year} monthly schedules`}
            </h2>
            {months.length > 0 ? (
              <ShipScheduleMonthCards months={months} />
            ) : (
              <p className="text-base leading-7 text-gray-600">
                No cruise ship calls are listed for {yearHub.year} yet. Check
                back as schedules are published.
              </p>
            )}
          </div>

          <p className="mt-8 text-sm leading-6 text-gray-500">
            Need help matching excursions to your ship? Use our{" "}
            <Link
              href="/cruise-planner"
              className="font-medium text-blue-700 underline underline-offset-2"
            >
              cruise planner
            </Link>{" "}
            or read{" "}
            <Link
              href="/villefranche-tender-information"
              className="font-medium text-blue-700 underline underline-offset-2"
            >
              tender information
            </Link>{" "}
            before port day.
          </p>
        </section>

        <ShipScheduleMonthLinks year={yearHub.year} />
      </ShipScheduleShell>
    </>
  );
}
