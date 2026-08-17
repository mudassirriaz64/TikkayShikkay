import Image from "next/image";
import { Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { KitchenProcess } from "@/types";

interface TimelineCardProps {
  process: KitchenProcess;
  flip?: boolean;
}

export function TimelineCard({ process, flip = false }: TimelineCardProps) {
  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] transition-colors duration-300 hover:border-[var(--accent-peach)]/30 md:grid-cols-2">
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:h-full",
          flip && "md:order-2",
        )}
      >
        <Image
          src={process.imageUrl}
          alt={process.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/70 via-transparent to-black/10" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] backdrop-blur-sm">
          Step {String(process.step).padStart(2, "0")}
        </span>
        <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] backdrop-blur-sm">
          <Clock className="h-3 w-3 text-[var(--accent-peach)]" aria-hidden="true" />
          {process.time}
        </span>
      </div>

      <div
        className={cn(
          "flex flex-col gap-5 p-6 md:p-10",
          flip && "md:order-1",
        )}
      >
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
          Inside The Kitchen
        </span>
        <h3 className="font-[family:var(--font-serif)] text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-3xl">
          {process.title}
        </h3>
        <p className="text-[var(--text-body)] leading-relaxed">
          {process.story}
        </p>
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
      </div>
    </article>
  );
}
