import type { Metadata } from "next";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/site-metadata";

/** Legacy path — canonical document lives at /terms-and-conditions. */
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Booking Terms and Conditions",
    description:
      "Booking terms and conditions for Villefranche Shore Excursions.",
    path: "/terms",
  }),
  robots: { index: false, follow: true },
};

export default function TermsLegacyAliasPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-[var(--w2-navy)]">
      <h1 className="text-3xl font-medium tracking-tight">
        Booking Terms and Conditions
      </h1>
      <p className="mt-4 text-lg leading-8 text-[var(--w2-muted)]">
        Continue to our Booking Terms and Conditions.
      </p>
      <p className="mt-8">
        <Link
          href="/terms-and-conditions"
          className="w2-btn w2-btn-primary px-6 py-3 text-sm"
        >
          View Booking Terms
        </Link>
      </p>
    </main>
  );
}
