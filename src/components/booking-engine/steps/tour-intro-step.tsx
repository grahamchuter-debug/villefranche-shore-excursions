"use client";

import { useEffect, useRef } from "react";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { bookingPrototypeTour } from "@/lib/booking/booking-config";
import { siteConfig } from "@/lib/site-config";

type TourIntroStepProps = {
  onContinue: () => void;
  isExiting?: boolean;
};

export function TourIntroStep({
  onContinue,
  isExiting = false,
}: TourIntroStepProps) {
  const tour = bookingPrototypeTour;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isExiting) buttonRef.current?.focus({ preventScroll: true });
  }, [isExiting]);

  return (
    <section
      className={[
        "book-opening relative flex min-h-[100dvh] flex-col",
        isExiting ? "book-hero-exiting" : "",
      ].join(" ")}
      aria-hidden={isExiting || undefined}
    >
      <div className="book-hero-panel relative flex min-h-[100dvh] flex-1 flex-col justify-end overflow-hidden">
        <div className="book-hero-stage" aria-hidden="true">
          {tour.heroGallery.map((slide) => (
            <div key={slide.src} className="book-hero-layer">
              <img src={slide.src} alt="" />
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/80 via-[var(--book-ink)]/30 to-[var(--book-ink)]/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--book-ink)]/40 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="book-hero-copy relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-32 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24">
          <p className="book-opening-brand book-display mb-7 max-w-2xl text-3xl font-medium leading-[1.05] text-white sm:mb-9 sm:text-4xl md:text-5xl lg:text-[3.35rem]">
            {siteConfig.name}
          </p>

          <h1 className="book-display max-w-3xl text-[2.75rem] font-medium leading-[0.98] text-white/95 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            <span className="sr-only">{tour.name}</span>
            {tour.experienceTitleLines.map((line) => (
              <span key={line} className="block" aria-hidden="true">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/88 sm:mt-8 sm:text-xl sm:leading-8">
            {tour.experienceSubheading}
          </p>

          <div className="book-opening-cta mt-10 w-full max-w-xs sm:mt-12">
            <BookingPrimaryButton
              ref={buttonRef}
              variant="onDark"
              onClick={onContinue}
              disabled={isExiting}
            >
              {tour.ctaLabel}
            </BookingPrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
