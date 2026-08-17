"use client";

import Image from "next/image";
import { Calendar, Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewBadge } from "@/components/ui/reviews/ReviewBadge";
import { StarRating } from "@/components/ui/reviews/StarRating";
import { useParallax } from "@/hooks/useParallax";
import { formatDate } from "@/lib/utils/formatDate";
import { CustomerReview } from "@/types";

interface FeaturedReviewProps {
  review: CustomerReview;
}

export function FeaturedReview({ review }: FeaturedReviewProps) {
  const parallaxRef = useParallax<HTMLDivElement>(0.1);

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            A Story Worth Retelling
          </span>
          <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
            The Featured{" "}
            <em className="font-normal italic text-[var(--accent-peach)]">
              Story
            </em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="h-full">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-warm)] shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
                <div
                  ref={parallaxRef}
                  className="relative aspect-[4/5] w-full overflow-hidden"
                >
                  <Image
                    src={review.customerImageUrl ?? review.image_url}
                    alt={review.customer_name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy"
                    className="scale-110 object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="font-[family:var(--font-serif)] text-2xl font-bold text-[var(--text-primary)]">
                      {review.customer_name}
                    </p>
                    <p className="text-sm text-[var(--text-body)]">
                      {review.location}
                    </p>
                  </div>
                  <ReviewBadge tone="peach">{review.source}</ReviewBadge>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative">
              <Quote
                aria-hidden="true"
                className="absolute -top-6 left-0 h-14 w-14 rotate-180 text-[var(--accent-orange)]/20"
              />
              <div className="flex flex-col gap-6">
                <StarRating rating={review.rating} size="lg" />

                <blockquote className="font-[family:var(--font-serif)] text-xl font-bold italic leading-snug text-[var(--text-primary)] md:text-2xl">
                  &ldquo;{review.review_text}&rdquo;
                </blockquote>

                <div className="flex flex-wrap items-center gap-3">
                  <ReviewBadge tone="gold">{review.favorite_meal}</ReviewBadge>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Visited {formatDate(review.visit_date)}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
