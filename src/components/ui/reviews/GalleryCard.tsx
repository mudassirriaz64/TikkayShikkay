"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import { cn } from "@/lib/utils/cn";
import { GalleryImage } from "@/types";

const ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
] as const;

interface GalleryCardProps {
  image: GalleryImage;
  index: number;
  onOpen: (image: GalleryImage) => void;
}

export function GalleryCard({ image, index, onOpen }: GalleryCardProps) {
  const parallaxRef = useParallax<HTMLDivElement>(0.08);

  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      aria-label={`Open ${image.caption} in lightbox`}
      className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-[var(--border-warm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
    >
      <div
        ref={parallaxRef}
        className={cn("relative", ASPECTS[index % ASPECTS.length])}
      >
        <Image
          src={image.imageUrl}
          alt={image.caption}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="scale-110 object-cover transition-transform duration-700 group-hover:scale-125"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
          {image.tag}
        </span>
        <p className="mt-1 font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
          {image.caption}
        </p>
      </div>
    </button>
  );
}
