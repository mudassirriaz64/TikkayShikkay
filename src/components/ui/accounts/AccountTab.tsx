"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AccountTabProps {
  label: string;
  count?: number;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

export function AccountTab({
  label,
  count,
  icon: Icon,
  active,
  onClick,
}: AccountTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
        active
          ? "border-[var(--accent-peach)]/50 bg-[var(--bg-surface-raised)] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,86,42,0.14)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] hover:-translate-y-1 hover:border-[var(--accent-peach)]/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-orange)]/20 blur-[40px] transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )}
      />

      <span
        className={cn(
          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
          active
            ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_26px_rgba(255,86,42,0.4)]"
            : "bg-[var(--accent-ember)]/15 text-[var(--accent-orange)] group-hover:scale-110",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <span className="relative flex flex-1 items-center justify-between gap-3">
        <span className="font-[family:var(--font-serif)] text-base font-bold text-[var(--text-primary)]">
          {label}
        </span>
        {typeof count === "number" ? (
          <span
            className={cn(
              "flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums",
              active
                ? "bg-[var(--accent-peach)]/15 text-[var(--accent-peach)]"
                : "bg-[var(--bg-deep)] text-[var(--text-faint)]",
            )}
          >
            {count}
          </span>
        ) : null}
      </span>

      <span className="absolute inset-x-0 bottom-0 h-0.5 w-full overflow-hidden rounded-full bg-[var(--border-warm)]/60">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-left bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-peach)] transition-transform duration-500 ease-[var(--ease-out-soft)]",
            active ? "scale-x-100" : "scale-x-0",
          )}
        />
      </span>
    </button>
  );
}
