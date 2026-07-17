"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type BookingPrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function BookingPrimaryButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: BookingPrimaryButtonProps) {
  const base =
    "inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45 sm:text-lg";

  const variants = {
    primary:
      "bg-[var(--book-sea-deep)] text-white shadow-sm hover:bg-[var(--book-ink)] focus-visible:outline-[var(--book-sea)]",
    secondary:
      "border border-[var(--book-line)] bg-white text-[var(--book-ink)] hover:bg-[var(--book-mist)] focus-visible:outline-[var(--book-sea)]",
    ghost:
      "bg-transparent text-[var(--book-muted)] hover:text-[var(--book-ink)] focus-visible:outline-[var(--book-sea)]",
  } as const;

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
