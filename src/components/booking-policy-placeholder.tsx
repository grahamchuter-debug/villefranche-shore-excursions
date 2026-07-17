import Link from "next/link";
import type { Metadata } from "next";

import { featuredTour } from "@/lib/featured-tour";
import { buildPageMetadata } from "@/lib/site-metadata";
import { siteConfig } from "@/lib/site-config";

type BookingPolicyPlaceholderProps = {
  title: string;
  path: string;
  description: string;
  lead: string;
  children: React.ReactNode;
};

export function buildPolicyMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return buildPageMetadata({ title, description, path });
}

export function BookingPolicyPlaceholder({
  title,
  path,
  description,
  lead,
  children,
}: BookingPolicyPlaceholderProps) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <p className="text-sm tracking-wide text-stone-500">
        <Link href="/" className="hover:underline">
          {siteConfig.name}
        </Link>
        <span aria-hidden="true"> · </span>
        Placeholder page
      </p>
      <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-stone-900 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-stone-600">{lead}</p>
      <div className="mt-8 space-y-4 text-base leading-7 text-stone-700">
        {children}
      </div>
      <p className="mt-10 text-sm text-stone-500">
        Path: <code className="text-stone-700">{path}</code>
        {description ? null : null}
      </p>
      <p className="mt-8">
        <Link
          href={featuredTour.bookingPath}
          className="font-medium text-teal-800 underline-offset-2 hover:underline"
        >
          Return to booking
        </Link>
      </p>
    </main>
  );
}
