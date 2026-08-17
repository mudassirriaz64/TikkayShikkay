"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { VideoReview } from "@/types";

interface VideoReviewCardProps {
  video: VideoReview;
}

export function VideoReviewCard({ video }: VideoReviewCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--accent-peach)]/35 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,180,162,0.08)]"
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video testimonial from ${video.customer_name}`}
        className="relative block aspect-video w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
      >
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] backdrop-blur-md">
          {video.duration}
        </span>

        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-orange)]/30"
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_8px_30px_rgba(255,86,42,0.45)] transition-transform duration-500 group-hover:scale-110">
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
          </span>
        </span>
      </button>

      <div className="p-5">
        <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
          {video.title}
        </h3>
        <p className="mt-1.5 text-xs text-[var(--text-faint)]">
          {video.customer_name} · {video.category}
        </p>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[var(--bg-deep)]/95 p-6 text-center backdrop-blur-md"
          >
            <Play
              className="h-9 w-9 text-[var(--accent-orange)]"
              aria-hidden="true"
            />
            <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
              Full video coming soon
            </p>
            <p className="max-w-[30ch] text-xs leading-relaxed text-[var(--text-muted)]">
              The complete testimonial from {video.customer_name} will live
              here shortly.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video preview"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-peach)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
