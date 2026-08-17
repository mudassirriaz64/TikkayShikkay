"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CultureValue } from "@/types";
import { Flame, Users, Star, Heart } from "lucide-react";

const iconMap = {
  flame: <Flame className="h-6 w-6" aria-hidden="true" />,
  users: <Users className="h-6 w-6" aria-hidden="true" />,
  star: <Star className="h-6 w-6" aria-hidden="true" />,
  heart: <Heart className="h-6 w-6" aria-hidden="true" />,
};

const iconColors = {
  flame: "text-[var(--accent-orange)]",
  users: "text-[var(--accent-peach)]",
  star: "text-[var(--accent-gold)]",
  heart: "text-[var(--accent-peach)]",
};

interface CultureSectionProps {
  values: CultureValue[];
}

export function CultureSection({ values }: CultureSectionProps) {
  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px] border-t border-[var(--border-warm)]/30">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal>
          <SectionHeading
            eyebrow="Our Values"
            title="What Drives"
            accent="the Fire"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Reveal key={value.id} delay={index * 0.1}>
              <Card className="flex h-full flex-col gap-4 border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-6 transition-colors hover:bg-[var(--bg-surface-hover)]">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] ${iconColors[value.icon]}`}>
                  {iconMap[value.icon]}
                </div>
                <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-body)]">
                  {value.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
