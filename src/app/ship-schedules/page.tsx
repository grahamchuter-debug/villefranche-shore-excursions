import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import {
  ShipSchedulePortInfo,
  ShipScheduleYearCards,
} from "@/components/ship-schedule-month-links";
import { ShipScheduleShell } from "@/components/ship-schedule-shell";
import { countVillefrancheCruiseScheduleForYear } from "@/lib/villefranche-cruise-schedule";
import {
  buildShipScheduleHubMetadata,
  getShipScheduleHubLead,
} from "@/lib/ship-schedule-page";
import { shipScheduleHub, shipScheduleYearHubs } from "@/lib/ship-schedule-months";
import { siteConfig } from "@/lib/site-config";
import { meetingPointPath } from "@/lib/site-paths";
import { buildWebPageSchema } from "@/lib/site-schema";

export const metadata = buildShipScheduleHubMetadata();

export default function ShipSchedulesHubPage() {
  const yearCards = shipScheduleYearHubs.map((yearHub) => ({
    year: yearHub.year,
    label: yearHub.label,
    path: yearHub.path,
    shipCount: countVillefrancheCruiseScheduleForYear(yearHub.year),
  }));

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: shipScheduleHub.path,
            title: `${shipScheduleHub.title} | ${siteConfig.name}`,
            description: shipScheduleHub.description,
          }),
        ]}
      />
      <ShipScheduleShell
        title="Villefranche Cruise Ship Schedule"
        lead={getShipScheduleHubLead()}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Ship Schedules" },
        ]}
      >
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
            <p className="text-base leading-7 sm:text-lg">
              Villefranche-sur-Mer is a tender port on the French Riviera. Cruise ships
              anchor offshore and transfer passengers ashore to visit Villefranche
              and the surrounding Côte d&apos;Azur. Use these timetables to see which
              vessels call at the port, when they arrive, and when they depart —
              so you can book shore excursions with enough time to return before
              all aboard.
            </p>
            <p className="text-base leading-7 sm:text-lg">
              Select a year below to browse monthly schedules, or jump directly
              to a month from the year overview page.
            </p>
          </div>

          <div className="mt-8">
            <ShipSchedulePortInfo />
          </div>

          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Browse by year
            </h2>
            <ShipScheduleYearCards years={yearCards} />
          </div>

          <p className="mt-8 text-sm leading-6 text-gray-500">
            Planning your port day? Browse{" "}
            <Link
              href="/cruise-ships"
              className="font-medium text-blue-700 underline underline-offset-2"
            >
              cruise ship planning guides
            </Link>
            , read our{" "}
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
              meeting points
            </Link>
            , and use the{" "}
            <Link
              href="/cruise-planner"
              className="font-medium text-blue-700 underline underline-offset-2"
            >
              cruise planner
            </Link>{" "}
            to match excursions to your ship&apos;s timetable.
          </p>
        </section>
      </ShipScheduleShell>
    </>
  );
}
