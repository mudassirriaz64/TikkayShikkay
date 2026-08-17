"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CateringEventType } from "@/types";
import { Utensils, Building2, Cake, GraduationCap } from "lucide-react";

const iconMap = {
  utensils: <Utensils className="h-6 w-6" aria-hidden="true" />,
  building: <Building2 className="h-6 w-6" aria-hidden="true" />,
  cake: <Cake className="h-6 w-6" aria-hidden="true" />,
  graduation: <GraduationCap className="h-6 w-6" aria-hidden="true" />,
};

interface EventTypesProps {
  events: CateringEventType[];
}

export function EventTypes({ events }: EventTypesProps) {
  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal>
          <SectionHeading
            eyebrow="What We Cater"
            title="Events We"
            accent="Bring the Fire To"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {events.map((event, index) => (
            <Reveal key={event.id} delay={index * 0.1}>
              <Card className="flex h-full flex-col gap-4 border-l-4 border-l-[var(--accent-gold)] rounded-r-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-6 transition-colors hover:bg-[var(--bg-surface-hover)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--accent-gold)]">
                    {iconMap[event.icon]}
                  </div>
                  <div>
                    <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {event.capacity}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-body)]">
                  {event.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
