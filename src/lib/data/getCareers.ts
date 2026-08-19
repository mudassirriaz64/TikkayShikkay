import { CareersPageData } from "@/types";
import { mockCareersPageData } from "@/lib/mock/careers";
import { careersService } from "@/lib/api/careers.service";

export async function getCareersPageData(): Promise<CareersPageData> {
  try {
    const jobs = await careersService.getOpenJobs();
    if (jobs && Array.isArray(jobs) && jobs.length > 0) {
      return {
        ...mockCareersPageData,
        jobs,
      };
    }
  } catch {
    // ignore
  }

  return mockCareersPageData;
}

