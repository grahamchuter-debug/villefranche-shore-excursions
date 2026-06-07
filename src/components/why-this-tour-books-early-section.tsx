import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import { featuredTourBooksEarlyPoints } from "@/lib/featured-tour-content";

type WhyThisTourBooksEarlySectionProps = {
  className?: string;
  showCta?: boolean;
  variant?: "light" | "muted" | "bordered";
};

export function WhyThisTourBooksEarlySection({
  className = "",
  showCta = true,
  variant = "light",
}: WhyThisTourBooksEarlySectionProps) {
  const bgClass =
    variant === "muted"
      ? "border-y border-blue-100 bg-blue-50/60"
      : variant === "bordered"
        ? "rounded-2xl border border-blue-200 bg-blue-50/40"
        : "border-y border-gray-200 bg-white";

  return (
    <section className={`${bgClass} ${className}`}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          Small-group availability
        </p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Why this Villefranche shore excursion books up early
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-700">
          Popular sailings can fill in advance — especially when several ships
          anchor in the bay on the same day.
        </p>
        <ul className="mt-6 space-y-3 text-base leading-7 text-gray-800">
          {featuredTourBooksEarlyPoints.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
              />
              {point}
            </li>
          ))}
        </ul>
        {showCta ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={featuredTour.path}
              className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              View Small Group Tour
            </Link>
            <Link
              href={featuredTour.bookingPath}
              className="rounded-full border-2 border-gray-900 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Check Availability
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
