"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/menu/PriceTag";
import { ProteinBadge } from "@/components/ui/menu/ProteinBadge";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";
import { PlatterData, PlatterOption } from "@/types/menu";

interface PlatterOptionsProps {
  options: PlatterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function PlatterOptions({ options, selectedId, onSelect }: PlatterOptionsProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const selected = option.id === selectedId;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selected}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
              selected
                ? "border-[var(--accent-orange)]/50 bg-[var(--accent-orange)]/10 shadow-[0_0_20px_rgba(255,86,42,0.15)]"
                : "border-[var(--border-warm)] bg-[var(--bg-surface)] hover:border-[var(--accent-peach)]/40",
            )}
          >
            <span className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300",
                  selected
                    ? "border-[var(--accent-orange)] bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
                    : "border-[var(--border-warm)]",
                )}
              >
                {selected ? (
                  <Check className="h-3 w-3" aria-hidden="true" />
                ) : null}
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-primary)]">
                {option.name}
              </span>
            </span>
            <PriceTag price={option.price} className="text-sm" />
          </button>
        );
      })}
    </div>
  );
}

interface BuildPlatterProps {
  data: PlatterData;
}

export function BuildPlatter({ data }: BuildPlatterProps) {
  const [meatId, setMeatId] = useState(data.meats[0].id);
  const [sideId, setSideId] = useState(data.sides[0].id);
  const reducedMotion = useReducedMotion();

  const meat = data.meats.find((m) => m.id === meatId) ?? data.meats[0];
  const side = data.sides.find((s) => s.id === sideId) ?? data.sides[0];
  const total = data.basePrice + meat.price + side.price;

  return (
    <section
      id="platters"
      className="scroll-mt-[140px] bg-[var(--bg-deep)] py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
                Interactive Experience
              </span>
              <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
                Build Your Own{" "}
                <em className="font-normal italic text-[var(--accent-peach)]">
                  Platter
                </em>
              </h2>
              <p className="mt-4 max-w-[54ch] text-[var(--text-body)]">
                Pick a protein, pair it with a side, and we will load it fresh
                off the coals. The price updates the moment you choose.
              </p>
            </Reveal>

            <div className="mt-9 flex flex-col gap-8">
              <Reveal delay={0.05}>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Step 1 — Choose Meat
                </p>
                <PlatterOptions
                  options={data.meats}
                  selectedId={meatId}
                  onSelect={setMeatId}
                />
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Step 2 — Choose Side
                </p>
                <PlatterOptions
                  options={data.sides}
                  selectedId={sideId}
                  onSelect={setSideId}
                />
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-6 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Estimated total
                  </p>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="block"
                  >
                    <PriceTag price={total} className="text-3xl" />
                  </motion.span>
                </div>
                <Button
                  variant="primary"
                  className="h-12 gap-2 rounded-xl px-7 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(255,86,42,0.4)]"
                >
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Lock In Platter
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="h-full">
            <div className="group relative">
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-warm)] shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -12, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="relative aspect-[4/5]"
                >
                  <Image
                    src={data.imageUrl}
                    alt="Signature Tikkay Shikkay platter"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/70 via-transparent to-transparent" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-20 top-0 h-full w-28 rotate-[18deg] bg-white/5 blur-2xl"
                />
              </div>

              <motion.div
                animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute -right-2 top-8 md:-right-5"
              >
                <ProteinBadge value="300g" label="Protein Loaded" />
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
