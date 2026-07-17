import Link from "next/link";

import type { CruiseShipCall } from "@/lib/cruise-ship-types";
import {
  formatScheduleDate,
  formatScheduleTimeCell,
} from "@/lib/cruise-schedule-types";
import { getShipScheduleMonthPath } from "@/lib/ship-schedule-months";
import {
  villefrancheArrivalPortLabel,
  villefrancheBestForLabel,
  villefrancheTenderPortLabel,
} from "@/lib/tender-port-copy";

type CruiseShipCallCardsProps = {
  calls: CruiseShipCall[];
  shipName: string;
};

export function CruiseShipCallCards({ calls, shipName }: CruiseShipCallCardsProps) {
  if (calls.length === 0) {
    return (
      <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-gray-600">
        No published Villefranche calls are listed for {shipName} yet. Check the
        monthly ship schedules as new sailings are confirmed.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {calls.map((call) => {
        const arrival = formatScheduleTimeCell(call.arrival);
        const departure = formatScheduleTimeCell(call.departure);
        const hasVerifiedTimes = arrival !== "—" && departure !== "—";

        return (
        <article
          key={`${call.date}-${call.ship}`}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {call.cruiseLine || "Cruise line not listed"}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">
                {formatScheduleDate(call.date)}
              </h3>
            </div>
            {hasVerifiedTimes ? (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {call.timeInPort}
              </span>
            ) : null}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">Arrival</dt>
              <dd className="font-medium text-gray-900">{arrival}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Departure</dt>
              <dd className="font-medium text-gray-900">{departure}</dd>
            </div>
            {hasVerifiedTimes ? (
            <div>
              <dt className="text-gray-500">Time in port</dt>
              <dd className="font-medium text-gray-900">{call.timeInPort}</dd>
            </div>
            ) : null}
            <div>
              <dt className="text-gray-500">Passenger capacity</dt>
              <dd className="font-medium text-gray-900">
                Capacity varies by sailing
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-gray-600">
            View the full{" "}
            <Link
              href={getShipScheduleMonthPath(call.scheduleMonthSlug)}
              className="w2-link underline underline-offset-2"
            >
              {call.scheduleMonthLabel} schedule
            </Link>
            .
          </p>
        </article>
        );
      })}
    </div>
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

type CruiseShipSnapshotProps = {
  typicalVisitLength: string;
};

export function CruiseShipSnapshot({ typicalVisitLength }: CruiseShipSnapshotProps) {
  return (
    <section className="border-b bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Cruise passenger snapshot
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SnapshotCard label="Arrival port" value={villefrancheArrivalPortLabel} />
          <SnapshotCard label="Tender port" value={villefrancheTenderPortLabel} />
          <SnapshotCard
            label="Typical visit length"
            value={typicalVisitLength}
          />
          <SnapshotCard label="Best for" value={villefrancheBestForLabel} />
          <SnapshotCard
            label="Recommended tour style"
            value="Small-group or private shore excursions"
          />
          <SnapshotCard
            label="Return-to-ship confidence"
            value="Build 45 minutes before all aboard plus tender queue time"
          />
        </div>
      </div>
    </section>
  );
}
