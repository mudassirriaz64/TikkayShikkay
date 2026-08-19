import Link from "next/link";
import { UtensilsCrossed, ArrowRight, Sparkles, Flame } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function CateringMenuBanner() {
  return (
    <section className="bg-[var(--bg-deep)] py-8 border-y border-[var(--border-warm)]/50">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-[var(--accent-orange)]/30 bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-surface-alt)] to-[var(--bg-surface)] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
            {/* Ambient Ember Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-orange)]/15 blur-3xl" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_20px_rgba(255,86,42,0.35)]">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--accent-peach)] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Corporate · Weddings · Birthdays · Bulk Boxes
                    </span>
                  </div>
                  <h3 className="font-[family:var(--font-serif)] text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)] mt-1">
                    Have a Bulk Order or Hosting an Event?
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-body)] mt-1 max-w-[55ch]">
                    We bring the charcoal pit & live clay tandoor directly to your venue. Custom BBQ spreads for 20 to 1,000+ guests.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/catering"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange)] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-on-orange)] shadow-[0_0_25px_rgba(255,86,42,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <Flame className="h-4 w-4" />
                  <span>Explore Catering & Live Feasts</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
