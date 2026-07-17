import Link from "next/link";

import { bookingPrototypeTour } from "@/lib/booking/booking-config";
import { siteConfig } from "@/lib/site-config";

type BookingCheckoutHeaderProps = {
  tourPath?: string;
  tourLabel?: string;
  /**
   * Opening scene: quiet escape only — no checkout trust chrome.
   * Booking flow: standard secure header with brand.
   */
  mode?: "scene" | "booking";
};

export function BookingCheckoutHeader({
  tourPath = bookingPrototypeTour.path,
  tourLabel = "Exit",
  mode = "booking",
}: BookingCheckoutHeaderProps) {
  const isScene = mode === "scene";

  return (
    <header
      className={
        isScene
          ? "pointer-events-none absolute inset-x-0 top-0 z-30"
          : "border-b border-[var(--book-line)]/80 bg-[var(--book-surface)]/85 backdrop-blur-xl"
      }
    >
      <div
        className={[
          "book-shell flex items-center gap-4 py-4 sm:py-5",
          isScene ? "justify-end" : "justify-between",
        ].join(" ")}
      >
        {!isScene ? (
          <Link
            href="/"
            className="min-w-0 truncate text-[13px] font-medium tracking-[0.04em] text-[var(--book-ink)] sm:text-sm"
          >
            {siteConfig.name}
          </Link>
        ) : null}

        <div className="pointer-events-auto flex shrink-0 items-center gap-4 sm:gap-6">
          {!isScene ? (
            <p className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-[var(--book-muted)] uppercase sm:flex">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--book-success)]"
              />
              Secure booking
            </p>
          ) : null}
          <Link
            href={tourPath}
            className={[
              "text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              isScene
                ? "text-white/80 hover:text-white focus-visible:outline-white"
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
