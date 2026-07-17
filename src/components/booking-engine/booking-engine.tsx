"use client";

import { useEffect, useState } from "react";

import { BookingCheckoutHeader } from "@/components/booking-engine/booking-checkout-header";
import { BookingProgress } from "@/components/booking-engine/booking-progress";
import { ConfirmationStep } from "@/components/booking-engine/steps/confirmation-step";
import { DateStep } from "@/components/booking-engine/steps/date-step";
import { GuestsStep } from "@/components/booking-engine/steps/guests-step";
import { PaymentStep } from "@/components/booking-engine/steps/payment-step";
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

const LEGACY_KEYS = [
  "vf-booking-prototype-v1",
  `vf-booking:${bookingPrototypeTour.id}`,
  `vf-booking:v2:${bookingPrototypeTour.id}`,
] as const;
const STORAGE_KEY = bookingSessionStorageKey(bookingPrototypeTour.id);

const VALID_STEPS = new Set<BookingStepId>([
  "tour",
  "date",
  "guests",
  "payment",
  "confirmed",
]);

function loadState(): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    for (const key of LEGACY_KEYS) {
      window.sessionStorage.removeItem(key);
    }
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      step: string;
      date: string | null;
      guests: number;
      bookingReference: string | null;
    };
    if (parsed.step === "summary") parsed.step = "payment";
    if (!VALID_STEPS.has(parsed.step as BookingStepId)) {
      parsed.step = "tour";
    }
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
    return {
      step: parsed.step as BookingStepId,
      date: parsed.date,
      guests: parsed.guests,
      bookingReference: parsed.bookingReference,
    };
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

  const isExperience = state.step === "tour";

  if (!hydrated) {
    return (
      <div
        className="book-shell py-24 text-center text-[var(--book-muted)]"
        aria-live="polite"
      >
        Preparing your day…
      </div>
    );
  }

  return (
    <div
      className={
        isExperience
          ? "relative flex flex-1 flex-col"
          : "flex flex-1 flex-col"
      }
    >
      <BookingCheckoutHeader immersive={isExperience} />

      {isExperience ? (
        <TourIntroStep onContinue={() => go("date")} />
      ) : (
        <div className="book-shell py-8 sm:py-12 lg:py-14">
          {state.step !== "confirmed" ? (
            <div className="mb-10 sm:mb-12">
              <BookingProgress current={state.step} />
            </div>
          ) : null}

          <div key={state.step} className="book-step-enter">
            {state.step === "date" ? (
              <DateStep
                selectedDate={state.date}
                onSelectDate={(date) =>
                  setState((prev) => ({ ...prev, date }))
                }
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
                onContinue={() => go("payment")}
                onBack={() => go("date")}
              />
            ) : null}

            {state.step === "payment" && state.date ? (
              <PaymentStep
                date={state.date}
                guests={state.guests}
                onPay={handlePay}
                onBack={() => go("guests")}
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
        </div>
      )}
    </div>
  );
}
