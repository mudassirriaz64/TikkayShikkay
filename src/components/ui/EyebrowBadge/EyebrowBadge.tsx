import { cn } from "@/lib/utils/cn";
import { EyebrowBadgeProps } from "./EyebrowBadge.types";

export function EyebrowBadge({
  label,
  color = "peach",
  className,
  ...props
}: EyebrowBadgeProps) {
  const colorStyles = {
    peach:
      "bg-[var(--accent-peach)]/10 text-[var(--accent-peach)] border-[var(--accent-peach)]/20",
    gold: "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/20",
    muted:
      "bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20",
  };

  const dotColors = {
    peach: "bg-[var(--accent-peach)]",
    gold: "bg-[var(--accent-gold)]",
    muted: "bg-[var(--text-muted)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-[family:var(--font-serif)]",
        colorStyles[color],
        className,
      )}
      {...props}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotColors[color])}
        aria-hidden="true"
      />
      <span className="text-xs font-bold uppercase tracking-[0.18em]">
        {label}
      </span>
    </div>
  );
}
