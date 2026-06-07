import Link from "next/link";

import { countVillefrancheCruiseSchedule } from "@/lib/villefranche-cruise-schedule";
import {
  getShipScheduleMonthPath,
  getShipScheduleYearPath,
  shipScheduleHub,
  shipScheduleMonths,
  shipScheduleYearHubs,
  type ShipScheduleMonth,
} from "@/lib/ship-schedule-months";

export type ShipScheduleMonthCardData = ShipScheduleMonth & {
  shipCount: number;
};

import { portGuidePath } from "@/lib/site-paths";

const planningLinks = [
  { label: "Cruise Ships", href: "/cruise-ships" },
  { label: "Port Guide", href: portGuidePath },
  { label: "Tender Information", href: "/villefranche-tender-information" },
  { label: "Cruise Planner", href: "/cruise-planner" },
] as const;

type ShipScheduleMonthLinksProps = {
  currentSlug?: string;
  year?: number;
  heading?: string;
};

export function ShipScheduleMonthLinks({
  currentSlug,
  year,
  heading = "Browse schedules and plan your port day",
}: ShipScheduleMonthLinksProps) {
  const months = (year
    ? shipScheduleMonths.filter((month) => month.year === year)
    : shipScheduleMonths
  ).filter((month) => countVillefrancheCruiseSchedule(month) > 0);

  return (
    <section className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
          {heading}
        </h2>
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link
              href={shipScheduleHub.path}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
            >
              Ship Schedules Hub
            </Link>
          </li>
          {!year
            ? shipScheduleYearHubs.map((yearHub) => (
                <li key={yearHub.slug}>
                  <Link
                    href={yearHub.path}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                  >
                    {yearHub.label}
                  </Link>
                </li>
              ))
            : null}
          {year ? (
            <li>
              <Link
                href={getShipScheduleYearPath(year)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
              >
                {year} Overview
              </Link>
            </li>
          ) : null}
          {months.map((month) => (
            <li key={month.slug}>
              <Link
                href={getShipScheduleMonthPath(month.slug)}
                aria-current={currentSlug === month.slug ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  currentSlug === month.slug
                    ? "border-blue-200 bg-blue-50 text-blue-800"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                }`}
              >
                {month.label}
              </Link>
            </li>
          ))}
          {planningLinks.map((link) => (
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
  );
}

type ShipScheduleMonthCardsProps = {
  months: ShipScheduleMonthCardData[];
};

export function ShipScheduleMonthCards({ months }: ShipScheduleMonthCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {months.map((month) => (
        <Link
          key={month.slug}
          href={getShipScheduleMonthPath(month.slug)}
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="border-b border-gray-100 bg-gray-900 px-5 py-4 transition group-hover:bg-gray-800">
            <h2 className="text-lg font-bold text-white sm:text-xl">
              {month.cardTitle}
            </h2>
            <p className="mt-1 text-sm text-white/75">{month.cardDescription}</p>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-3xl font-bold text-gray-900">{month.shipCount}</p>
            <p className="mt-1 text-sm text-gray-500">
              {month.shipCount === 1
                ? "cruise ship scheduled"
                : "cruise ships scheduled"}
            </p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-500">
              View schedule
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

type ShipScheduleYearCardsProps = {
  years: { year: number; shipCount: number; path: string; label: string }[];
};

export function ShipScheduleYearCards({ years }: ShipScheduleYearCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {years.map((year) => (
        <Link
          key={year.year}
          href={year.path}
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="border-b border-gray-100 bg-gray-900 px-5 py-4 transition group-hover:bg-gray-800">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {year.label}
            </h2>
            <p className="mt-1 text-sm text-white/75">
              Browse monthly Villefranche cruise ship timetables
            </p>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-3xl font-bold text-gray-900">{year.shipCount}</p>
            <p className="mt-1 text-sm text-gray-500">
              {year.shipCount === 1
                ? "cruise ship call listed"
                : "cruise ship calls listed"}
            </p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-500">
              View {year.year} schedules
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ShipSchedulePortInfo() {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        Villefranche-sur-Mer, France
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-gray-900">How ships arrive</dt>
          <dd className="mt-1 leading-6 text-gray-700">
            Tender port — ships anchor offshore in the bay
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">Timezone</dt>
          <dd className="mt-1 leading-6 text-gray-700">CET / CEST</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">Port type</dt>
          <dd className="mt-1 leading-6 text-gray-700">
            Tender port — see our tender information guide for ashore details
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">Return buffer</dt>
          <dd className="mt-1 leading-6 text-gray-700">
            Be at the tender pier 45 minutes before all aboard
          </dd>
        </div>
      </dl>
    </div>
  );
}
