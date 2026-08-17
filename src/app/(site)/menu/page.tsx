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

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <MenuHero />
        <CategoryTabs tabs={menu.tabs} />
        <FeaturedGrid items={menu.featured} />
        <BuildPlatter data={menu.platter} />
        <BotiSection data={menu.boti} />
        <SidesSection items={menu.sides} />
      </MotionConfig>
    </div>
  );
}
