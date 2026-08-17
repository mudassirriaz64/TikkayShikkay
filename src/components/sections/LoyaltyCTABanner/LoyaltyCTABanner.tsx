import { MagneticButton } from "@/components/motion/MagneticButton";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";

export function LoyaltyCTABanner() {
  return (
    <section className="bg-[var(--bg-deep)] px-4 py-[80px]">
      <Reveal className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[24px] border border-[#D9381E]/30 bg-[#181818] px-8 py-14 transition-shadow duration-700 hover:animate-[ember-bloom_2.4s_ease-in-out_infinite] md:px-14 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,56,30,0.15),transparent_70%)]" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <div>
              <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-white/80">
                Join the Grill Fam
              </p>
              <h2 className="mt-4 font-[family:var(--font-serif)] text-[clamp(2.5rem,4vw,3.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-white">
                Join the club and get the first bite.
              </h2>
              <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-[1.55] text-stone-300">
                Get early access to specials, loyalty rewards, and the kind of
                updates that matter when the grill is running hot.
              </p>
              <div className="mt-8">
                <MagneticButton
                  variant="flame"
                  size="md"
                  className="px-6 py-3 rounded-xl font-medium bg-[#D9381E] text-white hover:bg-[#b82d16]"
                >
                  Join WhatsApp Club
                </MagneticButton>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4 text-center text-white/90 md:text-left">
              <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em]">
                Member count
              </p>
              <Counter
                target={12470}
                suffix="+"
                className="mt-3 block font-[family:var(--font-serif)] text-4xl font-bold text-white"
              />
              <p className="mt-2 text-sm leading-[1.5]">
                This number keeps growing because the food keeps delivering.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
