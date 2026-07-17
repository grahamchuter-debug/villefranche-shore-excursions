import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";

type ConversionCtaStripProps = {
  className?: string;
  variant?: "light" | "dark";
};

export function ConversionCtaStrip({
  className = "",
  variant = "light",
}: ConversionCtaStripProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      <Link
        href={featuredTour.path}
        className={
          isDark
            ? "w2-btn w2-btn-primary px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base"
            : "w2-btn w2-btn-primary px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base"
        }
      >
        View Small Group Tour
      </Link>
      <Link
        href={featuredTour.bookingPath}
        className={
          isDark
            ? "w2-btn rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
            : "w2-btn w2-btn-secondary px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base"
        }
      >
        Check Availability
      </Link>
      <Link
        href="/cruise-planner"
        className={
          isDark
            ? "w2-btn rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
            : "w2-btn rounded-full border border-[var(--w2-border)] px-5 py-2.5 text-sm font-semibold text-[var(--w2-navy)] transition hover:bg-[var(--w2-grey-light)] sm:px-6 sm:py-3 sm:text-base"
        }
      >
        Plan your Villefranche cruise day
      </Link>
    </div>
  );
}
