import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineCard } from "@/components/ui/gallery/TimelineCard";
import { Reveal } from "@/components/motion/Reveal";
import { KitchenProcess } from "@/types";

interface KitchenStoriesProps {
  kitchen: KitchenProcess[];
}

export function KitchenStories({ kitchen }: KitchenStoriesProps) {
  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Behind The Scenes"
            title="How The Fire"
            accent="Works"
          />
          <p className="mt-5 max-w-[60ch] text-[var(--text-body)]">
            A documentary of the kitchen: the grind, the soak, the sauces, the
            charcoal and the hand that turns every skewer.
          </p>
        </Reveal>

        <div className="relative space-y-12 md:space-y-16">
          {kitchen.map((process, index) => (
            <div key={process.id} className="relative">
              <Reveal delay={(index % 2) * 0.08}>
                <TimelineCard process={process} flip={index % 2 === 1} />
              </Reveal>

              {/* Step-to-Step Sequential Connector Line & Flame Node */}
              {index < kitchen.length - 1 ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-12 md:-bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center h-12 md:h-16 z-10"
                >
                  {/* Glowing vertical flame-trail line */}
                  <div className="w-[2px] h-full bg-gradient-to-b from-[var(--accent-orange)]/60 via-[var(--accent-gold)]/40 to-[var(--accent-orange)]/60 shadow-[0_0_8px_rgba(255,86,42,0.4)]" />
                  
                  {/* Central flame indicator badge between cards */}
                  <div className="absolute top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--accent-orange)]/40 bg-[var(--bg-deep)] text-[var(--accent-orange)] shadow-[0_0_12px_rgba(255,86,42,0.3)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent-orange)] animate-pulse" />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
