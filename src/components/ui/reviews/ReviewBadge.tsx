import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ReviewBadgeTone = "peach" | "gold" | "muted" | "outline";

const TONES: Record<ReviewBadgeTone, string> = {
  peach:
    "bg-[var(--accent-peach)]/10 text-[var(--accent-peach)] border-[var(--accent-peach)]/20",
  gold: "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/20",
  muted:
    "bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20",
  outline: "bg-transparent text-[var(--text-muted)] border-[var(--border-warm)]",
};

interface ReviewBadgeProps {
  children: ReactNode;
  tone?: ReviewBadgeTone;
  className?: string;
}

export function ReviewBadge({
  children,
  tone = "muted",
  className,
}: ReviewBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
