"use client";

import { useEffect, useState, useCallback } from "react";
import {
  UtensilsCrossed,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Users,
  Search,
  CheckCircle2,
  RefreshCw,
  Flame,
  MessageCircle,
  PencilLine,
  Wallet,
  Sparkles,
} from "lucide-react";
import { Badge, BadgeTone, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import {
  cateringService,
  CateringBookingRecord,
  CateringStatus,
} from "@/lib/api";

const STATUS_META: Record<CateringStatus, { label: string; tone: BadgeTone }> = {
  inquiry: { label: "Inquiry Received", tone: "neutral" },
  "under-review": { label: "Under Review", tone: "orange" },
  confirmed: { label: "Confirmed & Locked", tone: "green" },
  completed: { label: "Completed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "red" },
};

const CATERING_STATUSES: CateringStatus[] = [
  "inquiry",
  "under-review",
  "confirmed",
  "completed",
  "cancelled",
];

export function CateringModule() {
  const [bookings, setBookings] = useState<CateringBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cateringService.getAllBookings();
      setBookings(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const totalValue = bookings.reduce((sum, b) => sum + (b.estimated_total || 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const activeInquiries = bookings.filter((b) => b.status === "inquiry" || b.status === "under-review").length;
  const totalGuests = bookings.reduce((sum, b) => sum + (b.guest_count || 0), 0);

  const handleUpdateStatus = async (id: string, status: CateringStatus) => {
    setUpdatingId(id);
    try {
      await cateringService.updateStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => ((b.id || b._id) === id ? { ...b, status } : b))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update catering status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const id = booking.id || booking._id || "";
    const name = booking.contact_name || "";
    const phone = booking.contact_phone || "";
    const loc = booking.event_location || "";

    const matchesSearch =
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      loc.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;
    if (typeFilter !== "all" && booking.event_type !== typeFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live Station & Event Operations"
        title="Catering & Bulk Orders"
        description="Manage corporate galas, wedding BBQ spreads, birthday parties, and bulk meal box requests with live date availability and coordinator tools."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            className="flex items-center gap-2 rounded-xl text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Bookings
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={UtensilsCrossed}
          label="Total Bookings"
          value={String(bookings.length)}
          sub="All event inquiries"
        />
        <StatCard
          icon={Calendar}
          label="Active Inquiries"
          value={String(activeInquiries)}
          sub="Under review by Pitmaster"
        />
        <StatCard
          icon={Users}
          label="Total Guests"
          value={String(totalGuests)}
          sub="Across all bookings"
        />
        <StatCard
          icon={Wallet}
          label="Pipeline Value"
          value={formatCurrency(totalValue)}
          sub="Estimated event revenues"
        />
      </div>

      <SectionCard
        title="Event Pipeline Directory"
        description="Filter events by type or status, inspect venue locations, message coordinators, and lock dates"
      >
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search by ID, client name, venue, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            >
              <option value="all">All Event Types ({bookings.length})</option>
              <option value="corporate">Corporate</option>
              <option value="birthday">Birthdays</option>
              <option value="wedding">Weddings</option>
              <option value="bulk-order">Bulk Boxes</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            >
              <option value="all">All Statuses ({bookings.length})</option>
              <option value="inquiry">Inquiries ({bookings.filter((b) => b.status === "inquiry").length})</option>
              <option value="under-review">Under Review ({bookings.filter((b) => b.status === "under-review").length})</option>
              <option value="confirmed">Confirmed ({bookings.filter((b) => b.status === "confirmed").length})</option>
              <option value="completed">Completed ({bookings.filter((b) => b.status === "completed").length})</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const id = booking.id || booking._id || "";
              const meta = STATUS_META[booking.status] || { label: booking.status, tone: "neutral" };
              const cleanPhone = (booking.contact_phone || "").replace(/[^0-9]/g, "");

              return (
                <div
                  key={id}
                  className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-5 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-warm)]/60 pb-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                        #{id}
                      </span>
                      <span className="rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[var(--accent-peach)]">
                        {booking.event_type}
                      </span>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      {booking.user_id ? (
                        <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--text-muted)]">
                          Account Linked
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--text-faint)]">
                          Guest Inquiry
                        </span>
                      )}
                    </div>

                    <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--accent-orange)]">
                      {formatCurrency(booking.estimated_total)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Client Contact</p>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{booking.contact_name}</p>
                      <p className="text-[var(--text-muted)]">{booking.contact_phone}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Date & Timing</p>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{booking.event_date}</p>
                      <p className="text-[var(--text-muted)]">{booking.event_time} ({booking.guest_count} Guests)</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Package Tier</p>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{booking.package_tier}</p>
                      {booking.is_live_tandoor_requested && (
                        <span className="text-[11px] font-bold text-[var(--accent-peach)] flex items-center gap-1 mt-0.5">
                          <Flame className="h-3 w-3 text-[var(--accent-orange)]" /> Live Clay Tandoor
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Venue Address</p>
                      <p className="text-[var(--text-primary)] mt-0.5 truncate">{booking.event_location}</p>
                    </div>
                  </div>

                  {booking.special_instructions && (
                    <p className="text-xs text-[var(--text-muted)] italic bg-[var(--bg-surface-raised)] p-2.5 rounded-xl border border-[var(--border-warm)]">
                      &ldquo;{booking.special_instructions}&rdquo;
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--border-warm)]/60 pt-3">
                    <p className="text-[11px] text-[var(--text-faint)]">
                      Submitted on {formatDate(booking.createdAt)}
                    </p>

                    <div className="flex items-center gap-3">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hello ${booking.contact_name}! Pitmaster Coordinator here regarding your Tikkay Shikkay Catering Booking #${id} for ${booking.event_date}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="whatsapp"
                            size="sm"
                            className="h-8 px-3 rounded-xl text-xs flex items-center gap-1.5 font-bold"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp Client</span>
                          </Button>
                        </a>
                      )}

                      <div className="flex items-center gap-1.5">
                        <PencilLine className="h-3.5 w-3.5 text-[var(--text-faint)]" />
                        <select
                          value={booking.status}
                          disabled={updatingId === id}
                          onChange={(e) => handleUpdateStatus(id, e.target.value as CateringStatus)}
                          className="rounded-xl border border-white/20 bg-[#222] px-3 py-1.5 text-xs font-bold text-white focus:border-[#D9381E] focus:outline-none cursor-pointer"
                        >
                          {CATERING_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-faint)] space-y-2">
            <UtensilsCrossed className="mx-auto h-8 w-8 text-[var(--text-faint)]/40" />
            <p className="font-semibold text-sm text-[var(--text-muted)]">No catering bookings found</p>
            <p className="text-xs text-[var(--text-faint)]">
              {loading ? "Loading bookings..." : "Inquiries placed via the Catering page will appear here live."}
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
