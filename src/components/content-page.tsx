import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { featuredTour } from "@/lib/featured-tour";
import { siteConfig } from "@/lib/site-config";
import { buildFaqSchema, buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/site-schema";

export type PageFaq = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type RelatedLink = {
  label: string;
  href: string;
};

type ContentPageProps = {
  title: string;
  lead: string;
  heroImage: string;
  heroImageAlt: string;
  pagePath: string;
  pageDescription: string;
  children: React.ReactNode;
  relatedLinks?: readonly RelatedLink[];
  faqs?: readonly PageFaq[];
  breadcrumbs?: readonly BreadcrumbItem[];
  belowHero?: React.ReactNode;
  ctaTitle?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaSecondaryHref?: string;
  ctaSecondaryLabel?: string;
  showShipReassurance?: boolean;
};

export function ContentPage({
  title,
  lead,
  heroImage,
  heroImageAlt,
  pagePath,
  pageDescription,
  children,
  relatedLinks,
  faqs,
  breadcrumbs,
  belowHero,
  ctaTitle = `Book the ${featuredTour.cardName} tour`,
  ctaText = "The recommended Villefranche shore excursion for cruise passengers — Monaco, Monte Carlo and Eze in one port day with return-to-ship planning.",
  ctaHref = featuredTour.path,
  ctaLabel = "View recommended tour",
  ctaSecondaryHref = featuredTour.bookingPath,
  ctaSecondaryLabel = "Check availability",
  showShipReassurance = true,
}: ContentPageProps) {
  const schema = [
    buildWebPageSchema({
      path: pagePath,
      title,
      description: pageDescription,
    }),
    ...(breadcrumbs && breadcrumbs.length > 0
      ? [buildBreadcrumbSchema(breadcrumbs, pagePath)]
      : []),
    ...(faqs && faqs.length > 0 ? [buildFaqSchema(faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <main className="min-h-screen bg-white text-gray-900">
        <section
          role="img"
          aria-label={heroImageAlt}
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          <div className="bg-black/55">
            <div className="mx-auto max-w-6xl px-4 py-16 text-white sm:px-6 sm:py-20">
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                {lead}
              </p>
              {showShipReassurance ? (
                <p className="mt-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
                  Return to ship on time, cruise passenger friendly
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {belowHero}

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-10 text-gray-700 [&_a]:font-medium [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-link-hover [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:leading-7 [&_p]:leading-7 [&_section]:space-y-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}
          </div>
        </article>

        <section className="border-y bg-gray-900 text-white">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14">
            <h2 className="text-2xl font-bold sm:text-3xl">{ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {ctaText}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={ctaHref}
                className="w2-btn w2-btn-primary px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base"
              >
                {ctaLabel}
              </Link>
              {ctaSecondaryHref ? (
                <Link
                  href={ctaSecondaryHref}
                  className="inline-block rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition hover:bg-white/10 sm:px-8 sm:py-3.5 sm:text-base"
                >
                  {ctaSecondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {faqs && faqs.length > 0 ? (
          <section className="border-b bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Frequently asked questions
              </h2>
              <dl className="space-y-6">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <dt className="font-semibold text-gray-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 leading-7 text-gray-700">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {relatedLinks && relatedLinks.length > 0 ? (
          <section className="bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Related Villefranche guides
              </h2>
              <ul className="flex flex-wrap gap-3">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
