"use client";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { bookingPrototypeTour } from "@/lib/booking/booking-config";

type TourIntroStepProps = {
  onContinue: () => void;
};

export function TourIntroStep({ onContinue }: TourIntroStepProps) {
  const tour = bookingPrototypeTour;

  return (
    <section className="relative flex min-h-[100dvh] flex-col">
      <div className="relative flex min-h-[78dvh] flex-1 flex-col justify-end overflow-hidden sm:min-h-[82dvh]">
        <div className="book-hero-stage" aria-hidden="true">
          {tour.heroGallery.map((slide) => (
            <div key={slide.src} className="book-hero-layer">
              <img src={slide.src} alt="" />
            </div>
          ))}
        </div>

        {/* Soft luminous wash — keep the Mediterranean bright */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/70 via-[var(--book-ink)]/25 to-[var(--book-ink)]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--book-ink)]/35 via-transparent to-transparent" />

        <div className="book-hero-copy relative z-10 mx-auto w-full max-w-5xl px-6 pb-14 pt-28 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24">
          <p className="mb-5 text-[11px] font-medium tracking-[0.28em] text-white/80 uppercase sm:mb-6 sm:text-xs">
            {tour.experienceLabel}
          </p>

          <h1 className="book-display max-w-3xl text-[3.25rem] font-medium leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <span className="sr-only">{tour.name}</span>
            {tour.experienceTitleLines.map((line) => (
              <span key={line} className="block" aria-hidden="true">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/90 sm:mt-8 sm:text-xl sm:leading-8">
            {tour.experienceSubheading}
          </p>
        </div>
      </div>

      <div className="relative z-10 bg-[var(--book-surface)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-12">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
            {tour.reassurance.map((item) => (
              <li
                key={item}
                className="book-reassure-item flex items-center gap-2 text-[13px] tracking-wide text-[var(--book-ink)]/75 sm:text-sm"
              >
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-[var(--book-gold)]"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="w-full shrink-0 sm:max-w-xs lg:w-auto lg:min-w-[17rem]">
            <BookingPrimaryButton onClick={onContinue}>
              {tour.ctaLabel}
            </BookingPrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
