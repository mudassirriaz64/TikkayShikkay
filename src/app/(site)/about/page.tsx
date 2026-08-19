import Image from "next/image";
import { getAboutFounderDetails, getAboutStats } from "@/lib/data/getAboutData";
import { getJourneyPosts } from "@/lib/data/getJourneyPosts";
import { getGalleryItems } from "@/lib/data/getGallery";
import { AboutHero } from "@/components/sections/FounderSection/AboutHero";
import { FounderSection } from "@/components/sections/FounderSection/FounderSection";
import { StatsBand } from "@/components/sections/StatsBand/StatsBand";
import { TimelineVertical } from "@/components/sections/Timeline/TimelineVertical";
import { ProcessGallery } from "@/components/sections/ProcessGallery/ProcessGallery";
import { FranchiseSection } from "@/components/sections/Franchise";
import { CareersCTA } from "@/components/sections/CareersCTA/CareersCTA";

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
      {/* 2. Ambient Flame & Smoke Hero Section */}
      <AboutHero />

      {/* 3. Founder Section ("Meet Ahmed") */}
      <FounderSection details={founderDetails} />

      {/* 4. Stats Band */}
      <StatsBand stats={stats} />

      {/* 5. Vertical Timeline */}
      <TimelineVertical posts={journeyPosts} />

      {/* 6. Behind the Scenes Process Gallery */}
      <ProcessGallery items={galleryItems} />

      {/* 7. Franchise & National Expansion Section */}
      <FranchiseSection />

      {/* 8. Careers CTA Banner */}
      <CareersCTA />
    </div>
  );
}
