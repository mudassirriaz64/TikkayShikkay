"use client";

import { Repeat, Star, ThumbsUp, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useCounter } from "@/hooks/useCounter";
import { Statistic, StatisticIcon } from "@/types";

const ICONS: Record<StatisticIcon, typeof Star> = {
  star: Star,
  users: Users,
  repeat: Repeat,
  "thumbs-up": ThumbsUp,
};

interface StatItemProps {
  statistic: Statistic;
  index: number;
}

function StatItem({ statistic, index }: StatItemProps) {
  const { ref, display } = useCounter<HTMLParagraphElement>(statistic.value, {
    decimals: statistic.decimals,
    suffix: statistic.suffix,
  });
  const Icon = ICONS[statistic.icon];

  return (
    <Reveal delay={index * 0.1} className="h-full">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-peach)]/35 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,180,162,0.08)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-ember)]/15 text-[var(--accent-orange)] transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--accent-peach)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p
          ref={ref}
          className="mt-5 font-[family:var(--font-serif)] text-4xl font-bold text-[var(--text-primary)] md:text-5xl"
        >
          {display}
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {statistic.label}
        </p>
      </div>
    </Reveal>
  );
}

interface ReviewStatsProps {
  statistics: Statistic[];
}

export function ReviewStats({ statistics }: ReviewStatsProps) {
  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((statistic, index) => (
            <StatItem key={statistic.id} statistic={statistic} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
