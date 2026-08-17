"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { GalleryImage } from "@/types";

interface LightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [[index, direction], setState] = useState<[number, number]>([
    initialIndex,
    0,
  ]);

  useEffect(() => {
    setState([initialIndex, 0]);
  }, [initialIndex]);

  const close = useCallback(() => onClose(), [onClose]);

  const paginate = useCallback(
    (dir: number) => {
      setState(([current]) => [
        (current + dir + images.length) % images.length,
        dir,
      ]);
    },
    [images.length],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") paginate(-1);
      if (event.key === "ArrowRight") paginate(1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [close, paginate]);

  const image = images[index];

  const swipeStart = { x: 0 };
  const onTouchStart = (event: React.TouchEvent) => {
    swipeStart.x = event.touches[0]?.clientX ?? 0;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const endX = event.changedTouches[0]?.clientX ?? 0;
    const delta = endX - swipeStart.x;
    if (delta > 50) paginate(-1);
    if (delta < -50) paginate(1);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={image.caption}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={close}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:text-[var(--accent-peach)]"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          paginate(-1);
        }}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)]/80 text-[var(--text-primary)] backdrop-blur-sm transition-colors hover:text-[var(--accent-peach)] md:left-6"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          paginate(1);
        }}
        aria-label="Next image"
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)]/80 text-[var(--text-primary)] backdrop-blur-sm transition-colors hover:text-[var(--accent-peach)] md:right-6"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <figure
        className="max-h-full"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative mx-auto flex max-h-[72vh] min-h-[320px] w-auto max-w-[min(92vw,1100px)] items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-warm)]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={image.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative aspect-[4/5] h-full max-h-[72vh] w-auto"
            >
              <Image
                src={image.imageUrl}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 60vw"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <figcaption className="mx-auto mt-4 max-w-lg text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
            {image.category}
          </span>
          <p className="mt-1 font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
            {image.caption}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-[var(--text-body)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--accent-peach)]" aria-hidden="true" />
            {image.location}
          </p>
          <p className="mt-2 text-xs tabular-nums text-[var(--text-faint)]">
            {index + 1} / {images.length}
          </p>
        </figcaption>
      </figure>
    </motion.div>
  );
}
