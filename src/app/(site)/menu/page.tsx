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

  const categories = menu.categories || [];
  const allItems = menu.items || [];

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <MenuHero />
        <CategoryTabs tabs={menu.tabs} />

        {/* 1. Featured & Bestsellers (Always at the top) */}
        {menu.featured && menu.featured.length > 0 && (
          <FeaturedGrid
            items={menu.featured}
            id="featured-picks"
            eyebrow="Chef's selection"
            title="Featured & Bestsellers"
            stepNumber="Featured"
          />
        )}

        {/* 2. Dynamically rendered Category Sections directly from MongoDB */}
        {categories.map((category, index) => {
          const categoryItems = allItems.filter(
            (item) =>
              item.category_id === category.id ||
              (item as any).category_id?._id === category.id ||
              item.slug?.includes(category.slug)
          );

          // If it is the Boti category and custom boti layout exists
          if (category.slug === "boti" && menu.boti?.featured) {
            return <BotiSection key={category.id} data={menu.boti} />;
          }

          // If it is the Sides category
          if (category.slug === "sides" && menu.sides?.length > 0) {
            return <SidesSection key={category.id} items={menu.sides} />;
          }

          // If category has items, render a dynamic section grid
          if (categoryItems.length > 0) {
            const stepStr = String(index + 1).padStart(2, "0");
            const totalStr = String(categories.length + 1).padStart(2, "0");

            return (
              <FeaturedGrid
                key={category.id}
                items={categoryItems}
                id={category.slug || category.id}
                eyebrow="Ancestral Fire-Grilled"
                title={`${category.name} Specials`}
                stepNumber={`${stepStr} / ${totalStr}`}
              />
            );
          }

          return null;
        })}

        {/* 3. Interactive Build Your Own Platter */}
        {menu.platter && <BuildPlatter data={menu.platter} />}
      </MotionConfig>
    </div>
  );
}
