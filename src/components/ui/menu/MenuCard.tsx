"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface MenuCardProps {
  children: ReactNode;
  className?: string;
}

export function MenuCard({ children, className }: MenuCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group/menu relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--accent-peach)]/35 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,180,162,0.08)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
