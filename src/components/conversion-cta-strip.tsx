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
            ? "rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 sm:px-6 sm:py-3 sm:text-base"
            : "rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base"
        }
      >
        View Small Group Tour
      </Link>
      <Link
        href={featuredTour.bookingPath}
        className={
          isDark
            ? "rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
            : "rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:px-6 sm:py-3 sm:text-base"
        }
      >
        Check Availability
      </Link>
      <Link
        href="/cruise-planner"
        className={
          isDark
            ? "rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
            : "rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 sm:px-6 sm:py-3 sm:text-base"
        }
      >
        Plan your Villefranche cruise day
      </Link>
    </div>
  );
}
