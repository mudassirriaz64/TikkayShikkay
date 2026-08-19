"use client";

import { useEffect, useState } from "react";
import { AccountsSignIn } from "./AccountsSignIn";
import { AccountsDashboard } from "./AccountsDashboard";
import { useAccount } from "@/providers/AccountProvider";
import { AccountsPageData } from "@/types";

export function AccountsPage() {
  const { authStatus, isSignedIn, profile } = useAccount();
  const [data, setData] = useState<AccountsPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (authStatus === "guest" || (!isSignedIn && authStatus !== "checking")) {
      setLoading(false);
      return;
    }

    if (authStatus === "authenticated") {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/users/accounts-page`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .then((json) => {
          setData(json.data ?? json);
        })
        .catch(() => {
          // If profile exists locally from localStorage, allow access with graceful empty data
          if (profile) {
            setData({
              demoProfile: profile,
              orders: [],
              reviews: [],
              menuItems: [],
            });
          } else {
            setData(null);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [mounted, authStatus, isSignedIn, profile]);

  if (!mounted || authStatus === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-orange)] border-t-transparent" />
          <p className="mt-4 text-xs text-[var(--text-faint)]">Checking session...</p>
        </div>
      </div>
    );
  }

  if (authStatus === "guest" || !isSignedIn) {
    return <AccountsSignIn />;
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-orange)] border-t-transparent" />
          <p className="mt-4 text-xs text-[var(--text-faint)]">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <AccountsSignIn />;
  }

  return <AccountsDashboard data={data} />;
}
