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
  "w-full rounded-xl border border-[var(--book-line)] bg-white px-4 py-3.5 text-base text-[var(--book-ink)] outline-none focus:border-[var(--book-sea)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]";

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
    <div className="mx-auto max-w-3xl space-y-12">
      {isDevelopment ? (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-950"
          role="status"
        >
          Prototype complete — no payment has been taken.
        </p>
      ) : null}

      <section className="overflow-hidden rounded-[1.75rem] bg-[var(--book-surface)] text-center shadow-[0_30px_80px_-40px_rgba(12,26,36,0.4)]">
        <div className="relative min-h-[14rem] overflow-hidden sm:min-h-[18rem]">
          <img
            src={bookingPrototypeTour.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--book-ink)]/55" />
          <div className="relative flex h-full min-h-[14rem] flex-col items-center justify-center px-6 py-12 text-white sm:min-h-[18rem] sm:px-10">
            <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase">
              Reserved for you
            </p>
            <h2 className="book-display max-w-xl text-3xl font-medium leading-tight sm:text-5xl">
              Your Riviera day awaits
            </h2>
            <p className="mt-5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              {bookingReference}
            </p>
          </div>
        </div>

        <div className="space-y-8 px-6 py-10 text-left sm:px-10">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Tour
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {bookingPrototypeTour.name}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Date
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {formatBookingDate(date)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.14em] text-[var(--book-muted)] uppercase">
                Total
              </dt>
              <dd className="mt-1 font-medium text-[var(--book-ink)]">
                {formatBookingMoney(calculateBookingTotal(guests))} · {guests}{" "}
                {guests === 1 ? "guest" : "guests"}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl bg-[var(--book-mist)] px-5 py-6">
            <h3 className="book-display text-2xl font-medium text-[var(--book-ink)]">
              What happens next
            </h3>
            <ol className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--book-muted)]">
              <li>We prepare your meeting details for the tender landing.</li>
              <li>
                Closer to port day, you receive exact meeting instructions.
              </li>
              <li>
                On the day, your guide meets you ashore and returns you with
                time for your ship.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-[var(--book-line)] bg-[var(--book-surface)] p-6 sm:p-8">
        <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
          Optional · after booking
        </p>
        <h3 className="book-display mt-2 text-2xl font-medium text-[var(--book-ink)] sm:text-3xl">
          Tell us about your cruise
        </h3>
        <p className="mt-2 max-w-xl text-[15px] leading-7 text-[var(--book-muted)]">
          Not part of payment — simply helps us prepare meeting and return
          timing.
        </p>

        {cruiseSaved ? (
          <div
            className="mt-6 rounded-xl bg-[var(--book-success)]/10 px-4 py-4 text-[var(--book-success)]"
            role="status"
          >
            <p className="font-medium">Thank you — cruise details noted.</p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleCruiseSubmit}>
            <div>
              <label
                htmlFor={`${formId}-ship`}
                className="mb-1.5 block text-sm text-[var(--book-muted)]"
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${formId}-mobile`}
                  className="mb-1.5 block text-sm text-[var(--book-muted)]"
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
                  className="mb-1.5 block text-sm text-[var(--book-muted)]"
                >
                  WhatsApp{" "}
                  <span className="font-normal">(optional)</span>
                </label>
                <input
                  id={`${formId}-whatsapp`}
                  name="whatsapp"
                  type="tel"
                  placeholder="If different"
                  className={fieldClass}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor={`${formId}-requirements`}
                className="mb-1.5 block text-sm text-[var(--book-muted)]"
              >
                Special requirements
              </label>
              <textarea
                id={`${formId}-requirements`}
                name="requirements"
                rows={3}
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

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <div className="sm:w-56">
          <BookingPrimaryButton variant="secondary" onClick={onBookAgain}>
            Book another date
          </BookingPrimaryButton>
        </div>
        <Link
          href={bookingPrototypeTour.path}
          className="inline-flex items-center justify-center px-6 py-4 text-[15px] font-medium text-[var(--book-sea)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
        >
          Back to tour
        </Link>
      </div>
    </div>
  );
}
