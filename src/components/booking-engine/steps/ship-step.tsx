"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { bookingContactPath } from "@/lib/booking/booking-config";
import { formatBookingDate } from "@/lib/booking/booking-format";
import {
  formatVerifiedShipTimingLine,
  type BookingShipVisit,
} from "@/lib/booking/booking-ship-types";

type ShipStepProps = {
  date: string;
  ships: readonly BookingShipVisit[];
  selectedShip: BookingShipVisit | null;
  onSelectShip: (ship: BookingShipVisit) => void;
  onContinue: () => void;
  onBack: () => void;
};

function ShipCardButton({
  ship,
  selected,
  onSelect,
}: {
  ship: BookingShipVisit;
  selected: boolean;
  onSelect: () => void;
}) {
  const timing = formatVerifiedShipTimingLine(ship);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "book-btn flex w-full flex-col items-start rounded-[1.25rem] border px-5 py-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] sm:px-6",
        selected
          ? "border-[var(--book-sea-deep)] bg-[var(--book-sea-deep)] text-white shadow-[0_16px_40px_-28px_rgba(13,47,60,0.55)]"
          : "border-[var(--book-line)] bg-[var(--book-surface)] text-[var(--book-ink)] hover:border-[var(--book-ink)]/20",
      ].join(" ")}
    >
      <span className="text-lg font-semibold tracking-wide">{ship.name}</span>
      <span
        className={[
          "mt-1 text-sm",
          selected ? "text-white/75" : "text-[var(--book-muted)]",
        ].join(" ")}
      >
        {ship.cruiseLine}
      </span>
      {timing ? (
        <span
          className={[
            "mt-2 text-sm",
            selected ? "text-white/80" : "text-[var(--book-muted)]",
          ].join(" ")}
        >
          {timing}
        </span>
      ) : null}
      {selected ? (
        <span className="mt-4 text-[11px] font-medium tracking-[0.14em] text-white/80 uppercase">
          Selected for your cruise day ✓
        </span>
      ) : null}
    </button>
  );
}

function ShipFeatureButton({
  ship,
  onSelect,
}: {
  ship: BookingShipVisit;
  onSelect: () => void;
}) {
  const image = ship.image;
  const timing = formatVerifiedShipTimingLine(ship);
  if (!image) return null;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed="true"
      aria-label={`${ship.name}, ${ship.cruiseLine}, selected for your cruise day`}
      className="book-ship-feature group relative w-full overflow-hidden rounded-[1.5rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
    >
      <div className="relative min-h-[14rem] sm:min-h-[17rem]">
        <picture>
          {image.avifSrcSet ? (
            <source
              type="image/avif"
              srcSet={image.avifSrcSet}
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          ) : null}
          <source
            type="image/webp"
            srcSet={image.srcSet}
            sizes="(max-width: 768px) 100vw, 42rem"
          />
          <img
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            className="book-ship-feature-image absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--book-ink)]/85 via-[var(--book-ink)]/45 to-[var(--book-ink)]/15"
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-[14rem] flex-col justify-end px-6 py-7 sm:min-h-[17rem] sm:px-8 sm:py-8">
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/70 uppercase">
            Your cruise
          </p>
          <p className="book-display mt-2 text-3xl font-medium leading-tight text-white sm:text-4xl">
            {ship.name}
          </p>
          <p className="mt-2 text-[15px] text-white/85">{ship.cruiseLine}</p>
          {timing ? (
            <p className="mt-3 text-sm text-white/75">{timing}</p>
          ) : null}
          <p
            className={[
              "text-[12px] font-medium tracking-[0.12em] text-white/90 uppercase",
              timing ? "mt-5" : "mt-6",
            ].join(" ")}
          >
            Selected for your cruise day ✓
          </p>
        </div>
      </div>
    </button>
  );
}

export function ShipStep({
  date,
  ships,
  selectedShip,
  onSelectShip,
  onContinue,
  onBack,
}: ShipStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const singleShip = ships.length === 1;
  const canContinue = Boolean(selectedShip);
  const didAutoSelect = useRef(false);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    didAutoSelect.current = false;
  }, [date]);

  useEffect(() => {
    if (!singleShip || !ships[0] || didAutoSelect.current) return;
    if (selectedShip?.slug === ships[0].slug) {
      didAutoSelect.current = true;
      return;
    }
    didAutoSelect.current = true;
    onSelectShip(ships[0]);
  }, [singleShip, ships, selectedShip, onSelectShip]);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-3 text-center">
        <h2
          ref={headingRef}
          tabIndex={-1}
          id="booking-ship-heading"
          className="book-display text-4xl font-medium text-[var(--book-ink)] outline-none sm:text-5xl"
        >
          Which cruise ship?
        </h2>
        <p className="text-lg text-[var(--book-muted)]">
          Ships visiting Villefranche on {formatBookingDate(date)}.
        </p>
      </header>

      {ships.length === 0 ? (
        <div className="rounded-[1.75rem] bg-[var(--book-surface)] px-6 py-10 text-center shadow-[0_24px_60px_-36px_rgba(12,26,36,0.3)] sm:px-10">
          <p className="text-base leading-7 text-[var(--book-muted)]">
            No cruise ships are listed for this date in our published schedule
            yet. Please choose another date, or contact our cruise excursion
            team for help.
          </p>
          <p className="mt-5">
            <Link
              href={bookingContactPath}
              className="font-medium text-[var(--book-sea)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
            >
              Contact us
            </Link>
          </p>
        </div>
      ) : (
        <fieldset className="space-y-3 border-0 p-0">
          <legend className="sr-only">Cruise ship</legend>
          {ships.map((ship) => {
            const selected = selectedShip?.slug === ship.slug;
            const showFeature = selected && Boolean(ship.image);

            if (showFeature) {
              return (
                <ShipFeatureButton
                  key={ship.slug}
                  ship={ship}
                  onSelect={() => onSelectShip(ship)}
                />
              );
            }

            return (
              <ShipCardButton
                key={ship.slug}
                ship={ship}
                selected={selected}
                onSelect={() => onSelectShip(ship)}
              />
            );
          })}
        </fieldset>
      )}

      {ships.length > 1 && !selectedShip ? (
        <p className="text-center text-sm text-[var(--book-muted)]" role="status">
          Please select your cruise ship to continue.
        </p>
      ) : null}

      <div className="mx-auto max-w-md space-y-3">
        <BookingPrimaryButton onClick={onContinue} disabled={!canContinue}>
          Continue to Guests
        </BookingPrimaryButton>
        <BookingPrimaryButton variant="ghost" onClick={onBack}>
          Back
        </BookingPrimaryButton>
      </div>
    </div>
  );
}
