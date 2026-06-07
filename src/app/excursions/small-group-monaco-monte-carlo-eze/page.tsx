import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { smallGroupMonacoMonteCarloEzeExcursion } from "@/lib/excursions/villefranche-excursions";
import { buildPageMetadata } from "@/lib/site-metadata";

const excursion = smallGroupMonacoMonteCarloEzeExcursion;

export const metadata: Metadata = buildPageMetadata({
  title: excursion.metaTitle,
  description: excursion.metaDescription,
  path: excursion.path,
  ogImage: excursion.heroImage,
  ogImageAlt: excursion.heroImageAlt,
});

export default function SmallGroupMonacoMonteCarloEzePage() {
  return <ExcursionDetailPage excursion={excursion} />;
}
