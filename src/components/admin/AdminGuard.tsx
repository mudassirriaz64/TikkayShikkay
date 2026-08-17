"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/providers/AccountProvider";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { authStatus, backendUser } = useAccount();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (authStatus === "idle" || authStatus === "checking") return;

    if (authStatus === "guest" || !backendUser) {
      router.replace("/admin/login");
      return;
    }

    if (backendUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setChecked(true);
  }, [authStatus, backendUser, router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-orange)] border-t-transparent" />
          <p className="mt-4 text-sm text-[var(--text-faint)]">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
