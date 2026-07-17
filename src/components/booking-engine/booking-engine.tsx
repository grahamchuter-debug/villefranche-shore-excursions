"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BookingCheckoutHeader } from "@/components/booking-engine/booking-checkout-header";
import { BookingProgress } from "@/components/booking-engine/booking-progress";
import { ConfirmationStep } from "@/components/booking-engine/steps/confirmation-step";
import { DateStep } from "@/components/booking-engine/steps/date-step";
import { GuestsStep } from "@/components/booking-engine/steps/guests-step";
import { PaymentStep } from "@/components/booking-engine/steps/payment-step";
import { ShipStep } from "@/components/booking-engine/steps/ship-step";
import { TourIntroStep } from "@/components/booking-engine/steps/tour-intro-step";
import {
  bookingCapacityConfig,
  bookingCheckoutGuestLimit,
  bookingPrototypeTour,
  bookingSessionStorageKey,
  type BookingStepId,
} from "@/lib/booking/booking-config";
import {
  createPrototypeBookingReference,
  formatBookingDate,
} from "@/lib/booking/booking-format";
import type {
  BookingShipVisit,
  BookingShipsByDate,
} from "@/lib/booking/booking-ship-types";

type BookingState = {
  step: BookingStepId;
  date: string | null;
  cruiseShip: BookingShipVisit | null;
  guests: number;
  bookingReference: string | null;
};

type BookingEngineProps = {
  shipsByDate: BookingShipsByDate;
};

const LEGACY_KEYS = [
  "vf-booking-prototype-v1",
  `vf-booking:${bookingPrototypeTour.id}`,
  `vf-booking:v2:${bookingPrototypeTour.id}`,
  `vf-booking:v3:${bookingPrototypeTour.id}`,
  `vf-booking:v4:${bookingPrototypeTour.id}`,
] as const;
const STORAGE_KEY = bookingSessionStorageKey(bookingPrototypeTour.id);

const VALID_STEPS = new Set<BookingStepId>([
  "tour",
  "date",
  "ship",
  "guests",
  "payment",
  "confirmed",
]);

const HERO_EXIT_MS = 720;
const DATE_TO_GUESTS_ENTER = "book-step-enter-forward";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isShipVisit(value: unknown): value is BookingShipVisit {
  if (!value || typeof value !== "object") return false;
  const ship = value as BookingShipVisit;
  return (
    typeof ship.name === "string" &&
    typeof ship.slug === "string" &&
    typeof ship.cruiseLine === "string"
  );
}

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
      cruiseShip?: unknown;
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
      cruiseShip: isShipVisit(parsed.cruiseShip) ? parsed.cruiseShip : null,
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
  cruiseShip: null,
  guests: 2,
  bookingReference: null,
};

export function BookingEngine({ shipsByDate }: BookingEngineProps) {
  const [state, setState] = useState<BookingState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [heroExiting, setHeroExiting] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const heroExitTimer = useRef<number | null>(null);

  useEffect(() => {
    const stored = loadState();
    if (stored) {
      if (stored.cruiseShip && stored.date) {
        const match = shipsByDate[stored.date]?.find(
          (ship) => ship.slug === stored.cruiseShip?.slug,
        );
        if (match) stored.cruiseShip = match;
      }
      setState(stored);
    }
    setHydrated(true);
  }, [shipsByDate]);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.step === "tour") return;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [state.step, hydrated]);

  useEffect(() => {
    return () => {
      if (heroExitTimer.current !== null) {
        window.clearTimeout(heroExitTimer.current);
      }
    };
  }, []);

  const shipsForSelectedDate = useMemo(() => {
    if (!state.date) return [] as BookingShipVisit[];
    return shipsByDate[state.date] ?? [];
  }, [shipsByDate, state.date]);

  /** Re-bind selected ship from current schedule so times/images stay authoritative. */
  useEffect(() => {
    if (!state.date || !state.cruiseShip) return;
    const match = shipsForSelectedDate.find(
      (ship) => ship.slug === state.cruiseShip?.slug,
    );
    if (!match) {
      setState((prev) => ({ ...prev, cruiseShip: null }));
      return;
    }
    if (
      match.arrivalTime !== state.cruiseShip.arrivalTime ||
      match.departureTime !== state.cruiseShip.departureTime ||
      match.timesVerified !== state.cruiseShip.timesVerified ||
      match.image?.src !== state.cruiseShip.image?.src
    ) {
      setState((prev) => ({ ...prev, cruiseShip: match }));
    }
  }, [state.date, state.cruiseShip, shipsForSelectedDate]);

  const go = (step: BookingStepId) =>
    setState((prev) => ({ ...prev, step }));

  const reset = () => {
    setState(initialState);
    setHeroExiting(false);
    setLiveMessage("");
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const beginDateSelection = () => {
    if (heroExiting) return;
    setHeroExiting(true);
    const delay = prefersReducedMotion() ? 0 : HERO_EXIT_MS;
    heroExitTimer.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, step: "date" }));
      setHeroExiting(false);
    }, delay);
  };

  const handleDateConfirmed = (isoDate: string) => {
    const label = formatBookingDate(isoDate);
    const ships = shipsByDate[isoDate] ?? [];
    const autoShip = ships.length === 1 ? ships[0] : null;

    setLiveMessage(
      autoShip
        ? `${label} selected. ${autoShip.name} is visiting Villefranche. Continuing to confirm your ship.`
        : `${label} selected. Continuing to cruise ship selection.`,
    );
    setState((prev) => ({
      ...prev,
      date: isoDate,
      cruiseShip: autoShip,
      step: "ship",
    }));
  };

  const handleSelectShip = (ship: BookingShipVisit) => {
    setState((prev) => ({ ...prev, cruiseShip: ship }));
  };

  const handlePay = () => {
    setState((prev) => ({
      ...prev,
      step: "confirmed",
      bookingReference: createPrototypeBookingReference(),
    }));
  };

  const isExperience = state.step === "tour";
  const selectedDateLabel = state.date
    ? formatBookingDate(state.date)
    : null;

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
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <BookingCheckoutHeader mode={isExperience ? "scene" : "booking"} />

      {isExperience ? (
        <TourIntroStep
          onContinue={beginDateSelection}
          isExiting={heroExiting}
        />
      ) : (
        <div className="book-shell py-8 sm:py-12 lg:py-14">
          {state.step !== "confirmed" ? (
            <div className="mb-10 sm:mb-12">
              <BookingProgress current={state.step} />
            </div>
          ) : null}

          <div
            key={state.step}
            className={
              state.step === "ship" ||
              state.step === "guests" ||
              state.step === "payment"
                ? DATE_TO_GUESTS_ENTER
                : "book-step-enter"
            }
          >
            {state.step === "date" ? (
              <DateStep
                selectedDate={state.date}
                onSelectDate={(date) =>
                  setState((prev) => ({
                    ...prev,
                    date,
                    cruiseShip: null,
                  }))
                }
                onDateConfirmed={handleDateConfirmed}
                onBack={() => go("tour")}
              />
            ) : null}

            {state.step === "ship" && state.date ? (
              <ShipStep
                date={state.date}
                ships={shipsForSelectedDate}
                selectedShip={state.cruiseShip}
                onSelectShip={handleSelectShip}
                onContinue={() => {
                  if (!state.cruiseShip) return;
                  go("guests");
                }}
                onBack={() =>
                  setState((prev) => ({
                    ...prev,
                    step: "date",
                    cruiseShip: null,
                  }))
                }
              />
            ) : null}

            {state.step === "guests" ? (
              <GuestsStep
                guests={state.guests}
                selectedDateLabel={selectedDateLabel}
                cruiseShipName={state.cruiseShip?.name}
                onChangeGuests={(guests) =>
                  setState((prev) => ({
                    ...prev,
                    guests: Math.min(
                      bookingCheckoutGuestLimit,
                      Math.max(bookingCapacityConfig.minGuests, guests),
                    ),
                  }))
                }
                onContinue={() => {
                  if (!state.cruiseShip) {
                    go("ship");
                    return;
                  }
                  go("payment");
                }}
                onBack={() => go("ship")}
              />
            ) : null}

            {state.step === "payment" &&
            state.date &&
            state.cruiseShip ? (
              <PaymentStep
                date={state.date}
                guests={state.guests}
                cruiseShip={state.cruiseShip}
                onPay={handlePay}
                onBack={() => go("guests")}
              />
            ) : null}

            {state.step === "confirmed" &&
            state.date &&
            state.cruiseShip &&
            state.bookingReference ? (
              <ConfirmationStep
                bookingReference={state.bookingReference}
                date={state.date}
                guests={state.guests}
                cruiseShip={state.cruiseShip}
                onBookAgain={reset}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
