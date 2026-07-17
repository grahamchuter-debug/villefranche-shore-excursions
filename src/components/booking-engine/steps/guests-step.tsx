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
    <div className="space-y-8">
      <header className="space-y-2 text-center sm:text-left">
        <h2 className="book-display text-3xl font-semibold text-[var(--book-ink)] sm:text-4xl">
          How many guests?
        </h2>
        <p className="text-lg leading-8 text-[var(--book-muted)]">
          {capacityLabel}
        </p>
      </header>

      <div className="rounded-3xl bg-[var(--book-surface)] p-6 shadow-[0_20px_50px_-28px_rgba(19,34,56,0.35)] sm:p-8">
        <div
          className="flex items-center justify-center gap-6 sm:gap-10"
          role="group"
          aria-labelledby="guest-count-label"
        >
          <button
            type="button"
            aria-label="Fewer guests"
            disabled={guests <= minGuests}
            onClick={() => onChangeGuests(Math.max(minGuests, guests - 1))}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--book-line)] bg-white text-3xl font-light text-[var(--book-ink)] transition hover:bg-[var(--book-mist)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] disabled:opacity-35"
          >
            −
          </button>
          <div className="min-w-[5rem] text-center">
            <p
              id="guest-count-label"
              className="book-display text-6xl font-semibold leading-none text-[var(--book-ink)]"
              aria-live="polite"
            >
              {guests}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--book-muted)]">
              {guests === 1 ? "guest" : "guests"}
            </p>
          </div>
          <button
            type="button"
            aria-label="More guests"
            disabled={guests >= maxGuests}
            onClick={() => onChangeGuests(Math.min(maxGuests, guests + 1))}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--book-line)] bg-white text-3xl font-light text-[var(--book-ink)] transition hover:bg-[var(--book-mist)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] disabled:opacity-35"
          >
            +
          </button>
        </div>

        <p className="mt-6 text-center text-sm leading-6 text-[var(--book-muted)]">
          Travelling with more than six people?{" "}
          <a
            href={overCapacityContactHref}
            className="font-semibold text-[var(--book-sea)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
          >
            Contact us
          </a>{" "}
          and we&apos;ll check additional vehicle availability.
        </p>

        <div className="mt-8 space-y-2 border-t border-[var(--book-line)] pt-6 text-center">
          <p className="text-base text-[var(--book-muted)]">
            {formatBookingMoney(bookingPricingConfig.pricePerGuest)} × {guests}
          </p>
          <p className="book-display text-3xl font-semibold text-[var(--book-ink)]">
            {formatBookingMoney(total)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <BookingPrimaryButton onClick={onContinue}>
          Review booking
        </BookingPrimaryButton>
        <BookingPrimaryButton variant="ghost" onClick={onBack}>
          Back
        </BookingPrimaryButton>
      </div>
    </div>
  );
}
