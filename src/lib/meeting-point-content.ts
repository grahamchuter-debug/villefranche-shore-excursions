import { featuredTourFacts } from "@/lib/featured-tour-facts";

export const meetingPointVerifiedDescription =
  `Your tour departs near the Villefranche-sur-Mer tender landing area. The exact meeting point address and walking directions are confirmed on your booking confirmation. ${featuredTourFacts.meetingPoint.landmark}.` as const;

export const meetingPointWalkingDirections =
  "Upon arrival at the tender pier, follow the directions on your booking confirmation to reach the meeting point. The walk from the tender landing is typically short and mostly flat, but exact route and timing depend on where your ship's tenders land on the day." as const;

export const meetingPointWalkSummary =
  `${featuredTourFacts.meetingPoint.walkFromTender}` as const;

export const meetingPointFaqs = [
  {
    question: "Where exactly do I meet my guide?",
    answer: meetingPointVerifiedDescription,
  },
  {
    question: "How long is the walk from the tender pier?",
    answer: `${meetingPointWalkSummary}. ${meetingPointWalkingDirections}`,
  },
  {
    question: "What sign should I look for?",
    answer: `${featuredTourFacts.arrivalAdvice} Guide sign and contact details are on your booking confirmation.`,
  },
  {
    question: "Which tender should I take?",
    answer: `${featuredTourFacts.arrivalAdvice} Take one of the earliest available tenders where appropriate so you have time to reach the meeting point and meet your guide before the scheduled tour departure.`,
  },
  {
    question: "What if I arrive early?",
    answer: `Head to ${featuredTourFacts.meetingPoint.landmark}. ${featuredTourFacts.arrivalAdvice} If you cannot see your guide, call the number on your booking confirmation.`,
  },
  {
    question: "What if my tender is delayed?",
    answer:
      "Contact your guide immediately using the number on your booking confirmation. Tender delays happen in Villefranche — operators may wait briefly but cannot hold indefinitely when ship schedules are tight.",
  },
] as const;
