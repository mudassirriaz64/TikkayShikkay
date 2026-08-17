"use client";

import Image from "next/image";
import { JourneyPost } from "@/types";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export function TimelineVertical({ posts }: { posts: JourneyPost[] }) {
  const years = ["2012", "2015", "Today"];

  return (
    <section className="relative bg-[var(--bg-base)] py-[80px] lg:pb-[128px] overflow-hidden">
      {/* Header */}
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px] text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
          Our Journey
        </span>
        <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-4xl">
          A Decade of Smoke
        </h2>
        <div className="mx-auto mt-4 w-12 h-[2px] bg-[var(--accent-peach)]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Centered Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border-warm)]/60 transform md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-16 md:space-y-24">
          {posts.map((post, index) => {
            const yearLabel = years[index] || "2024";
            const isEven = index % 2 === 0;
            const dotColor = isEven ? "bg-[var(--accent-peach)]" : "bg-[var(--accent-gold)]";

            return (
              <div key={post.id} className="relative w-full">
                {/* Center dot on desktop */}
                <div
                  className={cn(
                    "absolute left-4 top-6 -translate-x-1/2 z-20 w-4 h-4 rounded-full border-4 border-[#131313] md:left-1/2",
                    dotColor
                  )}
                />

                {/* Timeline row */}
                <div className="grid grid-cols-1 gap-8 pl-8 md:pl-0 md:grid-cols-2 md:gap-[96px] items-center w-full">
                  
                  {/* Left Column (Desktop) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "relative z-10 flex flex-col gap-3",
                      isEven ? "md:order-1 md:text-right md:items-end" : "md:order-2 md:text-left md:items-start"
                    )}
                  >
                    {/* Faded year background */}
                    <div
                      className={cn(
                        "absolute -top-12 text-[72px] font-bold font-[family:var(--font-serif)] text-white/5 select-none leading-none z-0 uppercase tracking-wider pointer-events-none md:-top-16 md:text-[96px]",
                        isEven ? "left-0 md:left-auto md:right-0" : "left-0"
                      )}
                    >
                      {yearLabel}
                    </div>

                    <span className={cn(
                      "text-xs font-bold uppercase tracking-[0.16em] z-10",
                      isEven ? "text-[var(--accent-peach)]" : "text-[var(--accent-gold)]"
                    )}>
                      {isEven ? "The Milestone" : "Secret of Flavor"}
                    </span>
                    <h3 className="font-[family:var(--font-serif)] text-xl font-bold uppercase text-[var(--text-primary)] z-10 md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="max-w-[45ch] text-sm leading-relaxed text-[var(--text-body)] z-10">
                      {post.content}
                    </p>
                  </motion.div>

                  {/* Right Column (Desktop) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "relative z-10",
                      isEven ? "md:order-2" : "md:order-1"
                    )}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg-surface-alt)] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.4)] border border-[var(--border-warm)]/60">
                      <Image
                        src={post.media_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 520px"
                        className="object-cover transition-transform duration-500 hover:scale-102"
                      />
                    </div>
                  </motion.div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
