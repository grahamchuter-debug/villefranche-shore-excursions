"use client";

import { useEffect, useState } from "react";

import { BookingProgress } from "@/components/booking-engine/booking-progress";
import { ConfirmationStep } from "@/components/booking-engine/steps/confirmation-step";
import { DateStep } from "@/components/booking-engine/steps/date-step";
import { GuestsStep } from "@/components/booking-engine/steps/guests-step";
import { PaymentStep } from "@/components/booking-engine/steps/payment-step";
import { SummaryStep } from "@/components/booking-engine/steps/summary-step";
import { TourIntroStep } from "@/components/booking-engine/steps/tour-intro-step";
import {
  bookingCapacityConfig,
  bookingCheckoutGuestLimit,
  bookingPrototypeTour,
  bookingSessionStorageKey,
  type BookingStepId,
} from "@/lib/booking/booking-config";
import { createPrototypeBookingReference } from "@/lib/booking/booking-format";

type BookingState = {
  step: BookingStepId;
  date: string | null;
  guests: number;
  bookingReference: string | null;
};

const LEGACY_STORAGE_KEY = "vf-booking-prototype-v1";
const STORAGE_KEY = bookingSessionStorageKey(bookingPrototypeTour.id);

function loadState(): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    // Drop the unscoped legacy key so drafts never cross tour routes.
    window.sessionStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingState;
    if (
      typeof parsed.guests === "number" &&
      (parsed.guests < bookingCapacityConfig.minGuests ||
        parsed.guests > bookingCheckoutGuestLimit)
    ) {
      parsed.guests = Math.min(
        bookingCheckoutGuestLimit,
        Math.max(bookingCapacityConfig.minGuests, parsed.guests),
      );
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: BookingState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private mode
  }
}

const initialState: BookingState = {
  step: "tour",
  date: null,
  guests: 2,
  bookingReference: null,
};

export function BookingEngine() {
  const [state, setState] = useState<BookingState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadState();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.step, hydrated]);

  const go = (step: BookingStepId) =>
    setState((prev) => ({ ...prev, step }));

  const reset = () => {
    setState(initialState);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handlePay = () => {
    setState((prev) => ({
      ...prev,
      step: "confirmed",
      bookingReference: createPrototypeBookingReference(),
    }));
  };

  if (!hydrated) {
    return (
      <div
        className="mx-auto max-w-xl px-4 py-20 text-center text-[var(--book-muted)]"
        aria-live="polite"
      >
        Preparing your booking…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <BookingProgress current={state.step} />
      </div>

      {state.step === "tour" ? (
        <TourIntroStep onContinue={() => go("date")} />
      ) : null}

      {state.step === "date" ? (
        <DateStep
          selectedDate={state.date}
          onSelectDate={(date) => setState((prev) => ({ ...prev, date }))}
          onContinue={() => {
            if (state.date) go("guests");
          }}
          onBack={() => go("tour")}
        />
      ) : null}

      {state.step === "guests" ? (
        <GuestsStep
          guests={state.guests}
          onChangeGuests={(guests) =>
            setState((prev) => ({
              ...prev,
              guests: Math.min(
                bookingCheckoutGuestLimit,
                Math.max(bookingCapacityConfig.minGuests, guests),
              ),
            }))
          }
          onContinue={() => go("summary")}
          onBack={() => go("date")}
        />
      ) : null}

      {state.step === "summary" && state.date ? (
        <SummaryStep
          date={state.date}
          guests={state.guests}
          onContinue={() => go("payment")}
          onBack={() => go("guests")}
        />
      ) : null}

      {state.step === "payment" ? (
        <PaymentStep
          guests={state.guests}
          onPay={handlePay}
          onBack={() => go("summary")}
        />
      ) : null}

      {state.step === "confirmed" &&
      state.date &&
      state.bookingReference ? (
        <ConfirmationStep
          bookingReference={state.bookingReference}
          date={state.date}
          guests={state.guests}
          onBookAgain={reset}
        />
      ) : null}
    </div>
  );
}
