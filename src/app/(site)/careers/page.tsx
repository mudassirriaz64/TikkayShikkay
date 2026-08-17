import { getCareersPageData } from "@/lib/data/getCareers";
import {
  CareersHero,
  JobListings,
  CultureSection,
  CareersPageCta,
} from "@/components/sections/careers";

export default async function CareersPage() {
  const data = await getCareersPageData();

  return (
    <>
      <CareersHero data={data.hero} />
      <JobListings jobs={data.jobs} />
      <CultureSection values={data.culture} />
      <CareersPageCta data={data.cta} />
    </>
  );
}
