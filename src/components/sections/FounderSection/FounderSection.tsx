import Image from "next/image";
import { FounderDetails } from "@/types";
import { AccentCard } from "@/components/ui/AccentCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export function FounderSection({ details }: { details: FounderDetails }) {
  return (
    <section className="bg-[var(--bg-base)] py-[80px] overflow-hidden">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-[64px] px-4 md:grid-cols-2 lg:px-[64px]">
        {/* Left Column: Portrait & Overlapping Card */}
        <Reveal className="relative w-full max-w-[480px] justify-self-center md:justify-self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--bg-surface)] rounded-2xl shadow-xl">
            <Image
              src={details.portraitUrl}
              alt="Founder Ahmed Raza portrait at the grill"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover grayscale brightness-90 transition-transform duration-500 hover:scale-102"
            />
          </div>

          {/* Peach Quote Card overlapping bottom right */}
          <Reveal
            delay={0.2}
            className="absolute right-0 bottom-8 z-20 max-w-[280px] bg-[var(--accent-peach)] p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:-right-8"
          >
            <p className="font-[family:var(--font-serif)] text-sm italic leading-relaxed text-[#611200]">
              "{details.quote}"
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#611200]">
              {details.quoteAuthor}
            </p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#611200]/70">
              {details.quoteRole}
            </p>
          </Reveal>
        </Reveal>

        {/* Right Column: Bio & Mission/Vision */}
        <div className="flex flex-col justify-center gap-8">
          <Reveal>
            <SectionHeading
              eyebrow={details.eyebrow}
              eyebrowColor="peach"
              title={details.title}
              className="mb-4"
            />
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-[var(--text-body)]">
              {details.bio}
            </p>
          </Reveal>

          {/* Stacked Mission and Vision cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={0.1}>
              <AccentCard accentColor="gold" className="bg-[var(--bg-surface-alt)]">
                <h3 className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                  Our Mission
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">
                  {details.mission}
                </p>
              </AccentCard>
            </Reveal>

            <Reveal delay={0.2}>
              <AccentCard accentColor="peach" className="bg-[var(--bg-surface-alt)]">
                <h3 className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)]">
                  Our Vision
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]">
                  {details.vision}
                </p>
              </AccentCard>
            </Reveal>
          </div>

          {/* Signature SVG & Caption */}
          <Reveal delay={0.3} className="flex items-center gap-6 mt-4">
            <svg
              className="w-32 h-10 text-[var(--accent-peach)] opacity-60"
              viewBox="0 0 100 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M10 20c12-12 25 8 38-3s18-12 30 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)] font-bold">
              {details.caption}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
