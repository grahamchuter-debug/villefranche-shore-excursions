# Stripe Checkout setup (test mode) — Villefranche Shore Excursions

This site is a **static Next.js export**. Secret Stripe operations and webhooks run on a **Cloudflare Worker** with **D1**.

## Architecture

| Layer | Role |
|-------|------|
| Next static site | Booking journey → `POST` Worker → redirect to Stripe Checkout |
| Worker `workers/payments` | Create session, verify session, webhooks, D1 bookings |
| Stripe Checkout | Collect card (+ phone), 3DS, wallets where available |
| D1 | Bookings + processed event IDs (idempotency) |

**Confirm bookings only via verified webhooks** — never because the customer hit the success URL. The success page calls `GET /api/checkout/session?session_id=` to verify payment server-side before showing confirmation.

**No capacity hold in v1** — opening Checkout does not reserve seats.

## Pricing (important)

**Approved retail: €149 per guest.**

Set the **same** value in both places:

| Variable | Where | Value |
|----------|--------|-------|
| `BOOKING_PRICE_PER_GUEST_EUR` | Worker env / `.dev.vars` / Cloudflare secrets (authoritative for charging) | `149` |
| `NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR` | Next `.env.local` (display only; baked at build) | `149` |

The Worker **always recalculates** amount as integer minor units: `149 × guests × 100` cents, and ignores any browser-supplied total (mismatches are logged).

Until these are set, the payment CTA stays blocked with a customer-friendly message.

## Environment variables

### Next.js (`.env.local` — gitignored)

See root `.env.example`.

| Name | Required | Notes |
|------|----------|--------|
| `NEXT_PUBLIC_PAYMENTS_API_URL` | Yes for checkout | Worker origin, e.g. `http://127.0.0.1:8787` or production Worker URL |
| `NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR` | Yes for checkout | Approved retail: `149` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No for hosted Checkout | `pk_test_…` for future client Stripe.js |

### Cloudflare Worker (`.dev.vars` locally; secrets in dashboard)

Copy `workers/payments/.dev.vars.example` → `workers/payments/.dev.vars`.

| Name | Required | Notes |
|------|----------|--------|
| `STRIPE_SECRET_KEY` | Yes | `sk_test_…` only until launch checklist passes |
| `STRIPE_WEBHOOK_SECRET` | Yes | `whsec_…` from Stripe CLI or Dashboard endpoint |
| `BOOKING_PRICE_PER_GUEST_EUR` | Yes | `149` (same as Next public price) |
| `SITE_ORIGIN` | Recommended | Production site origin for CORS + defaults |
| `CORS_ALLOWED_ORIGINS` | Optional | Extra origins (localhost already allowed) |
| `CHECKOUT_CURRENCY` | Optional | Default `eur` |
| `ORIGINATING_SITE` / `ORIGINATING_PORT` | Optional | Metadata defaults |

**Never** put `sk_` / `whsec_` in Next public env, client bundles, or git.

### Where to add keys (do not paste secrets into chat)

1. **Local Next**: project root `.env.local`
2. **Local Worker**: `workers/payments/.dev.vars`
3. **Cloudflare**: Worker → Settings → Variables and Secrets (`wrangler secret put STRIPE_SECRET_KEY`, etc.)
4. **Stripe Dashboard**: Developers → API keys (test), Webhooks → signing secret

## Local run

### 1. Create D1 database (once)

```bash
cd workers/payments
npx wrangler d1 create villefranche-bookings
```

Paste the returned `database_id` into `workers/payments/wrangler.toml`.

### 2. Apply migrations

```bash
cd workers/payments
npm run db:migrate:local
# later, after deploy:
# npm run db:migrate:remote
```

### 3. Start Worker

```bash
cd workers/payments
# ensure .dev.vars is filled with sk_test + whsec + price
npm run dev
```

Default: `http://127.0.0.1:8787`

### 4. Forward webhooks (Stripe CLI)

```bash
stripe listen --forward-to http://127.0.0.1:8787/api/stripe/webhook
```

Copy the CLI `whsec_…` into `.dev.vars` as `STRIPE_WEBHOOK_SECRET`.

### 5. Start Next

```bash
# root .env.local:
# NEXT_PUBLIC_PAYMENTS_API_URL=http://127.0.0.1:8787
# NEXT_PUBLIC_BOOKING_PRICE_PER_GUEST_EUR=149
npm run dev
```

Open `/book/small-group-monaco-monte-carlo-eze`, complete the journey, pay with test card `4242 4242 4242 4242`.

### Deploy Worker

```bash
cd workers/payments
npm run db:migrate:remote
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put BOOKING_PRICE_PER_GUEST_EUR
npm run deploy
```

Point Stripe Dashboard webhook to `https://<worker>/api/stripe/webhook` and subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `payment_intent.payment_failed`
- `charge.refunded`
- `refund.updated`

Rebuild/redeploy the static site with production `NEXT_PUBLIC_PAYMENTS_API_URL` and matching price env.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/checkout/session` | Validate booking, price server-side, create Checkout Session, store `awaiting_payment` |
| `GET` | `/api/checkout/session?session_id=` | Success-page verification |
| `POST` | `/api/stripe/webhook` | Signature-verified fulfillment |
| `GET` | `/health` | Liveness |

Checkout Session uses `mode: payment`, EUR `price_data`, `phone_number_collection.enabled`, metadata + `client_reference_id`, and Stripe idempotency keys.

## Email

Confirmation + supplier emails are **stubs** (logged). Columns `email_confirmation_sent_at` / `email_supplier_sent_at` keep sends idempotent when a real provider is wired.

## Analytics stubs

`src/lib/payments/analytics.ts` emits no-ops for:

`booking_started`, `date_selected`, `ship_selected`, `guest_count_selected`, `checkout_started`, `checkout_cancelled`, `payment_succeeded`, `payment_failed`, `booking_confirmed`.

## Test checklist (before live keys)

- [ ] 1. Successful card payment (`4242…`)
- [ ] 2. American Express test payment
- [ ] 3. Apple Pay / Google Pay where testable
- [ ] 4. 3D Secure authentication
- [ ] 5. Declined card
- [ ] 6. Insufficient funds
- [ ] 7. Incorrect CVC
- [ ] 8. Customer cancels Checkout → returns to payment step with selections
- [ ] 9. Refresh / revisit success page (still shows confirmation when paid)
- [ ] 10. Double-click pay button (single session / idempotency)
- [ ] 11. Duplicate webhook delivery (no duplicate emails / status thrash)
- [ ] 12. Delayed webhook delivery
- [ ] 13. Invalid webhook signature rejected
- [ ] 14. Browser total manipulation ignored (server amount charged)
- [ ] 15. Date / ship / guests changed before payment (new amount)
- [ ] 16. Full refund → booking `refunded`
- [ ] 17. Partial refund → `partially_refunded` (if supported)
- [ ] 18. Confirmation email stub fired only once
- [ ] 19. Supplier notification stub fired only once
- [ ] 20. Mobile: iPhone Safari + Android Chrome

## Live launch checklist

- [ ] All 20 test items passed in **test mode**
- [ ] Approved retail EUR price set identically on Worker + Next build
- [ ] Switch Cloudflare secrets to `sk_live_…` and live `whsec_…`
- [ ] Stripe Dashboard webhook endpoint points at production Worker (live mode)
- [ ] Rebuild static site with production `NEXT_PUBLIC_*` values
- [ ] Confirm CORS allows production origin only (plus temporary staging if needed)
- [ ] Restricted API key considered for production permissions
- [ ] Real email provider wired (replace stubs) before relying on customer comms
- [ ] Monitor first live payments + webhook delivery in Stripe Workbench
- [ ] Document rollback: revert Worker deploy + keep accepting enquiries if needed

## Modular reuse

`src/lib/payments/*` and `workers/payments` are structured for other shore-excursion sites: swap excursion metadata, `ORIGINATING_SITE` / port, and price env — keep the same Checkout + webhook contract.
