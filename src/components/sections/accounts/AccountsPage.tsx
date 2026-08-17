"use client";

import { useEffect, useState } from "react";
import { AccountsSignIn } from "./AccountsSignIn";
import { AccountsDashboard } from "./AccountsDashboard";
import { useAccount } from "@/providers/AccountProvider";
import { AccountsPageData } from "@/types";

export function AccountsPage() {
  const { authStatus } = useAccount();
  const [data, setData] = useState<AccountsPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authStatus !== "authenticated") return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/accounts-page`, {
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
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [mounted, authStatus]);

  if (!mounted || authStatus === "idle" || authStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-orange)] border-t-transparent" />
      </div>
    );
  }

  if (authStatus === "guest") {
    return <AccountsSignIn />;
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-orange)] border-t-transparent" />
          <p className="mt-4 text-sm text-[var(--text-faint)]">Loading your account…</p>
        </div>
      </div>
    );
  }

  return <AccountsDashboard data={data} />;
}
