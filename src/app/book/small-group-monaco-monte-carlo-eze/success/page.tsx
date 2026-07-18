import { Suspense } from "react";
import type { Metadata } from "next";

import { BookingSuccessClient } from "@/components/booking-engine/booking-success-client";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Booking confirmation",
  description:
    "Confirming your Monaco, Monte Carlo and Eze shore excursion booking.",
  path: `${featuredTour.bookingPath}/success`,
});

export default function BookingSuccessPage() {
  return (
    <main className="flex-1">
      <Suspense
        fallback={
          <div className="book-shell py-24 text-center text-[var(--book-muted)]">
            Confirming your payment…
          </div>
        }
      >
        <BookingSuccessClient />
      </Suspense>
    </main>
  );
}
