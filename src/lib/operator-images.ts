import { ezeVillageAlt, siteImages } from "@/lib/site-images";

/** Operator photo slots — preferred filenames for future assets; fallbacks avoid broken images until files are added. */
export const operatorImageSlots = {
  meetingPointLanding: {
    preferredPath: "/images/villefranche-meeting-point.jpg",
    src: siteImages.villefrancheCruisePort,
    alt: "Meeting point area near the Villefranche-sur-Mer tender landing",
  },
  tenderPierWalk: {
    preferredPath: "/images/villefranche-tender-pier-walk.jpg",
    src: siteImages.tenderLanding,
    alt: "Walking route from Villefranche tender pier to excursion meeting point",
  },
  monacoWaterfront: {
    preferredPath: "/images/monaco-harbour.jpg",
    src: siteImages.monacoHarbour,
    alt: "Casino de Monte-Carlo at night on a Villefranche shore excursion",
  },
  ezeVillage: {
    preferredPath: "/images/eze-village.jpg",
    src: siteImages.ezeVillage,
    alt: ezeVillageAlt,
  },
  smallGroupVan: {
    preferredPath: "/images/villefranche-small-group-van.jpg",
    src: siteImages.villefrancheHarbour,
    alt: "Small-group shore excursion vehicle for Monaco, Monte Carlo and Eze",
  },
} as const;

export type OperatorImageSlot = (typeof operatorImageSlots)[keyof typeof operatorImageSlots];
