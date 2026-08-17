import Image from "next/image";
import { SideItem } from "@/types/menu";
import { MenuCard } from "./MenuCard";
import { PriceTag } from "./PriceTag";

interface SideDishCardProps {
  item: SideItem;
}

export function SideDishCard({ item }: SideDishCardProps) {
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
        {item.isSignature ? (
          <span className="absolute left-4 top-4 rounded-full bg-[var(--accent-orange)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-on-orange)] shadow-lg">
            Signature
          </span>
        ) : null}
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
