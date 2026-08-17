import Image from "next/image";
import { AccentCard } from "@/components/ui/AccentCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";

const founderStats = [
  { target: 100, suffix: "%", label: "Organic Spices" },
  { target: 24, suffix: "h", label: "Hand Marination" },
  { target: 0, suffix: "", label: "Compromise" },
];

export function StorySection() {
  return (
    <section className="bg-[var(--bg-base)] py-[80px] overflow-hidden">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-[48px] px-4 lg:grid-cols-[minmax(0,520px)_1fr] lg:px-[64px]">
        <Reveal className="relative">
          <div
            aria-hidden="true"
            className="absolute -top-14 -left-10 h-80 w-80 rounded-full bg-[var(--accent-ember)]/30 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-[var(--accent-gold)]/20 blur-[90px]"
          />

          <Reveal delay={0.25} y={16} className="absolute left-0 lg:-left-6 top-8 z-20 max-w-[280px] border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] px-5 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
            <p className="text-sm italic leading-[1.5] text-[var(--text-primary)]">
              The grill doesn&rsquo;t lie. It reveals a tradition.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Ahmed, Founder
            </p>
          </Reveal>

          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
            <Image
              src="/images/our_legacy.png"
              alt="Founder portrait at the grill"
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col justify-center gap-8">
          <Reveal>
            <SectionHeading
              eyebrow="Our Legacy"
              eyebrowColor="peach"
              title="From a Single Grill to a National Revolution"
              className="mb-6"
            />
            <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.56] text-[var(--text-body)]">
              Tikkay Shikkay started with a simple obsession: make the kind of
              BBQ people remember. Every cut is hand seasoned, every ember
              watched, every plate sent out with the same pride that started the
              first fire.
            </p>
            <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.56] text-[var(--text-body)]">
              What began as one backyard grill in Ahmed&rsquo;s home has become a
              brand built on fire, family, and a refusal to cut corners.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-6 border-y border-[var(--border-warm)]/60 py-8">
              {founderStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-[family:var(--font-serif)] text-3xl font-bold leading-none text-[var(--accent-gold)]">
                    <Counter
                      target={stat.target}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={0.15}>
              <AccentCard accentColor="peach">
                <h3 className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)]">
                  Mission
                </h3>
                <p className="mt-3 text-lg leading-[1.5] text-[var(--text-primary)]">
                  Serve honest fire-grilled food that feels handcrafted from the
                  first bite to the last.
                </p>
              </AccentCard>
            </Reveal>
            <Reveal delay={0.25}>
              <AccentCard accentColor="gold">
                <h3 className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                  Vision
                </h3>
                <p className="mt-3 text-lg leading-[1.5] text-[var(--text-primary)]">
                  Build a brand that people trust for flavor, freshness, and a
                  grill that never cuts corners.
                </p>
              </AccentCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
