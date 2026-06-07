import Link from "next/link";

import { featuredTour } from "@/lib/featured-tour";
import {
  featuredTourComparisonRows,
  featuredTourPassengerQuestions,
  featuredTourSampleItinerary,
  featuredTourSampleItineraryDisclaimer,
} from "@/lib/featured-tour-content";

export function FeaturedTourComparisonSection() {
  return (
    <section id="why-small-group-tour" className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Why choose the {featuredTour.fullName}?
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
          Villefranche harbour is beautiful — but staying there alone means missing
          Monaco, Monte Carlo and Eze, and managing tender timing on your own.
          Here is how the options compare for cruise passengers.
        </p>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-4 font-semibold text-gray-900" scope="col">
                  What matters on port day
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700" scope="col">
                  Staying only in Villefranche
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700" scope="col">
                  Independent travel
                </th>
                <th
                  className="rounded-t-lg bg-blue-50 px-4 py-3 font-semibold text-blue-900"
                  scope="col"
                >
                  {featuredTour.cardName}
                </th>
              </tr>
            </thead>
            <tbody>
              {featuredTourComparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <th
                    className="py-4 pr-4 align-top font-medium text-gray-900"
                    scope="row"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-4 align-top text-gray-600">
                    {row.villageOnly}
                  </td>
                  <td className="px-4 py-4 align-top text-gray-600">
                    {row.independent}
                  </td>
                  <td className="bg-blue-50/60 px-4 py-4 align-top font-medium text-gray-800">
                    {row.tour}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {featuredTourComparisonRows.map((row) => (
            <article
              key={row.label}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <h3 className="font-semibold text-gray-900">{row.label}</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">
                    Staying only in Villefranche
                  </dt>
                  <dd className="mt-1 text-gray-600">{row.villageOnly}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">
                    Independent travel
                  </dt>
                  <dd className="mt-1 text-gray-600">{row.independent}</dd>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <dt className="font-medium text-blue-900">
                    {featuredTour.cardName}
                  </dt>
                  <dd className="mt-1 text-gray-800">{row.tour}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedTourSampleItinerarySection() {
  return (
    <section id="sample-itinerary" className="border-b bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Sample itinerary: {featuredTour.cardName}
        </h2>
        <p className="mb-8 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
          {featuredTourSampleItineraryDisclaimer}
        </p>

        <div
          role="list"
          className="mx-auto max-w-3xl space-y-5"
        >
          {featuredTourSampleItinerary.map((step, index) => (
            <div key={step.title} role="listitem" className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-700 sm:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <Link
            href={featuredTour.path}
            className="text-sm font-medium text-blue-700 underline underline-offset-2"
          >
            See full tour details, inclusions and FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedTourPassengerQuestionsSection() {
  return (
    <section id="passenger-questions" className="border-t bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
          Real cruise passenger questions
        </h2>
        <dl className="space-y-6">
          {featuredTourPassengerQuestions.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-gray-200 bg-gray-50 p-5"
            >
              <dt className="font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-7 text-gray-700 sm:text-base">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
