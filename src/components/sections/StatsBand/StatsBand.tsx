import { StatItem } from "@/types";
import { Reveal } from "@/components/motion/Reveal";

export function StatsBand({ stats }: { stats: StatItem[] }) {
  return (
    <section className="bg-[#1C1B1B] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Intro pull-quote */}
        <Reveal className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            Decade of Smoke
          </span>
          <h2 className="mx-auto mt-4 max-w-[36ch] font-[family:var(--font-serif)] text-2xl italic leading-relaxed text-[var(--text-body)] md:text-3xl">
            "The grill doesn't cover up. It exposes. We keep the craft pure so the flame speaks for itself."
          </h2>
        </Reveal>

        {/* 4-column stat row with hairline borders */}
        <Reveal
          delay={0.1}
          className="border-y border-[var(--border-warm)]/80 py-8 grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4 md:py-12"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center justify-center md:border-r md:last:border-r-0 border-[var(--border-warm)]/40 px-4"
            >
              <span className="font-[family:var(--font-serif)] text-4xl font-bold tracking-tight text-[var(--accent-peach)] md:text-5xl">
                {stat.value}
              </span>
              <span className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
