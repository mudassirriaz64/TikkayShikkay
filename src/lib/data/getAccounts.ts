import { AccountsPageData } from "@/types";
import { usersService } from "@/lib/api/users.service";
import { tryOrFallback } from "@/lib/api/client";
import { mockDemoProfile, mockAccountOrders, mockMyReviews } from "@/lib/mock/accounts";

export async function getAccountsPageData(): Promise<AccountsPageData> {
  return tryOrFallback(
    () => usersService.getAccountsPage(),
    {
      demoProfile: mockDemoProfile,
      orders: mockAccountOrders,
      reviews: mockMyReviews,
      menuItems: [],
    },
  );
}
