/**
 * World 2.0 Design System (v1) — JS mirror of CSS tokens in world-2-tokens.css.
 * Prefer CSS variables in components; use these only when a hex is required in JS.
 * Destination accent swap: override the CSS vars; keep these in sync if needed.
 */
export const world2Tokens = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  primaryPressed: "#1e40af",
  primarySoft: "#eff6ff",
  primaryMuted: "#dbeafe",
  navy: "#0c1a24",
  navyDeep: "#0b1220",
  bg: "#ffffff",
  bgWarm: "#fbfcfb",
  surface: "#ffffff",
  greyLight: "#f7f9f8",
  border: "#e4ebe8",
  muted: "#5a6b78",
  link: "#1d4ed8",
  linkHover: "#1e40af",
  success: "#2a6b52",
  warning: "#9a7b4f",
  error: "#b42318",
  gold: "#9a7b4f",
} as const;

/** Tailwind-friendly class fragments for primary / secondary CTAs */
export const w2BtnPrimaryClass =
  "w2-btn w2-btn-primary px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base";

export const w2BtnSecondaryClass =
  "w2-btn w2-btn-secondary px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base";

export const w2BtnPrimaryCompactClass =
  "w2-btn w2-btn-primary px-3.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm";

export const w2LinkClass = "w2-link";
