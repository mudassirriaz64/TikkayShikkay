import { Reveal } from "@/components/motion/Reveal";
import { FeaturedMenuCard } from "@/components/ui/menu/FeaturedMenuCard";
import { FeaturedItem } from "@/types/menu";

interface FeaturedGridProps {
  items: FeaturedItem[];
  id?: string;
  eyebrow?: string;
  title?: string;
  stepNumber?: string;
}

export function FeaturedGrid({
  items,
  id = "featured-picks",
  eyebrow = "Chef's selection",
  title = "Featured & Bestsellers",
  stepNumber = "01 / 05",
}: FeaturedGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id={id}
      className="scroll-mt-[140px] bg-[var(--bg-base)] py-10 lg:py-14"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
              {eyebrow}
            </span>
            <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
              {title}
            </h2>
          </div>
          <span className="font-[family:var(--font-serif)] text-sm font-bold tracking-[0.2em] text-[var(--text-muted)]">
            {stepNumber}
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08} className="h-full">
              <FeaturedMenuCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
