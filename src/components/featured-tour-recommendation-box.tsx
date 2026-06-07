import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import { featuredTourRecommendationCopy } from "@/lib/featured-tour-content";

type FeaturedTourRecommendationBoxProps = {
  className?: string;
};

export function FeaturedTourRecommendationBox({
  className = "",
}: FeaturedTourRecommendationBoxProps) {
  return (
    <aside
      className={`rounded-xl border-2 border-blue-600 bg-blue-50 p-5 shadow-sm sm:p-6 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        {featuredTourRecommendationCopy.label}
      </p>
      <h2 className="mt-2 text-lg font-bold text-gray-900 sm:text-xl">
        {featuredTourRecommendationCopy.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base">
        {featuredTourRecommendationCopy.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={featuredTour.path}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {featuredTourRecommendationCopy.tourLinkLabel}
        </Link>
        <Link
          href={featuredTour.bookingPath}
          className="rounded-full border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100/50"
        >
          {featuredTourRecommendationCopy.availabilityLinkLabel}
        </Link>
      </div>
    </aside>
  );
}
