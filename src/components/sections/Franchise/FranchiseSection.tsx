"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Sparkles, TrendingUp, ShieldCheck, Award, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { FranchiseModal } from "./FranchiseModal";

export function FranchiseSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="franchise" className="relative overflow-hidden bg-[var(--bg-deep)] py-[96px] lg:py-[120px] border-t border-[var(--border-warm)]/40">
      {/* Glow Effects */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[var(--accent-ember)]/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-[var(--accent-gold)]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Pitch (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                <Building2 className="h-3.5 w-3.5" />
                Franchise & Overseas Expansion
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase leading-[1.05] tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
                Own Pakistan’s Next <br />
                <span className="text-[var(--accent-peach)]">Iconic BBQ Franchise</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base leading-relaxed text-[var(--text-body)] md:text-lg max-w-[56ch]">
                With standard operating procedures, centralized 14-spice masala supply, master pitmaster training academy, and unmatched repeat customer loyalty, Tikkay Shikkay is expanding into high-density commercial hubs across Pakistan and the GCC.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-4 space-y-1">
                  <TrendingUp className="h-5 w-5 text-[var(--accent-orange)]" />
                  <p className="font-bold text-sm text-white">Proven Unit Economics</p>
                  <p className="text-[11px] text-neutral-400">High-margin live BBQ & delivery blend</p>
                </div>

                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-4 space-y-1">
                  <ShieldCheck className="h-5 w-5 text-[var(--accent-gold)]" />
                  <p className="font-bold text-sm text-white">Central Spice Supply</p>
                  <p className="text-[11px] text-neutral-400">Exact flavor consistency across cities</p>
                </div>

                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-4 space-y-1">
                  <Award className="h-5 w-5 text-emerald-400" />
                  <p className="font-bold text-sm text-white">Pitmaster Academy</p>
                  <p className="text-[11px] text-neutral-400">Complete staff training & kitchen ops</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="pt-3">
                <Button
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                  className="rounded-xl h-12 px-7 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Apply for Franchise Ownership
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Visual Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/our_legacy.png"
                  alt="Tikkay Shikkay Flagship Experience"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                    Now Welcoming Franchise Partners For
                  </p>
                  <p className="font-bold text-sm text-white mt-1">
                    Islamabad · Rawalpindi · Faisalabad · Multan · Karachi · Dubai
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <FranchiseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
