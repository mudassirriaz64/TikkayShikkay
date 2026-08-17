"use client";

import { Camera, ChefHat, Flame, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GalleryTab as GalleryTabType, GalleryTabIcon } from "@/types";

const ICONS: Record<GalleryTabIcon, typeof Users> = {
  users: Users,
  "chef-hat": ChefHat,
  flame: Flame,
  camera: Camera,
};

interface GalleryTabProps {
  tab: GalleryTabType;
  index: number;
  active: boolean;
  onClick: () => void;
}

export function GalleryTab({ tab, index, active, onClick }: GalleryTabProps) {
  const Icon = ICONS[tab.icon];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
        active
          ? "border-[var(--accent-peach)]/50 bg-[var(--bg-surface-raised)] shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_50px_rgba(255,86,42,0.16)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] hover:-translate-y-1 hover:border-[var(--accent-peach)]/25 hover:shadow-[0_18px_44px_rgba(0,0,0,0.4)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--accent-orange)]/20 blur-[48px] transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )}
      />

      <span className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
            active
              ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_30px_rgba(255,86,42,0.45)]"
              : "bg-[var(--accent-ember)]/15 text-[var(--accent-orange)] group-hover:scale-110",
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
          {active ? (
            <span
              aria-hidden="true"
              className="absolute -inset-1 -z-10 rounded-2xl border border-[var(--accent-peach)]/40"
            />
          ) : null}
        </span>
        <span
          className={cn(
            "text-[11px] font-bold tabular-nums tracking-[0.25em]",
            active ? "text-[var(--accent-peach)]" : "text-[var(--text-faint)]",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>

      <span className="relative flex flex-col gap-2">
        <span className="font-[family:var(--font-serif)] text-xl font-bold leading-tight text-[var(--text-primary)]">
          {tab.title}
        </span>
        <span className="text-sm leading-relaxed text-[var(--text-body)]">
          {tab.description}
        </span>
      </span>

      <span className="relative mt-auto block h-1 w-full overflow-hidden rounded-full bg-[var(--border-warm)]">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-left rounded-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-peach)] transition-transform duration-500 ease-[var(--ease-out-soft)]",
            active ? "scale-x-100" : "scale-x-0",
          )}
        />
      </span>
    </button>
  );
}
