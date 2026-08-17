"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryCard } from "@/components/ui/reviews/GalleryCard";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryImage } from "@/types";

interface CustomerGalleryProps {
  gallery: GalleryImage[];
}

export function CustomerGallery({ gallery }: CustomerGalleryProps) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Real Moments"
            title="Captured At The"
            accent="Table"
          />
          <p className="mt-5 max-w-[60ch] text-[var(--text-body)]">
            Birthdays, family dinners and late-night celebrations - the moments
            our guests share with us.
          </p>
        </Reveal>

        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
          {gallery.map((image, index) => (
            <Reveal key={image.id} delay={(index % 3) * 0.08}>
              <GalleryCard image={image} index={index} onOpen={setActive} />
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close lightbox"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:text-[var(--accent-peach)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <motion.figure
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-h-full"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative mx-auto aspect-[3/4] max-h-[78vh] w-auto overflow-hidden rounded-2xl border border-[var(--border-warm)]">
                <Image
                  src={active.imageUrl}
                  alt={active.caption}
                  fill
                  sizes="(max-width: 640px) 90vw, 60vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mx-auto mt-4 max-w-lg text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                  {active.tag}
                </span>
                <p className="mt-1 font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
                  {active.caption}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
