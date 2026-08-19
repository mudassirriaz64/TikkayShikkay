"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { FlameRating } from "@/components/ui/FlameRating";
import { useCart } from "@/context/CartContext";
import { useAccount } from "@/providers/AccountProvider";
import { FeaturedItem } from "@/types/menu";
import { AddToCartButton } from "./AddToCartButton";
import { IngredientBadge } from "./IngredientBadge";
import { MenuCard } from "./MenuCard";
import { PriceTag } from "./PriceTag";
import { QuantitySelector } from "./QuantitySelector";

interface FeaturedMenuCardProps {
  item: FeaturedItem;
  ctaLabel?: string;
}

export function FeaturedMenuCard({
  item,
  ctaLabel = "Add to Order",
}: FeaturedMenuCardProps) {
  const { items, addToCart, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite } = useAccount();
  const quantity = items.find((i) => i.item.id === item.id)?.quantity ?? 0;
  const favorite = isFavorite(item.id);

  return (
    <MenuCard className="h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover object-center transition-transform duration-500 group-hover/menu:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent" />
        
        {/* Top Badges & Favorite Button */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between pointer-events-none">
          {item.ribbon ? (
            <span className="pointer-events-auto rounded-full bg-[var(--accent-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-on-gold)] shadow-lg">
              {item.ribbon}
            </span>
          ) : <div />}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
            className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
              favorite
                ? "bg-[var(--accent-ember)] text-white shadow-[0_0_15px_rgba(217,56,30,0.5)]"
                : "bg-black/50 text-white/80 hover:bg-black/80 hover:text-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-white text-white" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-[family:var(--font-serif)] text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {item.title}
          </h3>
          <PriceTag price={item.price} className="whitespace-nowrap text-lg" />
        </div>
        {/* Platter Servings & Breakdown */}
        {item.servings ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-2.5 py-0.5 text-xs font-bold text-[var(--accent-orange)]">
              Serves {item.servings} People
            </span>
          </div>
        ) : null}

        {item.included_items && item.included_items.length > 0 ? (
          <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/60 p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Includes:</p>
            <ul className="text-xs text-[var(--text-primary)] space-y-0.5">
              {item.included_items.map((inc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent-peach)]" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <IngredientBadge key={tag} label={tag} />
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border-warm)] pt-4">
          <FlameRating level={item.spice_level} />
          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => addToCart(item)}
              onDecrement={() => removeFromCart(item.id)}
            />
          ) : (
            <AddToCartButton onClick={() => addToCart(item)}>
              {ctaLabel}
            </AddToCartButton>
          )}
        </div>
      </div>
    </MenuCard>
  );
}
