import { JourneyPost } from '@/types';
import { aboutService } from '@/lib/api/about.service';
import { tryOrFallback } from '@/lib/api/client';
import { mockJourneyPosts } from '@/lib/mock/journey';

export async function getJourneyPosts(): Promise<JourneyPost[]> {
  return tryOrFallback(
    () => aboutService.getJourneyPosts(),
    mockJourneyPosts,
  );
}
