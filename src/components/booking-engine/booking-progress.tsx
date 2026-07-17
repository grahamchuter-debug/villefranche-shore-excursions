"use client";

import { bookingSteps, type BookingStepId } from "@/lib/booking/booking-config";

type BookingProgressProps = {
  current: BookingStepId;
};

export function BookingProgress({ current }: BookingProgressProps) {
  const currentIndex = bookingSteps.findIndex((step) => step.id === current);
  const visibleSteps = bookingSteps.filter((step) => step.id !== "confirmed");
  const isConfirmed = current === "confirmed";

  if (isConfirmed) {
    return (
      <p className="text-center text-xs font-medium tracking-[0.16em] uppercase text-[var(--book-success)]">
        Confirmed
      </p>
    );
  }

  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="mx-auto flex max-w-2xl items-center justify-between gap-2">
        {visibleSteps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition sm:h-9 sm:w-9 sm:text-sm",
                  done
                    ? "bg-[var(--w2-primary)] text-white"
                    : active
                      ? "bg-[var(--w2-primary-hover)] text-white"
                      : "bg-transparent text-[var(--book-muted)] ring-1 ring-[var(--book-line)]",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={[
                  "truncate text-[10px] font-medium tracking-[0.08em] uppercase sm:text-[11px]",
                  active || done
                    ? "text-[var(--book-ink)]"
                    : "text-[var(--book-muted)]",
                ].join(" ")}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
