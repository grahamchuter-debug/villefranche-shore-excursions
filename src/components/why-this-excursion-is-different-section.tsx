import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import { featuredTourWhyDifferent } from "@/lib/featured-tour-content";

type WhyThisExcursionIsDifferentSectionProps = {
  className?: string;
  showCta?: boolean;
  variant?: "light" | "muted" | "dark";
};

export function WhyThisExcursionIsDifferentSection({
  className = "",
  showCta = false,
  variant = "light",
}: WhyThisExcursionIsDifferentSectionProps) {
  const bgClass =
    variant === "muted"
      ? "border-y border-blue-100 bg-blue-50/60"
      : variant === "dark"
        ? "border-y border-white/10 bg-gray-900 text-white"
        : "border-y border-gray-200 bg-white";

  const textClass =
    variant === "dark" ? "text-white/85" : "text-gray-700";
  const headingClass =
    variant === "dark" ? "text-white" : "text-gray-900";
  const eyebrowClass =
    variant === "dark" ? "text-sky-300" : "text-blue-600";

  return (
    <section className={`${bgClass} ${className}`}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.16em] ${eyebrowClass}`}
        >
          Why this tour is different
        </p>
        <h2
          className={`mt-2 text-2xl font-bold sm:text-3xl ${headingClass}`}
        >
          {featuredTourWhyDifferent.heading}
        </h2>
        <div
          className={`mt-5 space-y-4 text-base leading-8 sm:text-lg ${textClass}`}
        >
          {featuredTourWhyDifferent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {showCta ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={featuredTour.path}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Tour
            </Link>
            <Link
              href={featuredTour.bookingPath}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                variant === "dark"
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-blue-600 text-blue-700 hover:bg-blue-50"
              }`}
            >
              Check Availability
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
