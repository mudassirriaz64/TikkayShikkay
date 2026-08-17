"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/10 p-1",
        className,
      )}
    >
      <motion.button
        type="button"
        onClick={onDecrement}
        whileTap={{ scale: 0.9 }}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--accent-orange)] transition-colors duration-200 hover:bg-[var(--accent-orange)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </motion.button>
      <span
        aria-live="polite"
        className="w-6 text-center text-sm font-bold text-[var(--text-primary)]"
      >
        {quantity}
      </span>
      <motion.button
        type="button"
        onClick={onIncrement}
        whileTap={{ scale: 0.9 }}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--accent-orange)] transition-colors duration-200 hover:bg-[var(--accent-orange)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
