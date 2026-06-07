import { portGuidePath } from "@/lib/site-paths";

export const siteNavLinks = [
  { label: "Excursions", href: "/excursions" },
  { label: "Port Guide", href: portGuidePath },
  { label: "Tender Info", href: "/villefranche-tender-information" },
  { label: "Cruise Planner", href: "/cruise-planner" },
  { label: "Ship Schedules", href: "/ship-schedules" },
  { label: "Cruise Ships", href: "/cruise-ships" },
  { label: "FAQ", href: "/faq" },
] as const;
