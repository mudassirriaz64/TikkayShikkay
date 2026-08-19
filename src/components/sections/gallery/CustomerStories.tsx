"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/reviews/StarRating";
import { VideoCard } from "@/components/ui/gallery/VideoCard";
import { InstagramCard } from "@/components/ui/gallery/InstagramCard";
import { StoryCard } from "@/components/ui/gallery/StoryCard";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GoogleReview, InstagramPost, VideoTestimonial, CustomerStory } from "@/types";

function SubHeading({ title }: { title: string }) {
  return (
    <Reveal className="mb-6">
      <h3 className="flex items-center gap-3 font-[family:var(--font-serif)] text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-2xl">
        <span aria-hidden="true" className="h-6 w-1 rounded-full bg-[var(--accent-orange)]" />
        {title}
      </h3>
    </Reveal>
  );
}

function GoogleReviewCard({ review }: { review: GoogleReview }) {
  const initials = review.customer_name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-peach)]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-ember)]/15 font-[family:var(--font-serif)] text-sm font-bold text-[var(--accent-orange)]">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-primary)]">
            {review.customer_name}
            {review.verified ? (
              <BadgeCheck className="h-4 w-4 shrink-0 text-[var(--accent-peach)]" aria-label="Verified review" />
            ) : null}
          </p>
          <p className="text-xs text-[var(--text-faint)]">
            {review.source} · {review.visit_date}
          </p>
        </div>
      </div>

      <StarRating rating={review.rating} size="sm" />

      <p className="text-sm leading-relaxed text-[var(--text-body)]">
        &ldquo;{review.review_text}&rdquo;
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 border-t border-[var(--border-warm)]/40 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Verified Guest
      </span>
    </article>
  );
}

function MarqueeStrip({ posts }: { posts: InstagramPost[] }) {
  const reducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items 4x to ensure a wide enough buffer for seamless infinite loop across all viewports
  const repeated = [...posts, ...posts, ...posts, ...posts];

  if (!posts || posts.length === 0) return null;

  return (
    <div
      className="mt-20 overflow-hidden border-y border-[var(--border-warm)]/30 bg-[var(--bg-deep)]/40 py-5 backdrop-blur-xs select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <motion.div
        animate={
          reducedMotion || isPaused
            ? undefined
            : { x: ["0%", "-50%"] }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 35,
                ease: "linear",
                repeat: Infinity,
              }
        }
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        dragElastic={0.05}
        className="flex w-max gap-5"
      >
        {repeated.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] transition-all duration-300 hover:scale-105 hover:border-[var(--accent-orange)]/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          >
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              sizes="160px"
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
            <span className="absolute bottom-2.5 left-2.5 right-2.5 truncate rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent-peach)] backdrop-blur-xs">
              {post.tag}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface CustomerStoriesProps {
  videos: VideoTestimonial[];
  instagram: InstagramPost[];
  googleReviews: GoogleReview[];
  stories: CustomerStory[];
}

export function CustomerStories({
  videos,
  instagram,
  googleReviews,
  stories,
}: CustomerStoriesProps) {
  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="Hear From Our"
            accent="Guests"
          />
          <p className="mt-5 max-w-[60ch] text-[var(--text-body)]">
            The voices that fill our tables - captured in clips, feeds, reviews
            and the stories guests keep coming back to tell.
          </p>
        </Reveal>

        <div className="space-y-16 lg:space-y-24">
          {/* From Our Feed */}
          <div>
            <SubHeading title="From Our Feed" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instagram.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 0.08}>
                  <InstagramCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Google Reviews */}
          <div>
            <SubHeading title="Google Reviews" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {googleReviews.map((review, index) => (
                <Reveal key={review.id} delay={(index % 4) * 0.08} className="h-full">
                  <GoogleReviewCard review={review} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Repeat Customers */}
          <div>
            <SubHeading title="Repeat Customers" />
            <div className="space-y-8">
              {stories.map((story, index) => (
                <Reveal key={story.id} delay={(index % 2) * 0.1}>
                  <StoryCard story={story} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MarqueeStrip posts={instagram} />
    </section>
  );
}
