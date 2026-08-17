import { CateringPageData } from "@/types";
import { mockCateringPageData } from "@/lib/mock/catering";
import { tryOrFallback } from "@/lib/api/client";

export async function getCateringPageData(): Promise<CateringPageData> {
  return tryOrFallback(
    async () => {
      const { api } = await import("@/lib/api/client");
      return api.get<CateringPageData>("/catering");
    },
    mockCateringPageData,
  );
}
