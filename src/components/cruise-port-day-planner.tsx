"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { featuredTour } from "@/lib/featured-tour";
import { featuredTourFacts } from "@/lib/featured-tour-facts";
import {
  calculateVillefranchePlannerResult,
  getConfidenceTone,
  PLANNER_DISCLAIMER,
  villefranchePortDayPlannerConfig,
  TENDER_ASHORE_DELAY_MINUTES,
  TENDER_PIER_RETURN_BUFFER_MINUTES,
} from "@/lib/cruise-port-day-planner";

const plannerPrimaryButtonClass =
  "w2-btn w2-btn-primary px-5 py-2.5 text-sm";

const plannerSecondaryButtonClass =
  "w2-btn rounded-full border border-[var(--w2-navy)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--w2-navy)] transition hover:bg-[var(--w2-grey-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--w2-focus-ring)]";

const plannerLinkButtonClass =
  "w2-btn w2-btn-secondary px-4 py-2 text-sm";

const plannerBadges = [
  "Tender-aware",
  "Return-to-ship planning",
  "Excursion recommendations",
] as const;

function getRecommendationCardStyles(band: "short" | "good" | "excellent") {
  if (band === "excellent") {
    return {
      outer: "border-emerald-500 bg-gradient-to-br from-emerald-50 via-white to-blue-50",
      inner: "border-emerald-200 bg-white",
      accent: "text-emerald-700",
      bullet: "bg-emerald-600",
    };
  }
  if (band === "good") {
    return {
      outer: "border-blue-500 bg-gradient-to-br from-blue-50 via-white to-sky-50",
      inner: "border-blue-200 bg-white",
      accent: "text-blue-700",
      bullet: "bg-blue-600",
    };
  }
  return {
    outer: "border-slate-300 bg-gradient-to-br from-slate-50 via-white to-sky-50",
    inner: "border-slate-200 bg-white",
    accent: "text-slate-700",
    bullet: "bg-slate-600",
  };
}

function ResultCard({
  title,
  children,
  highlight = false,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm sm:p-5 ${
        highlight
          ? "border-blue-300 bg-white ring-2 ring-blue-100"
          : "border-white/80 bg-white/90 backdrop-blur-sm"
      }`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900/70">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RecommendationCard({
  result,
}: {
  result: Exclude<
    ReturnType<typeof calculateVillefranchePlannerResult>,
    { error: string } | null
  >;
}) {
  const styles = getRecommendationCardStyles(result.band);
  const isMainTour = result.recommendMainTour;

  return (
    <div
      className={`rounded-2xl border-2 p-5 shadow-md sm:p-6 ${styles.outer}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide ${styles.accent}`}>
        Recommended for your port time
      </p>
      <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        {result.recommendationCardTitle}
      </h3>

      {isMainTour ? (
        <>
          {result.recommendationHeading ? (
            <h4 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
              {result.recommendationHeading}
            </h4>
          ) : null}
          <p className="mt-3 text-base leading-7 text-gray-800">
            {result.fitMessage}
          </p>
          <div className={`mt-5 rounded-xl border p-4 sm:p-5 ${styles.inner}`}>
            <p className="text-sm font-semibold text-gray-900">
              {featuredTour.fullName}
            </p>
            {result.mainTourBenefits && result.mainTourBenefits.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-800 sm:text-base">
                {result.mainTourBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${styles.bullet}`}
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={featuredTour.path} className={plannerPrimaryButtonClass}>
                View Small Group Tour
              </Link>
              <Link
                href={featuredTour.bookingPath}
                className={plannerSecondaryButtonClass}
              >
                Check Availability
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 text-base leading-7 text-gray-800">
            {result.fitMessage}
          </p>
          {result.shortStayNote ? (
            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base">
              {result.shortStayNote}
            </p>
          ) : null}
          <div className={`mt-5 rounded-xl border p-4 sm:p-5 ${styles.inner}`}>
            {result.shortStaySuggestions &&
            result.shortStaySuggestions.length > 0 ? (
              <ul className="space-y-2 text-sm leading-6 text-gray-800 sm:text-base">
                {result.shortStaySuggestions.map((suggestion) => (
                  <li key={suggestion} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${styles.bullet}`}
                    />
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/one-day-in-villefranche"
                className={plannerPrimaryButtonClass}
              >
                One Day in Villefranche
              </Link>
              <Link
                href="/excursions/eze-village-riviera-coast"
                className={plannerSecondaryButtonClass}
              >
                View Eze Tour
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RecommendedExcursionSection({
  result,
}: {
  result: Exclude<
    ReturnType<typeof calculateVillefranchePlannerResult>,
    { error: string } | null
  >;
}) {
  if (!result.recommendMainTour) {
    return (
      <aside className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Recommended excursion
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-800">
          We generally recommend at least five hours of usable time ashore to
          allow for tender operations, check-in and a comfortable return to the
          ship.           On a longer Villefranche call, the {featuredTour.cardName} covers
          Monaco, Monte Carlo and Eze on a coordinated small-group excursion.
        </p>
        <Link
          href={featuredTour.path}
          className={`mt-4 ${plannerLinkButtonClass}`}
        >
          View tour details for your next visit
        </Link>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border-2 border-blue-600 bg-blue-50/40 p-4 sm:p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
        Recommended excursion
      </p>
      <h3 className="mt-2 text-lg font-bold text-gray-900">
        {featuredTour.fullName}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-800">
        {result.band === "excellent"
          ? "Your port schedule is a strong match for our most popular small-group French Riviera tour."
          : "Your schedule may work for this tour — confirm tender timing and check availability before port day."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={featuredTour.path} className={plannerPrimaryButtonClass}>
          View Small Group Tour
        </Link>
        <Link href={featuredTour.bookingPath} className={plannerSecondaryButtonClass}>
          Check Availability
        </Link>
      </div>
    </aside>
  );
}

export function CruisePortDayPlanner() {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const result = useMemo(() => {
    if (!arrival || !departure) {
      return null;
    }
    return calculateVillefranchePlannerResult(arrival, departure);
  }, [arrival, departure]);

  const hasValidResult = result && !("error" in result);

  return (
    <section
      aria-labelledby="port-day-planner-heading"
      className="overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-slate-50 p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <div className="max-w-3xl">
        <h2
          id="port-day-planner-heading"
          className="text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          {villefranchePortDayPlannerConfig.heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
          {villefranchePortDayPlannerConfig.subtitle}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {plannerBadges.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-medium text-blue-800"
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Ship arrival time
          </span>
          <input
            type="time"
            value={arrival}
            onChange={(event) => setArrival(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Ship departure time
          </span>
          <input
            type="time"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>
      </div>

      {result ? (
        <div className="mt-6 space-y-4">
          {"error" in result ? (
            <div className="rounded-xl border border-red-200 bg-white/90 p-4 text-sm text-red-700">
              {result.error}
            </div>
          ) : (
            <>
              <RecommendationCard result={result} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ResultCard title="Scheduled port time">
                  <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {result.scheduledPortLabel}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Arrival to departure
                  </p>
                </ResultCard>

                <ResultCard title="Tender planning time">
                  <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {result.tenderPlanningMinutes} min
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {TENDER_ASHORE_DELAY_MINUTES} min ashore delay +{" "}
                    {TENDER_PIER_RETURN_BUFFER_MINUTES} min return window
                  </p>
                </ResultCard>

                <ResultCard title="Usable time ashore" highlight>
                  <p className="text-2xl font-bold text-blue-800 sm:text-3xl">
                    {result.usableAshoreLabel}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    After tender delays are deducted
                  </p>
                </ResultCard>

                <ResultCard title="Port day rating">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getConfidenceTone(result.confidenceScore).badge}`}
                    >
                      {result.confidenceScore}/10
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {result.confidenceLabel}
                    </span>
                  </div>
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200"
                    role="presentation"
                  >
                    <div
                      className={`h-full rounded-full transition-all ${getConfidenceTone(result.confidenceScore).bar}`}
                      style={{ width: `${result.confidenceScore * 10}%` }}
                    />
                  </div>
                </ResultCard>
              </div>

              <ResultCard title="Return-to-ship timing">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Realistically ashore from
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {result.ashoreFromLabel}
                    </dd>
                    <dd className="text-xs text-gray-500">
                      {TENDER_ASHORE_DELAY_MINUTES} min after arrival
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Be at tender pier by
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-blue-800">
                      {result.recommendedTenderPierReturn}
                    </dd>
                    <dd className="text-xs text-gray-500">
                      {TENDER_PIER_RETURN_BUFFER_MINUTES} min before departure
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Ship departs
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {result.departureLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Port type
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-800">
                      Tender port — passengers land in Villefranche-sur-Mer
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {PLANNER_DISCLAIMER}
                </p>
              </ResultCard>

              <ResultCard title="Also worth considering">
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {result.excursions.map((excursion) => (
                    <li key={excursion.label}>
                      {excursion.href ? (
                        <Link
                          href={excursion.href}
                          className={`block rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                            excursion.href === featuredTour.path
                              ? "border-blue-400 bg-blue-50 text-blue-950 hover:border-blue-500 hover:bg-blue-100"
                              : "border-sky-200 bg-white text-gray-900 hover:border-blue-300 hover:bg-sky-50"
                          }`}
                        >
                          {excursion.label}
                        </Link>
                      ) : (
                        <span className="block rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                          {excursion.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard title="Suggested Villefranche day plan">
                <div role="list" className="space-y-2">
                  {result.dayPlan.map((step, index) => (
                    <div
                      key={step}
                      role="listitem"
                      className="flex gap-3 text-sm leading-6 text-gray-700 sm:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800"
                      >
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <RecommendedExcursionSection result={result} />

              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm leading-6 text-gray-600">
                <p className="font-medium text-gray-900">Helpful guides</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  <li>
                    <Link
                      href="/villefranche-tender-information"
                      className="w2-link underline"
                    >
                      Tender information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/villefranche-meeting-point"
                      className="w2-link underline"
                    >
                      Meeting points
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/what-if-my-tender-is-late"
                      className="w2-link underline"
                    >
                      What if my tender is late?
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={featuredTour.path}
                      className="w2-link underline"
                    >
                      Main Villefranche excursion
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={featuredTour.bookingPath}
                      className="w2-link underline"
                    >
                      Check availability
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-sky-200 bg-white/60 px-4 py-3 text-sm text-gray-600">
          Enter your ship&apos;s arrival and departure times to see usable time
          ashore, return-to-ship guidance, and excursion recommendations — with
          tender delays calculated for you.
        </p>
      )}

      {hasValidResult ? null : (
        <p className="mt-3 text-xs leading-5 text-gray-500">
          Villefranche-sur-Mer is a tender port. This planner automatically allows{" "}
          {TENDER_ASHORE_DELAY_MINUTES} minutes after arrival before you are
          ashore, and recommends reaching the tender pier{" "}
          {TENDER_PIER_RETURN_BUFFER_MINUTES} minutes before departure.
        </p>
      )}
    </section>
  );
}
