import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/types";
import { Reveal } from "@/components/motion/Reveal";

export function ProcessGallery({ items }: { items: GalleryItem[] }) {
  if (items.length < 3) return null;

  return (
    <section className="bg-[var(--bg-deep)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Header Row */}
        <Reveal className="mb-10 flex items-end justify-between gap-6 border-b border-[var(--border-warm)]/40 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
              Behind the Scenes
            </span>
            <h2 className="mt-2 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Follow Our Process
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-peach)] transition-colors hover:text-[var(--accent-gold)] underline underline-offset-4"
          >
            Explore Gallery →
          </Link>
        </Reveal>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Tall Image */}
          {items[0]?.url ? (
            <Reveal className="h-full">
              <div className="group relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-surface)] rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-[var(--border-warm)]/60">
                <Image
                  src={items[0].url}
                  alt={items[0].alt || "Tikkay Shikkay Grill"}
                  fill
                  sizes="(max-width: 768px) 100vw, 580px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay with peach tag pill */}
                <div className="absolute inset-0 bg-[#0e0e0ed0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <span className="bg-[var(--accent-peach)] text-[#550F00] text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    {items[0].tag || "Behind the Scenes"}
                  </span>
                  <p className="mt-4 text-xs text-[var(--text-body)] max-w-[28ch] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {items[0].alt || "Tikkay Shikkay Process"}
                  </p>
                </div>
              </div>
            </Reveal>
          ) : null}

          {/* Right Column - Stacked Images */}
          <div className="flex flex-col gap-6 justify-between h-full">
            {items.slice(1, 3).map((item, index) => (
              item?.url ? (
                <Reveal key={item.id || index} delay={(index + 1) * 0.1} className="w-full">
                  <div className="group relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-surface)] rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-[var(--border-warm)]/60">
                    <Image
                      src={item.url}
                      alt={item.alt || "Tikkay Shikkay Process"}
                      fill
                      sizes="(max-width: 768px) 100vw, 580px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover overlay with peach tag pill */}
                    <div className="absolute inset-0 bg-[#0e0e0ed0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                      <span className="bg-[var(--accent-peach)] text-[#550F00] text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        {item.tag || "Behind the Scenes"}
                      </span>
                      <p className="mt-3 text-xs text-[var(--text-body)] max-w-[35ch] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {item.alt || "Tikkay Shikkay Process"}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
