"use client";

import { useId, useState } from "react";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import {
  bookingPaymentMethods,
  bookingPricingConfig,
  bookingPrototypeTour,
} from "@/lib/booking/booking-config";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type PaymentStepProps = {
  date: string;
  guests: number;
  onPay: () => void;
  onBack: () => void;
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

export function PaymentStep({
  date,
  guests,
  onPay,
  onBack,
}: PaymentStepProps) {
  const formId = useId();
  const [method, setMethod] = useState<string>("visa");
  const [isPaying, setIsPaying] = useState(false);
  const [details, setDetails] = useState<GuestDetails>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  const total = formatBookingMoney(calculateBookingTotal(guests));

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

  const summaryRows = [
    { label: "Tour", value: bookingPrototypeTour.name },
    { label: "Date", value: formatBookingDate(date) },
    {
      label: "Guests",
      value: `${guests} ${guests === 1 ? "guest" : "guests"}`,
    },
  ] as const;

  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="space-y-3 text-center lg:text-left">
        <h2 className="book-display text-4xl font-medium text-[var(--book-ink)] sm:text-5xl">
          Complete your booking
        </h2>
        <p className="text-lg text-[var(--book-muted)]">
          A few details, then you&apos;re finished.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
        <aside className="rounded-[1.5rem] bg-[var(--book-surface)] p-6 shadow-[0_24px_60px_-36px_rgba(12,26,36,0.3)] sm:p-8 lg:sticky lg:top-6">
          <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--book-gold)] uppercase">
            Your reservation
          </p>
          <dl className="mt-5 space-y-4">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-[var(--book-line)] pb-4"
              >
                <dt className="text-sm text-[var(--book-muted)]">{row.label}</dt>
                <dd className="max-w-[65%] text-right text-[15px] font-medium text-[var(--book-ink)]">
                  {row.value}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 pt-1">
              <dt className="text-sm text-[var(--book-muted)]">Total</dt>
              <dd className="book-display text-3xl font-medium text-[var(--book-ink)]">
                {total}
              </dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-3">
            <li className="flex gap-2.5 text-sm text-[var(--book-ink)]/80">
              <span aria-hidden="true" className="text-[var(--book-success)]">
                ✓
              </span>
              <span>
                <span className="font-medium text-[var(--book-ink)]">
                  {bookingPricingConfig.freeCancellationLabel}
                </span>
                <span className="block text-[var(--book-muted)]">
                  {bookingPricingConfig.freeCancellationDetail}
                </span>
              </span>
            </li>
            <li className="flex gap-2.5 text-sm text-[var(--book-ink)]/80">
              <span aria-hidden="true" className="text-[var(--book-success)]">
                ✓
              </span>
              <span>
                <span className="font-medium text-[var(--book-ink)]">
                  {bookingPricingConfig.returnGuaranteeLabel}
                </span>
                <span className="block text-[var(--book-muted)]">
                  {bookingPricingConfig.returnGuaranteeDetail}
                </span>
              </span>
            </li>
          </ul>
        </aside>

        <div className="rounded-[1.5rem] bg-[var(--book-surface)] p-6 shadow-[0_24px_60px_-36px_rgba(12,26,36,0.3)] sm:p-8">
          <fieldset className="space-y-4 border-0 p-0">
            <legend className="mb-1 text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
              Guest details
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
                Email
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
                For your confirmation and receipt.
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

          <div className="mt-7">
            <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-[var(--book-muted)] uppercase">
              Pay with
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Payment method"
            >
              {bookingPaymentMethods.map((item) => {
                const selected = method === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id)}
                    aria-pressed={selected}
                    className={[
                      "rounded-full border px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]",
                      selected
                        ? "border-[var(--book-sea-deep)] bg-[var(--book-sea-deep)] text-white"
                        : "border-[var(--book-line)] bg-white text-[var(--book-ink)] hover:border-[var(--book-ink)]/25",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(method === "visa" || method === "mastercard") && (
            <div className="mt-5 space-y-3">
              <div>
                <label
                  htmlFor={`${formId}-card`}
                  className="mb-1.5 block text-sm text-[var(--book-muted)]"
                >
                  Card number
                </label>
                <input
                  id={`${formId}-card`}
                  type="text"
                  inputMode="numeric"
                  placeholder="•••• •••• •••• ••••"
                  autoComplete="off"
                  className={`${inputClass} border-[var(--book-line)]`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`${formId}-expiry`}
                    className="mb-1.5 block text-sm text-[var(--book-muted)]"
                  >
                    Expiry
                  </label>
                  <input
                    id={`${formId}-expiry`}
                    type="text"
                    placeholder="MM / YY"
                    autoComplete="off"
                    className={`${inputClass} border-[var(--book-line)]`}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${formId}-cvc`}
                    className="mb-1.5 block text-sm text-[var(--book-muted)]"
                  >
                    CVC
                  </label>
                  <input
                    id={`${formId}-cvc`}
                    type="text"
                    placeholder="•••"
                    autoComplete="off"
                    className={`${inputClass} border-[var(--book-line)]`}
                  />
                </div>
              </div>
            </div>
          )}

          {method === "apple-pay" ||
          method === "google-pay" ||
          method === "paypal" ? (
            <div className="mt-5 rounded-xl bg-[var(--book-mist)] px-4 py-6 text-center text-sm text-[var(--book-muted)]">
              Continue below with{" "}
              {bookingPaymentMethods.find((m) => m.id === method)?.label}.
            </div>
          ) : null}

          <div className="mt-8 space-y-3">
            <BookingPrimaryButton onClick={handlePay} disabled={isPaying}>
              {isPaying ? "Confirming…" : `Pay ${total}`}
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
      </div>
    </div>
  );
}
