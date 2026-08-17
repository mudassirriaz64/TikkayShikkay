import { aboutService } from "@/lib/api/about.service";
import { tryOrFallback } from "@/lib/api/client";
import { mockMilestones } from "@/lib/mock/milestones";

export async function getMilestones() {
  return tryOrFallback(
    () => aboutService.getMilestones(),
    mockMilestones,
  );
}
