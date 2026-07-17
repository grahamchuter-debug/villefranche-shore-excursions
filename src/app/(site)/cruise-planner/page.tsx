import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { CruisePortDayPlanner } from "@/components/cruise-port-day-planner";
import { featuredTour } from "@/lib/featured-tour";
import { featuredTourFacts } from "@/lib/featured-tour-facts";
import { buildPageMetadata } from "@/lib/site-metadata";
import { coreGuideLinks, excursionLinks } from "@/lib/related-links";
import { meetingPointPath } from "@/lib/site-paths";
import { siteImages } from "@/lib/site-images";

const cruisePlannerHeroAlt =
  "Villefranche harbour waterfront for cruise passengers planning shore excursions";

const pageMeta = {
  title: "Villefranche Cruise Planner for Shore Excursions",
  description:
    "Interactive Villefranche cruise planner: enter ship times and see usable time ashore after tender delays, return-to-ship guidance, and small-group excursion recommendations.",
  path: "/cruise-planner",
  ogImage: siteImages.tenderLanding,
  ogImageAlt: cruisePlannerHeroAlt,
} as const;

export const metadata: Metadata = buildPageMetadata(pageMeta);

const relatedLinks = [
  { label: featuredTour.fullName, href: featuredTour.path },
  { label: "Check availability", href: featuredTour.bookingPath },
  { label: "Tender information", href: "/villefranche-tender-information" },
  { label: "Meeting point", href: meetingPointPath },
  {
    label: "What if my tender is late?",
    href: "/what-if-my-tender-is-late",
  },
  ...excursionLinks.map((l) => ({ label: l.label, href: l.href })),
  ...coreGuideLinks.filter((l) => l.href !== "/cruise-planner"),
] as const;

const faqs = [
  {
    question: "How does the Villefranche cruise planner work?",
    answer:
      "Enter your ship's published arrival and departure times. The planner automatically deducts 30 minutes after arrival before you are realistically ashore, and a 60-minute return window before departure, then shows your usable time ashore, port day rating, and excursion recommendations.",
  },
  {
    question: "Does the planner account for tender transfer time?",
    answer:
      "Yes. Villefranche-sur-Mer is a tender port, so the planner builds in a 30-minute ashore delay after arrival and recommends being at the tender pier 60 minutes before departure. Actual tender queues may vary by cruise line, ship, and local conditions.",
  },
  {
    question: "Should I use published port times or all aboard time?",
    answer:
      "Use your ship's published arrival and departure times in the planner. Always confirm all aboard on your cruise app — that is your hard deadline, and the planner's return time is a cautious planning guide.",
  },
  {
    question: "When is the Small Group Monaco, Monte Carlo and Eze tour recommended?",
    answer:
      "Excellent Fit appears when you have six or more usable hours ashore — a comfortable match once the confirmed tour duration is taken into account. May Work — Check Availability means five to under six usable hours: the tour may work depending on tender timing. Stay Close to Villefranche is shown when you have under five usable hours ashore.",
  },
  {
    question: "What does the port day rating mean?",
    answer:
      "The rating reflects how comfortably your published port times cover tender delays, the tour duration, and return-to-ship margin. Higher scores mean more room for the full small-group French Riviera tour. Lower scores mean staying in Villefranche village is the safer choice.",
  },
] as const;

export default function CruisePlannerPage() {
  return (
    <ContentPage
      title="Villefranche Cruise Planner"
      lead="Enter your ship's port times and see usable time ashore after tender delays — with clear excursion recommendations and return-to-ship guidance for Villefranche-sur-Mer."
      heroImage={pageMeta.ogImage}
      heroImageAlt={pageMeta.ogImageAlt}
      pagePath={pageMeta.path}
      pageDescription={pageMeta.description}
      relatedLinks={relatedLinks}
      faqs={faqs}
      ctaTitle={`Book the ${featuredTour.cardName} tour`}
      ctaText="If the planner recommends the small-group tour, secure your place on the Monaco, Monte Carlo and Eze excursion before port day."
    >
      <section>
        <h2>Plan around your real port time — tender included</h2>
        <p>
          You do not need to subtract tender time yourself. This planner
          calculates how long you are realistically ashore at Villefranche-sur-Mer,
          when to be back at the tender pier, and whether the{" "}
          <Link href={featuredTour.path}>{featuredTour.cardName}</Link> tour
          fits your schedule. For background, read our{" "}
          <Link href="/villefranche-tender-information">tender information</Link>{" "}
          and{" "}
          <Link href={meetingPointPath}>meeting point</Link> guides.
        </p>
      </section>

      <CruisePortDayPlanner />

      <section>
        <h2>After planning: next steps</h2>
        <ul>
          <li>
            <Link href={featuredTour.path}>View the main Villefranche excursion</Link>{" "}
            if the planner recommends it
          </li>
          <li>
            <Link href={featuredTour.bookingPath}>
              Check availability and send your cruise details
            </Link>
          </li>
          <li>
            Read{" "}
            <Link href="/what-if-my-tender-is-late">
              what to do if your tender is late
            </Link>
          </li>
          <li>
            Review our{" "}
            <Link href="/one-day-in-villefranche">one day in Villefranche</Link>{" "}
            itinerary for sample day plans
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
