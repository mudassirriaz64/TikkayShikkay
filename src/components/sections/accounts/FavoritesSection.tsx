"use client";

import { Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { FavoriteCard, EmptyState } from "@/components/ui/accounts";
import { useAccount } from "@/providers/AccountProvider";
import { MenuItem } from "@/types";

interface FavoritesSectionProps {
  menuItems: MenuItem[];
}

export function FavoritesSection({ menuItems }: FavoritesSectionProps) {
  const { favorites } = useAccount();
  const favoriteItems = menuItems.filter((item) =>
    favorites.includes(item.id),
  );

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Favourites"
            title="Saved For"
            accent="Later"
          />
        </Reveal>

        {favoriteItems.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favourites yet"
            description="Tap the heart on any menu item to keep it here for your next order."
            ctaLabel="Explore the menu"
            ctaHref="/menu"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                <FavoriteCard item={item} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
