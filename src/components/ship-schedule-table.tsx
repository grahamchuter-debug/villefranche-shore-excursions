"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  formatScheduleDate,
  type CruiseScheduleEntry,
} from "@/lib/cruise-schedule-types";
import { getCruiseShipPath, slugifyShipName } from "@/lib/cruise-ship-utils";

type SortKey = keyof CruiseScheduleEntry;
type SortDirection = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "ship", label: "Ship" },
  { key: "arrival", label: "Arrival" },
  { key: "departure", label: "Departure" },
  { key: "cruiseLine", label: "Cruise Line" },
];

function compareValues(
  a: CruiseScheduleEntry,
  b: CruiseScheduleEntry,
  key: SortKey,
): number {
  if (key === "date") {
    return a.date.localeCompare(b.date);
  }

  if (key === "arrival" || key === "departure") {
    const normalize = (value: string) =>
      value.toLowerCase() === "tbc" || value.toLowerCase() === "tb"
        ? "99:99"
        : value;

    return normalize(a[key]).localeCompare(normalize(b[key]));
  }

  return a[key].localeCompare(b[key], undefined, { sensitivity: "base" });
}

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <span className="text-gray-300">↕</span>;
  }

  return <span aria-hidden="true">{direction === "asc" ? "↑" : "↓"}</span>;
}

type ShipScheduleTableProps = {
  entries: CruiseScheduleEntry[];
  emptyScheduleMessage?: string;
  linkShipNames?: boolean;
};

export function ShipScheduleTable({
  entries,
  emptyScheduleMessage = "No cruise ships are currently listed for this month. Schedules are updated as new port calls are confirmed.",
  linkShipNames = true,
}: ShipScheduleTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = normalizedQuery
      ? entries.filter((entry) =>
          [
            formatScheduleDate(entry.date),
            entry.date,
            entry.ship,
            entry.arrival,
            entry.departure,
            entry.cruiseLine,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : entries;

    return [...filtered].sort((a, b) => {
      const result = compareValues(a, b, sortKey);
      return sortDirection === "asc" ? result : -result;
    });
  }, [entries, query, sortDirection, sortKey]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  const emptyMessage =
    entries.length === 0
      ? emptyScheduleMessage
      : "No ships match your search. Try a different ship name, date, or cruise line.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="schedule-search" className="sr-only">
          Search cruise ship schedule
        </label>
        <input
          id="schedule-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by ship, date, or cruise line…"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:max-w-md"
        />
        <p className="text-sm text-gray-500">
          {filteredEntries.length} of {entries.length} calls shown
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition hover:bg-gray-800 sm:text-sm"
                  >
                    {column.label}
                    <SortIndicator
                      active={sortKey === column.key}
                      direction={sortDirection}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, index) => (
                <tr
                  key={`${entry.date}-${entry.ship}-${index}`}
                  className={`transition hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {formatScheduleDate(entry.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-800">
                    {linkShipNames ? (
                      <Link
                        href={getCruiseShipPath(slugifyShipName(entry.ship))}
                        className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
                      >
                        {entry.ship}
                      </Link>
                    ) : (
                      entry.ship
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {entry.arrival}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {entry.departure}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {entry.cruiseLine || "Not listed"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
