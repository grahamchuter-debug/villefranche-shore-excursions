import {
  bookingCapacityConfig,
  bookingMeetingConfig,
  bookingPrototypeTour,
  bookingStartTimeConfig,
  getBookingStartTimeLabel,
} from "@/lib/booking/booking-config";
import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingMoney,
} from "@/lib/booking/booking-format";

type CruiseDaySummaryProps = {
  date: string;
  guests: number;
  heading?: string;
};

export function CruiseDaySummary({
  date,
  guests,
  heading = "Your Cruise Day",
}: CruiseDaySummaryProps) {
  const startTime = getBookingStartTimeLabel(date);
  const total = formatBookingMoney(calculateBookingTotal(guests));

  const rows = [
    {
      label: bookingMeetingConfig.label,
      value: bookingMeetingConfig.place,
      note: bookingMeetingConfig.instructionsNote,
    },
    {
      label: bookingStartTimeConfig.label,
      value: startTime,
    },
    {
      label: "Date",
      value: formatBookingDate(date),
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
  ] as const;

  return (
    <section
      className="book-cruise-day book-checkout-enter rounded-[1.75rem] bg-[var(--book-surface)] px-6 py-9 shadow-[0_28px_70px_-42px_rgba(12,26,36,0.32)] sm:px-10 sm:py-11"
      aria-labelledby="cruise-day-heading"
    >
      <header className="mb-9 max-w-xl space-y-2">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-gold)] uppercase">
          Reservation overview
        </p>
        <h3
          id="cruise-day-heading"
          className="book-display text-3xl font-medium text-[var(--book-ink)] sm:text-4xl"
        >
          {heading}
        </h3>
      </header>

      <dl className="space-y-7">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="text-[13px] tracking-wide text-[var(--book-muted)]">
              {row.label}
            </dt>
            <dd className="text-[17px] font-medium leading-snug text-[var(--book-ink)] sm:text-lg">
              {row.value}
              {"note" in row && row.note ? (
                <span className="mt-1.5 block text-sm font-normal leading-relaxed text-[var(--book-muted)]">
                  {row.note}
                </span>
              ) : null}
            </dd>
          </div>
        ))}

        <div className="grid gap-1 border-t border-[var(--book-line)] pt-7 sm:grid-cols-[11rem_1fr] sm:gap-6">
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
