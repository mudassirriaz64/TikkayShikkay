"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
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
  const quantity = items.find((i) => i.item.id === item.id)?.quantity ?? 0;

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
