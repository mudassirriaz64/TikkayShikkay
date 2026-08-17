import { MotionConfig } from "framer-motion";
import { getAdminPageData } from "@/lib/data/getAdminPageData";
import { AdminDataProvider } from "@/providers/AdminDataProvider";
import { AdminPage } from "@/components/admin/AdminPage";
import { CartProvider } from "@/context/CartContext";
import { AccountProvider } from "@/providers/AccountProvider";
import { AdminGuard } from "@/components/admin/AdminGuard";

export const metadata = {
  title: "Admin Studio - Tikkay Shikkay",
  description:
    "Manage every plate, post and promise at Tikkay Shikkay from one dashboard.",
};

export default async function AdminRoute() {
  let data;

  try {
    data = await getAdminPageData();
  } catch {
    data = null;
  }

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <AccountProvider>
            <AdminGuard>
              {data ? (
                <AdminDataProvider initialData={data as any}>
                  <AdminPage />
                </AdminDataProvider>
              ) : (
                <div className="flex h-screen items-center justify-center">
                  <p className="text-[var(--text-faint)]">Failed to load admin data. Please check your connection.</p>
                </div>
              )}
            </AdminGuard>
          </AccountProvider>
        </CartProvider>
      </MotionConfig>
    </div>
  );
}
