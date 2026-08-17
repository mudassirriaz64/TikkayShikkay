"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { StarRating } from "@/components/ui/reviews/StarRating";
import { CustomerReview } from "@/types";

interface ReviewHighlightsProps {
  reviews: CustomerReview[];
}

export function ReviewHighlights({ reviews }: ReviewHighlightsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      const track = el?.querySelector(".highlights-track");
      if (!el || !track || reducedMotion) return;

      const tween = gsap.fromTo(
        track,
        { xPercent: 0 },
        {
          xPercent: -50,
          duration: 70,
          ease: "none",
          repeat: -1,
        },
      );

      const onEnter = () => tween.pause();
      const onLeave = () => tween.resume();
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        tween.kill();
      };
    },
    { scope: ref, dependencies: [reducedMotion, reviews] },
  );

  const doubled = [...reviews, ...reviews];

  return (
    <section
      aria-label="Featured review highlights"
      className="overflow-hidden border-y border-[var(--border-warm)]/30 bg-[var(--bg-deep)] py-10"
    >
      <div ref={ref} className="overflow-hidden">
        <div className="highlights-track flex w-max gap-5">
          {doubled.map((review, index) => (
            <article
              key={`${review.id}-${index}`}
              className="flex w-[300px] shrink-0 flex-col gap-3 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-5"
            >
              <StarRating rating={review.rating} size="sm" />
              <p className="line-clamp-3 text-sm italic leading-relaxed text-[var(--text-body)]">
                &ldquo;{review.review_text}&rdquo;
              </p>
              <footer className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border-warm)] pt-3">
                <span className="font-[family:var(--font-serif)] text-sm font-bold text-[var(--text-primary)]">
                  {review.customer_name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  {review.location}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
