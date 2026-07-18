import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { featuredTour } from "@/lib/featured-tour";
import { legalNavLinks } from "@/lib/legal";
import { businessIdentity } from "@/lib/legal/business-identity";
import { formatLastUpdated } from "@/lib/legal/resolve";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/site-schema";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

type TocItem = { id: string; title: string };

type LegalPolicyPageProps = {
  path: string;
  title: string;
  metaDescription: string;
  lead: string;
  lastUpdated: string | null;
  sections?: readonly { id: string; title: string; paragraphs: string[] }[];
  /** Cancellation-style labelled fields */
  fields?: readonly { id: string; label: string; value: string }[];
  /** Contact-style details */
  details?: readonly {
    id: string;
    label: string;
    value: string;
    href?: string;
  }[];
  closingParagraphs?: readonly string[];
};

export function LegalPolicyPage({
  path,
  title,
  metaDescription,
  lead,
  lastUpdated,
  sections = [],
  fields = [],
  details = [],
  closingParagraphs = [],
}: LegalPolicyPageProps) {
  const toc: TocItem[] = [
    ...sections.map((section) => ({ id: section.id, title: section.title })),
    ...fields.map((field) => ({ id: field.id, title: field.label })),
    ...details.map((detail) => ({ id: detail.id, title: detail.label })),
  ];

  const schema = [
    buildWebPageSchema({
      path,
      title,
      description: metaDescription,
    }),
    buildBreadcrumbSchema(
      [
        { label: "Home", href: "/" },
        { label: title },
      ],
      path,
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <main className="bg-[var(--w2-bg)] text-[var(--w2-navy)]">
        <header className="border-b border-[var(--w2-border)] bg-[var(--w2-bg-warm)]">
          <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--w2-primary)] uppercase">
              {businessIdentity.tradingName}
            </p>
            <h1
              className={`${display.className} mt-3 text-4xl font-medium tracking-tight sm:text-5xl`}
            >
              {title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--w2-muted)]">
              {lead}
            </p>
            {lastUpdated ? (
              <p className="mt-6 text-sm text-[var(--w2-muted)]">
                Last updated: {formatLastUpdated(lastUpdated)}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[15rem_minmax(0,42rem)] lg:gap-16 lg:py-20">
          {toc.length > 1 ? (
            <nav
              aria-label="On this page"
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--w2-muted)] uppercase">
                Contents
              </p>
              <ol className="mt-4 space-y-2.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="w2-link text-sm leading-snug"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <div className="hidden lg:block" aria-hidden="true" />
          )}

          <article className="min-w-0 space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <h2
                  className={`${display.className} text-2xl font-medium tracking-tight sm:text-3xl`}
                >
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--w2-muted)] sm:text-[17px] sm:leading-8">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            {fields.length > 0 ? (
              <div className="space-y-8">
                {fields.map((field) => (
                  <section
                    key={field.id}
                    id={field.id}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-lg font-medium text-[var(--w2-navy)]">
                      {field.label}
                    </h2>
                    <p className="mt-2 text-base leading-7 text-[var(--w2-muted)] sm:leading-8">
                      {field.value}
                    </p>
                  </section>
                ))}
              </div>
            ) : null}

            {details.length > 0 ? (
              <dl className="space-y-8">
                {details.map((detail) => (
                  <div key={detail.id} id={detail.id} className="scroll-mt-28">
                    <dt className="text-[11px] font-medium tracking-[0.14em] text-[var(--w2-muted)] uppercase">
                      {detail.label}
                    </dt>
                    <dd className="mt-2 text-lg text-[var(--w2-navy)]">
                      {detail.href ? (
                        <a href={detail.href} className="w2-link font-medium">
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {closingParagraphs.length > 0 ? (
              <div className="space-y-4 border-t border-[var(--w2-border)] pt-10 text-base leading-7 text-[var(--w2-muted)] sm:leading-8">
                {closingParagraphs.map((paragraph, index) => (
                  <p key={`close-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <aside className="border-t border-[var(--w2-border)] pt-8">
              <p className="text-xs leading-5 text-[var(--w2-muted)]">
                {businessIdentity.companyDisclosure}
              </p>
            </aside>

            <div className="border-t border-[var(--w2-border)] pt-10">
              <p className="text-[11px] font-medium tracking-[0.16em] text-[var(--w2-muted)] uppercase">
                Related
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {legalNavLinks
                  .filter((link) => link.href !== path)
                  .map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="w2-link text-sm">
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={featuredTour.path}
                  className="w2-btn w2-btn-primary px-6 py-3 text-sm"
                >
                  View Monaco, Monte Carlo &amp; Èze
                </Link>
                <Link
                  href={featuredTour.bookingPath}
                  className="w2-btn w2-btn-secondary px-6 py-3 text-sm"
                >
                  Return to Booking
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
