"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { getCruiseShipPath, groupShipsByCruiseLine } from "@/lib/cruise-ship-utils";
import type { CruiseShipSummary } from "@/lib/cruise-ship-types";

type CruiseShipsHubCardsProps = {
  ships: CruiseShipSummary[];
};

export function CruiseShipsHubCards({ ships }: CruiseShipsHubCardsProps) {
  const [query, setQuery] = useState("");
  const [selectedLine, setSelectedLine] = useState("all");

  const cruiseLines = useMemo(() => {
    const lines = new Set(ships.map((ship) => ship.cruiseLine));
    return [...lines].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [ships]);

  const filteredShips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ships.filter((ship) => {
      const matchesLine =
        selectedLine === "all" || ship.cruiseLine === selectedLine;
      const matchesQuery =
        !normalizedQuery ||
        [ship.name, ship.cruiseLine, ...ship.monthLabels]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesLine && matchesQuery;
    });
  }, [query, selectedLine, ships]);

  const groupedShips = groupShipsByCruiseLine(filteredShips);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="cruise-ship-search" className="sr-only">
            Search cruise ships
          </label>
          <input
            id="cruise-ship-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ship or cruise line…"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:max-w-sm"
          />

          <label htmlFor="cruise-line-filter" className="sr-only">
            Filter by cruise line
          </label>
          <select
            id="cruise-line-filter"
            value={selectedLine}
            onChange={(event) => setSelectedLine(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:max-w-xs"
          >
            <option value="all">All cruise lines</option>
            {cruiseLines.map((line) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-500">
          {filteredShips.length} of {ships.length} ships shown
        </p>
      </div>

      {groupedShips.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
          No ships match your search. Try a different ship name or cruise line.
        </p>
      ) : (
        groupedShips.map((group) => (
          <section key={group.cruiseLine}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {group.cruiseLine}
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.ships.map((ship) => (
                <Link
                  key={ship.slug}
                  href={getCruiseShipPath(ship.slug)}
                  className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {ship.cruiseLine}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                    {ship.name}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {ship.callCount} known Villefranche call
                    {ship.callCount === 1 ? "" : "s"}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">
                    Visiting: {ship.monthLabels.join(", ")}
                  </p>
                  <span className="mt-4 text-sm font-medium text-blue-700">
                    View planning guide →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
