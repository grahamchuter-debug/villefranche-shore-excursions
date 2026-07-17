import Link from "next/link";

import { bookingPrototypeTour } from "@/lib/booking/booking-config";
import { siteConfig } from "@/lib/site-config";

type BookingCheckoutHeaderProps = {
  tourPath?: string;
  tourLabel?: string;
  /** Transparent over the experience hero */
  immersive?: boolean;
};

export function BookingCheckoutHeader({
  tourPath = bookingPrototypeTour.path,
  tourLabel = "Exit",
  immersive = false,
}: BookingCheckoutHeaderProps) {
  return (
    <header
      className={
        immersive
          ? "absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-[var(--book-ink)]/35 to-transparent"
          : "border-b border-[var(--book-line)]/80 bg-[var(--book-surface)]/85 backdrop-blur-xl"
      }
    >
      <div className="book-shell flex items-center justify-between gap-4 py-4 sm:py-5">
        <Link
          href="/"
          className={[
            "min-w-0 truncate text-[13px] font-medium tracking-[0.04em] sm:text-sm",
            immersive ? "text-white" : "text-[var(--book-ink)]",
          ].join(" ")}
        >
          {siteConfig.name}
        </Link>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <p
            className={[
              "hidden items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase sm:flex",
              immersive ? "text-white/75" : "text-[var(--book-muted)]",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "inline-block h-1.5 w-1.5 rounded-full",
                immersive ? "bg-white" : "bg-[var(--book-success)]",
              ].join(" ")}
            />
            Secure booking
          </p>
          <Link
            href={tourPath}
            className={[
              "text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              immersive
                ? "text-white/85 hover:text-white"
                : "text-[var(--book-muted)] hover:text-[var(--book-ink)] focus-visible:outline-[var(--book-sea)]",
            ].join(" ")}
          >
            {tourLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
