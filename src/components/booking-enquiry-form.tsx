"use client";

import { useState } from "react";

import { siteConfig } from "@/lib/site-config";

type BookingEnquiryFormProps = {
  tourName: string;
};

type FormFields = {
  name: string;
  email: string;
  mobile: string;
  cruiseLine: string;
  shipName: string;
  portDate: string;
  guests: string;
  mobilityConcerns: string;
  message: string;
};

const initialFields: FormFields = {
  name: "",
  email: "",
  mobile: "",
  cruiseLine: "",
  shipName: "",
  portDate: "",
  guests: "",
  mobilityConcerns: "",
  message: "",
};

export function BookingEnquiryForm({ tourName }: BookingEnquiryFormProps) {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [submitted, setSubmitted] = useState(false);

  function updateField(key: keyof FormFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`Booking enquiry: ${tourName}`);
    const body = encodeURIComponent(
      [
        `Tour: ${tourName}`,
        "",
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Mobile: ${fields.mobile || "Not provided"}`,
        `Cruise line: ${fields.cruiseLine || "Not provided"}`,
        `Ship: ${fields.shipName || "Not provided"}`,
        `Sailing date / port date: ${fields.portDate || "Not provided"}`,
        `Number of guests: ${fields.guests || "Not provided"}`,
        `Mobility concerns: ${fields.mobilityConcerns || "None stated"}`,
        "",
        "Message:",
        fields.message || "No additional message",
      ].join("\n"),
    );

    window.location.href = `mailto:${siteConfig.bookingEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Thank you — your enquiry is ready to send
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-700">
          Your email app should open with your booking details. If it does not,
          email us directly at{" "}
          <a
            href={`mailto:${siteConfig.bookingEmail}`}
            className="font-medium text-blue-700 underline"
          >
            {siteConfig.bookingEmail}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-blue-700 underline"
        >
          Edit enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Full name *
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Email *
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Mobile number
          </span>
          <input
            type="tel"
            name="mobile"
            autoComplete="tel"
            value={fields.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Number of guests
          </span>
          <input
            type="number"
            name="guests"
            min={1}
            max={20}
            value={fields.guests}
            onChange={(event) => updateField("guests", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Cruise line
          </span>
          <input
            type="text"
            name="cruiseLine"
            value={fields.cruiseLine}
            onChange={(event) => updateField("cruiseLine", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Ship name
          </span>
          <input
            type="text"
            name="shipName"
            value={fields.shipName}
            onChange={(event) => updateField("shipName", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-900">
            Sailing date / port date
          </span>
          <input
            type="date"
            name="portDate"
            value={fields.portDate}
            onChange={(event) => updateField("portDate", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-900">
          Any mobility concerns
        </span>
        <textarea
          name="mobilityConcerns"
          rows={2}
          placeholder="Walking difficulties, wheelchair use, or other accessibility needs..."
          value={fields.mobilityConcerns}
          onChange={(event) =>
            updateField("mobilityConcerns", event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-900">
          Message
        </span>
        <textarea
          name="message"
          rows={4}
          placeholder="Ship arrival and departure times, special requests, or questions about the tour..."
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
      >
        Send booking enquiry
      </button>

      <p className="text-sm leading-6 text-gray-600">
        We will confirm availability, meeting point details, and return-to-ship
        timing by email. Spaces are limited on small-group tours — book early
        on busy port days.
      </p>
    </form>
  );
}
