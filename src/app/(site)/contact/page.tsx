import {
  BookingPolicyPlaceholder,
  buildPolicyMetadata,
} from "@/components/booking-policy-placeholder";
import { siteConfig } from "@/lib/site-config";

const path = "/contact";

export const metadata = buildPolicyMetadata(
  "Contact Us",
  "Contact the Villefranche Shore Excursions cruise excursion team.",
  path,
);

export default function ContactPage() {
  return (
    <BookingPolicyPlaceholder
      title="Contact Us"
      path={path}
      description=""
      lead="Need help before booking? Our cruise excursion team is here to assist."
    >
      <p>
        Email{" "}
        <a
          href={`mailto:${siteConfig.bookingEmail}`}
          className="font-medium text-teal-800 underline-offset-2 hover:underline"
        >
          {siteConfig.bookingEmail}
        </a>
        . A fuller contact page will replace this placeholder when final
        details are ready.
      </p>
    </BookingPolicyPlaceholder>
  );
}
