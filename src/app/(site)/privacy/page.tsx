import type { Metadata } from "next";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/site-metadata";

/** Legacy path — canonical document lives at /privacy-policy. */
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Privacy Policy",
    description: "Privacy policy for Villefranche Shore Excursions.",
    path: "/privacy",
  }),
  robots: { index: false, follow: true },
};

export default function PrivacyLegacyAliasPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-[var(--w2-navy)]">
      <h1 className="text-3xl font-medium tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--w2-muted)]">
        Continue to our Privacy Policy.
      </p>
      <p className="mt-8">
        <Link
          href="/privacy-policy"
          className="w2-btn w2-btn-primary px-6 py-3 text-sm"
        >
          View Privacy Policy
        </Link>
      </p>
    </main>
  );
}
