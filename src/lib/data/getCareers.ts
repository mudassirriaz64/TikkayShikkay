import { CareersPageData } from "@/types";
import { mockCareersPageData } from "@/lib/mock/careers";
import { tryOrFallback } from "@/lib/api/client";

export async function getCareersPageData(): Promise<CareersPageData> {
  return tryOrFallback(
    async () => {
      const { api } = await import("@/lib/api/client");
      return api.get<CareersPageData>("/careers");
    },
    mockCareersPageData,
  );
}
