import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import { featuredTourWhyCreated } from "@/lib/featured-tour-content";

type WhyWeCreatedThisTourSectionProps = {
  className?: string;
  showCta?: boolean;
  variant?: "light" | "muted";
};

export function WhyWeCreatedThisTourSection({
  className = "",
  showCta = true,
  variant = "light",
}: WhyWeCreatedThisTourSectionProps) {
  const bgClass =
    variant === "muted"
      ? "border-y border-blue-100 bg-blue-50/60"
      : "border-y border-gray-200 bg-white";

  return (
    <section className={`${bgClass} ${className}`}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          From local operators who know this port
        </p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {featuredTourWhyCreated.heading}
        </h2>
        <div className="mt-5 space-y-4 text-base leading-8 text-gray-700 sm:text-lg">
          {featuredTourWhyCreated.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {showCta ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={featuredTour.path}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Small Group Tour
            </Link>
            <Link
              href={featuredTour.bookingPath}
              className="rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Check Availability
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
