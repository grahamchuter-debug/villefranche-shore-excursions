import Link from "next/link";

import { bookingPrototypeTour } from "@/lib/booking/booking-config";
import { siteConfig } from "@/lib/site-config";

type BookingCheckoutHeaderProps = {
  tourPath?: string;
  tourLabel?: string;
};

export function BookingCheckoutHeader({
  tourPath = bookingPrototypeTour.path,
  tourLabel = "Exit",
}: BookingCheckoutHeaderProps) {
  return (
    <header className="border-b border-[var(--book-line)]/80 bg-[var(--book-surface)]/85 backdrop-blur-xl">
      <div className="book-shell flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="min-w-0 truncate text-[13px] font-medium tracking-[0.04em] text-[var(--book-ink)] sm:text-sm"
        >
          {siteConfig.name}
        </Link>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <p className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--book-muted)] sm:flex">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--book-success)]"
            />
            Secure booking
          </p>
          <Link
            href={tourPath}
            className="text-[13px] font-medium text-[var(--book-muted)] transition hover:text-[var(--book-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--book-sea)]"
          >
            {tourLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
