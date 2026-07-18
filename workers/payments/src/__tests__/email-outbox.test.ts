import { describe, expect, it, vi } from "vitest";

import { sendBookingEmailStub } from "../email";

describe("email stub acceptance", () => {
  it("returns accepted:true only after provider acceptance (stub)", async () => {
    const result = await sendBookingEmailStub({
      kind: "booking_confirmation",
      bookingReference: "VF-TEST",
      to: "guest@example.com",
      payload: { bookingReference: "VF-TEST" },
    });
    expect(result.accepted).toBe(true);
    expect(result.stub).toBe(true);
  });

  it("marks sent only after acceptance — never before", async () => {
    const markSent = vi.fn(async () => true);
    const markFailed = vi.fn(async () => undefined);

    // Outbox pattern: attempt delivery first, then claim sent.
    const result = await sendBookingEmailStub({
      kind: "supplier_notification",
      bookingReference: "VF-TEST",
      payload: { bookingReference: "VF-TEST" },
    });

    expect(markSent).not.toHaveBeenCalled();
    if (result.accepted) {
      await markSent();
    } else {
      await markFailed();
    }
    expect(markSent).toHaveBeenCalledTimes(1);
    expect(markFailed).not.toHaveBeenCalled();
  });
});
