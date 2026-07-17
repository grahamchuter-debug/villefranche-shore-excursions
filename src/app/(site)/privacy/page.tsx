import {
  BookingPolicyPlaceholder,
  buildPolicyMetadata,
} from "@/components/booking-policy-placeholder";

const path = "/privacy";

export const metadata = buildPolicyMetadata(
  "Privacy Policy",
  "Privacy policy for Villefranche Shore Excursions. Full policy text will be published here.",
  path,
);

export default function PrivacyPage() {
  return (
    <BookingPolicyPlaceholder
      title="Privacy Policy"
      path={path}
      description=""
      lead="This page will describe how guest details are collected and protected during booking."
    >
      <p>
        Placeholder content for design and navigation. The final privacy
        document will replace this text before public launch.
      </p>
    </BookingPolicyPlaceholder>
  );
}
