import type Stripe from "stripe";

import { jsonResponse } from "../cors";
import {
  claimEvent,
  getBookingByCheckoutSessionId,
  getBookingByPaymentIntentId,
  getBookingByReference,
  updateBookingStatus,
} from "../db";
import { enqueueAndDeliverBookingEmails } from "../email";
import { createStripe } from "../stripe-client";
import type { BookingStatus, PaymentsEnv } from "../types";

export async function handleStripeWebhook(
  request: Request,
  env: PaymentsEnv,
): Promise<Response> {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return jsonResponse({ error: "Webhook secret not configured" }, 503, request, env);
  }

  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return jsonResponse({ error: "Missing Stripe-Signature" }, 400, request, env);
  }

  const payload = await request.text();
  const stripe = createStripe(env);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("webhook_signature_invalid", String(err));
    return jsonResponse({ error: "Invalid signature" }, 400, request, env);
  }

  const bookingRefHint = extractBookingReference(event);

  const alreadyProcessed = await env.DB.prepare(
    `SELECT event_id FROM processed_events WHERE event_id = ? LIMIT 1`,
  )
    .bind(event.id)
    .first<{ event_id: string }>();
  if (alreadyProcessed) {
    return jsonResponse({ received: true, duplicate: true }, 200, request, env);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckoutSession(env, session, event.type);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markPaymentFailedFromSession(env, session);
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await markPaymentFailedFromIntent(env, intent);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(env, charge);
        break;
      }
      case "refund.updated": {
        const refund = event.data.object as Stripe.Refund;
        await handleRefundUpdated(env, refund);
        break;
      }
      default:
        break;
    }

    await claimEvent(env, event.id, event.type, bookingRefHint);
  } catch (err) {
    console.error("webhook_handler_error", event.type, String(err));
    return jsonResponse({ error: "Webhook handler failed" }, 500, request, env);
  }

  return jsonResponse({ received: true }, 200, request, env);
}

function extractBookingReference(event: Stripe.Event): string | null {
  const obj = event.data.object as {
    client_reference_id?: string | null;
    metadata?: Record<string, string> | null;
  };
  return (
    obj.client_reference_id ??
    obj.metadata?.booking_ref ??
    null
  );
}

async function resolveBookingFromSession(
  env: PaymentsEnv,
  session: Stripe.Checkout.Session,
) {
  if (session.id) {
    const bySession = await getBookingByCheckoutSessionId(env, session.id);
    if (bySession) return bySession;
  }
  const ref =
    session.client_reference_id ?? session.metadata?.booking_ref ?? null;
  if (ref) return getBookingByReference(env, ref);
  return null;
}

async function fulfillCheckoutSession(
  env: PaymentsEnv,
  session: Stripe.Checkout.Session,
  eventType: string,
): Promise<void> {
  if (session.payment_status !== "paid" && eventType === "checkout.session.completed") {
    if (session.payment_status === "unpaid") {
      console.log(
        JSON.stringify({
          fulfill_deferred: true,
          sessionId: session.id,
          payment_status: session.payment_status,
        }),
      );
      return;
    }
  }

  const booking = await resolveBookingFromSession(env, session);
  if (!booking) {
    console.error("fulfill_missing_booking", session.id);
    return;
  }

  if (booking.status === "confirmed" || booking.status === "paid") {
    await enqueueAndDeliverBookingEmails(
      env,
      booking.booking_reference,
      booking.customer_email,
    );
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const nextStatus: BookingStatus = "confirmed";
  await updateBookingStatus(env, booking.booking_reference, nextStatus, {
    paymentIntentId,
    customerPhone: session.customer_details?.phone ?? null,
    customerEmail: session.customer_details?.email ?? null,
    customerName: session.customer_details?.name ?? null,
  });

  await enqueueAndDeliverBookingEmails(
    env,
    booking.booking_reference,
    session.customer_details?.email ?? booking.customer_email,
  );
}

async function markPaymentFailedFromSession(
  env: PaymentsEnv,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const booking = await resolveBookingFromSession(env, session);
  if (!booking) return;
  if (booking.status === "confirmed" || booking.status === "paid") return;
  await updateBookingStatus(env, booking.booking_reference, "payment_failed");
}

async function markPaymentFailedFromIntent(
  env: PaymentsEnv,
  intent: Stripe.PaymentIntent,
): Promise<void> {
  let booking = await getBookingByPaymentIntentId(env, intent.id);
  if (!booking && intent.metadata?.booking_ref) {
    booking = await getBookingByReference(env, intent.metadata.booking_ref);
  }
  if (!booking) return;
  if (booking.status === "confirmed" || booking.status === "paid") return;
  await updateBookingStatus(env, booking.booking_reference, "payment_failed", {
    paymentIntentId: intent.id,
  });
}

async function handleChargeRefunded(
  env: PaymentsEnv,
  charge: Stripe.Charge,
): Promise<void> {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id ?? null;
  if (!paymentIntentId) return;

  const booking = await getBookingByPaymentIntentId(env, paymentIntentId);
  if (!booking) return;

  const fullyRefunded =
    charge.refunded ||
    (typeof charge.amount_refunded === "number" &&
      charge.amount_refunded >= charge.amount);
  const status: BookingStatus = fullyRefunded
    ? "refunded"
    : "partially_refunded";
  await updateBookingStatus(env, booking.booking_reference, status);
}

async function handleRefundUpdated(
  env: PaymentsEnv,
  refund: Stripe.Refund,
): Promise<void> {
  if (refund.status !== "succeeded") return;
  const paymentIntentId =
    typeof refund.payment_intent === "string"
      ? refund.payment_intent
      : refund.payment_intent?.id ?? null;
  if (!paymentIntentId) return;

  const booking = await getBookingByPaymentIntentId(env, paymentIntentId);
  if (!booking) return;

  if (booking.status === "refunded") return;
  await updateBookingStatus(env, booking.booking_reference, "partially_refunded");
}
