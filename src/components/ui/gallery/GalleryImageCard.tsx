"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useParallax } from "@/hooks/useParallax";
import { GalleryImage } from "@/types";

interface GalleryImageCardProps {
  image: GalleryImage;
  index: number;
  total: number;
  onOpen: (image: GalleryImage) => void;
}

export function GalleryImageCard({
  image,
  index,
  total,
  onOpen,
}: GalleryImageCardProps) {
  const parallaxRef = useParallax<HTMLDivElement>(0.08);

  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      aria-label={`Open ${image.caption} in lightbox`}
      className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--border-warm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
    >
      <div ref={parallaxRef} className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={image.imageUrl}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="scale-110 object-cover transition-transform duration-700 group-hover:scale-125"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold tabular-nums tracking-[0.12em] text-[var(--text-primary)] backdrop-blur-sm">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
          {image.category}
        </span>
        <p className="mt-1 font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
          {image.caption}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-body)]">
          <MapPin className="h-3.5 w-3.5 text-[var(--accent-peach)]" aria-hidden="true" />
          {image.location}
        </p>
      </div>
    </button>
  );
}
