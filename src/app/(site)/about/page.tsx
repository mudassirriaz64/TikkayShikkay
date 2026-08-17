import Image from "next/image";
import { getAboutFounderDetails, getAboutStats } from "@/lib/data/getAboutData";
import { getJourneyPosts } from "@/lib/data/getJourneyPosts";
import { getGalleryItems } from "@/lib/data/getGallery";
import { FounderSection } from "@/components/sections/FounderSection/FounderSection";
import { StatsBand } from "@/components/sections/StatsBand/StatsBand";
import { TimelineVertical } from "@/components/sections/Timeline/TimelineVertical";
import { ProcessGallery } from "@/components/sections/ProcessGallery/ProcessGallery";
import { CareersCTA } from "@/components/sections/CareersCTA/CareersCTA";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = {
  title: "Our Story - Tikkay Shikkay",
  description: "Learn about the heritage, the vision, and the pitmasters behind Tikkay Shikkay.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [founderDetails, stats, journeyPosts, galleryItems] = await Promise.all([
    getAboutFounderDetails(),
    getAboutStats(),
    getJourneyPosts(),
    getGalleryItems(),
  ]);

  return (
    <div className="bg-[var(--bg-base)]">
      {/* 2. Hero Section */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center overflow-hidden bg-[var(--bg-deep)]">
        {/* Background Image */}
        <Image
          src="/images/hero_image.png"
          alt="Skewers roasting over hot red coals"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Multi-stage dark gradient fade bottom-to-top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-black/30 pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 mx-auto max-w-[1280px] w-full px-4 lg:px-[64px]">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
              Since 2012
            </span>
            <h1 className="mt-4 font-[family:var(--font-serif)] text-[64px] md:text-[102.4px] font-bold uppercase tracking-tight leading-[0.9] text-white mix-blend-difference select-none">
              Our Story
            </h1>
          </Reveal>
        </div>

        {/* Decorative Vertical Rotated Tagline running down the right edge */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] uppercase tracking-[0.3em] text-[var(--text-faint)] opacity-40 select-none hidden lg:block whitespace-nowrap">
          The grill doesn't lie • Real smoke daily
        </div>
      </section>

      {/* 3. Founder Section ("Meet Ahmed") */}
      <FounderSection details={founderDetails} />

      {/* 4. Stats Band */}
      <StatsBand stats={stats} />

      {/* 5. Vertical Timeline */}
      <TimelineVertical posts={journeyPosts} />

      {/* 6. Behind the Scenes Process Gallery */}
      <ProcessGallery items={galleryItems} />

      {/* 7. Careers CTA Banner */}
      <CareersCTA />
    </div>
  );
}
