/**
 * Single source of truth for confirmed business/legal identity.
 *
 * Villefranche Shore Excursions is the customer-facing brand — never replace
 * it with the legal entity name in headings, nav, or hero copy. This file
 * only exists so every legal page, the footer, checkout, and the booking
 * confirmation read the same confirmed values instead of hard-coding them.
 *
 * Anything not listed here (telephone, WhatsApp, liability caps, governing
 * law, refund windows, etc.) is still genuinely unresolved — see
 * `src/lib/legal/constants.ts` (BUSINESS_DECISION_REQUIRED) for those.
 */
export const businessIdentity = {
  tradingName: "Villefranche Shore Excursions",
  legalCompanyName: "Wow A Tour Ltd",
  legalEntityStatement:
    "Villefranche Shore Excursions is a trading name of Wow A Tour Ltd.",
  companyNumber: "11426960",
  registeredJurisdiction: "England and Wales",
  registeredOffice: {
    lines: [
      "Kintyre House",
      "70 High Street",
      "Fareham",
      "Hampshire",
      "United Kingdom",
      "PO16 7BB",
    ],
    /** Single-line, comma-separated — for inline legal sentences. */
    formatted:
      "Kintyre House, 70 High Street, Fareham, Hampshire, United Kingdom, PO16 7BB",
    /** Multi-line — for address blocks. */
    multiline:
      "Kintyre House\n70 High Street\nFareham\nHampshire\nUnited Kingdom\nPO16 7BB",
  },
  customerServiceEmail: "info@villefrancheshoreexcursions.com",
  customerServiceEmailHref: "mailto:info@villefrancheshoreexcursions.com",
  /** Concise statement for use near checkout legal links, before purchase. */
  agentStatus:
    "Villefranche Shore Excursions acts as booking agent for the local excursion provider.",
  /**
   * Full company disclosure — footer, legal pages, contact page, and the
   * booking confirmation. Combines trading name, entity, company number and
   * registered office into one restrained sentence.
   */
  companyDisclosure:
    "Villefranche Shore Excursions is a trading name of Wow A Tour Ltd, registered in England and Wales under company number 11426960. Registered office: Kintyre House, 70 High Street, Fareham, Hampshire, United Kingdom, PO16 7BB.",
  /**
   * Draft "Our Role" wording for the Terms page, subject to final legal
   * review. Displayed to customers per business request — do not treat the
   * wording as final, and do not expand scope beyond what is written here.
   */
  bookingAgentRoleParagraphs: [
    "Wow A Tour Ltd, trading as Villefranche Shore Excursions, acts as a booking agent on behalf of independent local excursion providers.",
    "When you make a booking, we arrange the reservation and collect payment on behalf of the provider identified in your booking confirmation. The excursion itself is supplied and operated by that independent provider.",
    "We remain responsible for providing our booking services with reasonable care and skill. The local provider is responsible for operating the excursion in accordance with the booking description and applicable law.",
  ],
  /**
   * Preferred cancellation-language building blocks. Reuse verbatim rather
   * than paraphrasing back to "if we or the local operator cancel" — that
   * wording implies Wow A Tour Ltd operates the excursion directly.
   */
  cancellationLanguage: {
    triggerStatement:
      "If the local provider cancels the excursion, or if we notify you that the booking cannot be fulfilled",
    refundStatement: "We will arrange a refund to the original payment method.",
  },
  /**
   * Shown wherever a specific supplier's legal identity would otherwise be
   * needed but is not yet configured. Never invent a supplier name — this
   * placeholder (or a real per-tour provider name, once one exists) is the
   * only acceptable value.
   */
  localProviderPlaceholder:
    "Local excursion provider identified on your final voucher",
} as const;
