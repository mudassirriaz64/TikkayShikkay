"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { Download, FileText } from "lucide-react";
import { CateringData } from "@/types/contact";

export function CateringCTA({ data }: { data: CateringData }) {
  const zoomRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!zoomRef.current || reducedMotion) return;
      gsap.fromTo(
        zoomRef.current,
        { scale: 1 },
        { scale: 1.08, duration: 18, ease: "none", yoyo: true, repeat: -1 },
      );
    },
    { scope: zoomRef, dependencies: [reducedMotion] },
  );

  return (
    <section className="relative overflow-hidden border-y border-[var(--border-warm)]/30">
      <div className="absolute inset-0" aria-hidden="true">
        <div ref={zoomRef} className="absolute -inset-[10%] will-change-transform">
          <Image
            src={data.imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[var(--bg-base)]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-base)] via-transparent to-[var(--bg-base)]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 py-[96px] lg:px-[64px] lg:py-[128px]">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            {data.eyebrow}
          </span>
          <h2 className="mt-4 font-[family:var(--font-serif)] text-4xl font-bold uppercase leading-[0.95] tracking-tight text-[var(--text-primary)] md:text-6xl">
            {data.titleLead}{" "}
            <em className="font-normal italic text-[var(--accent-orange)]">
              {data.titleAccent}
            </em>
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[var(--text-body)]">
            {data.description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/catering"
              className="group/cat inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[var(--accent-orange)] px-7 text-sm font-bold uppercase tracking-[0.12em] text-[var(--text-on-orange)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_36px_rgba(255,86,42,0.45)] active:scale-[0.98]"
            >
              <Download
                className="h-4 w-4 transition-transform duration-300 group-hover/cat:translate-y-0.5"
                aria-hidden="true"
              />
              {data.menuLabel}
            </Link>
            <Link
              href="/catering"
              className="group/cat2 inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-[var(--accent-peach)]/40 bg-black/40 px-7 text-sm font-bold uppercase tracking-[0.12em] text-[var(--accent-peach)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:border-[var(--accent-peach)] hover:bg-[var(--accent-peach)] hover:text-[var(--text-on-peach)] hover:shadow-[0_0_36px_rgba(255,180,162,0.3)] active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {data.quoteLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
