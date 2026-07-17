"use client";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import {
  bookingPricingConfig,
  bookingPrototypeTour,
} from "@/lib/booking/booking-config";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type SummaryStepProps = {
  date: string;
  guests: number;
  onContinue: () => void;
  onBack: () => void;
};

export function SummaryStep({
  date,
  guests,
  onContinue,
  onBack,
}: SummaryStepProps) {
  const total = calculateBookingTotal(guests);
  const rows = [
    { label: "Tour", value: bookingPrototypeTour.fullName },
    { label: "Date", value: formatBookingDate(date) },
    {
      label: "Guests",
      value: `${guests} ${guests === 1 ? "guest" : "guests"}`,
    },
    { label: "Price", value: formatBookingMoney(total) },
  ] as const;

  const trust = [
    {
      title: bookingPricingConfig.freeCancellationLabel,
      detail: bookingPricingConfig.freeCancellationDetail,
    },
    {
      title: bookingPricingConfig.returnGuaranteeLabel,
      detail: bookingPricingConfig.returnGuaranteeDetail,
    },
    {
      title: bookingPricingConfig.securePaymentLabel,
      detail: bookingPricingConfig.securePaymentDetail,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center sm:text-left">
        <h2 className="book-display text-3xl font-semibold text-[var(--book-ink)] sm:text-4xl">
          Your booking summary
        </h2>
        <p className="text-lg leading-8 text-[var(--book-muted)]">
          Everything looks right? Next you&apos;ll pay securely.
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl bg-[var(--book-surface)] shadow-[0_20px_50px_-28px_rgba(19,34,56,0.35)]">
        <div className="divide-y divide-[var(--book-line)]">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-7 sm:py-5"
            >
              <dt className="text-sm font-medium uppercase tracking-wide text-[var(--book-muted)]">
                {row.label}
              </dt>
              <dd className="text-lg font-semibold text-[var(--book-ink)] sm:text-right">
                {row.value}
              </dd>
            </div>
          ))}
        </div>

        <ul className="space-y-4 border-t border-[var(--book-line)] bg-[var(--book-mist)] px-5 py-6 sm:px-7">
          {trust.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--book-success)]/15 text-sm font-bold text-[var(--book-success)]"
              >
                ✓
              </span>
              <div>
                <p className="font-semibold text-[var(--book-ink)]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm leading-6 text-[var(--book-muted)]">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <BookingPrimaryButton onClick={onContinue}>
          Continue to payment
        </BookingPrimaryButton>
        <BookingPrimaryButton variant="ghost" onClick={onBack}>
          Back
        </BookingPrimaryButton>
      </div>
    </div>
  );
}
