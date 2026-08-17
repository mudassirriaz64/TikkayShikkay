import { getMenu } from "@/lib/data/getMenu";
import { MenuGrid } from "./MenuGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export async function MenuSection() {
  const { categories, items } = await getMenu();
  const previewItems = items.slice(0, 4);

  return (
    <section className="bg-[var(--bg-deep)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The Fire List"
            eyebrowColor="gold"
            title="Signature grills"
          />
          <Link
            href="/menu"
            className="hidden text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] transition-colors hover:text-[var(--accent-peach)] md:inline-flex"
          >
            View all {items.length} items →
          </Link>
        </Reveal>

        <MenuGrid items={previewItems} categories={categories} />

        <Reveal className="mt-10 flex justify-center md:hidden">
          <Button variant="outline" size="lg">
            View All Items
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
