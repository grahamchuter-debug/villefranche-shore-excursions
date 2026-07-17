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
      <p className="text-center text-sm font-medium tracking-wide text-[var(--book-success)]">
        Booking confirmed
      </p>
    );
  }

  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {visibleSteps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition sm:h-9 sm:w-9",
                  done
                    ? "bg-[var(--book-sea)] text-white"
                    : active
                      ? "bg-[var(--book-sea-deep)] text-white ring-4 ring-[var(--book-sea)]/20"
                      : "bg-[var(--book-sand)] text-[var(--book-muted)]",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={[
                  "truncate text-[11px] font-medium sm:text-xs",
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
