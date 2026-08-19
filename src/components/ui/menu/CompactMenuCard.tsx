"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAccount } from "@/providers/AccountProvider";
import { BotiItem } from "@/types/menu";
import { AddToCartButton } from "./AddToCartButton";
import { MenuCard } from "./MenuCard";
import { PriceTag } from "./PriceTag";
import { QuantitySelector } from "./QuantitySelector";

interface CompactMenuCardProps {
  item: BotiItem;
}

export function CompactMenuCard({ item }: CompactMenuCardProps) {
  const { items, addToCart, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite } = useAccount();
  const quantity = items.find((i) => i.item.id === item.id)?.quantity ?? 0;
  const favorite = isFavorite(item.id);

  return (
    <MenuCard className="h-full">
      <div className="flex h-full gap-4 p-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-28 md:w-28">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="112px"
            loading="lazy"
            className="object-cover object-center transition-transform duration-500 group-hover/menu:scale-110"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
            className={`absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
              favorite
                ? "bg-[var(--accent-ember)] text-white shadow-[0_0_12px_rgba(217,56,30,0.5)]"
                : "bg-black/50 text-white/80 hover:bg-black/80 hover:text-white"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favorite ? "fill-white text-white" : ""}`} />
          </button>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
          <h3 className="font-[family:var(--font-serif)] text-base font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-lg">
            {item.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-body)]">
            {item.description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <PriceTag price={item.price} className="text-base" />
            {quantity > 0 ? (
              <QuantitySelector
                quantity={quantity}
                onIncrement={() => addToCart(item)}
                onDecrement={() => removeFromCart(item.id)}
              />
            ) : (
              <AddToCartButton size="sm" onClick={() => addToCart(item)}>
                Quick Add
              </AddToCartButton>
            )}
          </div>
        </div>
      </div>
    </MenuCard>
  );
}
