import {
  BookingPolicyPlaceholder,
  buildPolicyMetadata,
} from "@/components/booking-policy-placeholder";

const path = "/cancellation-policy";

export const metadata = buildPolicyMetadata(
  "Cancellation Policy",
  "Cancellation and refund policy for Villefranche Shore Excursions. Full policy text will be published here.",
  path,
);

export default function CancellationPolicyPage() {
  return (
    <BookingPolicyPlaceholder
      title="Cancellation Policy"
      path={path}
      description=""
      lead="This page will explain how cancellations and refunds work for cruise excursion bookings."
    >
      <p>
        Placeholder content for design and navigation. Free-cancellation wording
        on the booking flow remains the customer-facing summary until this
        document is finalised.
      </p>
    </BookingPolicyPlaceholder>
  );
}
