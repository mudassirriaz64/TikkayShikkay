"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FlameRating } from "@/components/ui/FlameRating";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";
import { useAccount } from "@/providers/AccountProvider";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/types";

interface FavoriteCardProps {
  item: MenuItem;
  className?: string;
}

export function FavoriteCard({ item, className }: FavoriteCardProps) {
  const { isFavorite, toggleFavorite } = useAccount();
  const { addToCart } = useCart();
  const favorite = isFavorite(item.id);

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6",
        className,
      )}
    >
      <Image
        src={item.image_url}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/85 to-black/30" />

      <button
        type="button"
        onClick={() => toggleFavorite(item.id)}
        aria-pressed={favorite}
        aria-label={favorite ? "Remove from favourites" : "Save to favourites"}
        className={cn(
          "relative z-10 ml-auto flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md transition-all active:scale-95",
          favorite
            ? "border-[var(--accent-ember)]/50 bg-[var(--accent-ember)]/25 text-[var(--accent-ember)]"
            : "border-white/15 bg-black/40 text-white/70 hover:text-white",
        )}
      >
        <Heart
          className={cn("h-4.5 w-4.5", favorite && "fill-current")}
          aria-hidden="true"
        />
      </button>

      <div className="relative z-10 mt-auto space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase leading-tight text-white">
            {item.title}
          </h3>
          <span className="whitespace-nowrap font-[family:var(--font-serif)] text-lg text-[var(--accent-gold)]">
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-stone-300">
          {item.description}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <FlameRating level={item.spice_level} className="min-w-0" />
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg px-3.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-orange)] transition-all hover:border-transparent hover:bg-[var(--accent-orange)] hover:text-[var(--text-on-orange)] active:scale-95"
            onClick={() => addToCart(item)}
          >
            Add to Order
          </Button>
        </div>
      </div>
    </article>
  );
}
