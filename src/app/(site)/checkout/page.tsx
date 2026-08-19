import { CheckoutPage } from "@/components/sections/checkout/CheckoutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Tikkay Shikkay",
  description: "Review your order, enter delivery details, and place your order at Tikkay Shikkay.",
};

export default function CheckoutRoute() {
  return (
    <div className="bg-[var(--bg-base)]">
      <CheckoutPage />
    </div>
  );
}
