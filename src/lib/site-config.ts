import { siteHeroAlt, siteImages } from "@/lib/site-images";

export const siteConfig = {
  name: "Villefranche Shore Excursions",
  url: "https://villefrancheshoreexcursions.com",
  locale: "en_GB",
  defaultDescription:
    "Small-group Villefranche shore excursions for cruise passengers — Monaco, Monte Carlo and Eze tours, plus tender guides and French Riviera port planning.",
  defaultOgImage: siteImages.hero,
  defaultOgImageAlt: siteHeroAlt,
  copyrightEntity: "Villefranche Shore Excursions",
  excursionsHubPath: "/excursions",
  excursionsHubLabel: "Villefranche shore excursions",
  bookingEmail: "bookings@villefrancheshoreexcursions.com",
} as const;
