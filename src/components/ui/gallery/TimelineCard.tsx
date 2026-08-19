import Image from "next/image";
import { Clock, Flame, Lightbulb, Sparkles, Utensils, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { KitchenProcess } from "@/types";

interface TimelineCardProps {
  process: KitchenProcess;
  flip?: boolean;
}

export function TimelineCard({ process, flip = false }: TimelineCardProps) {
  const isFeatured = process.is_featured;

  return (
    <article
      className={cn(
        "group relative grid grid-cols-1 overflow-hidden rounded-[28px] border transition-all duration-300 md:grid-cols-2",
        isFeatured
          ? "border-[var(--accent-orange)]/60 bg-[var(--bg-surface)] shadow-[0_0_40px_rgba(255,86,42,0.15)] ring-1 ring-[var(--accent-orange)]/30"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] hover:border-[var(--accent-peach)]/30"
      )}
    >
      {/* Media Column (Image or Looping Background Video) */}
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden bg-black/60 md:aspect-auto md:h-full",
          flip && "md:order-2",
        )}
      >
        {process.video_url ? (
          <video
            src={process.video_url}
            poster={process.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={process.imageUrl}
            alt={process.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/80 via-transparent to-black/20" />

        {/* Step Badge */}
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] backdrop-blur-md">
          Step {String(process.step).padStart(2, "0")}
        </span>

        {/* Featured Signature Tag */}
        {isFeatured ? (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-on-orange)] shadow-md backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> Signature Craft
          </span>
        ) : null}

        {/* Time & Temperature Badges */}
        <div className="absolute bottom-4 right-4 flex flex-wrap items-center gap-2">
          {process.temperature ? (
            <span className="flex items-center gap-1 rounded-full border border-[var(--accent-orange)]/30 bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-orange)] backdrop-blur-md">
              <Flame className="h-3 w-3 text-[var(--accent-orange)]" aria-hidden="true" />
              {process.temperature}
            </span>
          ) : null}

          {process.time ? (
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] backdrop-blur-md">
              <Clock className="h-3 w-3 text-[var(--accent-peach)]" aria-hidden="true" />
              {process.time}
            </span>
          ) : null}
        </div>
      </div>

      {/* Content Column */}
      <div
        className={cn(
          "flex flex-col gap-5 p-6 md:p-10",
          flip && "md:order-1",
        )}
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            Inside The Kitchen
          </span>
          <h3 className="mt-1 font-[family:var(--font-serif)] text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-3xl">
            {process.title}
          </h3>

          {/* Technique Tags */}
          {process.technique_tags && process.technique_tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {process.technique_tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="rounded-full border border-[var(--accent-orange)]/25 bg-[var(--accent-orange)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-peach)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Narrative Story */}
        <p className="text-[var(--text-body)] leading-relaxed">
          {process.story}
        </p>

        {/* Key Ingredients / Tools Bar */}
        {process.ingredients_highlight ? (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/60 px-3.5 py-2 text-xs">
            <Utensils className="h-3.5 w-3.5 shrink-0 text-[var(--accent-peach)]" />
            <span className="text-[var(--text-faint)] font-bold uppercase tracking-wider text-[10px]">
              Craft &amp; Tools:
            </span>
            <span className="text-[var(--text-primary)] truncate font-medium">
              {process.ingredients_highlight}
            </span>
          </div>
        ) : null}

        {/* Chef Secret Box */}
        {process.chef_secret ? (
          <div className="flex gap-3 rounded-2xl border border-[var(--accent-orange)]/25 bg-[var(--accent-ember)]/10 p-4">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-orange)]" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-[var(--text-primary)]">
              <span className="font-bold uppercase tracking-[0.12em] text-[var(--accent-orange)]">
                Chef&apos;s Secret:{" "}
              </span>
              {process.chef_secret}
            </p>
          </div>
        ) : null}

        {/* The Detail / Key Fact */}
        {process.fact ? (
          <div className="mt-auto flex gap-3 rounded-2xl border border-[var(--accent-gold)]/25 bg-[var(--accent-gold)]/5 p-4">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-gold)]"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              <span className="font-bold uppercase tracking-[0.12em] text-[var(--accent-gold)]">
                The Detail:{" "}
              </span>
              {process.fact}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
