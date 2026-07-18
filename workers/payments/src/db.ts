import type { BookingRow, BookingStatus, PaymentsEnv } from "./types";

export async function insertBooking(
  env: PaymentsEnv,
  row: Omit<BookingRow, "email_confirmation_sent_at" | "email_supplier_sent_at"> & {
    email_confirmation_sent_at?: null;
    email_supplier_sent_at?: null;
  },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO bookings (
      id, booking_reference, status, excursion_id, excursion_name, excursion_date,
      ship_id, ship_name, adults, children, total_guests, currency,
      amount_total_cents, unit_amount_cents, cancellation_protection,
      originating_site, originating_port, booking_session_id,
      customer_email, customer_name, customer_phone,
      stripe_checkout_session_id, stripe_payment_intent_id, idempotency_key,
      email_confirmation_sent_at, email_supplier_sent_at, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      NULL, NULL, ?, ?
    )`,
  )
    .bind(
      row.id,
      row.booking_reference,
      row.status,
      row.excursion_id,
      row.excursion_name,
      row.excursion_date,
      row.ship_id,
      row.ship_name,
      row.adults,
      row.children,
      row.total_guests,
      row.currency,
      row.amount_total_cents,
      row.unit_amount_cents,
      row.cancellation_protection,
      row.originating_site,
      row.originating_port,
      row.booking_session_id,
      row.customer_email,
      row.customer_name,
      row.customer_phone,
      row.stripe_checkout_session_id,
      row.stripe_payment_intent_id,
      row.idempotency_key,
      row.created_at,
      row.updated_at,
    )
    .run();
}

export async function getBookingByIdempotencyKey(
  env: PaymentsEnv,
  key: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE idempotency_key = ? LIMIT 1`,
    )
      .bind(key)
      .first<BookingRow>()) ?? null
  );
}

export async function getBookingByReference(
  env: PaymentsEnv,
  reference: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE booking_reference = ? LIMIT 1`,
    )
      .bind(reference)
      .first<BookingRow>()) ?? null
  );
}

export async function getBookingByCheckoutSessionId(
  env: PaymentsEnv,
  sessionId: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE stripe_checkout_session_id = ? LIMIT 1`,
    )
      .bind(sessionId)
      .first<BookingRow>()) ?? null
  );
}

export async function getBookingByPaymentIntentId(
  env: PaymentsEnv,
  paymentIntentId: string,
): Promise<BookingRow | null> {
  return (
    (await env.DB.prepare(
      `SELECT * FROM bookings WHERE stripe_payment_intent_id = ? LIMIT 1`,
    )
      .bind(paymentIntentId)
      .first<BookingRow>()) ?? null
  );
}

export async function updateBookingStripeIds(
  env: PaymentsEnv,
  bookingReference: string,
  sessionId: string,
  paymentIntentId: string | null,
): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE bookings
     SET stripe_checkout_session_id = ?,
         stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
         updated_at = ?
     WHERE booking_reference = ?`,
  )
    .bind(sessionId, paymentIntentId, now, bookingReference)
    .run();
}

export async function updateBookingStatus(
  env: PaymentsEnv,
  bookingReference: string,
  status: BookingStatus,
  extras?: {
    paymentIntentId?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
    customerName?: string | null;
  },
): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE bookings
     SET status = ?,
         stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
         customer_phone = COALESCE(?, customer_phone),
         customer_email = COALESCE(?, customer_email),
         customer_name = COALESCE(?, customer_name),
         updated_at = ?
     WHERE booking_reference = ?`,
  )
    .bind(
      status,
      extras?.paymentIntentId ?? null,
      extras?.customerPhone ?? null,
      extras?.customerEmail ?? null,
      extras?.customerName ?? null,
      now,
      bookingReference,
    )
    .run();
}

export async function markEmailSent(
  env: PaymentsEnv,
  bookingReference: string,
  kind: "confirmation" | "supplier",
): Promise<boolean> {
  const column =
    kind === "confirmation"
      ? "email_confirmation_sent_at"
      : "email_supplier_sent_at";
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE bookings
     SET ${column} = ?, updated_at = ?
     WHERE booking_reference = ? AND ${column} IS NULL`,
  )
    .bind(now, now, bookingReference)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/** Returns true if this event ID was newly recorded (should process). */
export async function claimEvent(
  env: PaymentsEnv,
  eventId: string,
  eventType: string,
  bookingReference: string | null,
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO processed_events (event_id, event_type, booking_reference, processed_at)
       VALUES (?, ?, ?, ?)`,
    )
      .bind(eventId, eventType, bookingReference, now)
      .run();
    return true;
  } catch {
    return false;
  }
}
