import { cn } from "@/lib/utils/cn";
import { OpeningDay } from "@/types/contact";

interface OpeningHoursProps {
  days: OpeningDay[];
}

export function OpeningHours({ days }: OpeningHoursProps) {
  return (
    <>
      <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
        Opening Hours
      </h3>
      <ul className="mt-4 space-y-2.5">
        {days.map((day) => (
          <li key={day.id} className="flex items-baseline gap-3 text-sm">
            <span className="text-[var(--text-muted)]">{day.day}</span>
            <span
              aria-hidden="true"
              className="mb-1 flex-1 border-b border-dotted border-[var(--border-warm)]"
            />
            <span
              className={cn(
                "font-medium",
                day.isClosed
                  ? "text-[var(--accent-ember)]"
                  : "text-[var(--text-body)]",
              )}
            >
              {day.hours}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
        Open daily · Live fire at peak hours
      </p>
    </>
  );
}
