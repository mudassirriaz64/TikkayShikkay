"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Search,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, Badge, BadgeTone } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/formatDate";
import {
  franchiseService,
  FranchiseInquiryRecord,
} from "@/lib/api/franchise.service";

const FRANCHISE_STATUS_META: Record<
  string,
  { label: string; tone: BadgeTone }
> = {
  pending: { label: "New Lead", tone: "neutral" },
  reviewed: { label: "Under Evaluation", tone: "orange" },
  contacted: { label: "Investor Contacted", tone: "gold" },
  approved: { label: "Prospectus Approved", tone: "green" },
  rejected: { label: "Not Feasible", tone: "red" },
};

export function FranchiseModule() {
  const [inquiries, setInquiries] = useState<FranchiseInquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await franchiseService.getAllInquiries();
      setInquiries(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await franchiseService.updateStatus(id, status);
      setInquiries((prev) =>
        prev.map((i) => ((i.id || i._id) === id ? { ...i, status: status as any } : i))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update status");
    }
  };

  const handleDeleteInquiry = async (inquiry: FranchiseInquiryRecord) => {
    const id = inquiry.id || inquiry._id;
    if (
      !confirm(
        `Permanently delete franchise inquiry from "${inquiry.full_name}" (${inquiry.target_city})?`
      )
    )
      return;

    try {
      await franchiseService.deleteInquiry(id!);
      setInquiries((prev) => prev.filter((i) => (i.id || i._id) !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete inquiry");
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const name = inq.full_name || "";
    const email = inq.email || "";
    const city = inq.target_city || "";
    const phone = inq.phone || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Expansion & Strategic Partnerships"
        title="Franchise & Overseas Inquiries"
        description="Manage prospective franchisee applications, evaluate target cities and investment capability, and manage investor outreach."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInquiries}
            className="flex items-center gap-2 rounded-xl text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Leads
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Total Inquiries"
          value={String(inquiries.length)}
          sub="Investor applications"
        />
        <StatCard
          icon={Clock}
          label="New Leads"
          value={String(inquiries.filter((i) => i.status === "pending").length)}
          sub="Awaiting evaluation"
        />
        <StatCard
          icon={TrendingUp}
          label="In Discussion"
          value={String(inquiries.filter((i) => i.status === "contacted" || i.status === "reviewed").length)}
          sub="Feasibility review"
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved Partners"
          value={String(inquiries.filter((i) => i.status === "approved").length)}
          sub="Prospectus shared"
        />
      </div>

      <SectionCard
        title="Investor Inquiries Directory"
        description="Review city proposals, investment budgets, business background, and manage communication status."
      >
        {/* Search and Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search investor name, city, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            >
              <option value="all">All Inquiry Statuses ({inquiries.length})</option>
              <option value="pending">New Leads ({inquiries.filter((i) => i.status === "pending").length})</option>
              <option value="reviewed">Under Review ({inquiries.filter((i) => i.status === "reviewed").length})</option>
              <option value="contacted">Investor Contacted ({inquiries.filter((i) => i.status === "contacted").length})</option>
              <option value="approved">Approved ({inquiries.filter((i) => i.status === "approved").length})</option>
              <option value="rejected">Not Feasible ({inquiries.filter((i) => i.status === "rejected").length})</option>
            </select>
          </div>
        </div>

        {filteredInquiries.length > 0 ? (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => {
              const id = inq.id || inq._id || "";
              const meta = FRANCHISE_STATUS_META[inq.status] || {
                label: inq.status,
                tone: "neutral",
              };

              return (
                <div
                  key={id}
                  className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-5 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-warm)]/60 pb-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-base text-[var(--text-primary)]">
                        {inq.full_name}
                      </span>
                      <span className="rounded-full bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[var(--accent-gold)] flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {inq.target_city}
                      </span>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>

                    <span className="text-xs text-[var(--text-faint)]">
                      Inquiry Date: {formatDate(inq.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Contact Details</p>
                      <p className="text-neutral-200 mt-0.5 flex items-center gap-1.5 font-mono">
                        <Phone className="h-3 w-3 text-neutral-400" /> {inq.phone}
                      </p>
                      <p className="text-neutral-300 flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-neutral-400" /> {inq.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Investment Readiness</p>
                      <p className="font-bold text-emerald-400 mt-0.5">
                        {inq.investment_budget}
                      </p>
                      <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                        Launch Target: {inq.timeline}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Proposed Location</p>
                      <p className="text-neutral-300 mt-0.5">
                        {inq.proposed_location || "Open to prime commercial recommendation"}
                      </p>
                    </div>
                  </div>

                  {inq.experience_summary && (
                    <div className="bg-[var(--bg-surface-raised)] p-3 rounded-xl border border-[var(--border-warm)] text-xs text-[var(--text-muted)] space-y-1">
                      <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Business Experience</p>
                      <p className="italic leading-relaxed">&ldquo;{inq.experience_summary}&rdquo;</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--border-warm)]/60 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-faint)] font-bold uppercase">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(id, e.target.value)}
                        className="rounded-xl border border-white/20 bg-[#222] px-3 py-1.5 text-xs font-bold text-white focus:border-[var(--accent-orange)] focus:outline-none cursor-pointer"
                      >
                        <option value="pending">New Lead</option>
                        <option value="reviewed">Under Evaluation</option>
                        <option value="contacted">Investor Contacted</option>
                        <option value="approved">Prospectus Approved</option>
                        <option value="rejected">Not Feasible</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(inq)}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Lead</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-faint)] space-y-2">
            <Building2 className="mx-auto h-8 w-8 text-[var(--text-faint)]/40" />
            <p className="font-semibold text-sm text-[var(--text-muted)]">No franchise inquiries found</p>
            <p className="text-xs text-[var(--text-faint)]">
              {loading ? "Loading inquiries..." : "Investor inquiries from the website will appear here."}
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
