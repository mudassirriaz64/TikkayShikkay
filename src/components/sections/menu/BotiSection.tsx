import Link from "next/link";
import { Flame } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CompactMenuCard } from "@/components/ui/menu/CompactMenuCard";
import { FeaturedMenuCard } from "@/components/ui/menu/FeaturedMenuCard";
import { BotiData } from "@/types/menu";

export function BotiSection({ data }: { data: BotiData }) {
  return (
    <section
      id="boti"
      className="scroll-mt-[140px] bg-[var(--bg-base)] py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
              Char &amp; lacquer
            </span>
            <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
              Boti &amp; Kabab
            </h2>
          </div>
          <span className="font-[family:var(--font-serif)] text-sm font-bold tracking-[0.2em] text-[var(--text-muted)]">
            03 / 05
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal className="h-full">
            <FeaturedMenuCard item={data.featured} ctaLabel="Add To Bag" />
          </Reveal>

          <div className="flex flex-col gap-6">
            {data.compact.map((item, index) => (
              <Reveal key={item.id} delay={0.1 + index * 0.1} className="h-full">
                <CompactMenuCard item={item} />
              </Reveal>
            ))}

            <Reveal delay={0.3} className="h-full">
              <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-ember)]/15 text-[var(--accent-orange)]">
                    <Flame className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
                      The Charcoal Edge
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
                      Every boti is finished over live coals until lacquered and
                      jewel-red. Pair Bharli Boti with garlic naan and the Dip
                      Trilogy for the full ritual.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-warm)] pt-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    Fresh off the coals · 15 min
                  </span>
                  <Link
                    href="/contact"
                    className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)] transition-colors hover:text-[var(--accent-orange)]"
                  >
                    Table Order
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
