import type { Metadata } from "next";

import { LegalPolicyPage } from "@/components/legal-policy-page";
import { contactContent } from "@/lib/legal";
import { resolveContactPage } from "@/lib/legal/resolve";
import { buildPageMetadata } from "@/lib/site-metadata";

const page = resolveContactPage(contactContent);

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.metaDescription,
  path: page.path,
});

export default function ContactPage() {
  return (
    <LegalPolicyPage
      path={page.path}
      title={page.title}
      metaDescription={page.metaDescription}
      lead={page.lead}
      lastUpdated={page.lastUpdated}
      details={page.details}
      closingParagraphs={page.closingParagraphs}
    />
  );
}
