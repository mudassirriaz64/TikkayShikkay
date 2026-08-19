"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  CalendarDays,
  Gift,
  Heart,
  LogOut,
  ReceiptText,
  Star,
  UserRound,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { initialsAvatar } from "@/lib/utils/avatar";
import { formatDate } from "@/lib/utils/formatDate";
import { useAccount } from "@/providers/AccountProvider";
import { AccountsNavigation, AccountTabItem } from "./AccountsNavigation";
import { OrderHistorySection } from "./OrderHistorySection";
import { FavoritesSection } from "./FavoritesSection";
import { ProfileSection } from "./ProfileSection";
import { MyReviewsSection } from "./MyReviewsSection";
import { LoyaltySection } from "./LoyaltySection";
import { CateringHistorySection } from "./CateringHistorySection";
import { AccountsPageData } from "@/types";

interface AccountsDashboardProps {
  data: AccountsPageData;
}

export function AccountsDashboard({ data }: AccountsDashboardProps) {
  const { profile, favorites, reviews, signOut } = useAccount();
  const [activeId, setActiveId] = useState("orders");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [cateringCount, setCateringCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    import("@/lib/api/catering.service")
      .then((m) => m.cateringService.getMyBookings())
      .then((res) => {
        if (res && Array.isArray(res)) {
          setCateringCount(res.length);
        }
      })
      .catch(() => {});
  }, []);

  if (!profile) return null;

  const tabs: AccountTabItem[] = [
    { id: "orders", label: "My Orders", icon: ReceiptText, count: data.orders.length },
    { id: "catering", label: "Catering & Events", icon: Utensils, count: cateringCount },
    { id: "loyalty", label: "Loyalty Club", icon: Gift },
    { id: "favorites", label: "Favourites", icon: Heart, count: favorites.length },
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "reviews", label: "My Reviews", icon: Star, count: reviews.length },
  ];

  return (
    <>
      <section className="border-b border-[var(--border-warm)]/50 bg-[var(--bg-base)] pt-[72px] lg:pt-[96px]">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8">
            <div className="flex items-center gap-5">
              <span className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[var(--border-warm)]">
                <Image
                  src={initialsAvatar(profile.name, 0)}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-[-0.02em] text-[var(--text-primary)]">
                    {profile.name}
                  </h1>
                  {profile.is_loyalty_member && (
                    <span className="rounded-full bg-[var(--accent-gold)]/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[var(--accent-gold)]">
                      VIP Member
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  Member since {formatDate(profile.memberSince)}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSignOutModal(true)}
              className="flex items-center gap-2 rounded-xl text-[var(--text-faint)] hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </section>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSignOutModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 text-center text-[var(--text-primary)] shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 mb-4">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase text-[var(--text-primary)] mb-2">
              Sign Out of Account?
            </h3>
            <p className="text-xs text-[var(--text-body)] leading-relaxed mb-6">
              Are you sure you want to sign out? You will need to sign in again to view your loyalty status, favorites, and past orders.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] py-2.5 text-xs font-bold text-[var(--text-body)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={async () => {
                  setShowSignOutModal(false);
                  await signOut();
                }}
                className="rounded-xl py-2.5 text-xs font-bold uppercase"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-[var(--bg-base)] pt-8">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
          <AccountsNavigation
            tabs={tabs}
            activeId={activeId}
            onChange={setActiveId}
          />
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeId === "orders" && (
            <OrderHistorySection orders={data.orders} menuItems={data.menuItems} />
          )}
          {activeId === "catering" && <CateringHistorySection />}
          {activeId === "loyalty" && <LoyaltySection />}
          {activeId === "favorites" && (
            <FavoritesSection menuItems={data.menuItems} />
          )}
          {activeId === "profile" && <ProfileSection />}
          {activeId === "reviews" && <MyReviewsSection />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
