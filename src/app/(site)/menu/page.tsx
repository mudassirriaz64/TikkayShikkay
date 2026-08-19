import { MotionConfig } from "framer-motion";
import { getMenu } from "@/lib/data/getMenu";
import { MenuHero } from "@/components/sections/menu/MenuHero";
import { CategoryTabs } from "@/components/sections/menu/CategoryTabs";
import { FeaturedGrid } from "@/components/sections/menu/FeaturedGrid";
import { PlattersSection } from "@/components/sections/menu/PlattersSection";
import { CateringMenuBanner } from "@/components/sections/menu/CateringMenuBanner";

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
        <CateringMenuBanner />

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

          const stepStr = String(index + 1).padStart(2, "0");
          const totalStr = String(categories.length).padStart(2, "0");
          const counter = `${stepStr} / ${totalStr}`;

          // If it is the Platters category, render Unified Platters Section
          if (category.slug === "platters" || category.name.toLowerCase().includes("platter")) {
            return (
              <PlattersSection
                key={category.id}
                curatedItems={categoryItems}
                categories={categories}
                allItems={allItems}
                platterData={menu.platter}
                stepNumber={counter}
              />
            );
          }

          // Render dynamic section grid for all categories (Tikka, Boti, Sides, Drinks, Kebabs, + any new ones)
          if (categoryItems.length > 0) {
            return (
              <FeaturedGrid
                key={category.id}
                items={categoryItems}
                id={category.slug || category.id}
                eyebrow={category.subtitle || "Ancestral Fire-Grilled"}
                title={`${category.name} Specials`}
                stepNumber={counter}
              />
            );
          }

          return null;
        })}

        {/* 3. Fallback PlattersSection if platters category was not in category list */}
        {!categories.some((c) => c.slug === "platters" || c.name.toLowerCase().includes("platter")) &&
          menu.platter && (
            <PlattersSection
              curatedItems={allItems.filter((item) => item.category_id === "platters" || item.slug?.includes("platter"))}
              categories={categories}
              allItems={allItems}
              platterData={menu.platter}
              stepNumber="Platters"
            />
          )}
      </MotionConfig>
    </div>
  );
}
