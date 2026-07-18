/**
 * Email stubs — idempotent hooks ready for a real provider later.
 * Never throw; logging only in Workers.
 */

export type EmailKind = "booking_confirmation" | "supplier_notification";

export async function sendBookingEmailStub(args: {
  kind: EmailKind;
  bookingReference: string;
  to?: string | null;
  payload: Record<string, unknown>;
}): Promise<{ sent: boolean; stub: true }> {
  console.log(
    JSON.stringify({
      email_stub: true,
      kind: args.kind,
      bookingReference: args.bookingReference,
      to: args.to ? "[redacted]" : null,
      keys: Object.keys(args.payload),
    }),
  );
  return { sent: true, stub: true };
}
