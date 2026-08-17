import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { Flame, Utensils, Clock } from "lucide-react";

const reasons = [
  {
    icon: Flame,
    color: "text-[var(--accent-orange)]",
    glow: "bg-[var(--accent-orange)]/10",
    title: "Live Fire Cooking",
    body: "The smoke, the char, the heat. It all stays in the food.",
  },
  {
    icon: Utensils,
    color: "text-[var(--accent-peach)]",
    glow: "bg-[var(--accent-peach)]/10",
    title: "Secret Spice Blends",
    body: "House spices are ground, blended, and adjusted in small batches.",
  },
  {
    icon: Clock,
    color: "text-[var(--accent-gold)]",
    glow: "bg-[var(--accent-gold)]/10",
    title: "Fresh Every Day",
    body: "Fresh prep, limited batches, and nothing lingering from the night before.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-[var(--bg-base)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="text-center mb-16">
          <SectionHeading
            eyebrow="Why Choose Us"
            eyebrowColor="muted"
            title="No shortcuts. No compromise."
            align="center"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={index * 0.12} className="h-full">
                <Card className="relative h-full overflow-hidden bg-[var(--bg-surface-raised)] p-8">
                  <div
                    className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-colors ${reason.glow}`}
                  />
                  <GlowCard>
                    <Icon
                      className={`relative z-10 mb-6 h-10 w-10 ${reason.color}`}
                    />
                    <h3 className="relative z-10 mb-4 font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                      {reason.title}
                    </h3>
                    <p className="relative z-10 text-[var(--text-body)]">
                      {reason.body}
                    </p>
                  </GlowCard>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
