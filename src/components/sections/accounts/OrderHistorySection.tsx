"use client";

import { ReceiptText } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { OrderCard, EmptyState } from "@/components/ui/accounts";
import { AccountOrder, MenuItem } from "@/types";

interface OrderHistorySectionProps {
  orders: AccountOrder[];
  menuItems: MenuItem[];
}

export function OrderHistorySection({
  orders,
  menuItems,
}: OrderHistorySectionProps) {
  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Order History"
            title="Your Orders"
            accent="& Tracking"
          />
        </Reveal>

        {orders.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No orders yet"
            description="When you place an order, it will show up here with live status tracking."
            ctaLabel="Browse the menu"
            ctaHref="/menu"
          />
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order, index) => {
              const key = order.id || (order as any)._id || `order-${index}`;
              return (
                <Reveal key={key} delay={index * 0.06}>
                  <OrderCard order={order} menuItems={menuItems} index={index} />
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
