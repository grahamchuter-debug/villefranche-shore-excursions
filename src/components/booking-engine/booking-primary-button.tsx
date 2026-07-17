"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type BookingPrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "onDark";
};

export const BookingPrimaryButton = forwardRef<
  HTMLButtonElement,
  BookingPrimaryButtonProps
>(function BookingPrimaryButton(
  { children, variant = "primary", className = "", type = "button", ...props },
  ref,
) {
  const base =
    "book-btn inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-[15px] font-semibold tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base";

  const variants = {
    primary:
      "book-btn-primary bg-[var(--book-sea-deep)] text-white hover:bg-[var(--book-ink)] focus-visible:outline-[var(--book-sea)]",
    secondary:
      "book-btn-secondary border border-[var(--book-line)] bg-white text-[var(--book-ink)] hover:border-[var(--book-ink)]/30 focus-visible:outline-[var(--book-sea)]",
    ghost:
      "book-btn bg-transparent text-[var(--book-muted)] hover:text-[var(--book-ink)] focus-visible:outline-[var(--book-sea)]",
    onDark:
      "book-btn-primary border border-white/55 bg-white/12 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-[var(--book-ink)] focus-visible:outline-white",
  } as const;

  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
