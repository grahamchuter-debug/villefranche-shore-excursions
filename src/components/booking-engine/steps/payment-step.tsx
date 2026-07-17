"use client";

import { useId, useState } from "react";

import { BookingPrimaryButton } from "@/components/booking-engine/booking-primary-button";
import { bookingPaymentMethods } from "@/lib/booking/booking-config";
import {
  calculateBookingTotal,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type PaymentStepProps = {
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
  "w-full rounded-2xl border bg-white px-4 py-4 text-base text-[var(--book-ink)] outline-none transition focus:border-[var(--book-sea)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function PaymentStep({ guests, onPay, onBack }: PaymentStepProps) {
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

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center sm:text-left">
        <h2 className="book-display text-3xl font-semibold text-[var(--book-ink)] sm:text-4xl">
          Secure payment
        </h2>
        <p className="text-lg leading-8 text-[var(--book-muted)]">
          Enter your details, then choose how you&apos;d like to pay.
        </p>
      </header>

      <div className="rounded-3xl bg-[var(--book-surface)] p-5 shadow-[0_20px_50px_-28px_rgba(19,34,56,0.35)] sm:p-7">
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-[var(--book-mist)] px-4 py-4">
          <span className="text-base text-[var(--book-muted)]">Total due</span>
          <span className="book-display text-3xl font-semibold text-[var(--book-ink)]">
            {total}
          </span>
        </div>

        <fieldset className="mb-6 space-y-4 border-0 p-0">
          <legend className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--book-muted)]">
            Your details
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${formId}-firstName`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
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
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
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
              className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
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
              className="mt-1.5 text-sm leading-6 text-[var(--book-muted)]"
            >
              We&apos;ll use this email for your booking confirmation and receipt.
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

        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--book-muted)]">
          Pay with
        </p>
        <div
          className="mb-6 flex flex-wrap gap-2"
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
                  "rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]",
                  selected
                    ? "border-[var(--book-sea-deep)] bg-[var(--book-sea-deep)] text-white"
                    : "border-[var(--book-line)] bg-white text-[var(--book-ink)] hover:bg-[var(--book-mist)]",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {(method === "visa" || method === "mastercard") && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor={`${formId}-card`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
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
                  className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
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
                  className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
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
            <div>
              <label
                htmlFor={`${formId}-cardName`}
                className="mb-1.5 block text-sm font-medium text-[var(--book-muted)]"
              >
                Name on card
              </label>
              <input
                id={`${formId}-cardName`}
                type="text"
                placeholder="As shown on card"
                autoComplete="off"
                className={`${inputClass} border-[var(--book-line)]`}
              />
            </div>
          </div>
        )}

        {method === "apple-pay" ||
        method === "google-pay" ||
        method === "paypal" ? (
          <div className="rounded-2xl border border-dashed border-[var(--book-line)] bg-[var(--book-mist)] px-4 py-8 text-center">
            <p className="text-base font-medium text-[var(--book-ink)]">
              Continue with{" "}
              {bookingPaymentMethods.find((m) => m.id === method)?.label}
            </p>
            <p className="mt-2 text-sm text-[var(--book-muted)]">
              Confirm below to complete this step with your selected method.
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <BookingPrimaryButton onClick={handlePay} disabled={isPaying}>
          {isPaying ? "Confirming…" : `Pay ${total} securely`}
        </BookingPrimaryButton>
        <BookingPrimaryButton variant="ghost" onClick={onBack} disabled={isPaying}>
          Back
        </BookingPrimaryButton>
      </div>
    </div>
  );
}
