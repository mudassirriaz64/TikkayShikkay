"use client";

import { cn } from "@/lib/utils/cn";

export interface SubTabItem {
  id: string;
  label: string;
  count?: number;
}

export function SubTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: SubTabItem[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300",
            activeId === tab.id
              ? "border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]"
              : "border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
          )}
        >
          {tab.label}
          {typeof tab.count === "number" ? (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px]",
                activeId === tab.id
                  ? "bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]"
                  : "bg-[var(--bg-surface-raised)] text-[var(--text-faint)]",
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
