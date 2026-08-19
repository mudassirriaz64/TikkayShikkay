"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/reviews/StarRating";
import { CustomerReview } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ReviewHighlightsProps {
  reviews: CustomerReview[];
}

export function ReviewHighlights({ reviews }: ReviewHighlightsProps) {
  const reducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  // Single batch of reviews to be duplicated across 2 tracks
  const trackItems = [...reviews, ...reviews];

  const renderCard = (review: CustomerReview, key: string) => (
    <article
      key={key}
      className="flex w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-5 transition-all duration-300 hover:border-[var(--accent-orange)]/60 hover:bg-[var(--bg-surface)] hover:shadow-lg"
    >
      <StarRating rating={review.rating} size="sm" />
      <p className="line-clamp-3 text-sm italic leading-relaxed text-[var(--text-body)]">
        &ldquo;{review.review_text}&rdquo;
      </p>
      <footer className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border-warm)]/60 pt-3">
        <span className="font-[family:var(--font-serif)] text-sm font-bold text-[var(--text-primary)]">
          {review.customer_name}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)]">
          {review.location}
        </span>
      </footer>
    </article>
  );

  return (
    <section
      aria-label="Featured review highlights"
      className="relative overflow-hidden border-y border-[var(--border-warm)]/30 bg-[var(--bg-deep)] py-10 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Left/Right Edge Fades for seamless continuous rolling illusion */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-28 bg-gradient-to-r from-[var(--bg-deep)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-28 bg-gradient-to-l from-[var(--bg-deep)] to-transparent" />

      <div className="flex w-full overflow-hidden">
        {/* Track 1 */}
        <div
          className={`flex shrink-0 items-center gap-5 pr-5 ${
            reducedMotion ? "" : "animate-[marquee_35s_linear_infinite]"
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {trackItems.map((review, i) => renderCard(review, `t1-${review.id}-${i}`))}
        </div>

        {/* Track 2 (Follower for true infinite continuous roll) */}
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center gap-5 pr-5 ${
            reducedMotion ? "hidden" : "animate-[marquee_35s_linear_infinite]"
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {trackItems.map((review, i) => renderCard(review, `t2-${review.id}-${i}`))}
        </div>
      </div>
    </section>
  );
}
