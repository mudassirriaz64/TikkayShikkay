"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Play, X } from "lucide-react";
import { VideoTestimonial } from "@/types";

interface VideoCardProps {
  video: VideoTestimonial;
}

export function VideoCard({ video }: VideoCardProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video: ${video.title}`}
        className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--border-warm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-bold tabular-nums text-[var(--text-primary)] backdrop-blur-sm">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {video.duration}
          </span>
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] backdrop-blur-sm">
            {video.source}
          </span>

          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="absolute h-16 w-16 animate-ping rounded-full bg-[var(--accent-orange)]/30" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_30px_rgba(255,86,42,0.5)] transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)]">
              {video.customer_name}
            </span>
            <p className="mt-1 font-[family:var(--font-serif)] text-lg font-bold leading-snug text-[var(--text-primary)]">
              {video.title}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-[var(--accent-orange)] transition-transform duration-500 group-hover:scale-x-100"
          />
        </div>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={video.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:text-[var(--accent-peach)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <motion.figure
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border-warm)]">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 92vw, 42rem"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)]">
                    <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
                  </span>
                </span>
              </div>
              <figcaption className="mt-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)]">
                  {video.customer_name}
                </span>
                <p className="mt-1 font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
                  {video.title}
                </p>
                <p className="mt-2 text-sm text-[var(--text-body)]">
                  The full clip lives on our {video.source} - follow
                  @tikkayshikkay for the complete story.
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
