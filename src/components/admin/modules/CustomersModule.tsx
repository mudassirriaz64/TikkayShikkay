"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Gift,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  Mail,
  Coins,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Badge, BadgeTone, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { usersService, AdminUser } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatDate";

export function CustomersModule() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "loyalty" | "regular">("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const loyaltyMembers = users.filter((u) => u.is_loyalty_member);
  const totalPoints = users.reduce((sum, u) => sum + (u.loyalty_points || 0), 0);
  const whatsappOptIns = users.filter((u) => u.whatsapp_opt_in).length;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || "").includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterType === "loyalty") return user.is_loyalty_member;
    if (filterType === "regular") return !user.is_loyalty_member;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community & Loyalty"
        title="Customers & VIP Members"
        description="View registered customers, monitor loyalty club enrollments, points accruals, and WhatsApp community opt-ins."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            className="flex items-center gap-2 rounded-xl text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh List
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Accounts"
          value={String(users.length)}
          sub="Registered users"
        />
        <StatCard
          icon={Gift}
          label="Loyalty Members"
          value={String(loyaltyMembers.length)}
          sub="Enrolled in Grill Fam"
        />
        <StatCard
          icon={Coins}
          label="Points Distributed"
          value={String(totalPoints)}
          sub="Accrued from orders"
        />
        <StatCard
          icon={Phone}
          label="WhatsApp Opt-ins"
          value={String(whatsappOptIns)}
          sub="Community subscribers"
        />
      </div>

      <SectionCard
        title="Customer Directory"
        description="Search, filter, and inspect customer profiles and loyalty statuses"
      >
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>

          <div className="flex rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-1">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === "all"
                  ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-faint)] hover:text-[var(--text-body)]"
              }`}
            >
              All ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("loyalty")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === "loyalty"
                  ? "bg-[var(--bg-base)] text-[var(--accent-peach)] shadow-sm"
                  : "text-[var(--text-faint)] hover:text-[var(--text-body)]"
              }`}
            >
              Loyalty VIP ({loyaltyMembers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("regular")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === "regular"
                  ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-faint)] hover:text-[var(--text-body)]"
              }`}
            >
              Standard ({users.length - loyaltyMembers.length})
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-warm)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Loyalty Points</th>
                <th className="py-3 px-3">Birthday</th>
                <th className="py-3 px-3">WhatsApp Opt-in</th>
                <th className="py-3 px-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-warm)]/40">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[var(--bg-surface-alt)]/40 transition-colors"
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-warm)] bg-[var(--bg-surface-raised)] font-bold text-[var(--text-primary)] uppercase">
                          {user.name.slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-bold text-[var(--text-primary)] text-sm">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[var(--text-faint)]">
                            Role: {user.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <p className="text-[var(--text-primary)]">{user.email}</p>
                      {user.phone && (
                        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                          {user.phone}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      {user.is_loyalty_member ? (
                        <Badge tone="orange">Loyalty Member</Badge>
                      ) : (
                        <Badge tone="neutral">Standard</Badge>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-bold tabular-nums text-sm text-[var(--accent-orange)]">
                        {user.loyalty_points || 0} pts
                      </span>
                    </td>
                    <td className="py-4 px-3 text-[var(--text-muted)]">
                      {user.birthday ? user.birthday : "—"}
                    </td>
                    <td className="py-4 px-3">
                      {user.whatsapp_opt_in ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[var(--whatsapp-green)]">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[var(--text-faint)]">
                          <XCircle className="h-3.5 w-3.5" /> No
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-[var(--text-muted)]">
                      {formatDate(user.loyalty_joined_at || user.createdAt || user.memberSince || new Date().toISOString())}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-xs text-[var(--text-faint)]"
                  >
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
