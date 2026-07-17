import {
  BookingPolicyPlaceholder,
  buildPolicyMetadata,
} from "@/components/booking-policy-placeholder";
import { bookingPricingConfig } from "@/lib/booking/booking-config";

const path = "/return-to-ship-guarantee";

export const metadata = buildPolicyMetadata(
  "Return to Ship Guarantee",
  "How Villefranche Shore Excursions plans itineraries around your cruise schedule.",
  path,
);

export default function ReturnToShipGuaranteePage() {
  return (
    <BookingPolicyPlaceholder
      title="Return to Ship Guarantee"
      path={path}
      description=""
      lead={bookingPricingConfig.returnGuaranteeDetail}
    >
      <p>
        This dedicated guarantee page will expand on how we monitor cruise
        arrivals and pace your day for a confident return to Villefranche. Full
        conditions will be published here before launch — without inventing
        legal wording ahead of review.
      </p>
    </BookingPolicyPlaceholder>
  );
}
