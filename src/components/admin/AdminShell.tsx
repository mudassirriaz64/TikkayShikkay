"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  RotateCcw,
  X,
} from "lucide-react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { AdminTabId } from "@/types/admin";
import { ADMIN_TABS } from "./AdminNav";

interface AdminShellProps {
  activeTab: AdminTabId;
  onTabChange: (tab: AdminTabId) => void;
  unreadMessagesCount?: number;
  children: ReactNode;
}

export function AdminShell({ activeTab, onTabChange, unreadMessagesCount = 0, children }: AdminShellProps) {
  const { resetAll } = useAdminData();
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Expanded if mobile is open or user is hovering over the sidebar
  const isExpanded = mobileOpen || isHovered;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSelect(tab: AdminTabId) {
    onTabChange(tab);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      {/* Sidebar — auto-retractable on hover */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--border-warm)] bg-[rgba(12,12,12,0.98)] transition-[width,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isExpanded
            ? "w-[272px] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            : "w-[76px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border-warm)] px-4 transition-all",
            !isExpanded && "lg:justify-center lg:px-0",
          )}
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden">
            <Image
              src="/logo/logo_transparent.png"
              alt="Tikkay Shikkay Logo"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <div className={cn("leading-tight transition-opacity duration-200", !isExpanded && "lg:hidden")}>
            <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] whitespace-nowrap">
              Tikkay<span className="text-[var(--accent-orange)]">Shikkay</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)] whitespace-nowrap">
              Admin Studio
            </p>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] lg:hidden"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-none">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const hasChildren = tab.children && tab.children.length > 0;
            const isChildActive = hasChildren && tab.children!.some((c) => c.id === activeTab);
            const active = activeTab === tab.id || isChildActive;

            return (
              <div key={tab.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      // Navigate to first child or default
                      handleSelect(tab.children![0].id);
                    } else {
                      handleSelect(tab.id);
                    }
                  }}
                  title={!isExpanded ? tab.label : undefined}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-[13px] font-bold uppercase tracking-[0.06em] transition-all duration-200",
                    !isExpanded && "lg:justify-center lg:px-0",
                    active
                      ? "border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]"
                      : "border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]",
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Icon className="h-[18px] w-[18px]" />
                      {tab.id === "contact-messages" && unreadMessagesCount > 0 && !isExpanded ? (
                        <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[9px] font-bold text-[var(--text-on-orange)]">
                          {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "truncate",
                        !isExpanded && "lg:hidden",
                      )}
                    >
                      {tab.label}
                    </span>
                  </div>

                  {tab.id === "contact-messages" && unreadMessagesCount > 0 && isExpanded ? (
                    <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent-orange)] px-1.5 text-[11px] font-bold text-[var(--text-on-orange)] shadow-sm">
                      {unreadMessagesCount}
                    </span>
                  ) : null}

                  {hasChildren && isExpanded ? (
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 text-[var(--text-faint)]",
                        active && "rotate-90 text-[var(--accent-orange)]"
                      )}
                    />
                  ) : null}
                </button>

                {/* Sub-items dropdown when parent is active */}
                {hasChildren && active && isExpanded ? (
                  <div className="ml-4 space-y-1 border-l border-[var(--border-warm)]/60 pl-3">
                    {tab.children!.map((sub) => {
                      const SubIcon = sub.icon;
                      const subActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelect(sub.id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors",
                            subActive
                              ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-sm"
                              : "text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                          )}
                        >
                          {SubIcon ? <SubIcon className="h-3.5 w-3.5 shrink-0" /> : null}
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        {/* Logout (bottom) */}
        <div className="shrink-0 border-t border-[var(--border-warm)] p-3">
          <Link
            href="/"
            title={!isExpanded ? "Logout" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] transition-all duration-200 hover:bg-[var(--accent-red)]/10 hover:text-[var(--accent-red)]",
              !isExpanded && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap",
                !isExpanded && "lg:hidden",
              )}
            >
              Logout
            </span>
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-col lg:pl-[76px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[var(--border-warm)] bg-[rgba(14,14,14,0.92)] backdrop-blur-[10px]">
          <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] lg:hidden"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>
              <div className="leading-tight">
                <p className="hidden text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-faint)] sm:block">
                  Workspace
                </p>
                <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                  {ADMIN_TABS.find((t) => t.id === activeTab)?.label ??
                    "Dashboard"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <button
                type="button"
                onClick={resetAll}
                title="Restore the original demo data"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-orange)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
