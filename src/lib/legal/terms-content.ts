import { BUSINESS_DECISION_REQUIRED } from "@/lib/legal/constants";
import type { LegalPageContent } from "@/lib/legal/types";
import { siteConfig } from "@/lib/site-config";

/**
 * Draft Booking Terms structure for business/legal review.
 * Sections marked pendingApproval (or paragraphs set to BUSINESS_DECISION_REQUIRED)
 * are omitted from customer rendering until approved copy is supplied.
 */
export const termsContent: LegalPageContent = {
  path: "/terms-and-conditions",
  title: "Booking Terms and Conditions",
  metaDescription:
    "Booking terms and conditions for Villefranche Shore Excursions shore excursions for cruise passengers.",
  lastUpdated: BUSINESS_DECISION_REQUIRED,
  lead: `These terms explain how bookings work with ${siteConfig.name}. They apply to shore excursions arranged for cruise passengers visiting Villefranche-sur-Mer.`,
  sections: [
    {
      id: "about-us",
      title: "1. About Us",
      paragraphs: [
        `${siteConfig.name} arranges small-group shore excursions for cruise passengers calling at Villefranche-sur-Mer on the French Riviera.`,
        BUSINESS_DECISION_REQUIRED, // legal entity / trading status
      ],
    },
    {
      id: "making-a-booking",
      title: "2. Making a Booking",
      paragraphs: [
        "You may request or place a booking through our website by selecting your excursion, cruise date, ship where listed, and guest numbers, then providing your contact details.",
        "A booking is not confirmed until you receive written confirmation from us (usually by email).",
      ],
    },
    {
      id: "prices-and-payment",
      title: "3. Prices and Payment",
      paragraphs: [
        "Prices are shown in euros on the booking pages at the time you book.",
        "Online card payments are intended to be processed securely by Stripe. We do not ask you to email full card details.",
        BUSINESS_DECISION_REQUIRED, // taxes, surcharges, when payment is taken
      ],
    },
    {
      id: "booking-confirmation",
      title: "4. Booking Confirmation",
      paragraphs: [
        "After your booking is confirmed you will receive confirmation details by email, including the excursion, date, guest numbers and meeting guidance once available.",
        "Please check your confirmation carefully and contact us promptly if anything appears incorrect.",
      ],
    },
    {
      id: "customer-responsibilities",
      title: "5. Customer Responsibilities",
      paragraphs: [
        "You are responsible for arriving at the meeting point on time, bringing any documents your cruise line requires for going ashore, and ensuring each guest is fit to take part in the excursion as described.",
        "You must provide accurate ship and sailing information so we can plan the day around your port visit.",
      ],
    },
    {
      id: "cruise-ship-information",
      title: "6. Cruise Ship and Sailing Information",
      paragraphs: [
        "Shore excursions are planned around the cruise schedule information available for your sailing. Published ship times can change.",
        "Please tell us as soon as possible if your cruise line changes your call at Villefranche so we can review your booking.",
      ],
    },
    {
      id: "meeting-instructions",
      title: "7. Meeting Instructions",
      paragraphs: [
        "Meeting point and timing details are provided with your booking confirmation or final voucher.",
        "Exact guide identification details are confirmed for your booking rather than published as a fixed public address on every page.",
      ],
    },
    {
      id: "changes-by-customer",
      title: "8. Changes by the Customer",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // amendment fees, cutoffs, what can be changed
      ],
    },
    {
      id: "cancellation-by-customer",
      title: "9. Cancellation by the Customer",
      paragraphs: [
        "Customer cancellation terms are set out in our Cancellation Policy. Please read that page together with these terms.",
        BUSINESS_DECISION_REQUIRED, // cross-reference once refund windows are approved
      ],
    },
    {
      id: "changes-or-cancellation-by-us",
      title: "10. Changes or Cancellation by Us or the Supplier",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // alternatives, refunds, force majeure wording
      ],
    },
    {
      id: "cruise-itinerary-changes",
      title: "11. Cruise Itinerary Changes",
      paragraphs: [
        "Cruise itineraries and arrival arrangements can occasionally change. Contact us as soon as possible if your cruise line alters your Villefranche visit so we can review the arrangements for your booking.",
        BUSINESS_DECISION_REQUIRED, // refund/transfer rules for missed ports
      ],
    },
    {
      id: "return-to-ship",
      title: "12. Return to Ship Commitment",
      paragraphs: [
        "Your excursion is planned around the operating times of your cruise ship, with appropriate time allowed for your return to Villefranche.",
        "More detail is available on our Return to Ship Commitment page. The full scope of that commitment forms part of these terms once approved.",
        BUSINESS_DECISION_REQUIRED, // final legal scope of the commitment
      ],
    },
    {
      id: "weather-and-operations",
      title: "13. Weather and Operational Conditions",
      paragraphs: [
        "Weather, traffic, tender operations and local conditions can affect timing and routing on the day.",
        BUSINESS_DECISION_REQUIRED, // customer remedies when operations change
      ],
    },
    {
      id: "passenger-conduct",
      title: "14. Passenger Conduct",
      paragraphs: [
        "We ask all guests to follow reasonable guidance from the driver and local operator so the group can enjoy the day safely and return to port as planned.",
        BUSINESS_DECISION_REQUIRED, // refusal/removal consequences
      ],
    },
    {
      id: "mobility-accessibility",
      title: "15. Mobility, Accessibility and Medical Requirements",
      paragraphs: [
        "Please tell us about mobility, accessibility or medical needs before booking so we can advise whether the excursion is suitable.",
        BUSINESS_DECISION_REQUIRED, // formal accessibility limitations
      ],
    },
    {
      id: "children-and-age",
      title: "16. Children and Age Requirements",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // minimum ages, child pricing, seat requirements
      ],
    },
    {
      id: "personal-belongings",
      title: "17. Personal Belongings",
      paragraphs: [
        "Please look after your personal belongings during the excursion. We recommend carrying only what you need ashore.",
        BUSINESS_DECISION_REQUIRED, // loss/damage responsibility wording
      ],
    },
    {
      id: "complaints-and-contact",
      title: "18. Complaints and Contact",
      paragraphs: [
        `If you have a concern before, during or after your excursion, contact us at ${siteConfig.bookingEmail} as soon as practical so we can look into it.`,
      ],
    },
    {
      id: "liability",
      title: "19. Liability",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // do not invent liability caps or exclusions
      ],
    },
    {
      id: "governing-law",
      title: "20. Governing Law and Jurisdiction",
      pendingApproval: true,
      paragraphs: [
        BUSINESS_DECISION_REQUIRED, // do not invent jurisdiction
      ],
    },
    {
      id: "contact-details",
      title: "21. Contact Details",
      paragraphs: [
        `Email: ${siteConfig.bookingEmail}`,
        BUSINESS_DECISION_REQUIRED, // registered address / company numbers
      ],
    },
  ],
};
