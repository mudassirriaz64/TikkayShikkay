"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneyCard } from "@/components/ui/gallery/JourneyCard";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { JourneyMilestone } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface BrandJourneyProps {
  journey: JourneyMilestone[];
}

export function BrandJourney({ journey }: BrandJourneyProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const fill = sectionRef.current?.querySelector(".journey-line-fill");
      if (!fill) return;

      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-16">
          <SectionHeading
            eyebrow="Building Pakistan's First BBQ Brand"
            title="The Journey Of"
            accent="Fire"
          />
          <p className="mt-5 max-w-[60ch] text-[var(--text-body)]">
            From a single charcoal chimney to a brand in the making - the
            challenges, the lessons and the milestones that lit the way.
          </p>
        </Reveal>

        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[9px] top-0 w-px bg-[var(--border-warm)]"
          />
          <span
            aria-hidden="true"
            className="journey-line-fill absolute bottom-0 left-[9px] top-0 w-px origin-top bg-gradient-to-b from-[var(--accent-orange)] via-[var(--accent-ember)] to-[var(--accent-gold)]"
          />

          <div className="space-y-10">
            {journey.map((milestone, index) => (
              <Reveal key={milestone.id} delay={(index % 2) * 0.08}>
                <div className="relative pl-10 md:pl-16">
                  <span className="absolute left-0 top-6 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[var(--accent-peach)]/50 bg-[var(--bg-surface-raised)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent-orange)]" />
                  </span>
                  <JourneyCard milestone={milestone} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
