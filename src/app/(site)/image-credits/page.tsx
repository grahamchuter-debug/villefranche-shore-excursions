import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { listPublishableShipImageCredits } from "@/lib/booking/ship-image-metadata";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/site-schema";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const path = "/image-credits";

export const metadata: Metadata = buildPageMetadata({
  title: "Image Credits",
  description:
    "Photographer and licence credits for cruise ship photography used on Villefranche Shore Excursions.",
  path,
});

export default function ImageCreditsPage() {
  const credits = listPublishableShipImageCredits();

  const schema = [
    buildWebPageSchema({
      path,
      title: "Image Credits",
      description:
        "Photographer and licence credits for cruise ship photography used on Villefranche Shore Excursions.",
    }),
    buildBreadcrumbSchema(
      [
        { label: "Home", href: "/" },
        { label: "Image Credits" },
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
              Photography
            </p>
            <h1
              className={`${display.className} mt-3 text-4xl font-medium tracking-tight sm:text-5xl`}
            >
              Image Credits
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--w2-muted)]">
              Credits for cruise ship photographs used in booking where
              attribution is required. Only verified, publishable vessel images
              are listed here.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
          {credits.length === 0 ? (
            <p className="text-base leading-7 text-[var(--w2-muted)]">
              No externally attributed ship photographs are currently published
              on the booking journey. When verified vessel images with complete
              source and licence details are added, credits will appear on this
              page.
            </p>
          ) : (
            <ul className="space-y-10">
              {credits.map((entry) => (
                <li
                  key={entry.slug}
                  className="border-b border-[var(--w2-border)] pb-10"
                >
                  <h2
                    className={`${display.className} text-2xl font-medium tracking-tight`}
                  >
                    {entry.shipName}
                  </h2>
                  <dl className="mt-4 space-y-2 text-sm leading-6 text-[var(--w2-muted)]">
                    <div>
                      <dt className="inline font-medium text-[var(--w2-navy)]">
                        Photographer / author:{" "}
                      </dt>
                      <dd className="inline">{entry.author}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-[var(--w2-navy)]">
                        Source:{" "}
                      </dt>
                      <dd className="inline">
                        <a
                          href={entry.sourcePage}
                          className="w2-link"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {entry.sourceName}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-[var(--w2-navy)]">
                        Licence:{" "}
                      </dt>
                      <dd className="inline">{entry.licence}</dd>
                    </div>
                    {entry.attributionText ? (
                      <div>
                        <dt className="inline font-medium text-[var(--w2-navy)]">
                          Attribution:{" "}
                        </dt>
                        <dd className="inline">{entry.attributionText}</dd>
                      </div>
                    ) : null}
                  </dl>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-12">
            <Link href="/" className="w2-link text-sm font-medium">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
