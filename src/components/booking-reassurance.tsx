import { bookingReassurancePoints } from "@/lib/featured-tour-content";

type BookingReassuranceProps = {
  className?: string;
  compact?: boolean;
};

export function BookingReassurance({
  className = "",
  compact = false,
}: BookingReassuranceProps) {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-blue-50/80 ${compact ? "p-4" : "p-5 sm:p-6"} ${className}`}
    >
      {!compact ? (
        <p className="text-sm font-semibold text-gray-900 sm:text-base">
          What happens when you enquire
        </p>
      ) : null}
      <ul className={`${compact ? "mt-0" : "mt-3"} space-y-2`}>
        {bookingReassurancePoints.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-6 text-gray-700 sm:text-base"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
