import { businessIdentity } from "@/lib/legal/business-identity";
import { siteHeroAlt, siteImages } from "@/lib/site-images";

export const siteConfig = {
  name: businessIdentity.tradingName,
  url: "https://villefrancheshoreexcursions.com",
  locale: "en_GB",
  defaultDescription:
    "Small-group Villefranche shore excursions for cruise passengers — Monaco, Monte Carlo and Eze tours, plus tender guides and French Riviera port planning.",
  defaultOgImage: siteImages.hero,
  defaultOgImageAlt: siteHeroAlt,
  /** Customer-facing brand only — not the legal entity name. */
  copyrightEntity: businessIdentity.tradingName,
  excursionsHubPath: "/excursions",
  excursionsHubLabel: "Villefranche shore excursions",
  /** Confirmed customer-service address — sourced from businessIdentity. */
  bookingEmail: businessIdentity.customerServiceEmail,
} as const;
