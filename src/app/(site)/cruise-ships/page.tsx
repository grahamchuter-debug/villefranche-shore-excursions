import Link from "next/link";

import { CruiseShipsHubCards } from "@/components/cruise-ships-hub-cards";
import { JsonLd } from "@/components/json-ld";
import { ShipScheduleShell } from "@/components/ship-schedule-shell";
import { buildCruiseShipsHubMetadata } from "@/lib/cruise-ship-page";
import { buildCruiseShipSummaries, cruiseShipsHub } from "@/lib/villefranche-cruise-ships";
import { cruiseLineVillefrancheHubLinks } from "@/lib/cruise-line-villefranche-pages";
import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { buildWebPageSchema } from "@/lib/site-schema";

export const metadata = buildCruiseShipsHubMetadata();

export default function CruiseShipsHubPage() {
  const ships = buildCruiseShipSummaries();
  const totalCalls = ships.reduce((total, ship) => total + ship.callCount, 0);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: cruiseShipsHub.path,
            title: `${cruiseShipsHub.title} | ${siteConfig.name}`,
            description: cruiseShipsHub.description,
          }),
        ]}
      />
      <ShipScheduleShell
        title="Villefranche Cruise Ships"
        lead="Browse cruise ships that visit Villefranche-sur-Mer on the French Riviera. Each ship page includes port call history, tender planning advice, and shore excursion recommendations for cruise passengers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Ships" },
        ]}
        ctaTitle={`Book the ${featuredTour.cardName} tour`}
        ctaHref={featuredTour.path}
        ctaLabel="View recommended tour"
      >
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
            <p className="text-base leading-7 sm:text-lg">
              Villefranche-sur-Mer is a tender port on the French Riviera. The ships below
              appear in our published Villefranche cruise schedules — currently{" "}
              {ships.length} vessels and {totalCalls} known port calls across
              2026 and 2027.
            </p>
            <p className="text-base leading-7 sm:text-lg">
              Select your ship for a passenger planning guide covering tender
              logistics, time in port, recommended excursions, and links to
              monthly timetables.
            </p>
          </div>

          <div className="mt-10">
            <CruiseShipsHubCards ships={ships} />
          </div>

          <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Villefranche guides by cruise line
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-700">
              Tender logistics and shore excursion planning for major cruise
              lines calling at Villefranche-sur-Mer.
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {cruiseLineVillefrancheHubLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/excursions"
              className="w2-btn w2-btn-primary px-6 py-3 text-sm"
            >
              View Villefranche shore excursions
            </Link>
            <Link
              href="/ship-schedules"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-400"
            >
              View ship schedules
            </Link>
          </div>

          <p className="mt-8 text-sm leading-6 text-gray-500">
            Schedules are updated as new port calls are confirmed. For month-by-month
            timetables, visit the{" "}
            <Link
              href="/ship-schedules"
              className="w2-link underline underline-offset-2"
            >
              Villefranche ship schedule hub
            </Link>
            .
          </p>
        </section>
      </ShipScheduleShell>
    </>
  );
}
