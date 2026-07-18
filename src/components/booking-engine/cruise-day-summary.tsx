import {
  bookingCapacityConfig,
  bookingMeetingConfig,
  bookingPrototypeTour,
  bookingStartTimeConfig,
  getBookingStartTimeLabel,
} from "@/lib/booking/booking-config";
import type { BookingShipVisit } from "@/lib/booking/booking-ship-types";
import {
  formatVerifiedShipTime,
} from "@/lib/booking/booking-ship-types";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type CruiseDaySummaryProps = {
  date: string;
  guests: number;
  cruiseShip: BookingShipVisit;
  heading?: string;
  onChangeShip?: () => void;
};

export function CruiseDaySummary({
  date,
  guests,
  cruiseShip,
  heading = "Your Cruise Day",
  onChangeShip,
}: CruiseDaySummaryProps) {
  /** Excursion start — never derived from ship arrival */
  const tourStartTime = getBookingStartTimeLabel(date);
  const total = formatBookingMoney(calculateBookingTotal(guests));
  const shipArrival = formatVerifiedShipTime(cruiseShip.arrivalTime);
  const shipDeparture = formatVerifiedShipTime(cruiseShip.departureTime);

  const rows: Array<{
    label: string;
    value: string;
    note?: string;
  }> = [
    {
      label: "Date",
      value: formatBookingDate(date),
    },
  ];

  if (shipArrival) {
    rows.push({
      label: "Ship arrival",
      value: shipArrival,
      note: "Published cruise schedule — subject to change by your cruise line.",
    });
  }
  if (shipDeparture) {
    rows.push({
      label: "Ship departure",
      value: shipDeparture,
      note: "Published cruise schedule — subject to change by your cruise line.",
    });
  }

  rows.push(
    {
      label: bookingStartTimeConfig.label,
      value: tourStartTime,
      note: "Excursion start time — separate from your ship’s arrival or departure.",
    },
    {
      label: bookingMeetingConfig.label,
      value: bookingMeetingConfig.place,
      note: bookingMeetingConfig.instructionsNote,
    },
    {
      label: "Guests",
      value: `${guests} ${guests === 1 ? "guest" : "guests"}`,
    },
    {
      label: "Experience",
      value: bookingPrototypeTour.experienceName,
    },
    {
      label: "Group Size",
      value: bookingCapacityConfig.groupSizeLabel,
    },
    {
      label: "Duration",
      value: bookingPrototypeTour.durationLabel,
    },
  );

  return (
    <section
      className="book-cruise-day book-checkout-enter"
      aria-labelledby="cruise-day-heading"
    >
      <header className="mb-8 max-w-xl space-y-2 sm:mb-9">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-gold)] uppercase">
          Your cruise itinerary
        </p>
        <h3
          id="cruise-day-heading"
          className="book-display text-3xl font-medium text-[var(--book-ink)] sm:text-4xl"
        >
          {heading}
        </h3>
      </header>

      <dl className="divide-y divide-[var(--book-line)]">
        <div className="grid gap-1 py-5 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <dt className="flex items-baseline gap-3 text-[13px] tracking-wide text-[var(--book-muted)]">
            <span>Cruise Ship</span>
            {onChangeShip ? (
              <button
                type="button"
                onClick={onChangeShip}
                className="book-btn book-text-link text-[12px] tracking-wide underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]"
              >
                Change
              </button>
            ) : null}
          </dt>
          <dd className="book-display text-[1.35rem] font-medium leading-snug text-[var(--book-ink)] sm:text-[1.5rem]">
            {cruiseShip.name}
            {cruiseShip.cruiseLine ? (
              <span className="mt-1.5 block font-sans text-sm font-normal leading-relaxed text-[var(--book-muted)]">
                {cruiseShip.cruiseLine}
              </span>
            ) : null}
          </dd>
        </div>

        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <dt className="text-[13px] tracking-wide text-[var(--book-muted)]">
              {row.label}
            </dt>
            <dd className="text-[17px] font-medium leading-snug text-[var(--book-ink)] sm:text-lg">
              {row.value}
              {row.note ? (
                <span className="mt-1.5 block text-sm font-normal leading-relaxed text-[var(--book-muted)]">
                  {row.note}
                </span>
              ) : null}
            </dd>
          </div>
        ))}

        <div className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <dt className="text-[13px] tracking-wide text-[var(--book-muted)]">
            Total
          </dt>
          <dd className="book-display text-4xl font-medium text-[var(--book-ink)] sm:text-5xl">
            {total}
          </dd>
        </div>
      </dl>
    </section>
  );
}
