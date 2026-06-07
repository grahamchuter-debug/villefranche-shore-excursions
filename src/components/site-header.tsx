import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { siteNavLinks } from "@/lib/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/90 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight sm:text-lg">
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex"
        >
          {siteNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={featuredTour.bookingPath}
          className="rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold transition hover:bg-blue-500 sm:px-4 sm:py-2 sm:text-sm"
        >
          Book a Tour
        </Link>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="border-t border-white/10 lg:hidden"
      >
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {siteNavLinks.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="block rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80 transition hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
