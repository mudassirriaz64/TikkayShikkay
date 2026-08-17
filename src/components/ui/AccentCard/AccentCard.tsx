import { cn } from "@/lib/utils/cn";
import { AccentCardProps } from "./AccentCard.types";

export function AccentCard({
  children,
  accentColor = "peach",
  className,
  ...props
}: AccentCardProps) {
  const borderColors = {
    peach: "border-l-[var(--accent-peach)]",
    gold: "border-l-[var(--accent-gold)]",
  };

  return (
    <div
      className={cn(
        "bg-[var(--bg-surface-alt)] border-l-4 rounded-r-2xl p-8 font-[family:var(--font-serif)]",
        borderColors[accentColor],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
