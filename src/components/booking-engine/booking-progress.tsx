"use client";

import { bookingSteps, type BookingStepId } from "@/lib/booking/booking-config";

type BookingProgressProps = {
  current: BookingStepId;
};

const FLOW_STEPS = bookingSteps.filter(
  (step) => step.id !== "tour" && step.id !== "confirmed",
);

/**
 * Quiet progress instrument: a thin fill + "Step x of y" label rather than
 * numbered-circle wizard chrome. Still driven entirely by `bookingSteps`.
 */
export function BookingProgress({ current }: BookingProgressProps) {
  if (current === "confirmed") {
    return (
      <p className="text-center text-xs font-medium tracking-[0.16em] uppercase text-[var(--book-success)]">
        Confirmed
      </p>
    );
  }

  const currentIndex = FLOW_STEPS.findIndex((step) => step.id === current);
  const stepNumber = currentIndex + 1;
  const total = FLOW_STEPS.length;
  const currentLabel = FLOW_STEPS[currentIndex]?.label ?? "";
  const progressPercent = total > 0 ? (stepNumber / total) * 100 : 0;

  return (
    <div className="w-full">
      <div
        className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--book-line)]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={stepNumber}
        aria-valuetext={`Step ${stepNumber} of ${total}: ${currentLabel}`}
      >
        <div
          className="book-progress-fill h-full rounded-full bg-[var(--w2-primary)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-3 flex items-baseline justify-between text-[11px] font-medium tracking-[0.14em] text-[var(--book-muted)] uppercase">
        <span>
          Step {stepNumber} of {total}
        </span>
        <span className="text-[var(--book-ink)]">{currentLabel}</span>
      </p>
    </div>
  );
}
