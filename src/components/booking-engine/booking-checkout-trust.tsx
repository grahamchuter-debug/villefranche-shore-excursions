import Link from "next/link";

import {
  bookingCapacityConfig,
  bookingCheckoutLinks,
  bookingPricingConfig,
} from "@/lib/booking/booking-config";
import { siteConfig } from "@/lib/site-config";

export function BookingCheckoutTrust() {
  const trustItems = [
    "SSL encrypted",
    bookingPricingConfig.freeCancellationLabel,
    bookingPricingConfig.returnGuaranteeLabel,
    bookingCapacityConfig.capacityLabel.replace(/\.$/, ""),
  ] as const;

  return (
    <section
      className="book-checkout-trust mx-auto max-w-3xl space-y-8 pt-4 text-center"
      aria-label="Booking reassurance"
    >
      <div className="space-y-4">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--book-gold)] uppercase">
          Secure checkout
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-7">
          {trustItems.map((item) => (
            <li
              key={item}
              className="text-[13px] tracking-wide text-[var(--book-muted)]"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[var(--book-muted)]">
          Need help?{" "}
          <a
            href={`mailto:${siteConfig.bookingEmail}`}
            className="font-medium text-[var(--book-sea)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
          >
            Contact us
          </a>
        </p>
      </div>

      <nav
        aria-label="Booking policies"
        className="border-t border-[var(--book-line)] pt-6"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] tracking-wide text-[var(--book-muted)]">
          {bookingCheckoutLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition hover:text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
