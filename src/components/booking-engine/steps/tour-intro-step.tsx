"use client";

import Link from "next/link";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import {
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
    <div className="space-y-10 lg:space-y-12">
      <div className="overflow-hidden rounded-[1.75rem] bg-[var(--book-surface)] shadow-[0_30px_80px_-40px_rgba(12,26,36,0.45)] lg:rounded-[2rem]">
        <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
          <div className="relative min-h-[22rem] overflow-hidden sm:min-h-[28rem] lg:min-h-[34rem]">
            <img
              src={tour.image}
              alt={tour.imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/75 via-[var(--book-ink)]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
              <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-white/75 uppercase">
                French Riviera
              </p>
              <h1 className="book-display max-w-xl text-[2.15rem] font-medium leading-[1.1] text-white sm:text-5xl lg:text-[3.35rem]">
                {tour.headline}
              </h1>
            </div>
          </div>

          <div className="relative hidden overflow-hidden lg:block">
            <img
              src={tour.secondaryImage}
              alt={tour.secondaryImageAlt}
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-[var(--book-ink)]/15" />
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12 lg:px-12 lg:py-12">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-gold)] uppercase">
                {tour.subtitle}
              </p>
              <h2 className="book-display mt-2 text-3xl font-medium text-[var(--book-ink)] sm:text-4xl">
                {tour.name}
              </h2>
              <p className="mt-3 text-base tracking-wide text-[var(--book-muted)] sm:text-lg">
                {tour.tagline}
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {tour.reassurance.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[var(--book-ink)]/85 sm:text-[15px]"
                >
                  <span
                    aria-hidden="true"
                    className="text-[var(--book-success)]"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            <div>
              <p className="book-display text-4xl font-medium text-[var(--book-ink)] sm:text-5xl">
                {price}
              </p>
              <p className="mt-1 text-sm text-[var(--book-muted)]">per guest</p>
            </div>
            <div className="w-full max-w-sm space-y-3 lg:max-w-none">
              <BookingPrimaryButton onClick={onContinue}>
                Select your date
              </BookingPrimaryButton>
              <p className="text-center text-sm text-[var(--book-muted)] lg:text-right">
                <Link
                  href={tour.path}
                  className="underline-offset-4 transition hover:text-[var(--book-ink)] hover:underline"
                >
                  Tour details
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
