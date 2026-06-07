/** Operational facts for the featured Villefranche shore excursion — single source of truth. */
export const featuredTourFacts = {
  durationLabel: "Duration confirmed before booking",
  portType: "Tender port",
  meetingPoint: {
    landmark: "Near the harbour tender landing",
    streetAddress: "Exact meeting point confirmed after booking",
    locality: "Villefranche-sur-Mer",
    walkFromTender:
      "A short walk from where cruise passengers come ashore — your route is confirmed after booking",
  },
  arrivalAdvice:
    "Aim to arrive a few minutes before departure and use an early tender where appropriate.",
  uniqueSellingPoint:
    "A shared small-group van tour visiting Monaco, Monte Carlo and Eze in one French Riviera port day.",
  vehicle: {
    label: "Small-group van",
    // Vehicle capacity to be confirmed with operator before publishing exact numbers.
    largerGroupsNote: "Final group size confirmed before booking",
  },
} as const;

export const featuredTourMeetingPointSummary =
  "Your exact meeting point is confirmed after booking. Most Villefranche shore excursions meet near the harbour tender landing, a short walk from where cruise passengers come ashore." as const;

export const featuredTourCoordinatedCoverage =
  "covers Monaco, Monte Carlo and Eze on a coordinated small-group excursion" as const;

export const featuredTourMeetingPointLine =
  featuredTourFacts.meetingPoint.landmark;

/** Public website copy — guide identification is sent on the booking confirmation only. */
export const featuredTourGuideMeetAdvice =
  "Look for your guide at the meeting point. Sign and contact details are on your booking confirmation." as const;

export const featuredTourMeetingInstructions =
  `${featuredTourMeetingPointSummary} ${featuredTourGuideMeetAdvice}` as const;

export const featuredTourGroupSizeLine =
  "Small-group van format, with final group size confirmed before booking" as const;
