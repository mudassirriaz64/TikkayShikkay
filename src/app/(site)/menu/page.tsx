import { MotionConfig } from "framer-motion";
import { getMenu } from "@/lib/data/getMenu";
import { MenuHero } from "@/components/sections/menu/MenuHero";
import { CategoryTabs } from "@/components/sections/menu/CategoryTabs";
import { FeaturedGrid } from "@/components/sections/menu/FeaturedGrid";
import { BuildPlatter } from "@/components/sections/menu/BuildPlatter";
import { BotiSection } from "@/components/sections/menu/BotiSection";
import { SidesSection } from "@/components/sections/menu/SidesSection";

export const metadata = {
  title: "Menu - Tikkay Shikkay",
  description:
    "Explore the Tikkay Shikkay menu — charcoal tikkas, boti & kabab, build-your-own platters, and artisan sides.",
};

export default async function MenuPage() {
  const menu = await getMenu();

  const tikkaItems =
    menu.tikka && menu.tikka.length > 0
      ? menu.tikka
      : menu.items.filter((i) => i.title.toLowerCase().includes("tikka"));

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <MenuHero />
        <CategoryTabs tabs={menu.tabs} />

        {/* 1. Featured & Bestsellers (Cross-category top picks) */}
        <FeaturedGrid
          items={menu.featured}
          id="featured-picks"
          eyebrow="Chef's selection"
          title="Featured & Bestsellers"
          stepNumber="01 / 05"
        />

        {/* 2. Authentic Tikka Specials (Strictly Tikka category) */}
        <FeaturedGrid
          items={tikkaItems}
          id="tikka"
          eyebrow="Ancestral charcoal grill"
          title="Tikka Specials"
          stepNumber="02 / 05"
        />

        {/* 3. Boti & Kabab */}
        <BotiSection data={menu.boti} />

        {/* 4. Build Your Own Platter */}
        <BuildPlatter data={menu.platter} />

        {/* 5. Sides & Artisan Dips */}
        <SidesSection items={menu.sides} />
      </MotionConfig>
    </div>
  );
}
