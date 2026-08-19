"use client";

import { useState, useEffect } from "react";
import { PageHeader, SectionCard, Badge, Notice } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { contactService, ContactSubmission } from "@/lib/api";
import {
  CheckCheck,
  Clock,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface MessagesModuleProps {
  onUnreadCountChange?: (count: number) => void;
}

export function MessagesModule({ onUnreadCountChange }: MessagesModuleProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactSubmission | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getSubmissions();
      setSubmissions(data || []);
      const unread = (data || []).filter((s) => !s.is_read).length;
      onUnreadCountChange?.(unread);
    } catch (err: any) {
      console.error("[MessagesModule] Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await contactService.markRead(id);
      const next = submissions.map((s) => (s.id === id ? { ...s, is_read: true } : s));
      setSubmissions(next);
      const unread = next.filter((s) => !s.is_read).length;
      onUnreadCountChange?.(unread);
      flash("Message marked as read.");
    } catch (err: any) {
      alert(`Failed to mark read: ${err?.message}`);
    }
  };

  const handleToggleExpand = (submission: ContactSubmission) => {
    const isNowExpanded = expandedId !== submission.id;
    setExpandedId(isNowExpanded ? (submission.id || null) : null);
    if (isNowExpanded && !submission.is_read && submission.id) {
      handleMarkRead(submission.id);
    }
  };

  const handleDelete = async (submission: ContactSubmission) => {
    if (!submission.id) return;
    try {
      await contactService.deleteSubmission(submission.id);
      const next = submissions.filter((s) => s.id !== submission.id);
      setSubmissions(next);
      const unread = next.filter((s) => !s.is_read).length;
      onUnreadCountChange?.(unread);
      flash("Message removed.");
    } catch (err: any) {
      alert(`Failed to delete message: ${err?.message}`);
    }
    setPendingDelete(null);
  };

  const filtered = submissions.filter((s) => {
    if (filter === "unread" && s.is_read) return false;
    if (filter === "read" && !s.is_read) return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(query) ||
      (s.email || "").toLowerCase().includes(query) ||
      (s.phone || "").toLowerCase().includes(query) ||
      (s.subject || "").toLowerCase().includes(query) ||
      (s.message || "").toLowerCase().includes(query)
    );
  });

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer Inquiries"
        title="Contact Messages"
        description="View, read, and manage customer inquiries submitted from the public contact page."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {notice ? <Notice tone="success">{notice}</Notice> : null}

      <SectionCard
        title={unreadCount > 0 ? `Inquiry Inbox (${unreadCount} New)` : "Inquiry Inbox"}
        description="Click any message row to view full details and mark it as read."
      >
        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] pl-9 pr-4 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                filter === "all"
                  ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                filter === "unread"
                  ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("read")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                filter === "read"
                  ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Read ({submissions.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Message List */}
        {loading && submissions.length === 0 ? (
          <div className="flex py-12 items-center justify-center text-xs text-[var(--text-muted)]">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-[var(--accent-orange)]" />
            Loading messages...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[var(--text-muted)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-deep)] text-[var(--text-faint)]">
              <Inbox className="h-7 w-7" />
            </div>
            <p className="mt-4 font-bold text-sm text-[var(--text-primary)]">No messages found</p>
            <p className="mt-1 text-xs text-[var(--text-muted)] max-w-sm">
              {search
                ? `No submissions matched your search "${search}".`
                : filter === "unread"
                ? "No unread inquiries. You're all caught up!"
                : "Customer inquiries submitted through the contact page will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const isExpanded = expandedId === item.id;
              const isUnread = !item.is_read;

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleExpand(item)}
                  className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isUnread
                      ? "border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/[0.03] shadow-[0_0_20px_rgba(255,86,42,0.06)]"
                      : "border-[var(--border-warm)] bg-[var(--bg-deep)]/70 hover:border-[var(--border-warm)]/90"
                  }`}
                >
                  {/* Summary Bar */}
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Sender Info & Subject */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            isUnread
                              ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
                              : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-warm)]"
                          }`}
                        >
                          {item.name ? item.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-sm font-bold truncate ${isUnread ? "text-[var(--text-primary)] font-extrabold" : "text-[var(--text-body)]"}`}>
                              {item.name || "Anonymous Guest"}
                            </span>
                            {isUnread ? (
                              <span className="inline-flex items-center rounded-full bg-[var(--accent-orange)] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                New
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-warm)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
                                Read
                              </span>
                            )}
                          </div>

                          <p className={`mt-0.5 text-xs truncate ${isUnread ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-muted)]"}`}>
                            {item.subject || "No Subject"}
                          </p>

                          {!isExpanded ? (
                            <p className="mt-1 text-xs text-[var(--text-faint)] line-clamp-1">
                              {item.message}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {/* Date & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-warm)]/40">
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)] whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Recent"}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isUnread ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleMarkRead(item.id!, e)}
                              className="h-8 px-2 text-xs text-[var(--accent-peach)] hover:text-[var(--accent-orange)]"
                              title="Mark as Read"
                            >
                              <CheckCheck className="h-3.5 w-3.5 mr-1" />
                              <span className="hidden md:inline">Mark Read</span>
                            </Button>
                          ) : null}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDelete(item);
                            }}
                            className="h-8 w-8 p-0 text-[var(--text-faint)] hover:text-[var(--accent-coral)]"
                            title="Delete Message"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>

                          <div className="text-[var(--text-faint)] ml-1">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Message View */}
                  {isExpanded ? (
                    <div className="border-t border-[var(--border-warm)]/60 bg-[var(--bg-surface)]/60 p-5 sm:p-6 rounded-b-2xl space-y-4">
                      {/* Sender Meta Bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-deep)] p-3 border border-[var(--border-warm)]/40">
                          <Mail className="h-4 w-4 text-[var(--accent-orange)] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] uppercase font-bold text-[var(--text-faint)]">Email</p>
                            <a
                              href={`mailto:${item.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-peach)] hover:underline truncate block"
                            >
                              {item.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-deep)] p-3 border border-[var(--border-warm)]/40">
                          <Phone className="h-4 w-4 text-[var(--accent-gold)] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] uppercase font-bold text-[var(--text-faint)]">Phone</p>
                            <a
                              href={`tel:${item.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-gold)] hover:underline truncate block"
                            >
                              {item.phone || "Not provided"}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Full Message Body */}
                      <div className="rounded-xl bg-[var(--bg-deep)] p-4 border border-[var(--border-warm)]/40">
                        <p className="text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider mb-2">
                          Message Body
                        </p>
                        <p className="text-sm leading-relaxed text-[var(--text-body)] whitespace-pre-wrap">
                          {item.message}
                        </p>
                      </div>

                      {/* Quick Action Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || "Tikkay Shikkay Inquiry")}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-orange)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-on-orange)] hover:scale-102 transition-transform"
                          >
                            <Mail className="h-3.5 w-3.5" /> Reply by Email
                          </a>
                          {item.phone ? (
                            <a
                              href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--whatsapp-green)]/15 border border-[var(--whatsapp-green)]/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green)]/25 transition-colors"
                            >
                              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Guest
                            </a>
                          ) : null}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDelete(item);
                          }}
                          className="text-xs text-[var(--accent-coral)] hover:bg-[var(--accent-coral)]/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Inquiry
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete customer inquiry?"
        description={
          pendingDelete
            ? `Inquiry from "${pendingDelete.name}" (${pendingDelete.email}) will be permanently removed. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            handleDelete(pendingDelete);
          }
        }}
      />
    </div>
  );
}
