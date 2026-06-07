import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourFacts,
  featuredTourGroupSizeLine,
  featuredTourGuideMeetAdvice,
  featuredTourMeetingInstructions,
  featuredTourMeetingPointSummary,
} from "@/lib/featured-tour-facts";

export const featuredTourProductStatement =
  `The recommended cruise excursion from Villefranche is the ${featuredTour.fullName}.` as const;

export const featuredTourProductBullets = [
  "Visits Monaco",
  "Visits Monte Carlo",
  "Visits Eze",
  "Designed for cruise passengers",
  "Small-group van format",
  "Avoids the stress of planning train, taxi and bus connections independently",
  "Helps passengers see the key French Riviera highlights in one port day",
] as const;

export const featuredTourTrustPoints = [
  "Built for cruise passengers",
  "Tender-port aware",
  "Small group",
  "Local knowledge",
  "Designed around realistic time in port",
  "Return-to-ship planning",
] as const;

export const featuredTourComparisonRows = [
  {
    label: "See more in one cruise day",
    villageOnly: "Villefranche village only — charming but compact on busy days",
    independent:
      "Possible with buses and trains, but connections eat into your time",
    tour: "Monaco, Monte Carlo and Eze in one coordinated small-group excursion",
  },
  {
    label: "Less planning stress",
    villageOnly: "Simple, but you may wonder what you missed along the coast",
    independent:
      "High — tender queues, transport timetables, and return timing are on you",
    tour: "Guide and driver handle routes, pacing, and port-day logistics",
  },
  {
    label: "Local guide and driver support",
    villageOnly: "No",
    independent: "No",
    tour: "Yes — English-speaking local guide throughout",
  },
  {
    label: "Better for tender-port timings",
    villageOnly: "Works for a short harbour stroll only",
    independent: "Risky when connections slip or return queues build",
    tour: featuredTourMeetingPointSummary,
  },
  {
    label: "Eze — often missed by cruise passengers",
    villageOnly: "Not reachable on foot from the tender landing",
    independent: "Often skipped because transport is unreliable on a tight schedule",
    tour: "Included — medieval hill village above the French Riviera",
  },
  {
    label: "Return-to-ship planning",
    villageOnly: "You watch the clock yourself",
    independent: "You watch the clock and manage every connection",
    tour: "Return timing coordinated with typical all-aboard schedules",
  },
] as const;

export const featuredTourSampleItineraryDisclaimer =
  "Example itinerary only. Actual timings may vary by ship schedule, tender operations, traffic, and local conditions. Duration confirmed before booking." as const;

export const featuredTourSampleItinerary = [
  {
    title: "Meet near the Villefranche tender landing",
    description: `${featuredTourMeetingInstructions} ${featuredTourFacts.arrivalAdvice}`,
  },
  {
    title: "Monaco & Monte Carlo",
    description:
      "Explore the Principality of Monaco and Monte Carlo — harbour views, palace district, and the famous casino quarter when timing allows.",
  },
  {
    title: "Eze village",
    description:
      "Visit the medieval hilltop village of Eze with panoramic views over the French Riviera — one of the most popular day-trip destinations from Villefranche.",
  },
  {
    title: "Scenic coastal time",
    description:
      "Drive along the Corniche roads with views of the Côte d'Azur. Photo stops when traffic and timing allow.",
  },
  {
    title: "Return to Villefranche",
    description:
      "Head back toward Villefranche-sur-Mer with your guide monitoring the schedule throughout the day.",
  },
  {
    title: "Free time if schedule allows",
    description:
      "Enjoy the harbour and old town before returning to the tender pier well before all aboard.",
  },
] as const;

export const featuredTourReturnToShipReassurance = [
  "Return-to-ship timing is built into the itinerary — your guide monitors traffic and tender queues throughout the day",
  "We check your ship's published arrival and departure times before confirming your booking",
  "Allow generous time before all aboard for the return tender queue — your guide plans the day with that margin in mind",
  "Only your cruise line confirms the final all-aboard deadline — monitor your ship's app throughout port day",
] as const;

export const featuredTourPassengerQuestions = [
  {
    question: "What tender should I take for a morning tour?",
    answer:
      `Take the earliest tender that gets you ashore in time to reach the meeting area near the harbour tender landing — usually the first or second departure after your ship clears passengers. ${featuredTourMeetingPointSummary} ${featuredTourFacts.arrivalAdvice}`,
  },
  {
    question: "What if I arrive early and cannot see the guide?",
    answer:
      `${featuredTourMeetingPointSummary} ${featuredTourGuideMeetAdvice} Call the number on your booking confirmation if you cannot see your guide. Do not wander far from the meeting area.`,
  },
  {
    question: "What if my tender is delayed?",
    answer:
      "Contact your excursion provider immediately with your ship name and revised arrival time. If the delay is short, the group may wait briefly; if tenders are running significantly late, the operator may adjust the itinerary or offer alternatives. See our guide on what to do if your tender is late for immediate steps.",
  },
  {
    question: "Is Villefranche-sur-Mer a tender port?",
    answer:
      "Yes. Large cruise ships typically anchor in the bay and transfer passengers into Villefranche-sur-Mer by tender boat. Build generous time into your port day for tender transfers in both directions, plus return-queue time before all aboard.",
  },
  {
    question:
      "Is this tour suitable if we want to see more than just Villefranche?",
    answer:
      "Yes — that is exactly what this tour is designed for. You visit Monaco, Monte Carlo and Eze as well as returning to Villefranche, with coordinated transport so you do not lose time navigating local connections on a tight cruise schedule.",
  },
  {
    question: "Why book this tour instead of going independently?",
    answer:
      "Most cruise passengers visiting Villefranche want Monaco, Monte Carlo and Eze — but tender timing, traffic, train connections and return-to-ship pressure make independent planning stressful. This small-group excursion handles transport and pacing so you can see the French Riviera highlights without booking a private vehicle.",
  },
] as const;

export const featuredTourWhyDifferent = {
  heading: "Why this tour is different",
  paragraphs: [
    "Most cruise passengers visiting Villefranche want to see Monaco, Monte Carlo and Eze, but planning this independently can be stressful because of tender timing, traffic, train connections and return-to-ship pressure.",
    "This small-group excursion is designed around a cruise port day, giving passengers a practical way to see the French Riviera highlights without booking a private vehicle.",
    `${featuredTourGroupSizeLine}.`,
    "The itinerary is built specifically around cruise ship schedules and Villefranche tender operations.",
  ],
} as const;

export const featuredTourRecommendedBullets = featuredTourProductBullets;

export const featuredTourWhyCreated = {
  heading: "Why we created this tour",
  paragraphs: [
    "Most cruise passengers only see Villefranche harbour — and it is stunning. But the best French Riviera day combines Villefranche with Monaco, Monte Carlo and Eze: three very different destinations within a short drive of the tender landing.",
    "We built this itinerary specifically around cruise passengers and Villefranche tender operations. That means a confirmed meeting point near the harbour tender landing, realistic pacing for tender ashore and return queues, and enough margin to get you back before all aboard.",
    "If your call is shorter, we will tell you honestly. Villefranche village on foot may be the smarter choice. When you have enough usable hours ashore, check availability and tender timing. With a comfortable window, this small-group tour is the best use of your port day.",
  ],
} as const;

export const bookingReassurancePoints = [
  "Before confirming, we check your ship arrival time, tender arrangements and all aboard time",
  "We make sure the excursion fits your Villefranche port day before taking payment",
  "Meeting point details sent after confirmation",
  "Return-to-ship planning is built into the itinerary",
] as const;

export const bookingPreConfirmReassurance =
  "Before confirming, we check your ship arrival time, tender arrangements and all aboard time to make sure the excursion fits your Villefranche port day." as const;

export const featuredTourRecommendationCopy = {
  label: "Our recommended Villefranche shore excursion",
  title: featuredTour.fullName,
  description: featuredTourFacts.uniqueSellingPoint,
  tourLinkLabel: "View Tour",
  availabilityLinkLabel: "Check Availability",
} as const;

export const featuredTourBooksEarlyPoints = [
  featuredTourGroupSizeLine,
  "Shared small-group van format — not a private vehicle for one family",
  "A shared small-group Villefranche shore excursion visiting Monaco, Monte Carlo and Eze",
  "Works well for many cruise calls once tender time is counted — duration confirmed before booking",
  "Designed around tender-port timing — meet ashore after your ship clears passengers",
  "More affordable than booking a private vehicle for one family or group",
  featuredTourFacts.vehicle.largerGroupsNote,
] as const;
