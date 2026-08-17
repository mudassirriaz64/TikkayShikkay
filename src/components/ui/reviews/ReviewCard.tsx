"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Check, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ReviewAvatar } from "./ReviewAvatar";
import { ReviewBadge } from "./ReviewBadge";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/formatDate";
import { CustomerReview } from "@/types";

const LONG_REVIEW_THRESHOLD = 170;

interface ReviewCardProps {
  review: CustomerReview;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(false);

  const isLong = review.review_text.length > LONG_REVIEW_THRESHOLD;
  const visibleText =
    !isLong || expanded
      ? review.review_text
      : `${review.review_text.slice(0, LONG_REVIEW_THRESHOLD).trimEnd()}…`;
  const helpfulCount = review.helpful_count + (helpful ? 1 : 0);

  return (
    <Card className="group flex h-full flex-col overflow-hidden hover:shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,180,162,0.08)]">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={review.image_url}
          alt={review.favorite_meal}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-[var(--bg-surface)]/10 to-transparent" />
        <ReviewBadge tone="gold" className="absolute left-4 top-4 backdrop-blur-sm">
          {review.favorite_meal}
        </ReviewBadge>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-6 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ReviewAvatar name={review.customer_name} index={index} size="sm" />
            <div>
              <p className="flex items-center gap-2 font-[family:var(--font-serif)] font-bold text-[var(--text-primary)]">
                {review.customer_name}
                {review.verified ? (
                  <ReviewBadge tone="peach">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    Verified
                  </ReviewBadge>
                ) : null}
              </p>
              <p className="text-xs text-[var(--text-faint)]">
                {review.location}
              </p>
            </div>
          </div>
          <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-faint)]">
            {review.source}
          </span>
        </div>

        <StarRating rating={review.rating} size="sm" />

        <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
          {review.title}
        </h3>

        <p className="text-sm leading-relaxed text-[var(--text-body)]">
          {visibleText}
        </p>
        {isLong ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="self-start text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-peach)] transition-colors hover:text-[var(--accent-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-warm)] pt-4">
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(review.visit_date)}
          </span>
          <button
            type="button"
            onClick={() => setHelpful((value) => !value)}
            aria-pressed={helpful}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
              helpful
                ? "border-[var(--accent-orange)]/50 bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]"
                : "border-[var(--border-warm)] text-[var(--text-muted)] hover:text-[var(--accent-peach)]",
            )}
          >
            <ThumbsUp
              className={cn("h-3.5 w-3.5", helpful && "fill-current")}
              aria-hidden="true"
            />
            Helpful · {helpfulCount}
          </button>
        </div>
      </div>
    </Card>
  );
}
