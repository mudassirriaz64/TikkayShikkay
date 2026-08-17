"use client";

import Image from "next/image";
import { useCounter } from "@/hooks/useCounter";
import { cn } from "@/lib/utils/cn";
import { JourneyMilestone, JourneyType } from "@/types";

const TYPE_STYLES: Record<JourneyType, string> = {
  milestone: "border-[var(--accent-peach)]/30 text-[var(--accent-peach)]",
  achievement: "border-[var(--accent-gold)]/30 text-[var(--accent-gold)]",
  challenge: "border-[var(--accent-ember)]/40 text-[var(--accent-ember)]",
  lesson: "border-[var(--text-muted)]/30 text-[var(--text-muted)]",
  future: "border-[var(--accent-orange)]/40 text-[var(--accent-orange)]",
};

interface JourneyCardProps {
  milestone: JourneyMilestone;
}

export function JourneyCard({ milestone }: JourneyCardProps) {
  const { ref, display } = useCounter<HTMLSpanElement>(
    milestone.stat?.value ?? 0,
    {
      decimals: 0,
      suffix: milestone.stat?.suffix ?? "",
    },
  );

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-peach)]/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={milestone.imageUrl}
          alt={milestone.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-black/20" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 font-[family:var(--font-serif)] text-sm font-bold tabular-nums text-[var(--text-primary)] backdrop-blur-sm">
          {milestone.year}
        </span>
        <span
          className={cn(
            "absolute right-4 top-4 rounded-full border bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm",
            TYPE_STYLES[milestone.type],
          )}
        >
          {milestone.badge}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-8">
        <h3 className="font-[family:var(--font-serif)] text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-3xl">
          {milestone.title}
        </h3>
        <p className="text-[var(--text-body)] leading-relaxed">
          {milestone.story}
        </p>

        {milestone.stat ? (
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[var(--border-warm)]/40 pt-5">
            <span
              ref={ref}
              className="font-[family:var(--font-serif)] text-4xl font-bold text-[var(--accent-orange)]"
            >
              {display}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {milestone.stat.label}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
