"use client";

import { AccountTab } from "@/components/ui/accounts/AccountTab";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

export interface AccountTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface AccountsNavigationProps {
  tabs: AccountTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function AccountsNavigation({
  tabs,
  activeId,
  onChange,
  className,
}: AccountsNavigationProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {tabs.map((tab) => (
        <AccountTab
          key={tab.id}
          label={tab.label}
          icon={tab.icon}
          count={tab.count}
          active={activeId === tab.id}
          onClick={() => onChange(tab.id)}
        />
      ))}
    </div>
  );
}
