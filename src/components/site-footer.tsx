import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import { cruiseLineVillefrancheHubLinks } from "@/lib/cruise-line-villefranche-pages";
import { portGuidePath, meetingPointPath } from "@/lib/site-paths";
import { siteConfig } from "@/lib/site-config";

const planYourVisitLinks = [
  { label: "Book the Small Group Tour", href: featuredTour.bookingPath },
  { label: featuredTour.cardName, href: featuredTour.path },
  { label: "Villefranche Shore Excursions", href: "/excursions" },
  { label: "Villefranche Port Guide", href: portGuidePath },
  { label: "One Day in Villefranche", href: "/one-day-in-villefranche" },
  {
    label: "Is Villefranche Worth Visiting?",
    href: "/is-villefranche-worth-visiting",
  },
] as const;

const cruiseToolsLinks = [
  { label: "Ship Schedules", href: "/ship-schedules" },
  { label: "Cruise Ships", href: "/cruise-ships" },
  { label: "2026 Schedule", href: "/ship-schedules/2026" },
  { label: "2027 Schedule", href: "/ship-schedules/2027" },
  { label: "Cruise Planner", href: "/cruise-planner" },
  { label: "Tender Information", href: "/villefranche-tender-information" },
  { label: "Meeting Point", href: meetingPointPath },
  {
    label: "What If My Tender Is Late?",
    href: "/what-if-my-tender-is-late",
  },
  { label: "FAQ", href: "/faq" },
] as const;

const cruiseLineLinks = cruiseLineVillefrancheHubLinks;

const whyBookWithUs = [
  "Small-group experiences",
  "Local French Riviera knowledge",
  "Return-to-ship reliability",
] as const;

const trustBullets = [
  "Return-to-ship friendly itineraries",
  "Tender port specialists",
  "Small-group shore excursions",
] as const;

const ctaSecondaryLinks = [
  { label: "Meeting Point", href: meetingPointPath },
  { label: "Ship Schedules", href: "/ship-schedules" },
  { label: "Cruise Ships", href: "/cruise-ships" },
  { label: "Tender Information", href: "/villefranche-tender-information" },
  { label: "Cruise Planner", href: "/cruise-planner" },
] as const;

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200/90">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <section className="border-t border-sky-900/30 bg-gradient-to-r from-slate-900 via-[#132238] to-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Ready to plan your Villefranche cruise day?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Browse small-group shore excursions, tender guides, and port planning
            tools designed specifically for cruise passengers visiting Villefranche-sur-Mer.
          </p>
          <Link
            href={featuredTour.bookingPath}
            className="mt-6 inline-block rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400 sm:text-base"
          >
            Book Now
          </Link>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            {ctaSecondaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 transition hover:text-white"
                >
                  • {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="relative border-t border-white/10 bg-[#0b1220] text-slate-200">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent"
        />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-white transition hover:text-sky-200"
              >
                {siteConfig.name}
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Small-group Villefranche shore excursions for cruise passengers —
                {featuredTour.cardName} plus tender guides and port planning.
              </p>
              <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200/90">
                  Recommended Excursion
                </h2>
                <Link
                  href={featuredTour.path}
                  className="mt-2 block text-sm font-medium text-white transition hover:text-sky-200"
                >
                  {featuredTour.cardName}
                </Link>
              </div>
              <ul className="mt-4 space-y-2">
                {trustBullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-6 text-slate-400"
                  >
                    <span aria-hidden="true" className="text-sky-400/90">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:col-span-1 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              <FooterColumn title="Plan Your Visit">
                <ul className="space-y-2">
                  {planYourVisitLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Cruise Tools">
                <ul className="space-y-2">
                  {cruiseToolsLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Cruise Lines">
                <ul className="space-y-2">
                  {cruiseLineLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Why Book With Us">
                <ul className="space-y-2">
                  {whyBookWithUs.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-400"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-400/80"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>

          <p className="mt-8 border-t border-white/8 pt-6 text-xs leading-5 text-slate-500">
            © 2026 {siteConfig.copyrightEntity}. Independent cruise excursion
            guide.
          </p>
        </div>
      </div>
    </footer>
  );
}
