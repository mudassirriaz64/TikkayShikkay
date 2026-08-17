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

        <div className="space-y-8">
          {kitchen.map((process, index) => (
            <Reveal key={process.id} delay={(index % 2) * 0.08}>
              <TimelineCard process={process} flip={index % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
