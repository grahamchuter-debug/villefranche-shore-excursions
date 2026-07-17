import type { Metadata } from "next";

import { BookingEngine } from "@/components/booking-engine/booking-engine";
import { JsonLd } from "@/components/json-ld";
import {
  bookingPricingConfig,
  bookingPrototypeTour,
} from "@/lib/booking/booking-config";
import { formatBookingMoney } from "@/lib/booking/booking-format";
import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildFeaturedTourTripSchema, buildWebPageSchema } from "@/lib/site-schema";
import { siteImages } from "@/lib/site-images";

const pageMeta = {
  title: "Book Monaco, Monte Carlo & Eze Shore Excursion",
  description: `Book Monaco, Monte Carlo and Eze — a small-group French Riviera shore excursion from Villefranche. ${formatBookingMoney(bookingPricingConfig.pricePerGuest)} per guest.`,
  path: featuredTour.bookingPath,
  ogImage: siteImages.monacoHarbour,
  ogImageAlt: bookingPrototypeTour.imageAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

export default function BookFeaturedTourPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: pageMeta.path,
            title: pageMeta.title,
            description: pageMeta.description,
          }),
          buildFeaturedTourTripSchema(),
        ]}
      />
      <main className="flex-1">
        <BookingEngine />
      </main>
    </>
  );
}
