import type { PaymentsEnv } from "./types";

const LOCALHOST_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function allowedOrigins(env: PaymentsEnv): Set<string> {
  const set = new Set<string>(LOCALHOST_ORIGINS);
  if (env.SITE_ORIGIN) set.add(env.SITE_ORIGIN.replace(/\/$/, ""));
  for (const part of (env.CORS_ALLOWED_ORIGINS ?? "").split(",")) {
    const origin = part.trim().replace(/\/$/, "");
    if (origin) set.add(origin);
  }
  return set;
}

export function corsHeaders(
  request: Request,
  env: PaymentsEnv,
): Record<string, string> {
  const requestOrigin = request.headers.get("Origin");
  const allowed = allowedOrigins(env);
  const allowOrigin =
    requestOrigin && allowed.has(requestOrigin)
      ? requestOrigin
      : env.SITE_ORIGIN?.replace(/\/$/, "") ?? "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function jsonResponse(
  data: unknown,
  status: number,
  request: Request,
  env: PaymentsEnv,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request, env),
    },
  });
}

export function optionsResponse(request: Request, env: PaymentsEnv): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}
