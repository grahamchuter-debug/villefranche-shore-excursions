import type { ExcursionData } from "@/lib/excursion-types";
import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
  featuredTourGuideMeetAdvice,
  featuredTourMeetingInstructions,
  featuredTourMeetingPointLine,
} from "@/lib/featured-tour-facts";
import { operatorImageSlots } from "@/lib/operator-images";
import { meetingPointPath, portGuidePath } from "@/lib/site-paths";
import { ezeVillageAlt, siteImages } from "@/lib/site-images";

export const smallGroupMonacoMonteCarloEzeExcursion: ExcursionData = {
  slug: featuredTour.slug,
  path: featuredTour.path,
  title: featuredTour.cardName,
  headline: featuredTour.fullName,
  lead: "The recommended Villefranche shore excursion for cruise passengers — visit Monaco, Monte Carlo and Eze in one port day by small-group van, without the stress of planning train, taxi and bus connections independently.",
  metaTitle:
    "Small Group Monaco, Monte Carlo & Eze Shore Excursion from Villefranche",
  metaDescription:
    "Book the small-group Monaco, Monte Carlo and Eze shore excursion for cruise passengers tendering into Villefranche-sur-Mer. French Riviera highlights, local guide, and return-to-ship timing.",
  heroImage: siteImages.monacoHarbour,
  heroImageAlt:
    "Monaco harbour on the small-group Villefranche shore excursion to Monaco, Monte Carlo and Eze",
  heroBadge: "⭐ Most Popular Cruise Excursion",
  summary: {
    duration: featuredTourFacts.durationLabel,
    meetingPoint: featuredTourMeetingPointLine,
    returnReassurance:
      "Timed for typical port calls with buffer before all aboard",
    bestFor:
      "Cruise passengers who want Monaco, Monte Carlo and Eze in one port day from Villefranche",
  },
  snapshotCards: [
    { label: "Tender transfer", value: "Allow generous time each way — queues vary" },
    { label: "Fitness level", value: "Easy to moderate — some walking in Eze village" },
    { label: "Vehicle", value: featuredTourFacts.vehicle.label },
    { label: "Group size", value: `${featuredTourGroupSizeLine} · ${featuredTourFacts.vehicle.largerGroupsNote}` },
    { label: "Port call suitability", value: "Best when you have enough usable hours ashore after tender time" },
  ],
  gallery: [
    {
      src: operatorImageSlots.monacoWaterfront.src,
      alt: operatorImageSlots.monacoWaterfront.alt,
    },
    {
      src: operatorImageSlots.ezeVillage.src,
      alt: operatorImageSlots.ezeVillage.alt,
    },
    {
      src: operatorImageSlots.smallGroupVan.src,
      alt: operatorImageSlots.smallGroupVan.alt,
    },
    {
      src: operatorImageSlots.meetingPointLanding.src,
      alt: operatorImageSlots.meetingPointLanding.alt,
    },
    {
      src: operatorImageSlots.tenderPierWalk.src,
      alt: operatorImageSlots.tenderPierWalk.alt,
    },
    {
      src: siteImages.monacoHarbour,
      alt: "Monaco harbour on the small-group Villefranche shore excursion",
    },
    {
      src: siteImages.monteCarlo,
      alt: "Monte Carlo on the French Riviera shore excursion from Villefranche",
    },
    {
      src: siteImages.ezeVillage,
      alt: ezeVillageAlt,
    },
    {
      src: siteImages.villefrancheHarbour,
      alt: "Villefranche-sur-Mer harbour with colourful waterfront buildings",
    },
    {
      src: siteImages.frenchRivieraCoast,
      alt: "French Riviera coastline on the Côte d'Azur shore excursion",
    },
  ],
  highlights: [
    "Visits Monaco — harbour, palace district and Principality highlights",
    "Visits Monte Carlo — famous casino quarter and Riviera glamour when timing allows",
    "Visits Eze — medieval hill village with panoramic French Riviera views",
    "Designed for cruise passengers — built around tender timing and all-aboard pressure",
    "Small-group van format — capacity confirmed at booking",
    "Avoids the stress of planning train, taxi and bus connections independently",
    "Return-to-ship planning built around your cruise schedule",
  ],
  description: [
    `This is the excursion we recommend for cruise passengers calling at Villefranche-sur-Mer. Most passengers want Monaco, Monte Carlo and Eze — but tender timing, traffic, train connections and return-to-ship pressure make independent planning stressful.`,
    "This small-group excursion is designed around a cruise port day. Your guide and driver handle routes, pacing and logistics so you can see the key French Riviera highlights without booking a private vehicle.",
    "Ships typically anchor in the bay and tender into the harbour. The tour is planned around that reality, with a meeting point near the tender landing and enough margin to get you back before all aboard.",
    "From Monaco and Monte Carlo to Eze village, your guide monitors traffic and tender queues throughout the day so the group returns to Villefranche with time to spare.",
  ],
  whyCruisePassengers: [
    "Most cruise passengers visiting Villefranche want Monaco, Monte Carlo and Eze — this tour covers all three in one coordinated port day",
    "Avoids navigating buses, trains and taxis on a tight schedule when tender queues and all-aboard time are already pressing",
    featuredTourMeetingInstructions,
    `${featuredTourFacts.arrivalAdvice} Villefranche-sur-Mer is typically a ${featuredTourFacts.portType.toLowerCase()}.`,
    "Your guide monitors traffic on the coastal roads and adjusts the pace if queues at the tender pier are building",
    "A practical alternative to a private vehicle — shared small-group format at a lower cost per person",
  ],
  itinerary: [
    {
      title: `Meet near the tender landing`,
      description: `${featuredTourMeetingInstructions} ${featuredTourFacts.arrivalAdvice}`,
    },
    {
      title: "Scenic coastal drive along the Côte d'Azur",
      description:
        "Travel by small vehicle along the Corniche roads with views of the French Riviera coastline. Your guide shares local context as you head toward Monaco.",
    },
    {
      title: "Monaco & Monte Carlo",
      description:
        "Explore the Principality of Monaco and Monte Carlo — harbour views, palace district, and the famous casino quarter when timing allows.",
    },
    {
      title: "Eze village",
      description:
        "Discover the medieval hilltop village of Eze — narrow stone lanes, artisan shops, and panoramic views over the Mediterranean.",
    },
    {
      title: "Return to Villefranche",
      description:
        "Head back toward Villefranche-sur-Mer with your guide monitoring the schedule throughout the day.",
    },
    {
      title: "Return to the tender pier",
      description:
        "Your guide ensures the group reaches the Villefranche harbour with time to queue for the return tender. Be at the pier well before all aboard — allow generous margin on busy days.",
    },
  ],
  bestForDetails: [
    "First-time visitors who want the classic French Riviera experience in one port day",
    "Passengers with enough usable hours ashore once tender transfers are counted",
    "Travellers who prefer small groups over large coach tours",
    "Anyone who wants Monaco, Monte Carlo and Eze without transport stress",
    "Not ideal for very short port calls — consider staying in Villefranche village instead",
  ],
  included: [
    "Small-group guided tour with limited spaces",
    "Local English-speaking guide",
    "Coastal transport between Monaco, Monte Carlo, Eze and Villefranche",
    "Free time in Eze village",
    "Return-to-ship timing coordination",
  ],
  notIncluded: [
    "Tender boat between ship and shore (provided by your cruise line)",
    "Food, drinks, and personal shopping",
    "Gratuities for your guide",
    "Travel insurance or personal expenses",
  ],
  timingAdvice: [
    "Check your cruise app for tender departure times, all aboard, and final departure before booking. Treat all aboard as your hard deadline.",
    "Allow generous time before all aboard to queue for the return tender, clear any security, and board without stress.",
    `${featuredTourFacts.arrivalAdvice} Disembark on an early tender on busy port days.`,
    "Compare your hours in port using our cruise planner to confirm this tour fits your schedule comfortably.",
  ],
  faqs: [
    {
      question: "Where does this excursion meet cruise passengers?",
      answer: featuredTourMeetingInstructions,
    },
    {
      question: "How long is the Monaco, Monte Carlo and Eze tour?",
      answer: `${featuredTourFacts.durationLabel}. Duration may vary slightly depending on traffic and your ship's port times.`,
    },
    {
      question: "Will I get back to my cruise ship on time?",
      answer:
        "This excursion is designed for typical Villefranche port calls with a buffer before all aboard. Only your cruise line confirms the final deadline — monitor your ship's app throughout the day.",
    },
    {
      question: "Can I do this tour if my port call is only six hours?",
      answer:
        "Six hours scheduled in port may work once tender time is counted. Use our cruise planner with your arrival and departure times to confirm you have enough usable time ashore.",
    },
    {
      question: "How do I find my guide?",
      answer: `${featuredTourMeetingPointLine}. ${featuredTourFacts.meetingPoint.walkFromTender}. ${featuredTourGuideMeetAdvice}`,
    },
    {
      question: "Why book a small-group tour instead of going independently?",
      answer:
        "Independent travel requires navigating tender boats, local buses, and return timing on your own. A small-group tour with a local guide handles transport, knows the fastest routes, and builds return-to-ship margins into the itinerary.",
    },
    {
      question: "Does this tour visit Monaco, Monte Carlo and Eze?",
      answer:
        "Yes — Monaco, Monte Carlo and Eze village are all included. Villefranche-sur-Mer is where you tender ashore and where the tour returns, giving you time to reach the pier before all aboard.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Shore Excursions", href: "/excursions" },
    { label: featuredTour.cardName },
  ],
  relatedLinks: [
    { label: "Book this tour", href: featuredTour.bookingPath },
    { label: "Port guide", href: portGuidePath },
    { label: "Tender information", href: "/villefranche-tender-information" },
    { label: "Meeting point", href: meetingPointPath },
    { label: "One day in Villefranche", href: "/one-day-in-villefranche" },
    { label: "Cruise planner", href: "/cruise-planner" },
  ],
  bookingHref: featuredTour.bookingPath,
  bookingLabel: "Book now",
  ctaTitle: "Ready to explore the French Riviera from Villefranche?",
  ctaText:
    "Secure your place on this small-group tour before port day. Monaco, Monte Carlo and Eze, local guides, tender-friendly timing, and return-to-ship reassurance.",
};

export const monacoMonteCarloHighlightsExcursion: ExcursionData = {
  slug: "monaco-monte-carlo-highlights",
  path: "/excursions/monaco-monte-carlo-highlights",
  title: "Monaco & Monte Carlo Highlights",
  headline: "Monaco & Monte Carlo Highlights for Cruise Passengers",
  lead: "Discover Monaco and Monte Carlo on an intimate small-group excursion from Villefranche — harbour views, palace district, and reliable return-to-ship timing for tender passengers.",
  metaTitle: "Monaco & Monte Carlo Highlights Shore Excursion from Villefranche",
  metaDescription:
    "Small-group Monaco and Monte Carlo highlights shore excursion for cruise passengers tendering into Villefranche-sur-Mer. French Riviera tour with local guide and return-to-ship timing.",
  heroImage: siteImages.monacoHarbour,
  heroImageAlt: "Monaco harbour on the French Riviera",
  heroBadge: "⭐ Small Group Favourite",
  summary: {
    duration: "Duration confirmed at booking",
    meetingPoint: "Near the Villefranche tender landing — details on confirmation",
    returnReassurance:
      "Coordinated return with tender queue buffer",
    bestFor:
      "Travellers who want Monaco and Monte Carlo without the full three-destination itinerary",
  },
  snapshotCards: [
    { label: "Tender transfer", value: "Allow generous time each way — queues vary" },
    { label: "Fitness level", value: "Easy" },
    { label: "Group size", value: "Small group — capacity confirmed at booking" },
    { label: "Port call suitability", value: "Best when you have enough usable hours ashore" },
  ],
  gallery: [
    { src: siteImages.monacoHarbour, alt: "Monaco harbour on the French Riviera" },
    { src: siteImages.monteCarlo, alt: "Monte Carlo on the Côte d'Azur" },
    { src: siteImages.frenchRivieraCoast, alt: "French Riviera coastal scenery" },
    { src: siteImages.villefrancheHarbour, alt: "Villefranche-sur-Mer harbour" },
  ],
  highlights: [
    "Explore Monaco and Monte Carlo in one port day",
    "Small-group format for a more personal experience",
    "Scenic coastal drive with photo stops when timing allows",
    "Local guide who knows the roads, traffic patterns, and return routes",
    "Designed for tender passengers with built-in schedule margins",
  ],
  description: [
    "Monaco and Monte Carlo are the French Riviera destinations that cruise passengers most want to reach from Villefranche — and this small-group tour is designed to get you there without transport stress.",
    "Your local guide collects the group near the Villefranche tender landing and drives along the coastal road to Monaco. You explore the harbour, palace quarter, and famous casino district when timing allows, with your guide adapting the pace to your ship schedule.",
    "This tour suits passengers who want Monaco and Monte Carlo without committing to the full Monaco–Monte Carlo–Eze itinerary. Independent travel from the tender pier involves multiple connections with unreliable timetables — a guided tour removes that risk on a tight cruise schedule.",
  ],
  included: [
    "Small-group guided tour",
    "Local English-speaking guide",
    "Coastal transport between Villefranche, Monaco and Monte Carlo",
    "Return-to-ship timing coordination",
  ],
  notIncluded: [
    "Tender boat between ship and shore",
    "Food, drinks, and personal purchases",
    "Gratuities for your guide",
    "Travel insurance or personal expenses",
  ],
  timingAdvice: [
    "Use our cruise planner to verify your schedule before booking.",
    "Build a generous buffer before all aboard for the return tender queue.",
    "If your ship arrives late due to tender delays, contact your excursion operator immediately.",
    "Coastal road traffic can slow the return journey on summer weekends.",
  ],
  faqs: [
    {
      question: "How is this different from the Monaco, Monte Carlo and Eze tour?",
      answer:
        "This tour focuses on Monaco and Monte Carlo only, without the Eze village stop. It suits passengers with less time ashore or those who prefer a shorter itinerary.",
    },
    {
      question: "Where do we meet after tendering ashore?",
      answer:
        "Your guide meets you near the tender landing in Villefranche-sur-Mer. Full meeting point details are provided on your booking confirmation.",
    },
    {
      question: "What happens if traffic delays our return?",
      answer:
        "Your guide monitors the schedule throughout the day and chooses the fastest return route. Small-group operators prioritise getting guests back to the tender pier on time.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Shore Excursions", href: "/excursions" },
    { label: "Monaco & Monte Carlo Highlights" },
  ],
  relatedLinks: [
    { label: featuredTour.cardName, href: featuredTour.path },
    { label: "Meeting point", href: meetingPointPath },
    { label: "One day in Villefranche", href: "/one-day-in-villefranche" },
    { label: "Cruise planner", href: "/cruise-planner" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Enquire about this tour",
  ctaTitle: "Ready to discover Monaco and Monte Carlo?",
  ctaText:
    "Book this intimate small-group tour with local guides who know the French Riviera roads and your ship's schedule.",
};

export const ezeVillageRivieraCoastExcursion: ExcursionData = {
  slug: "eze-village-riviera-coast",
  path: "/excursions/eze-village-riviera-coast",
  title: "Eze Village & Riviera Coast",
  headline: "Eze Village & Riviera Coast for Cruise Passengers",
  lead: "Visit the medieval hilltop village of Eze and enjoy scenic French Riviera coastal views — a compact small-group excursion suited to moderate port calls and tender passengers.",
  metaTitle: "Eze Village & French Riviera Coast Shore Excursion from Villefranche",
  metaDescription:
    "Guided Eze village and French Riviera coast shore excursion for cruise passengers. Medieval hill village, coastal scenery, tender-friendly timing, and return-to-ship reassurance.",
  heroImage: siteImages.ezeVillage,
  heroImageAlt: ezeVillageAlt,
  heroBadge: "⭐ French Riviera Highlights",
  summary: {
    duration: "Duration confirmed at booking",
    meetingPoint: "Near the Villefranche tender landing — details on confirmation",
    returnReassurance:
      "Compact duration with buffer for tender return queue",
    bestFor:
      "Passengers wanting Eze village and coastal scenery on a moderate port call",
  },
  snapshotCards: [
    { label: "Walking", value: "Moderate — uphill lanes in Eze village" },
    { label: "Fitness level", value: "Moderate — some uphill sections" },
    { label: "Group size", value: "Small group — capacity confirmed at booking" },
    { label: "Port call suitability", value: "Works when you have enough usable hours ashore" },
  ],
  gallery: [
    { src: siteImages.ezeVillage, alt: ezeVillageAlt },
    { src: siteImages.frenchRivieraCoast, alt: "French Riviera coastal scenery" },
    { src: siteImages.villefrancheHarbour, alt: "Villefranche-sur-Mer harbour" },
    { src: siteImages.coastalScenery, alt: "Côte d'Azur coastal views" },
  ],
  highlights: [
    "Visit Eze — one of the French Riviera's most photographed hill villages",
    "Compact format suited to moderate port calls",
    "Scenic coastal drive with panoramic viewpoints",
    "Local guide who knows the village lanes and best photo spots",
    "Meeting point near the Villefranche tender landing",
    "Ideal for passengers who want Eze without the full Monaco itinerary",
  ],
  description: [
    "Eze is the hilltop village that cruise passengers dream of reaching from Villefranche — medieval stone lanes, artisan shops, and panoramic views over the Côte d'Azur. This small-group tour gets you there without navigating local buses on a tight schedule.",
    "Your guide leads a small group from the Villefranche tender landing along the coastal road to Eze, where you explore the village at a steady pace suited to the group. The compact duration means this excursion works on moderate port calls, as long as you account for tender transfer time.",
    "Reaching Eze independently from the tender pier requires multiple connections with limited schedules. A guided excursion with coordinated transport is the safer choice for return-to-ship reliability.",
  ],
  included: [
    "Guided tour with local English-speaking guide",
    "Small-group format",
    "Coastal transport between Villefranche and Eze",
    "Free time in Eze village",
    "Return-to-ship timing guidance",
  ],
  notIncluded: [
    "Tender boat between ship and shore",
    "Food, drinks, and personal purchases",
    "Gratuities for your guide",
    "Travel insurance or personal expenses",
  ],
  timingAdvice: [
    "This is a flexible excursion for moderate port calls. Allow generous time before all aboard for the return tender.",
    "Wear comfortable walking shoes. Eze village has uphill cobbled lanes.",
    "If your port call is very short, consider staying in Villefranche village instead. Use our cruise planner to check.",
    "Morning departures are best — the village is quieter and you have more margin before all aboard.",
  ],
  faqs: [
    {
      question: "How difficult is the walk in Eze village?",
      answer:
        "Eze has uphill cobbled lanes and some uneven surfaces. Comfortable walking shoes are essential. It is not suitable for guests with significant mobility limitations.",
    },
    {
      question: "Can I do this tour on a shorter port call?",
      answer:
        "It depends on your usable hours ashore once tender time is counted. Use our cruise planner with your arrival and departure times to confirm.",
    },
    {
      question: "Where does the tour start?",
      answer:
        "Your guide meets the group near the tender landing in Villefranche-sur-Mer. Full details are on your booking confirmation.",
    },
    {
      question: "Is this tour good for first-time visitors?",
      answer:
        "Yes — Eze is one of the most iconic French Riviera destinations and pairs well with time in Villefranche harbour before or after the tour.",
    },
  ],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Shore Excursions", href: "/excursions" },
    { label: "Eze Village & Riviera Coast" },
  ],
  relatedLinks: [
    { label: featuredTour.cardName, href: featuredTour.path },
    { label: "Monaco vs Eze", href: "/monaco-vs-eze" },
    { label: "Tender information", href: "/villefranche-tender-information" },
    { label: "Cruise planner", href: "/cruise-planner" },
  ],
  bookingHref: "/excursions",
  bookingLabel: "Enquire about this tour",
  ctaTitle: "Ready to visit Eze from Villefranche?",
  ctaText:
    "Book this compact guided tour — ideal for passengers who want Eze village, coastal scenery, and reliable return-to-ship timing.",
};
