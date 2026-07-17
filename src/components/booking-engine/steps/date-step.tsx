"use client";

import { useEffect, useMemo, useState } from "react";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import {
  formatBookingDate,
  startOfLocalDay,
  toLocalIsoDate,
} from "@/lib/booking/booking-format";

type DateStepProps = {
  selectedDate: string | null;
  onSelectDate: (isoDate: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const startOffset = (first.getDay() + 6) % 7;
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DateStep({
  selectedDate,
  onSelectDate,
  onContinue,
  onBack,
}: DateStepProps) {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<Date | null>(null);

  useEffect(() => {
    const start = startOfLocalDay();
    setToday(start);
    setView(new Date(start.getFullYear(), start.getMonth(), 1));
  }, []);

  const cells = useMemo(
    () =>
      view ? buildMonthGrid(view.getFullYear(), view.getMonth()) : [],
    [view],
  );

  const monthLabel = view
    ? new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
      }).format(view)
    : "";

  const canGoPrev =
    Boolean(today && view) &&
    (view!.getFullYear() > today!.getFullYear() ||
      (view!.getFullYear() === today!.getFullYear() &&
        view!.getMonth() > today!.getMonth()));

  if (!today || !view) {
    return (
      <div className="py-16 text-center text-[var(--book-muted)]" aria-live="polite">
        Loading calendar…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center sm:text-left">
        <h2 className="book-display text-3xl font-semibold text-[var(--book-ink)] sm:text-4xl">
          When are you in port?
        </h2>
        <p className="text-lg leading-8 text-[var(--book-muted)]">
          Choose the date your ship calls at Villefranche-sur-Mer.
        </p>
      </header>

      <div className="rounded-3xl bg-[var(--book-surface)] p-5 shadow-[0_20px_50px_-28px_rgba(19,34,56,0.35)] sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
            }
            disabled={!canGoPrev}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--book-sea)] disabled:opacity-30"
            aria-label="Previous month"
          >
            ←
          </button>
          <p className="book-display text-xl font-semibold text-[var(--book-ink)]">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() =>
              setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
            }
            className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--book-sea)]"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-[var(--book-muted)]">
          {WEEKDAYS.map((day) => (
            <span key={day} className="py-2">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} className="aspect-square" />;
            }
            const iso = toLocalIsoDate(date);
            const disabled = date < today;
            const selected = selectedDate === iso;
            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(iso)}
                aria-label={formatBookingDate(iso)}
                className={[
                  "aspect-square rounded-2xl text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]",
                  disabled
                    ? "cursor-not-allowed text-[var(--book-line)]"
                    : selected
                      ? "bg-[var(--book-sea-deep)] text-white shadow-sm"
                      : "text-[var(--book-ink)] hover:bg-[var(--book-mist)]",
                ].join(" ")}
                aria-pressed={selected}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {selectedDate ? (
          <p className="mt-5 rounded-2xl bg-[var(--book-mist)] px-4 py-3 text-center text-base font-medium text-[var(--book-ink)]">
            Selected: {formatBookingDate(selectedDate)}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <BookingPrimaryButton onClick={onContinue} disabled={!selectedDate}>
          Continue
        </BookingPrimaryButton>
        <BookingPrimaryButton variant="ghost" onClick={onBack}>
          Back
        </BookingPrimaryButton>
      </div>
    </div>
  );
}
