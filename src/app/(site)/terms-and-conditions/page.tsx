import type { Metadata } from "next";

import { LegalPolicyPage } from "@/components/legal-policy-page";
import { termsContent } from "@/lib/legal";
import { resolveLegalPage } from "@/lib/legal/resolve";
import { buildPageMetadata } from "@/lib/site-metadata";

const page = resolveLegalPage(termsContent);

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.metaDescription,
  path: page.path,
});

export default function TermsAndConditionsPage() {
  return (
    <LegalPolicyPage
      path={page.path}
      title={page.title}
      metaDescription={page.metaDescription}
      lead={page.lead}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
    />
  );
}
