"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BookingBackLink } from "@/components/booking-engine/booking-primary-button";
import {
  formatBookingDate,
  startOfLocalDay,
  toLocalIsoDate,
} from "@/lib/booking/booking-format";

type DateStepProps = {
  selectedDate: string | null;
  onSelectDate: (isoDate: string | null) => void;
  /** Called after polished confirmation pause — advances to guests */
  onDateConfirmed: (isoDate: string) => void;
  onBack: () => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const CONFIRM_DELAY_MS = 450;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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
  onDateConfirmed,
  onBack,
}: DateStepProps) {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<Date | null>(null);
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    const start = startOfLocalDay();
    setToday(start);
    setView(new Date(start.getFullYear(), start.getMonth(), 1));
  }, []);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current !== null) {
        window.clearTimeout(advanceTimer.current);
      }
    };
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

  const clearAdvanceTimer = () => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  const handleSelectDate = (iso: string, date: Date) => {
    if (!today || date < today) return;

    clearAdvanceTimer();
    setPendingDate(iso);
    onSelectDate(iso);

    const label = formatBookingDate(iso);
    setAnnouncement(`${label} selected`);

    const delay = prefersReducedMotion() ? 0 : CONFIRM_DELAY_MS;
    advanceTimer.current = window.setTimeout(() => {
      onDateConfirmed(iso);
    }, delay);
  };

  const handleBack = () => {
    clearAdvanceTimer();
    setPendingDate(null);
    onBack();
  };

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

  const displayDate = pendingDate ?? selectedDate;

  return (
    <div className="book-date-stage mx-auto max-w-3xl">
      <BookingBackLink onClick={handleBack} className="mb-6 sm:mb-8" />

      {/* Photographic band — the journey continues from the hero, heading rides on it */}
      <div
        className="book-date-hero-remnant relative overflow-hidden rounded-[1.25rem]"
      >
        <img
          src="/images/booking/monaco-port-hercule-1280.webp"
          alt=""
          width={1280}
          height={580}
          className="h-40 w-full object-cover object-center sm:h-56"
          decoding="async"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/80 via-[var(--book-ink)]/25 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-[10rem] flex-col justify-end px-6 py-7 sm:min-h-[14rem] sm:px-10 sm:py-9">
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/70 uppercase">
            Villefranche-sur-Mer
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            id="booking-date-heading"
            className="book-display mt-2 max-w-md text-3xl font-medium leading-[1.05] text-white outline-none sm:text-5xl"
          >
            Choose your cruise date
          </h2>
        </div>
      </div>

      <p className="mt-5 max-w-md text-[15px] leading-6 text-[var(--book-muted)] sm:text-base">
        The day your ship calls at port.
      </p>

      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="mt-9 border-t border-[var(--book-line)] pt-8 sm:mt-10 sm:pt-9">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                clearAdvanceTimer();
                setPendingDate(null);
                setAnnouncement("");
                onSelectDate(null);
                setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
              }}
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
              onClick={() => {
                clearAdvanceTimer();
                setPendingDate(null);
                setAnnouncement("");
                onSelectDate(null);
                setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
              }}
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
              const selected = displayDate === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled || Boolean(pendingDate)}
                  onClick={() => handleSelectDate(iso, date)}
                  aria-label={formatBookingDate(iso)}
                  aria-pressed={selected}
                  className={[
                    "book-day-btn aspect-square rounded-2xl text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]",
                    disabled
                      ? "cursor-not-allowed text-[var(--book-line)]"
                      : selected
                        ? "bg-[var(--book-sea-deep)] text-white"
                        : "text-[var(--book-ink)] hover:bg-[var(--book-mist)]",
                    pendingDate && selected ? "book-day-confirming" : "",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {displayDate ? (
            <p
              key={displayDate}
              className="book-selected-date mt-8 text-center text-base font-medium text-[var(--book-ink)]"
              aria-hidden="true"
            >
              {formatBookingDate(displayDate)} selected
            </p>
          ) : (
            <p className="mt-8 text-center text-sm text-[var(--book-muted)]">
              Select a date to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
