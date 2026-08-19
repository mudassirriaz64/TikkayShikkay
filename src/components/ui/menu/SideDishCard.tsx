"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useAccount } from "@/providers/AccountProvider";
import { SideItem } from "@/types/menu";
import { MenuCard } from "./MenuCard";
import { PriceTag } from "./PriceTag";

interface SideDishCardProps {
  item: SideItem;
}

export function SideDishCard({ item }: SideDishCardProps) {
  const { isFavorite, toggleFavorite } = useAccount();
  const favorite = isFavorite(item.id);

  return (
    <MenuCard className="h-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover object-center transition-transform duration-500 group-hover/menu:scale-108"
        />
        
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between pointer-events-none">
          {item.isSignature ? (
            <span className="pointer-events-auto rounded-full bg-[var(--accent-orange)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-on-orange)] shadow-lg">
              Signature
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
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
              favorite
                ? "bg-[var(--accent-ember)] text-white shadow-[0_0_12px_rgba(217,56,30,0.5)]"
                : "bg-black/50 text-white/80 hover:bg-black/80 hover:text-white"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favorite ? "fill-white text-white" : ""}`} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 p-5">
        <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
          {item.title}
        </h3>
        <PriceTag price={item.price} className="whitespace-nowrap" />
      </div>
    </MenuCard>
  );
}

