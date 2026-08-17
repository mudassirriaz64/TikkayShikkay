import { cn } from "@/lib/utils/cn";

interface ProteinBadgeProps {
  value: string;
  label: string;
  className?: string;
}

export function ProteinBadge({
  value,
  label,
  className,
}: ProteinBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md",
        className,
      )}
    >
      <span className="font-[family:var(--font-serif)] text-3xl font-bold leading-none text-[var(--text-primary)]">
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}
