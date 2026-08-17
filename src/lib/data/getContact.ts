import { ContactPageData } from "@/types/contact";
import { contactService } from "@/lib/api/contact.service";
import { tryOrFallback } from "@/lib/api/client";
import { mockContactPageData } from "@/lib/mock/contact";

export async function getContactPageData(): Promise<ContactPageData> {
  return tryOrFallback(
    () => contactService.getPageData(),
    mockContactPageData,
  );
}
