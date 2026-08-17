import { aboutService } from "@/lib/api/about.service";
import { tryOrFallback } from "@/lib/api/client";
import { mockFounderDetails, mockAboutStats } from "@/lib/mock/about";

export async function getAboutPageData() {
  return tryOrFallback(
    () => aboutService.getPageData(),
    {
      hero: null,
      founder: mockFounderDetails,
      stats: mockAboutStats,
      journeyPosts: [],
      milestones: [],
    },
  );
}

export async function getAboutFounderDetails() {
  return tryOrFallback(
    () => aboutService.getPageData().then((d) => d.founder),
    mockFounderDetails,
  );
}

export async function getAboutStats() {
  return tryOrFallback(
    () => aboutService.getStats(),
    mockAboutStats,
  );
}
