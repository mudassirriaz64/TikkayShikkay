import { AccountsPage } from "@/components/sections/accounts/AccountsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account - Tikkay Shikkay",
  description:
    "Track your orders, save your favourites and manage your profile at Tikkay Shikkay.",
};

export default function AccountsRoute() {
  return (
    <div className="bg-[var(--bg-base)]">
      <AccountsPage />
    </div>
  );
}
