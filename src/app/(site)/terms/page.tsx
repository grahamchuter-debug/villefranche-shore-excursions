import {
  BookingPolicyPlaceholder,
  buildPolicyMetadata,
} from "@/components/booking-policy-placeholder";

const path = "/terms";

export const metadata = buildPolicyMetadata(
  "Terms & Conditions",
  "Terms and conditions for Villefranche Shore Excursions bookings. Full legal text will be published here.",
  path,
);

export default function TermsPage() {
  return (
    <BookingPolicyPlaceholder
      title="Terms & Conditions"
      path={path}
      description=""
      lead="This page will hold the full booking terms for Villefranche Shore Excursions."
    >
      <p>
        Placeholder content for design and navigation. The final terms document
        will replace this text before public launch.
      </p>
    </BookingPolicyPlaceholder>
  );
}
