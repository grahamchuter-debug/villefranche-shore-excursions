import { Fraunces, Outfit } from "next/font/google";

import { BookingCheckoutHeader } from "@/components/booking-engine/booking-checkout-header";

const bookingDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-booking-display",
  weight: ["500", "600", "700"],
});

const bookingSans = Outfit({
  subsets: ["latin"],
  variable: "--font-booking-sans",
  weight: ["400", "500", "600", "700"],
});

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${bookingDisplay.variable} ${bookingSans.variable} booking-engine-root flex min-h-full flex-1 flex-col`}
    >
      <BookingCheckoutHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
