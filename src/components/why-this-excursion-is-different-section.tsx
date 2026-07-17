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
      ? "border-y border-brand-muted bg-brand-soft/60"
      : variant === "dark"
        ? "border-y border-white/10 bg-navy-deep text-white"
        : "border-y border-gray-200 bg-white";

  const textClass =
    variant === "dark" ? "text-white/85" : "text-gray-700";
  const headingClass =
    variant === "dark" ? "text-white" : "text-gray-900";
  const eyebrowClass =
    variant === "dark" ? "text-brand-muted" : "text-brand";

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
              className="w2-btn w2-btn-primary px-5 py-2.5 text-sm"
            >
              View Tour
            </Link>
            <Link
              href={featuredTour.bookingPath}
              className={`w2-btn px-5 py-2.5 text-sm font-semibold ${
                variant === "dark"
                  ? "rounded-full border border-white/30 text-white hover:bg-white/10"
                  : "w2-btn-secondary"
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
