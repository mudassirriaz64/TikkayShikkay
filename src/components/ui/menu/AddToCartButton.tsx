"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AddToCartButtonProps {
  onClick: () => void;
  children?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export function AddToCartButton({
  onClick,
  children = "Add to Order",
  size = "md",
  className,
}: AddToCartButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group/atc inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange)] font-[family:var(--font-serif)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-on-orange)] transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(255,86,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/70",
        size === "sm" ? "h-9 px-4" : "h-10 px-5",
        className,
      )}
    >
      <Plus
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover/atc:rotate-90"
      />
      {children}
    </motion.button>
  );
}
