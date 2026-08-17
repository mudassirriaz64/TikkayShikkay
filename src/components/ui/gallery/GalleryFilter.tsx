"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { GalleryCategoryFilter } from "@/types";

interface GalleryFilterProps {
  categories: GalleryCategoryFilter[];
  activeId: string;
  counts: Record<string, number>;
  onChange: (id: string) => void;
}

export function GalleryFilter({
  categories,
  activeId,
  counts,
  onChange,
}: GalleryFilterProps) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0">
      {categories.map((category) => {
        const active = activeId === category.id;
        const count = counts[category.id] ?? 0;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category.id)}
            className={cn(
              "relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
              active
                ? "border-transparent text-[var(--text-on-orange)]"
                : "border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-body)] hover:border-[var(--accent-peach)]/30 hover:text-[var(--text-primary)]",
            )}
          >
            {active ? (
              <motion.span
                layoutId="gallery-filter-active"
                className="absolute inset-0 rounded-full bg-[var(--accent-orange)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
            <span className="relative">{category.label}</span>
            <span
              className={cn(
                "relative rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                active
                  ? "bg-[var(--text-on-orange)]/20 text-[var(--text-on-orange)]"
                  : "bg-[var(--accent-ember)]/15 text-[var(--accent-peach)]",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
