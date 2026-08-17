"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { Counter } from "@/components/motion/Counter";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useParallax } from "@/hooks/useParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_SOFT } from "@/lib/animations/easings";
import { SiteSettings } from "@/types";
import Image from "next/image";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef<HTMLElement | null>(null);
  const mediaRef = useParallax<HTMLDivElement>(0.12);
  const reducedMotion = useReducedMotion();

  const [headlineLead, headlineAccent, ...headlineRest] =
    settings.hero_title.split(". ");

  const heroLines = [
    <span key="lead">
      {headlineLead} <span className="hero-accent">{headlineAccent}</span>
    </span>,
    ...headlineRest.map((line) => <span key={line}>{line}</span>),
  ];

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(
          [
            ".hero-scrim",
            ".hero-eyebrow",
            ".hero-line-inner",
            ".hero-subtitle",
            ".hero-cta",
            ".hero-widget",
          ],
          { opacity: 1, y: 0, yPercent: 0 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_SOFT } });

      tl.fromTo(
        ".hero-scrim",
        { opacity: 0 },
        { opacity: 1, duration: 0.9 },
      )
        .fromTo(
          ".hero-eyebrow",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6",
        )
        .fromTo(
          ".hero-line-inner",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.16 },
          "-=0.35",
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          "-=0.55",
        )
        .fromTo(
          ".hero-widget",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.85 },
          "-=0.55",
        );
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--bg-base)]"
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 scale-110 overflow-hidden will-change-transform"
      >
        <Image
          src={settings.hero_media_url}
          alt="Charcoal Fire-Grilled BBQ Tikka"
          className="object-cover object-center image-render-crisp"
          fill
          priority
          quality={95}
          sizes="100vw"
        />
        <div className="hero-scrim absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]/85" />
      </div>

      <div className="relative mx-auto flex min-h-[660px] md:min-h-[700px] max-w-[1280px] flex-col px-4 pt-2 pb-16 lg:px-[64px]">
        <div className="flex flex-1 flex-col justify-start pt-2 lg:pt-4">
          <div className="max-w-4xl space-y-6">
            <div className="hero-eyebrow">
              <EyebrowBadge label="Pakistan's First BBQ Brand" color="gold" />
            </div>
            <h1 className="hero-title text-4xl leading-[1.05] tracking-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl xl:text-[76px]">
              {heroLines.map((line, index) => (
                <span
                  key={index}
                  className={`hero-line block overflow-hidden${
                    index === 0 ? " lg:whitespace-nowrap" : ""
                  }`}
                >
                  <span className="hero-line-inner block will-change-transform">
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-subtitle max-w-xl text-base leading-relaxed text-[var(--color-flame-accent)] md:text-lg">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <MagneticButton
                variant="flame"
                size="lg"
                className="hero-cta min-w-[170px] text-sm tracking-[0.08em] uppercase"
              >
                Order Online
              </MagneticButton>
              <MagneticButton
                variant="outline"
                size="lg"
                className="hero-cta min-w-[170px] border-[var(--border-warm)] text-sm tracking-[0.08em] uppercase hover:border-[var(--accent-peach)]/60 hover:text-[var(--accent-peach)] hover:shadow-[0_0_24px_rgba(255,180,162,0.2)]"
              >
                Explore Menu
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="hero-widget mt-auto flex w-full max-w-[380px] items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-ember)]/15 text-[var(--accent-ember)]">
            <Counter
              target={settings.fresh_batch_count}
              className="font-[family:var(--font-serif)] text-xl font-bold"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
              {"Today's Fresh Batch"}
            </p>
            <p className="mt-1 text-sm text-[var(--text-body)]">
              Fresh orders moving through the grill right now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
