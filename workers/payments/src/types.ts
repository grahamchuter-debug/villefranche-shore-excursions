export type BookingStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "confirmed"
  | "payment_failed"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export type PaymentsEnv = {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  /** Approved retail EUR price per guest (major units, e.g. "149"). Required. */
  BOOKING_PRICE_PER_GUEST_EUR: string;
  CHECKOUT_CURRENCY?: string;
  ORIGINATING_SITE?: string;
  ORIGINATING_PORT?: string;
  SITE_ORIGIN?: string;
  CORS_ALLOWED_ORIGINS?: string;
};

export type CreateCheckoutBody = {
  excursionId: string;
  excursionName: string;
  excursionDate: string;
  shipId?: string | null;
  shipName: string;
  adults?: number;
  children?: number;
  totalGuests: number;
  customerEmail: string;
  customerName: string;
  bookingSessionId?: string | null;
  cancellationProtection?: boolean;
  /** Browser-reported total — ignored for charging; logged only if mismatch. */
  clientDisplayedTotalEur?: number;
  successUrl: string;
  cancelUrl: string;
};

export type BookingRow = {
  id: string;
  booking_reference: string;
  status: BookingStatus;
  excursion_id: string;
  excursion_name: string;
  excursion_date: string;
  ship_id: string | null;
  ship_name: string;
  adults: number;
  children: number;
  total_guests: number;
  currency: string;
  amount_total_cents: number;
  unit_amount_cents: number;
  cancellation_protection: number;
  originating_site: string;
  originating_port: string | null;
  booking_session_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  idempotency_key: string;
  email_confirmation_sent_at: string | null;
  email_supplier_sent_at: string | null;
  created_at: string;
  updated_at: string;
};
