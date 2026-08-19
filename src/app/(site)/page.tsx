import { getSiteSettings } from "@/lib/data/getSiteSettings";
import { HeroSection } from "@/components/sections/HeroSection";
import { StorySection } from "@/components/sections/StorySection";
import { OrderChannelsBar } from "@/components/sections/OrderChannelsBar";
import { MenuSection } from "@/components/sections/MenuSection";
import { LiveGrillCam } from "@/components/sections/LiveGrillCam";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Timeline } from "@/components/sections/Timeline";
import { WallOfLove } from "@/components/sections/WallOfLove";
import { LoyaltyCTABanner } from "@/components/sections/LoyaltyCTABanner";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col">
      <HeroSection settings={settings} />
      <StorySection />
      <MenuSection />
      <LiveGrillCam />
      <OrderChannelsBar />
      <WhyChooseUs />
      <Timeline />
      <WallOfLove />
      <LoyaltyCTABanner />
    </div>
  );
}
