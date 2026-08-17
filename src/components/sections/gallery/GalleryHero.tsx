"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_SOFT } from "@/lib/animations/easings";
import { GalleryHeroData } from "@/types";

const embers = [
  { className: "left-[8%] top-[62%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[16%] top-[48%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[26%] top-[76%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[40%] top-[66%] h-1 w-1 bg-[var(--accent-peach)]/30" },
  { className: "left-[56%] top-[54%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[68%] top-[72%] h-1 w-1 bg-[var(--accent-gold)]/35" },
  { className: "left-[76%] top-[46%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[86%] top-[60%] h-1.5 w-1.5 bg-[var(--accent-orange)]/30" },
  { className: "left-[92%] top-[78%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[32%] top-[84%] h-1 w-1 bg-[var(--accent-peach)]/30" },
];

interface GalleryHeroProps {
  data: GalleryHeroData;
}

export function GalleryHero({ data }: GalleryHeroProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(
          [
            ".gallery-hero-scrim",
            ".gallery-hero-eyebrow",
            ".gallery-hero-line",
            ".gallery-hero-subtitle",
          ],
          { opacity: 1, y: 0, yPercent: 0 },
        );
        gsap.set(".gallery-hero-ember", { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_SOFT } });

      tl.fromTo(".gallery-hero-scrim", { opacity: 0 }, { opacity: 1, duration: 0.9 })
        .fromTo(
          ".gallery-hero-eyebrow",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6",
        )
        .fromTo(
          ".gallery-hero-line",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.16 },
          "-=0.35",
        )
        .fromTo(
          ".gallery-hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7",
        );

      gsap.to(".gallery-hero-smoke-a", {
        xPercent: 20,
        yPercent: -14,
        scale: 1.15,
        opacity: 0.14,
        duration: 16,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gallery-hero-smoke-b", {
        xPercent: -16,
        yPercent: 12,
        scale: 1.2,
        opacity: 0.12,
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gallery-hero-ember", {
        y: -90,
        opacity: 0,
        duration: (i) => 7 + (i % 5) * 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1.1,
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--bg-deep)]"
    >
      <div className="absolute inset-0 scale-110">
        <Image
          src={data.imageUrl}
          alt="Flames rising over the grill"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="gallery-hero-scrim absolute inset-0 bg-[var(--bg-deep)]/75" />
        <div className="gallery-hero-scrim absolute inset-0 bg-gradient-to-b from-[var(--bg-deep)]/70 via-transparent to-[var(--bg-base)]" />
      </div>

      <div
        aria-hidden="true"
        className="gallery-hero-smoke-a absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--accent-ember)]/10 opacity-[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="gallery-hero-smoke-b absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[var(--accent-peach)]/10 opacity-[0.06] blur-[120px]"
      />

      {embers.map((ember, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`gallery-hero-ember absolute rounded-full ${ember.className}`}
        />
      ))}

      <div className="relative mx-auto flex min-h-[62vh] w-full max-w-[1280px] flex-col justify-center px-4 pb-16 pt-24 md:min-h-[70vh] lg:px-[64px]">
        <div className="max-w-4xl space-y-7">
          <span className="gallery-hero-eyebrow inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            <span aria-hidden="true" className="h-px w-10 bg-[var(--accent-peach)]/50" />
            {data.label}
          </span>

          <h1 className="font-[family:var(--font-serif)] text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)] md:text-7xl lg:text-[96px]">
            <span className="gallery-hero-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block will-change-transform">{data.titleLead}</span>
            </span>
            <span className="gallery-hero-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block text-[var(--accent-peach)] will-change-transform">
                {data.titleMid} {data.titleAccent}
              </span>
            </span>
          </h1>

          <p className="gallery-hero-subtitle max-w-xl text-base leading-relaxed text-[var(--text-body)] md:text-lg">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
