import type { Metadata } from "next";

import { ExcursionDetailPage } from "@/components/excursion-detail-page";
import { ezeVillageRivieraCoastExcursion } from "@/lib/excursions/villefranche-excursions";
import { buildPageMetadata } from "@/lib/site-metadata";

const excursion = ezeVillageRivieraCoastExcursion;

export const metadata: Metadata = buildPageMetadata({
  title: excursion.metaTitle,
  description: excursion.metaDescription,
  path: excursion.path,
  ogImage: excursion.heroImage,
  ogImageAlt: excursion.heroImageAlt,
});

export default function EzeVillageRivieraCoastPage() {
  return <ExcursionDetailPage excursion={excursion} />;
}
