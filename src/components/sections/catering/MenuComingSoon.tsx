"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Flame } from "lucide-react";

export function MenuComingSoon() {
  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px] border-t border-[var(--border-warm)]/30">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <Card className="flex flex-col items-center gap-6 border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-8 md:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]">
              <Flame className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-3xl">
                Catering Menu
              </h2>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-[var(--accent-peach)]">
                Coming Soon
              </p>
            </div>
            <p className="max-w-[48ch] text-sm leading-relaxed text-[var(--text-body)]">
              We're putting the finishing touches on our dedicated catering menu.
              In the meantime, reach out and we'll craft a custom package for your event.
            </p>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
