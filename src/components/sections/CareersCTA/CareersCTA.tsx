import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function CareersCTA() {
  return (
    <section className="bg-[var(--bg-base)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Rounded orange card container */}
        <Reveal className="relative overflow-hidden bg-[#FF562A] rounded-3xl px-6 py-16 md:px-12 md:py-24 text-left shadow-[0_20px_40px_rgba(255,86,42,0.15)]">
          
          {/* Faded decorative brand graphic bleeding off top-right */}
          <div className="absolute -right-20 -top-20 w-80 h-80 text-[#550F00]/8 pointer-events-none select-none z-0">
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              className="w-full h-full"
            >
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
              <path d="M50 25 L50 75 M25 50 L75 50" stroke="currentColor" strokeWidth="8" />
            </svg>
          </div>

          <div className="relative z-10 max-w-[650px] flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#550F00]">
              We Are Hiring
            </span>
            <h2 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[#550F00] md:text-4.5xl leading-tight">
              Join the Crew Behind the Fire
            </h2>
            <p className="text-base leading-relaxed text-[#550F00]/80">
              Think you have what it takes to manage the coals? We are always on the lookout for passionate cooks, pitmasters, and service staff who care about ancestral grillcraft.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                href="/careers"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#121212] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#201F1F] active:translate-y-[1px] shadow-md"
              >
                View Openings
              </Link>
              <Link
                href="/careers"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[#550F00]/30 px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#550F00] transition-all duration-300 hover:bg-[#550F00]/10 active:translate-y-[1px]"
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
