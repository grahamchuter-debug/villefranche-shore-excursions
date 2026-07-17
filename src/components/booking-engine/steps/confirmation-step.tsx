"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { bookingPrototypeTour } from "@/lib/booking/booking-config";
import {
  formatBookingDate,
  formatBookingMoney,
  calculateBookingTotal,
} from "@/lib/booking/booking-format";

type ConfirmationStepProps = {
  bookingReference: string;
  date: string;
  guests: number;
  onBookAgain: () => void;
};

const fieldClass =
  "w-full rounded-2xl border border-[var(--book-line)] bg-white px-4 py-4 text-base text-[var(--book-ink)] outline-none focus:border-[var(--book-sea)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]";

const isDevelopment = process.env.NODE_ENV === "development";

export function ConfirmationStep({
  bookingReference,
  date,
  guests,
  onBookAgain,
}: ConfirmationStepProps) {
  const formId = useId();
  const [cruiseSaved, setCruiseSaved] = useState(false);

  const handleCruiseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCruiseSaved(true);
  };

  return (
    <div className="space-y-10">
      {isDevelopment ? (
        <p
          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-950"
          role="status"
        >
          Prototype complete — no payment has been taken.
        </p>
      ) : null}

      <section className="overflow-hidden rounded-3xl bg-[var(--book-surface)] text-center shadow-[0_20px_50px_-28px_rgba(19,34,56,0.35)]">
        <div className="bg-gradient-to-br from-[var(--book-sea)] to-[var(--book-sea-deep)] px-5 py-10 text-white sm:px-8 sm:py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/75">
            You&apos;re booked
          </p>
          <h2 className="book-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Your French Riviera day is reserved
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-white/85">
            Monaco, Monte Carlo and Eze — a small-group day designed around your
            cruise call.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            Reference {bookingReference}
          </p>
        </div>

        <div className="space-y-5 px-5 py-8 text-left sm:px-8">
          <dl className="space-y-3 text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--book-muted)]">Tour</dt>
              <dd className="max-w-[60%] text-right font-semibold text-[var(--book-ink)]">
                {bookingPrototypeTour.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--book-muted)]">Date</dt>
              <dd className="text-right font-semibold text-[var(--book-ink)]">
                {formatBookingDate(date)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--book-muted)]">Guests</dt>
              <dd className="text-right font-semibold text-[var(--book-ink)]">
                {guests}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-[var(--book-line)] pt-3">
              <dt className="text-[var(--book-muted)]">Total</dt>
              <dd className="text-right font-semibold text-[var(--book-ink)]">
                {formatBookingMoney(calculateBookingTotal(guests))}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl bg-[var(--book-mist)] px-4 py-5">
            <h3 className="text-lg font-semibold text-[var(--book-ink)]">
              What happens next
            </h3>
            <ol className="mt-3 space-y-3 text-base leading-7 text-[var(--book-muted)]">
              <li>
                <span className="font-semibold text-[var(--book-ink)]">1.</span>{" "}
                We prepare your meeting details for the tender landing.
              </li>
              <li>
                <span className="font-semibold text-[var(--book-ink)]">2.</span>{" "}
                Closer to port day, you receive your exact meeting instructions.
              </li>
              <li>
                <span className="font-semibold text-[var(--book-ink)]">3.</span>{" "}
                On the day, your guide meets you ashore and brings you back with
                time for your ship.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--book-line)] bg-[var(--book-surface)] p-5 sm:p-8">
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--book-muted)]">
            Optional · after booking
          </p>
          <h3 className="book-display mt-2 text-2xl font-semibold text-[var(--book-ink)] sm:text-3xl">
            Tell us about your cruise
          </h3>
          <p className="mt-2 max-w-xl text-base leading-7 text-[var(--book-muted)]">
            This is not part of payment. It simply helps us prepare your
            meeting point and return timing.
          </p>
        </div>

        {cruiseSaved ? (
          <div
            className="mt-6 rounded-2xl bg-[var(--book-success)]/10 px-4 py-5 text-[var(--book-success)]"
            role="status"
          >
            <p className="font-semibold">Thank you — cruise details noted.</p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleCruiseSubmit}>
            <div>
              <label
                htmlFor={`${formId}-ship`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
              >
                Ship
              </label>
              <input
                id={`${formId}-ship`}
                name="ship"
                type="text"
                placeholder="e.g. Celebrity Edge"
                className={fieldClass}
              />
            </div>
            <div>
              <label
                htmlFor={`${formId}-mobile`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
              >
                Mobile number
              </label>
              <input
                id={`${formId}-mobile`}
                name="mobile"
                type="tel"
                placeholder="Including country code"
                className={fieldClass}
              />
            </div>
            <div>
              <label
                htmlFor={`${formId}-whatsapp`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
              >
                WhatsApp{" "}
                <span className="font-normal">(optional)</span>
              </label>
              <input
                id={`${formId}-whatsapp`}
                name="whatsapp"
                type="tel"
                placeholder="If different from mobile"
                className={fieldClass}
              />
            </div>
            <div>
              <label
                htmlFor={`${formId}-requirements`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
              >
                Special requirements
              </label>
              <textarea
                id={`${formId}-requirements`}
                name="requirements"
                rows={4}
                placeholder="Mobility needs, celebration, timing notes…"
                className={`${fieldClass} resize-y`}
              />
            </div>
            <BookingPrimaryButton type="submit" variant="secondary">
              Save cruise details
            </BookingPrimaryButton>
          </form>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <BookingPrimaryButton variant="secondary" onClick={onBookAgain}>
          Book another date
        </BookingPrimaryButton>
        <Link
          href={bookingPrototypeTour.path}
          className="inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold text-[var(--book-sea)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)] sm:text-lg"
        >
          Back to tour page
        </Link>
      </div>
    </div>
  );
}
