"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface FilterButtonProps {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}

export function FilterButton({
  label,
  active,
  count,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
        active
          ? "border-[var(--accent-orange)] text-[var(--text-on-orange)]"
          : "border-[var(--border-warm)] text-[var(--text-muted)] hover:border-[var(--accent-peach)]/40 hover:text-[var(--text-primary)]",
      )}
    >
      {active ? (
        <motion.span
          layoutId="review-filter-active"
          className="absolute inset-0 rounded-full bg-[var(--accent-orange)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ) : null}
      <span className="relative z-10">{label}</span>
      {typeof count === "number" && count >= 0 ? (
        <span className="relative z-10 ml-1.5 opacity-70">{count}</span>
      ) : null}
    </button>
  );
}
