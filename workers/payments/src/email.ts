/**
 * Email delivery — outbox-driven stubs ready for a real provider.
 * sent_at / status=sent only after the provider (or stub) accepts the message.
 */

import {
  enqueueEmailOutbox,
  getPendingEmailOutbox,
  markBookingEmailColumnSent,
  markEmailOutboxFailed,
  markEmailOutboxSent,
  type EmailOutboxKind,
} from "./db";
import type { PaymentsEnv } from "./types";

export type EmailKind = "booking_confirmation" | "supplier_notification";

export async function sendBookingEmailStub(args: {
  kind: EmailKind;
  bookingReference: string;
  to?: string | null;
  payload: Record<string, unknown>;
}): Promise<{ accepted: boolean; stub: true }> {
  console.log(
    JSON.stringify({
      email_stub: true,
      kind: args.kind,
      bookingReference: args.bookingReference,
      to: args.to ? "[redacted]" : null,
      keys: Object.keys(args.payload),
    }),
  );
  // Stub always accepts; real providers should throw/return false on rejection.
  return { accepted: true, stub: true };
}

function stubKindForOutbox(kind: EmailOutboxKind): EmailKind {
  return kind === "confirmation"
    ? "booking_confirmation"
    : "supplier_notification";
}

/**
 * Enqueue confirmation + supplier emails (idempotent via unique constraint),
 * then attempt delivery for pending rows. Does not mark sent until accepted.
 */
export async function enqueueAndDeliverBookingEmails(
  env: PaymentsEnv,
  bookingReference: string,
  customerEmail: string | null | undefined,
): Promise<void> {
  const payload = { bookingReference };
  await enqueueEmailOutbox(env, {
    bookingReference,
    kind: "confirmation",
    payload: { ...payload, to: customerEmail ?? null },
  });
  await enqueueEmailOutbox(env, {
    bookingReference,
    kind: "supplier",
    payload,
  });

  await deliverPendingEmails(env, bookingReference, customerEmail);
}

export async function deliverPendingEmails(
  env: PaymentsEnv,
  bookingReference: string,
  customerEmail?: string | null,
): Promise<void> {
  const pending = await getPendingEmailOutbox(env, bookingReference);

  for (const row of pending) {
    try {
      const result = await sendBookingEmailStub({
        kind: stubKindForOutbox(row.kind),
        bookingReference,
        to: row.kind === "confirmation" ? customerEmail : null,
        payload: row.payload_json
          ? (JSON.parse(row.payload_json) as Record<string, unknown>)
          : { bookingReference },
      });

      if (!result.accepted) {
        await markEmailOutboxFailed(env, row.id, "provider rejected message");
        continue;
      }

      const claimed = await markEmailOutboxSent(env, row.id);
      if (claimed) {
        await markBookingEmailColumnSent(env, bookingReference, row.kind);
      }
    } catch (err) {
      console.error("email_outbox_delivery_failed", row.id, String(err));
      await markEmailOutboxFailed(env, row.id, String(err));
    }
  }
}
