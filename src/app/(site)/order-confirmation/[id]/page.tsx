import { OrderConfirmationPage } from "@/components/sections/checkout/OrderConfirmationPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation - Tikkay Shikkay",
  description: "Your Tikkay Shikkay order confirmation and live grill status tracking.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmationRoute({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="bg-[var(--bg-base)]">
      <OrderConfirmationPage orderId={id} />
    </div>
  );
}
