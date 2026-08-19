import { getCateringPageData } from "@/lib/data/getCatering";
import {
  CateringHero,
  EventTypes,
  CateringBookingSection,
  MenuComingSoon,
  CateringPageCta,
} from "@/components/sections/catering";

export default async function CateringPage() {
  const data = await getCateringPageData();

  return (
    <>
      <CateringHero data={data.hero} />
      <CateringBookingSection />
      <EventTypes events={data.eventTypes} />
      <MenuComingSoon />
      <CateringPageCta data={data.cta} />
    </>
  );
}

