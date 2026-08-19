"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";
import { useAccount } from "@/providers/AccountProvider";
import { AccountOrder, MenuItem, OrderStatus } from "@/types";

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  placed: {
    label: "Order Placed",
    className: "border-[var(--accent-peach)]/40 bg-[var(--accent-peach)]/10 text-[var(--accent-peach)]",
  },
  preparing: {
    label: "Preparing",
    className: "border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]",
  },
  ready: {
    label: "Ready For Pickup",
    className: "border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]",
  },
  "out-for-delivery": {
    label: "Out For Delivery",
    className: "border-[var(--accent-peach)]/40 bg-[var(--accent-peach)]/10 text-[var(--accent-peach)]",
  },
  delivered: {
    label: "Delivered",
    className: "border-[var(--text-muted)]/40 bg-[var(--bg-surface-raised)] text-[var(--text-body)]",
  },
};

interface OrderCardProps {
  order: AccountOrder;
  menuItems: MenuItem[];
  index: number;
}

export function OrderCard({ order, menuItems, index }: OrderCardProps) {
  const { reorder } = useAccount();
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);

  const badge = STATUS_BADGE[order.status];

  const handleReorder = () => {
    reorder(order, menuItems);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)]">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                Order #{order.id}
              </h3>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-[var(--text-faint)]">
              Placed on {formatDate(order.placedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {order.items.slice(0, 4).map((item, idx) => (
                <span
                  key={`${order.id || (order as any)._id || index}-${item.itemId || item.title || idx}`}
                  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[var(--bg-surface)]"
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
              ))}
            </div>
            <span className="text-xs font-bold text-[var(--text-body)]">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
        </div>

        <OrderStatusTracker status={order.status} timeline={order.timeline} />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-warm)] pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[var(--text-faint)]">Total</span>
            <span className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
              {formatCurrency(order.total)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReorder}
              className="flex items-center gap-2 rounded-lg"
            >
              {added ? (
                "Added to order!"
              ) : (
                <>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Re-order
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-warm)] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-alt)] hover:text-[var(--accent-peach)]"
            >
              Details
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  expanded && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--border-warm)]"
          >
            <div className="flex flex-col gap-4 p-6">
              <ul className="flex flex-col gap-3">
                {order.items.map((item, itemIdx) => (
                  <li
                    key={`${order.id || (order as any)._id || index}-${item.itemId || item.title || itemIdx}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 overflow-hidden rounded-xl border border-[var(--border-warm)]">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        <span className="text-xs text-[var(--text-faint)]">
                          Qty {item.quantity} x {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="flex flex-col gap-2 border-t border-[var(--border-warm)] pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--text-faint)]">Subtotal</dt>
                  <dd className="text-[var(--text-body)]">
                    {formatCurrency(order.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--text-faint)]">Delivery</dt>
                  <dd className="text-[var(--text-body)]">
                    {order.deliveryFee > 0
                      ? formatCurrency(order.deliveryFee)
                      : "Free"}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-[var(--border-warm)] pt-2">
                  <dt className="font-bold text-[var(--text-primary)]">Total</dt>
                  <dd className="font-[family:var(--font-serif)] text-base font-bold text-[var(--text-primary)]">
                    {formatCurrency(order.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}
