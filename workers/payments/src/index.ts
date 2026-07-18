import { jsonResponse, optionsResponse } from "./cors";
import { handleCreateCheckoutSession } from "./routes/create-checkout";
import { handleGetCheckoutSession } from "./routes/get-session";
import { handleStripeWebhook } from "./routes/webhook";
import type { PaymentsEnv } from "./types";

export default {
  async fetch(request: Request, env: PaymentsEnv): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return optionsResponse(request, env);
    }

    if (path === "/health" && request.method === "GET") {
      return jsonResponse({ ok: true, service: "villefranche-payments" }, 200, request, env);
    }

    if (path === "/api/checkout/session") {
      if (request.method === "POST") {
        return handleCreateCheckoutSession(request, env);
      }
      if (request.method === "GET") {
        return handleGetCheckoutSession(request, env);
      }
      return jsonResponse({ error: "Method not allowed" }, 405, request, env);
    }

    if (path === "/api/stripe/webhook" && request.method === "POST") {
      return handleStripeWebhook(request, env);
    }

    return jsonResponse({ error: "Not found" }, 404, request, env);
  },
} satisfies ExportedHandler<PaymentsEnv>;
