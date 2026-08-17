import { Reveal } from "@/components/motion/Reveal";
import { SideDishCard } from "@/components/ui/menu/SideDishCard";
import { SideItem } from "@/types/menu";

interface SidesSectionProps {
  items: SideItem[];
}

export function SidesSection({ items }: SidesSectionProps) {
  return (
    <section
      id="sides"
      className="scroll-mt-[140px] bg-[var(--bg-deep)] py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
              The supporting cast
            </span>
            <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
              Sides &amp; Artisan Dips
            </h2>
          </div>
          <span className="font-[family:var(--font-serif)] text-sm font-bold tracking-[0.2em] text-[var(--text-muted)]">
            03 / 04
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.07} className="h-full">
              <SideDishCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
