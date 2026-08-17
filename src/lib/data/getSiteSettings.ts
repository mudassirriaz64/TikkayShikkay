import { SiteSettings } from "@/types";
import { settingsService } from "@/lib/api/settings.service";
import { mockSiteSettings } from "@/lib/mock/settings";
import { tryOrFallback } from "@/lib/api/client";

export async function getSiteSettings(): Promise<SiteSettings> {
  return tryOrFallback(
    () => settingsService.get(),
    mockSiteSettings,
  );
}
