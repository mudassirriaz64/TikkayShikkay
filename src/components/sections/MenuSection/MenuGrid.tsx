import { MenuCategory, MenuItem } from "@/types";
import { MenuItemCard } from "@/components/ui/MenuItemCard";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { GlowCard } from "@/components/motion/GlowCard";

interface MenuGridProps {
  items: MenuItem[];
  categories?: MenuCategory[];
}

export function MenuGrid({ items, categories }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const category = categories?.find(
          (cat) => cat.id === item.category_id,
        );
        return (
          <Reveal key={item.id} delay={index * 0.07} className="h-full">
            <TiltCard className="h-full" maxTilt={4}>
              <GlowCard className="h-full rounded-2xl">
                <MenuItemCard item={item} category={category?.name} />
              </GlowCard>
            </TiltCard>
          </Reveal>
        );
      })}
    </div>
  );
}
