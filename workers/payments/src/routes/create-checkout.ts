import {
  createBookingReference,
  createIdempotencyKeySync,
} from "../booking-ref";
import { jsonResponse } from "../cors";
import {
  getBookingByIdempotencyKey,
  insertBooking,
  updateBookingStripeIds,
} from "../db";
import {
  calculateAmountCents,
  getCurrency,
  getPricePerGuestEur,
  MAX_GUESTS,
  MIN_GUESTS,
} from "../pricing";
import { createStripe } from "../stripe-client";
import type { CreateCheckoutBody, PaymentsEnv } from "../types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseBody(raw: unknown): CreateCheckoutBody | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as CreateCheckoutBody;
}

export async function handleCreateCheckoutSession(
  request: Request,
  env: PaymentsEnv,
): Promise<Response> {
  let body: CreateCheckoutBody | null = null;
  try {
    body = parseBody(await request.json());
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, request, env);
  }

  if (!body) {
    return jsonResponse({ error: "Invalid request body" }, 400, request, env);
  }

  const errors: string[] = [];
  if (!isNonEmptyString(body.excursionId)) errors.push("excursionId is required");
  if (!isNonEmptyString(body.excursionName))
    errors.push("excursionName is required");
  if (!isNonEmptyString(body.excursionDate) || !ISO_DATE.test(body.excursionDate)) {
    errors.push("excursionDate must be YYYY-MM-DD");
  }
  if (!isNonEmptyString(body.shipName)) errors.push("shipName is required");
  if (!isNonEmptyString(body.customerEmail) || !EMAIL_RE.test(body.customerEmail.trim())) {
    errors.push("customerEmail is required");
  }
  if (!isNonEmptyString(body.customerName)) errors.push("customerName is required");
  if (!isNonEmptyString(body.successUrl)) errors.push("successUrl is required");
  if (!isNonEmptyString(body.cancelUrl)) errors.push("cancelUrl is required");

  const totalGuests = Number(body.totalGuests);
  if (!Number.isInteger(totalGuests) || totalGuests < MIN_GUESTS || totalGuests > MAX_GUESTS) {
    errors.push(`totalGuests must be an integer from ${MIN_GUESTS} to ${MAX_GUESTS}`);
  }

  if (errors.length > 0) {
    return jsonResponse({ error: "Validation failed", details: errors }, 400, request, env);
  }

  let pricePerGuestEur: number;
  try {
    pricePerGuestEur = getPricePerGuestEur(env);
  } catch (err) {
    console.error("pricing_config_error", String(err));
    return jsonResponse(
      { error: "Payments pricing is not configured" },
      503,
      request,
      env,
    );
  }

  const adults =
    typeof body.adults === "number" && Number.isInteger(body.adults)
      ? body.adults
      : totalGuests;
  const children =
    typeof body.children === "number" && Number.isInteger(body.children)
      ? body.children
      : 0;

  if (adults + children !== totalGuests) {
    return jsonResponse(
      { error: "adults + children must equal totalGuests" },
      400,
      request,
      env,
    );
  }

  const { unitAmountCents, amountTotalCents } = calculateAmountCents(
    totalGuests,
    pricePerGuestEur,
  );
  const currency = getCurrency(env);

  if (
    typeof body.clientDisplayedTotalEur === "number" &&
    Number.isFinite(body.clientDisplayedTotalEur)
  ) {
    const clientCents = Math.round(body.clientDisplayedTotalEur * 100);
    if (clientCents !== amountTotalCents) {
      console.warn(
        JSON.stringify({
          price_mismatch: true,
          clientCents,
          serverCents: amountTotalCents,
        }),
      );
    }
  }

  const bookingSessionId =
    typeof body.bookingSessionId === "string" ? body.bookingSessionId : "";
  const shipId =
    typeof body.shipId === "string" && body.shipId.trim()
      ? body.shipId.trim()
      : "custom";

  let idempotencyKey = createIdempotencyKeySync({
    excursionId: body.excursionId.trim(),
    excursionDate: body.excursionDate,
    shipId,
    totalGuests,
    customerEmail: body.customerEmail.trim(),
    bookingSessionId,
  });

  const existing = await getBookingByIdempotencyKey(env, idempotencyKey);
  if (existing?.stripe_checkout_session_id && existing.status === "awaiting_payment") {
    try {
      const stripe = createStripe(env);
      const session = await stripe.checkout.sessions.retrieve(
        existing.stripe_checkout_session_id,
      );
      if (session.url && session.status !== "expired") {
        return jsonResponse(
          {
            url: session.url,
            bookingReference: existing.booking_reference,
            sessionId: session.id,
          },
          200,
          request,
          env,
        );
      }
      // Expired / unusable — new attempt gets a fresh idempotency key.
      idempotencyKey = createIdempotencyKeySync({
        excursionId: body.excursionId.trim(),
        excursionDate: body.excursionDate,
        shipId,
        totalGuests,
        customerEmail: body.customerEmail.trim(),
        bookingSessionId,
        attemptSalt: crypto.randomUUID(),
      });
    } catch (err) {
      console.warn("reuse_session_failed", String(err));
      idempotencyKey = createIdempotencyKeySync({
        excursionId: body.excursionId.trim(),
        excursionDate: body.excursionDate,
        shipId,
        totalGuests,
        customerEmail: body.customerEmail.trim(),
        bookingSessionId,
        attemptSalt: crypto.randomUUID(),
      });
    }
  }

  const bookingReference = createBookingReference();
  const bookingId = crypto.randomUUID();
  const now = new Date().toISOString();
  const originatingSite = env.ORIGINATING_SITE ?? "villefrancheshoreexcursions.com";
  const originatingPort = env.ORIGINATING_PORT ?? "Villefranche";
  const cancellationProtection = body.cancellationProtection ? 1 : 0;

  const metadata: Record<string, string> = {
    booking_ref: bookingReference,
    excursion_id: body.excursionId.trim().slice(0, 40),
    excursion_name: body.excursionName.trim().slice(0, 80),
    excursion_date: body.excursionDate,
    ship_id: shipId.slice(0, 40),
    ship_name: body.shipName.trim().slice(0, 80),
    adults: String(adults),
    children: String(children),
    total_guests: String(totalGuests),
    currency,
    cancel_prot: cancellationProtection ? "1" : "0",
    site: originatingSite.slice(0, 40),
    port: originatingPort.slice(0, 40),
  };
  if (bookingSessionId) {
    metadata.booking_session_id = bookingSessionId.slice(0, 40);
  }

  try {
    await insertBooking(env, {
      id: bookingId,
      booking_reference: bookingReference,
      status: "awaiting_payment",
      excursion_id: body.excursionId.trim(),
      excursion_name: body.excursionName.trim(),
      excursion_date: body.excursionDate,
      ship_id: shipId === "custom" ? null : shipId,
      ship_name: body.shipName.trim(),
      adults,
      children,
      total_guests: totalGuests,
      currency,
      amount_total_cents: amountTotalCents,
      unit_amount_cents: unitAmountCents,
      cancellation_protection: cancellationProtection,
      originating_site: originatingSite,
      originating_port: originatingPort,
      booking_session_id: bookingSessionId || null,
      customer_email: body.customerEmail.trim().toLowerCase(),
      customer_name: body.customerName.trim(),
      customer_phone: null,
      stripe_checkout_session_id: null,
      stripe_payment_intent_id: null,
      idempotency_key: idempotencyKey,
      created_at: now,
      updated_at: now,
    });
  } catch (err) {
    const raced = await getBookingByIdempotencyKey(env, idempotencyKey);
    if (raced?.stripe_checkout_session_id) {
      const stripe = createStripe(env);
      const session = await stripe.checkout.sessions.retrieve(
        raced.stripe_checkout_session_id,
      );
      if (session.url) {
        return jsonResponse(
          {
            url: session.url,
            bookingReference: raced.booking_reference,
            sessionId: session.id,
          },
          200,
          request,
          env,
        );
      }
    }
    console.error("insert_booking_failed", String(err));
    return jsonResponse({ error: "Could not create booking" }, 500, request, env);
  }

  const lineDescription = [
    body.excursionName.trim(),
    body.excursionDate,
    body.shipName.trim(),
    `${totalGuests} guest${totalGuests === 1 ? "" : "s"}`,
  ].join(" · ");

  try {
    const stripe = createStripe(env);
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: bookingReference,
        customer_email: body.customerEmail.trim().toLowerCase(),
        customer_creation: "if_required",
        phone_number_collection: { enabled: true },
        billing_address_collection: "auto",
        line_items: [
          {
            quantity: totalGuests,
            price_data: {
              currency,
              unit_amount: unitAmountCents,
              product_data: {
                name: body.excursionName.trim().slice(0, 120),
                description: lineDescription.slice(0, 500),
                metadata: {
                  excursion_id: body.excursionId.trim().slice(0, 40),
                },
              },
            },
          },
        ],
        metadata,
        payment_intent_data: {
          metadata,
          description: lineDescription.slice(0, 1000),
        },
        success_url: body.successUrl.includes("{CHECKOUT_SESSION_ID}")
          ? body.successUrl
          : appendSessionIdParam(body.successUrl),
        cancel_url: body.cancelUrl,
      },
      { idempotencyKey },
    );

    if (!session.url) {
      return jsonResponse(
        { error: "Stripe did not return a Checkout URL" },
        502,
        request,
        env,
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    await updateBookingStripeIds(
      env,
      bookingReference,
      session.id,
      paymentIntentId,
    );

    return jsonResponse(
      {
        url: session.url,
        bookingReference,
        sessionId: session.id,
      },
      200,
      request,
      env,
    );
  } catch (err) {
    console.error("stripe_session_create_failed", String(err));
    return jsonResponse(
      { error: "Could not start secure payment" },
      502,
      request,
      env,
    );
  }
}

function appendSessionIdParam(url: string): string {
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}session_id={CHECKOUT_SESSION_ID}`;
}
