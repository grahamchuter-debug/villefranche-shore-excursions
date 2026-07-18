"use client";

import { useEffect, useId, useRef, useState } from "react";

import { BookingCheckoutTrust } from "@/components/booking-engine/booking-checkout-trust";
import {
  BookingPrimaryButton,
} from "@/components/booking-engine/booking-primary-button";
import { BookingReconnectMoment } from "@/components/booking-engine/booking-reconnect-moment";
import { CruiseDaySummary } from "@/components/booking-engine/cruise-day-summary";
import { CruiseReassurance } from "@/components/booking-engine/cruise-reassurance";
import {
  bookingCheckoutCopy,
  bookingPrototypeTour,
} from "@/lib/booking/booking-config";
import type { BookingShipVisit } from "@/lib/booking/booking-ship-types";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type PaymentStepProps = {
  date: string;
  guests: number;
  cruiseShip: BookingShipVisit;
  onPay: () => void;
  onBack: () => void;
  onChangeDate?: () => void;
  onChangeShip?: () => void;
  onChangeGuests?: () => void;
  /** When false, payment CTA is blocked (e.g. capacity / selection invalid). */
  canPay?: boolean;
};

type GuestDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

type FieldErrors = Partial<Record<keyof GuestDetails, string>>;

const inputClass =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-base text-[var(--book-ink)] outline-none transition focus:border-[var(--book-sea)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-[var(--book-sea)]"
    >
      <rect
        x="2.75"
        y="5.75"
        width="18.5"
        height="12.5"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PaymentStep({
  date,
  guests,
  cruiseShip,
  onPay,
  onBack,
  onChangeDate,
  onChangeShip,
  onChangeGuests,
  canPay = true,
}: PaymentStepProps) {
  const formId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [details, setDetails] = useState<GuestDetails>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  const total = formatBookingMoney(calculateBookingTotal(guests));
  const copy = bookingCheckoutCopy;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const validate = (next: GuestDetails): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (!next.firstName.trim()) nextErrors.firstName = "Enter your first name.";
    if (!next.lastName.trim()) nextErrors.lastName = "Enter your last name.";
    if (!next.email.trim()) nextErrors.email = "Enter your email address.";
    else if (!isValidEmail(next.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  };

  const handlePay = () => {
    if (!canPay) return;
    setAttempted(true);
    const nextErrors = validate(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsPaying(true);
    window.setTimeout(() => {
      onPay();
    }, 900);
  };

  const updateField = (key: keyof GuestDetails, value: string) => {
    const next = { ...details, [key]: value };
    setDetails(next);
    if (attempted) setErrors(validate(next));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-14 sm:space-y-16 lg:space-y-20">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <h2
          ref={headingRef}
          tabIndex={-1}
          id="booking-payment-heading"
          className="book-display text-4xl font-medium tracking-[-0.02em] text-[var(--book-ink)] outline-none sm:text-5xl"
        >
          {copy.heading}
        </h2>
        <p className="text-lg text-[var(--book-muted)]">{copy.supportingLine}</p>
      </header>

      <CruiseDaySummary
        date={date}
        guests={guests}
        cruiseShip={cruiseShip}
        heading={copy.cruiseDayHeading}
        onChangeDate={onChangeDate}
        onChangeShip={onChangeShip}
        onChangeGuests={onChangeGuests}
      />

      <CruiseReassurance />

      <BookingReconnectMoment />

      <section
        className="book-checkout-enter space-y-8"
        aria-labelledby="booking-payment-heading"
      >
        <p className="text-center text-[15px] text-[var(--book-muted)] sm:text-left">
          <span className="sr-only">Booking summary: </span>
          {bookingPrototypeTour.experienceName} · {cruiseShip.name} ·{" "}
          {formatBookingDate(date)} · {guests}{" "}
          {guests === 1 ? "guest" : "guests"} · {total}
        </p>

        <div className="rounded-[1.75rem] border border-[var(--book-line)]/80 bg-[var(--book-surface)] p-6 sm:p-9">
          <fieldset className="space-y-4 border-0 p-0">
            <legend className="mb-1 text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
              Your details
            </legend>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${formId}-firstName`}
                  className="mb-1.5 block text-sm text-[var(--book-muted)]"
                >
                  First name
                </label>
                <input
                  id={`${formId}-firstName`}
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={details.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={
                    errors.firstName ? `${formId}-firstName-error` : undefined
                  }
                  className={`${inputClass} ${errors.firstName ? "border-red-500" : "border-[var(--book-line)]"}`}
                />
                {errors.firstName ? (
                  <p
                    id={`${formId}-firstName-error`}
                    className="mt-1.5 text-sm text-red-700"
                    role="alert"
                  >
                    {errors.firstName}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor={`${formId}-lastName`}
                  className="mb-1.5 block text-sm text-[var(--book-muted)]"
                >
                  Last name
                </label>
                <input
                  id={`${formId}-lastName`}
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={details.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={
                    errors.lastName ? `${formId}-lastName-error` : undefined
                  }
                  className={`${inputClass} ${errors.lastName ? "border-red-500" : "border-[var(--book-line)]"}`}
                />
                {errors.lastName ? (
                  <p
                    id={`${formId}-lastName-error`}
                    className="mt-1.5 text-sm text-red-700"
                    role="alert"
                  >
                    {errors.lastName}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor={`${formId}-email`}
                className="mb-1.5 block text-sm text-[var(--book-muted)]"
              >
                Email address
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={details.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={`${formId}-email-hint${errors.email ? ` ${formId}-email-error` : ""}`}
                className={`${inputClass} ${errors.email ? "border-red-500" : "border-[var(--book-line)]"}`}
              />
              <p
                id={`${formId}-email-hint`}
                className="mt-1.5 text-sm text-[var(--book-muted)]"
              >
                For your confirmation and voucher.
              </p>
              {errors.email ? (
                <p
                  id={`${formId}-email-error`}
                  className="mt-1.5 text-sm text-red-700"
                  role="alert"
                >
                  {errors.email}
                </p>
              ) : null}
            </div>
          </fieldset>

          <div className="mt-8 border-t border-[var(--book-line)] pt-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
                  Total
                </p>
                <p className="book-display mt-1 text-4xl font-medium text-[var(--book-ink)]">
                  {total}
                </p>
              </div>
              <p className="text-sm text-[var(--book-muted)]">
                {guests} ×{" "}
                {formatBookingMoney(calculateBookingTotal(1))}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
                {copy.securePaymentHeading}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--book-muted)]">
                {copy.securePaymentNote}
              </p>
            </div>

            <div
              className="flex items-center gap-4 rounded-2xl border border-[var(--book-line)] bg-[var(--book-mist)]/60 px-5 py-4 sm:px-6 sm:py-5"
              role="status"
            >
              <CardIcon />
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[var(--book-ink)] sm:text-base">
                  {copy.paymentMethodLabel}
                </p>
                <p className="mt-0.5 text-sm text-[var(--book-muted)]">
                  {copy.paymentProviderNote}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {!canPay ? (
              <p className="text-center text-sm text-red-700 sm:text-left" role="alert">
                Review your date, ship, and guests before continuing to payment.
              </p>
            ) : null}
            <BookingPrimaryButton
              onClick={handlePay}
              disabled={isPaying || !canPay}
            >
              {isPaying ? copy.payingLabel : copy.payButtonLabel}
            </BookingPrimaryButton>
            <BookingPrimaryButton
              variant="ghost"
              onClick={onBack}
              disabled={isPaying}
            >
              Back
            </BookingPrimaryButton>
          </div>
        </div>
      </section>

      <BookingCheckoutTrust />
    </div>
  );
}
