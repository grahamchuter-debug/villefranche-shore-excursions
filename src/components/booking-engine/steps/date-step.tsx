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
    () => (view ? buildMonthGrid(view.getFullYear(), view.getMonth()) : []),
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
      <div
        className="py-20 text-center text-[var(--book-muted)]"
        aria-live="polite"
      >
        Loading calendar…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3 text-center">
        <h2 className="book-display text-4xl font-medium text-[var(--book-ink)] sm:text-5xl">
          Choose your cruise date
        </h2>
        <p className="text-lg text-[var(--book-muted)]">
          The day your ship calls at Villefranche-sur-Mer.
        </p>
      </header>

      <div className="book-surface-card rounded-[1.75rem] bg-[var(--book-surface)] p-6 shadow-[0_24px_60px_-36px_rgba(12,26,36,0.35)] sm:p-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
            }
            disabled={!canGoPrev}
            className="book-btn rounded-full px-4 py-2 text-sm font-medium text-[var(--book-sea)] disabled:opacity-25"
            aria-label="Previous month"
          >
            ←
          </button>
          <p
            key={monthLabel}
            className="book-selected-date book-display text-2xl font-medium text-[var(--book-ink)]"
          >
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() =>
              setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
            }
            className="book-btn rounded-full px-4 py-2 text-sm font-medium text-[var(--book-sea)]"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--book-muted)]">
          {WEEKDAYS.map((day) => (
            <span key={day} className="py-2">
              {day}
            </span>
          ))}
        </div>

        <div
          key={`${view.getFullYear()}-${view.getMonth()}`}
          className="book-calendar-grid grid grid-cols-7 gap-1.5 sm:gap-2"
        >
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
                aria-pressed={selected}
                className={[
                  "book-day-btn aspect-square rounded-2xl text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]",
                  disabled
                    ? "cursor-not-allowed text-[var(--book-line)]"
                    : selected
                      ? "bg-[var(--book-sea-deep)] text-white"
                      : "text-[var(--book-ink)] hover:bg-[var(--book-mist)]",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {selectedDate ? (
          <p
            key={selectedDate}
            className="book-selected-date mt-8 text-center text-base text-[var(--book-ink)]"
          >
            {formatBookingDate(selectedDate)}
          </p>
        ) : null}
      </div>

      <div className="mx-auto max-w-md space-y-3">
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
