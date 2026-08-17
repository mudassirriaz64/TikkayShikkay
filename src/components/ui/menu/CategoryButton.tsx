"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface CategoryButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function CategoryButton({
  label,
  active,
  onClick,
}: CategoryButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={active}
      className={cn(
        "relative shrink-0 rounded-xl border px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
        active
          ? "border-[var(--accent-orange)]/50 bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] shadow-[0_0_24px_rgba(255,86,42,0.22)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] hover:border-[var(--accent-peach)]/40 hover:text-[var(--text-primary)] hover:shadow-[0_0_20px_rgba(255,180,162,0.1)]",
      )}
    >
      {label}
      {active ? (
        <motion.span
          layoutId="category-underline"
          aria-hidden="true"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-[var(--accent-orange)]"
        />
      ) : null}
    </motion.button>
  );
}
