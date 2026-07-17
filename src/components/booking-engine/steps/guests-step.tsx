"use client";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import {
  bookingCapacityConfig,
  bookingCheckoutGuestLimit,
  bookingPricingConfig,
} from "@/lib/booking/booking-config";
import {
  calculateBookingTotal,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type GuestsStepProps = {
  guests: number;
  onChangeGuests: (guests: number) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function GuestsStep({
  guests,
  onChangeGuests,
  onContinue,
  onBack,
}: GuestsStepProps) {
  const { minGuests, capacityLabel, overCapacityContactHref } =
    bookingCapacityConfig;
  const maxGuests = bookingCheckoutGuestLimit;
  const total = calculateBookingTotal(guests);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-3 text-center">
        <h2 className="book-display text-4xl font-medium text-[var(--book-ink)] sm:text-5xl">
          How many guests?
        </h2>
        <p className="text-lg text-[var(--book-muted)]">{capacityLabel}</p>
      </header>

      <div className="book-surface-card rounded-[1.75rem] bg-[var(--book-surface)] px-6 py-12 shadow-[0_24px_60px_-36px_rgba(12,26,36,0.35)] sm:px-12">
        <div
          className="flex items-center justify-center gap-8 sm:gap-12"
          role="group"
          aria-labelledby="guest-count-label"
        >
          <button
            type="button"
            aria-label="Fewer guests"
            disabled={guests <= minGuests}
            onClick={() => onChangeGuests(Math.max(minGuests, guests - 1))}
            className="book-guest-control flex h-14 w-14 items-center justify-center rounded-full border border-[var(--book-line)] text-2xl text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] disabled:opacity-30"
          >
            −
          </button>
          <div className="min-w-[6rem] text-center">
            <p
              id="guest-count-label"
              key={guests}
              className="book-guest-count book-display text-7xl font-medium leading-none text-[var(--book-ink)]"
              aria-live="polite"
            >
              {guests}
            </p>
            <p className="mt-3 text-sm tracking-wide text-[var(--book-muted)]">
              {guests === 1 ? "guest" : "guests"}
            </p>
          </div>
          <button
            type="button"
            aria-label="More guests"
            disabled={guests >= maxGuests}
            onClick={() => onChangeGuests(Math.min(maxGuests, guests + 1))}
            className="book-guest-control flex h-14 w-14 items-center justify-center rounded-full border border-[var(--book-line)] text-2xl text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] disabled:opacity-30"
          >
            +
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-sm leading-6 text-[var(--book-muted)]">
          Travelling with more than six people?{" "}
          <a
            href={overCapacityContactHref}
            className="font-medium text-[var(--book-sea)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
          >
            Contact us
          </a>{" "}
          and we&apos;ll check additional vehicle availability.
        </p>

        <div className="mt-10 border-t border-[var(--book-line)] pt-8 text-center">
          <p className="text-sm text-[var(--book-muted)]">
            {formatBookingMoney(bookingPricingConfig.pricePerGuest)} × {guests}
          </p>
          <p
            key={total}
            className="book-guest-count book-display mt-1 text-4xl font-medium text-[var(--book-ink)]"
          >
            {formatBookingMoney(total)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-md space-y-3">
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
