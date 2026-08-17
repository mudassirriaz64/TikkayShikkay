"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryFilter } from "@/components/ui/gallery/GalleryFilter";
import { GalleryImageCard } from "@/components/ui/gallery/GalleryImageCard";
import { Lightbox } from "@/components/ui/gallery/Lightbox";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryCategoryFilter, GalleryImage } from "@/types";

interface PhotoGalleryProps {
  gallery: GalleryImage[];
  categories: GalleryCategoryFilter[];
}

export function PhotoGallery({ gallery, categories }: PhotoGalleryProps) {
  const [activeId, setActiveId] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: gallery.length };
    for (const category of categories) {
      if (category.id === "all") continue;
      map[category.id] = gallery.filter(
        (image) => image.category === category.id,
      ).length;
    }
    return map;
  }, [gallery, categories]);

  const visible = useMemo(() => {
    if (activeId === "all") return gallery;
    return gallery.filter((image) => image.category === activeId);
  }, [gallery, activeId]);

  const openLightbox = (image: GalleryImage) => {
    const index = visible.findIndex((item) => item.id === image.id);
    if (index >= 0) setLightboxIndex(index);
  };

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-10">
          <SectionHeading
            eyebrow="Premium Photo Gallery"
            title="Moments In"
            accent="Smoke"
          />
          <p className="mt-5 max-w-[60ch] text-[var(--text-body)]">
            Food, flame, faces and atmosphere - the images we keep, shot across
            every table we serve.
          </p>
        </Reveal>

        <Reveal className="mb-10">
          <GalleryFilter
            categories={categories}
            activeId={activeId}
            counts={counts}
            onChange={(id) => {
              setActiveId(id);
              setLightboxIndex(null);
            }}
          />
        </Reveal>

        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
          {visible.map((image, index) => (
            <Reveal
              key={image.id}
              delay={(index % 3) * 0.06}
              className="mb-5 break-inside-avoid"
            >
              <GalleryImageCard
                image={image}
                index={index}
                total={visible.length}
                onOpen={openLightbox}
              />
            </Reveal>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-10 text-center">
            <p className="font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
              No moments here yet
            </p>
            <p className="mt-2 text-sm text-[var(--text-body)]">
              Check back soon - the camera is always out.
            </p>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <Lightbox
            images={visible}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
