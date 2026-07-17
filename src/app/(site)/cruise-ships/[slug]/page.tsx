import { notFound } from "next/navigation";

import { CruiseShipDetailPage } from "@/components/cruise-ship-detail-page";
import { buildCruiseShipMetadata } from "@/lib/cruise-ship-page";
import {
  getAllCruiseShipSlugs,
  getCruiseShipBySlug,
} from "@/lib/villefranche-cruise-ships";

type CruiseShipPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCruiseShipSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CruiseShipPageProps) {
  const { slug } = await params;
  const ship = getCruiseShipBySlug(slug);

  if (!ship) {
    return {};
  }

  return buildCruiseShipMetadata(ship);
}

export default async function CruiseShipPage({ params }: CruiseShipPageProps) {
  const { slug } = await params;
  const ship = getCruiseShipBySlug(slug);

  if (!ship) {
    notFound();
  }

  return <CruiseShipDetailPage ship={ship} />;
}
