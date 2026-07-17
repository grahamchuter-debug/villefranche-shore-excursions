import { villefrancheTenderPortAlt } from "@/lib/tender-port-copy";

export const siteHeroAlt =
  "Panoramic daytime view of Port Hercule in Monaco with yachts and the Monte Carlo skyline on the French Riviera" as const;

export const villefrancheCruisePortAlt = villefrancheTenderPortAlt;

export const ezeVillageAlt =
  "The medieval hilltop village of Èze overlooking the Mediterranean and Cap Ferrat on the French Riviera" as const;

/**
 * Site photography map — French Riviera locations only.
 * Booking hero derivatives live under /images/booking (Monaco, Monte Carlo, Èze).
 * Do not reference Portofino / Italian Riviera leftovers in public/images.
 */
export const siteImages = {
  hero: "/images/booking/monaco-port-hercule-1920.webp",
  villefrancheCruisePort: "/images/locations/villefranche-harbour-1920.webp",
  villefrancheHarbour: "/images/locations/villefranche-harbour-1920.webp",
  monacoHarbour: "/images/booking/monaco-port-hercule-1920.webp",
  monteCarlo: "/images/booking/monte-carlo-casino-1920.webp",
  ezeVillage: "/images/booking/eze-village-1920.webp",
  frenchRivieraCoast: "/images/booking/eze-viewpoint-1920.webp",
  nicePromenade: "/images/nice-promenade.png",
  tenderLanding: "/images/locations/villefranche-harbour-1920.webp",
  coastalScenery: "/images/booking/eze-viewpoint-1920.webp",
  villageHarbour: "/images/locations/villefranche-harbour-1920.webp",
} as const;
