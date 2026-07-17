"use client";

import Link from "next/link";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import {
  bookingCapacityConfig,
  bookingPricingConfig,
  bookingPrototypeTour,
} from "@/lib/booking/booking-config";
import { formatBookingMoney } from "@/lib/booking/booking-format";

type TourIntroStepProps = {
  onContinue: () => void;
};

export function TourIntroStep({ onContinue }: TourIntroStepProps) {
  const tour = bookingPrototypeTour;
  const price = formatBookingMoney(bookingPricingConfig.pricePerGuest);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-[var(--book-surface)] shadow-[0_20px_50px_-28px_rgba(19,34,56,0.35)]">
        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[21/10]">
          <img
            src={tour.image}
            alt={tour.imageAlt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/70 via-[var(--book-ink)]/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              {tour.subtitle}
            </p>
            <h1 className="book-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {tour.name}
            </h1>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          <p className="max-w-xl text-lg leading-8 text-[var(--book-muted)] sm:text-xl sm:leading-9">
            {tour.tagline}
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {tour.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-[var(--book-mist)] px-4 py-3 text-base text-[var(--book-ink)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--book-sea)]"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--book-line)] pt-6">
            <div>
              <p className="book-display text-3xl font-semibold text-[var(--book-ink)]">
                {price}
                <span className="ml-2 text-base font-normal text-[var(--book-muted)]">
                  per guest
                </span>
              </p>
            </div>
            <p className="max-w-[14rem] text-sm leading-6 text-[var(--book-muted)] sm:text-right">
              {bookingCapacityConfig.capacityLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <BookingPrimaryButton onClick={onContinue}>
          Choose your date
        </BookingPrimaryButton>
        <p className="text-center text-sm text-[var(--book-muted)]">
          Prefer to read more first?{" "}
          <Link
            href={tour.path}
            className="font-medium text-[var(--book-sea)] underline underline-offset-2"
          >
            View full tour details
          </Link>
        </p>
      </div>
    </div>
  );
}
