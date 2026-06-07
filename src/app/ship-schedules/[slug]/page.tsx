import { notFound } from "next/navigation";

import { ShipScheduleMonthPage } from "@/components/ship-schedule-month-page";
import { ShipScheduleYearPage } from "@/components/ship-schedule-year-page";
import {
  buildShipScheduleMonthMetadata,
  buildShipScheduleYearMetadata,
} from "@/lib/ship-schedule-page";
import {
  getAllShipScheduleSlugs,
  isShipScheduleMonthSlug,
  isShipScheduleYearSlug,
} from "@/lib/ship-schedule-months";

type ShipScheduleSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllShipScheduleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ShipScheduleSlugPageProps) {
  const { slug } = await params;

  if (isShipScheduleYearSlug(slug)) {
    return buildShipScheduleYearMetadata(slug);
  }

  if (isShipScheduleMonthSlug(slug)) {
    return buildShipScheduleMonthMetadata(slug);
  }

  return {};
}

export default async function ShipScheduleSlugPage({
  params,
}: ShipScheduleSlugPageProps) {
  const { slug } = await params;

  if (isShipScheduleYearSlug(slug)) {
    return <ShipScheduleYearPage yearSlug={slug} />;
  }

  if (isShipScheduleMonthSlug(slug)) {
    return <ShipScheduleMonthPage monthSlug={slug} />;
  }

  notFound();
}
