/** Operational facts for the featured Villefranche shore excursion — single source of truth. */
export const featuredTourFacts = {
  durationLabel: "Duration confirmed at booking",
  portType: "Tender port",
  meetingPoint: {
    landmark: "Near the Villefranche tender landing",
    streetAddress: "Exact address confirmed on booking",
    locality: "Villefranche-sur-Mer, France",
    walkFromTender:
      "Short walk from the tender landing — route confirmed on booking",
  },
  arrivalAdvice:
    "Aim to arrive a few minutes before departure and use an early tender where appropriate.",
  uniqueSellingPoint:
    "The recommended cruise excursion from Villefranche — a shared small-group van tour visiting Monaco, Monte Carlo and Eze in one French Riviera port day.",
  vehicle: {
    label: "Small-group van",
    largerGroupsNote: "Group size confirmed at booking",
  },
} as const;

export const featuredTourMeetingPointLine =
  `${featuredTourFacts.meetingPoint.landmark}, ${featuredTourFacts.meetingPoint.locality}` as const;

/** Public website copy — guide identification is sent on the booking confirmation only. */
export const featuredTourGuideMeetAdvice =
  "Look for your guide at the meeting point. Sign and contact details are on your booking confirmation." as const;

export const featuredTourMeetingInstructions =
  `Meet at ${featuredTourMeetingPointLine}. ${featuredTourFacts.meetingPoint.walkFromTender}. ${featuredTourGuideMeetAdvice}` as const;

export const featuredTourGroupSizeLine =
  "Small group — capacity confirmed at booking" as const;
