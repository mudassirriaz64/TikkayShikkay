"use client";

import {
  Bike,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  PackageOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { OrderStatus, OrderTimelineStep } from "@/types";

const STATUS_ORDER: OrderStatus[] = [
  "placed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
];

const STATUS_ICONS = {
  placed: ClipboardList,
  preparing: ChefHat,
  ready: PackageOpen,
  "out-for-delivery": Bike,
  delivered: CheckCircle2,
} as const;

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface OrderStatusTrackerProps {
  status: OrderStatus;
  timeline: OrderTimelineStep[];
  className?: string;
}

export function OrderStatusTracker({
  status,
  timeline,
  className,
}: OrderStatusTrackerProps) {
  const reached = STATUS_ORDER.indexOf(status);
  const progress =
    STATUS_ORDER.length === 1
      ? 100
      : (reached / (STATUS_ORDER.length - 1)) * 100;

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-0 right-0 top-[13px] h-0.5 bg-[var(--border-warm)]/60">
        <div
          className="h-full origin-left bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-peach)] transition-all duration-700 ease-[var(--ease-out-soft)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="relative grid grid-cols-5">
        {STATUS_ORDER.map((stepStatus, index) => {
          const Icon = STATUS_ICONS[stepStatus];
          const step = timeline.find((item) => item.status === stepStatus);
          const active = index <= reached;
          return (
            <div
              key={stepStatus}
              className="flex flex-col items-center gap-2 px-1"
            >
              <span
                className={cn(
                  "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-300",
                  active
                    ? "border-[var(--accent-orange)] bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
                    : "border-[var(--border-warm)] bg-[var(--bg-surface-raised)] text-[var(--text-faint)]",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span
                className={cn(
                  "text-center text-[10px] font-bold uppercase tracking-wider leading-tight",
                  active
                    ? "text-[var(--accent-peach)]"
                    : "text-[var(--text-faint)]",
                )}
              >
                {step?.label}
              </span>
              <span className="text-center text-[10px] tabular-nums text-[var(--text-faint)]">
                {step?.timestamp ? formatTime(step.timestamp) : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
