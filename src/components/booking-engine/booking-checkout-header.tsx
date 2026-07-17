import Link from "next/link";

import { bookingPrototypeTour } from "@/lib/booking/booking-config";
import { siteConfig } from "@/lib/site-config";

type BookingCheckoutHeaderProps = {
  tourPath?: string;
  tourLabel?: string;
};

export function BookingCheckoutHeader({
  tourPath = bookingPrototypeTour.path,
  tourLabel = "Back to tour",
}: BookingCheckoutHeaderProps) {
  return (
    <header className="border-b border-[var(--book-line)] bg-[var(--book-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="min-w-0 truncate text-sm font-semibold tracking-tight text-[var(--book-ink)] sm:text-base"
        >
          {siteConfig.name}
        </Link>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <p className="hidden text-xs font-medium text-[var(--book-muted)] sm:block">
            <span
              aria-hidden="true"
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--book-success)]"
            />
            Secure booking
          </p>
          <p className="text-xs font-medium text-[var(--book-muted)] sm:hidden">
            Secure
          </p>
          <Link
            href={tourPath}
            className="rounded-full border border-[var(--book-line)] px-3 py-1.5 text-xs font-medium text-[var(--book-muted)] transition hover:border-[var(--book-sea)] hover:text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
          >
            {tourLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
