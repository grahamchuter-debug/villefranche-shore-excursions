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
      ? "border-y border-brand-muted bg-brand-soft/60"
      : variant === "bordered"
        ? "rounded-2xl border border-brand-muted bg-brand-soft/40"
        : "border-y border-gray-200 bg-white";

  return (
    <section className={`${bgClass} ${className}`}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
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
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />
              {point}
            </li>
          ))}
        </ul>
        {showCta ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={featuredTour.path}
              className="w2-btn w2-btn-primary px-5 py-2.5 text-sm"
            >
              View Small Group Tour
            </Link>
            <Link
              href={featuredTour.bookingPath}
              className="w2-btn w2-btn-secondary px-5 py-2.5 text-sm"
            >
              Check Availability
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
