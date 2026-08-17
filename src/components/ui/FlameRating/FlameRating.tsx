import { cn } from "@/lib/utils/cn";
import { FlameRatingProps } from "./FlameRating.types";
import { Flame } from "lucide-react";

export function FlameRating({ level, className, ...props }: FlameRatingProps) {
  const maxFlames = 3;
  let activeFlames = 1;

  switch (level) {
    case "Mild":
      activeFlames = 1;
      break;
    case "Medium":
      activeFlames = 2;
      break;
    case "Hot":
    case "Extra Spicy":
      activeFlames = 3;
      break;
  }

  const displayTexts: Record<string, string> = {
    "Mild": "MILD HEAT",
    "Medium": "MEDIUM",
    "Hot": "HIGH HEAT",
    "Extra Spicy": "HIGH HEAT",
  };
  const text = displayTexts[level] || level.toUpperCase();

  return (
    <div className={cn("flex min-w-0 items-center gap-1.5", className)} {...props}>
      <div className="flex gap-0.5 shrink-0">
        {Array.from({ length: maxFlames }).map((_, i) => (
          <Flame
            key={i}
            className={cn(
              "w-4 h-4 transition-colors",
              i < activeFlames
                ? "fill-[var(--accent-orange)] text-[var(--accent-orange)]"
                : "fill-transparent text-[var(--text-muted)] opacity-30",
            )}
          />
        ))}
      </div>
      <span className="font-[family:var(--font-serif)] text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">
        {text}
      </span>
    </div>
  );
}
