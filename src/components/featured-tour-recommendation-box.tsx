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
      className={`rounded-xl border-2 border-brand bg-brand-soft p-5 shadow-sm sm:p-6 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
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
          className="w2-btn w2-btn-primary px-4 py-2 text-sm"
        >
          {featuredTourRecommendationCopy.tourLinkLabel}
        </Link>
        <Link
          href={featuredTour.bookingPath}
          className="w2-btn w2-btn-secondary px-4 py-2 text-sm"
        >
          {featuredTourRecommendationCopy.availabilityLinkLabel}
        </Link>
      </div>
    </aside>
  );
}
