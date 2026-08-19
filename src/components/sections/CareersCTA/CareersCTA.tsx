import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function CareersCTA() {
  return (
    <section className="bg-[var(--bg-deep)] px-4 py-[80px]">
      <div className="mx-auto max-w-[1280px]">
        {/* Dark charcoal card container matching Loyalty Club banner */}
        <Reveal className="relative overflow-hidden rounded-[24px] border border-[#D9381E]/30 bg-[#181818] px-8 py-14 transition-shadow duration-700 hover:animate-[ember-bloom_2.4s_ease-in-out_infinite] md:px-14 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,56,30,0.15),transparent_70%)]" />
          
          {/* Faded decorative brand graphic */}
          <div className="absolute -right-20 -top-20 w-80 h-80 text-white/5 pointer-events-none select-none z-0">
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              className="w-full h-full"
            >
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="none" />
              <path d="M50 25 L50 75 M25 50 L75 50" stroke="currentColor" strokeWidth="6" />
            </svg>
          </div>

          <div className="relative z-10 max-w-[650px] flex flex-col gap-6">
            <span className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-white/80">
              We Are Hiring
            </span>
            <h2 className="font-[family:var(--font-serif)] text-[clamp(2.2rem,3.8vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-white">
              Join the Crew Behind the Fire.
            </h2>
            <p className="max-w-[58ch] text-[1.05rem] leading-[1.55] text-stone-300">
              Think you have what it takes to manage the coals? We are always on the lookout for passionate cooks, pitmasters, and service staff who care about ancestral grillcraft.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href="/careers"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#D9381E] px-6 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#b82d16] active:translate-y-[1px] shadow-md cursor-pointer"
              >
                View Openings
              </Link>
              <Link
                href="/careers"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-bold uppercase tracking-[0.08em] text-neutral-200 transition-all duration-300 hover:bg-white/10 hover:text-white active:translate-y-[1px]"
              >
                Our Culture
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
