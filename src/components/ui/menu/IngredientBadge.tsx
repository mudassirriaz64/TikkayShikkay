import { cn } from "@/lib/utils/cn";

interface IngredientBadgeProps {
  label: string;
  tone?: "peach" | "gold" | "muted";
  className?: string;
}

const toneStyles = {
  peach: "border-[var(--accent-peach)]/20 bg-[var(--accent-peach)]/8 text-[var(--accent-peach)]",
  gold: "border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/8 text-[var(--accent-gold)]",
  muted: "border-[var(--border-warm)] bg-[var(--bg-surface-raised)] text-[var(--text-muted)]",
};

const dotStyles = {
  peach: "bg-[var(--accent-peach)]",
  gold: "bg-[var(--accent-gold)]",
  muted: "bg-[var(--text-muted)]",
};

export function IngredientBadge({
  label,
  tone = "peach",
  className,
}: IngredientBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        toneStyles[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1 w-1 rounded-full", dotStyles[tone])}
      />
      {label}
    </span>
  );
}
