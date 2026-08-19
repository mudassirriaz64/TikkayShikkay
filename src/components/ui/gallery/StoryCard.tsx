import Image from "next/image";
import { Calendar, Quote } from "lucide-react";
import { ReviewBadge } from "@/components/ui/reviews/ReviewBadge";
import { CustomerStory } from "@/types";

interface StoryCardProps {
  story: CustomerStory;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] lg:grid-cols-[0.85fr_1.15fr]">
      <div className="relative min-h-[320px] aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:min-h-[420px] lg:h-full">
        <Image
          src={story.imageUrl || "/images/gallery/customer-1.jpg"}
          alt={story.customer_name}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
            Repeat Customer Story
          </span>
          <p className="mt-1 font-[family:var(--font-serif)] text-2xl font-bold leading-tight text-[var(--text-primary)]">
            {story.customer_name}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ReviewBadge tone="gold">{story.favorite_meal}</ReviewBadge>
            <ReviewBadge tone="muted">
              {story.years_visiting} Years Visiting
            </ReviewBadge>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-warm)]/40 pb-5">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)]">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {story.visits}+ Visits
          </span>
          <span className="font-[family:var(--font-serif)] text-4xl font-bold text-[var(--accent-orange)]/25">
            {String(story.years_visiting).padStart(2, "0")}
          </span>
        </div>

        <blockquote className="relative">
          <Quote
            aria-hidden="true"
            className="absolute -left-2 -top-4 h-10 w-10 rotate-180 text-[var(--accent-orange)]/20"
          />
          <p className="font-[family:var(--font-serif)] text-xl font-bold italic leading-snug text-[var(--text-primary)] md:text-2xl">
            &ldquo;{story.quote}&rdquo;
          </p>
        </blockquote>

        <ol className="mt-auto space-y-0">
          {story.timeline.map((visit, index) => (
            <li
              key={`${story.id}-${visit.year}`}
              className="relative flex gap-5 pb-5 last:pb-0"
            >
              {index < story.timeline.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[11px] top-6 h-full w-px bg-[var(--border-warm)]"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="relative mt-1.5 h-[22px] w-[22px] shrink-0 rounded-full border border-[var(--accent-peach)]/40 bg-[var(--bg-surface-raised)]"
              >
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-orange)]" />
              </span>
              <div>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xs font-bold tabular-nums tracking-[0.14em] text-[var(--accent-peach)]">
                    {visit.year}
                  </span>
                  <span className="font-[family:var(--font-serif)] text-base font-bold text-[var(--text-primary)]">
                    {visit.label}
                  </span>
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-body)]">
                  {visit.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
