"use client";

import { useState } from "react";
import {
  Gift,
  Sparkles,
  MessageCircle,
  Flame,
  Calendar,
  ShieldCheck,
  Coins,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAccount } from "@/providers/AccountProvider";
import { formatDate } from "@/lib/utils/formatDate";
import { JoinLoyaltyModal } from "./JoinLoyaltyModal";

export function LoyaltySection() {
  const { profile } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);

  const isMember = Boolean(profile?.is_loyalty_member);
  const points = profile?.loyalty_points || 0;
  const joinedAt = profile?.loyalty_joined_at || profile?.memberSince || "";

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Rewards & VIP Perks"
            title="Loyalty Club"
            accent="& Points"
          />
        </Reveal>

        {isMember ? (
          /* Active Member View */
          <div className="space-y-8">
            {/* Points & Stats Top Banner */}
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--accent-orange)]/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_20px_rgba(255,86,42,0.4)]">
                      <Gift className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-[var(--accent-gold)]/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent-gold)]">
                      VIP Grill Fam Member
                    </span>
                  </div>
                  <h3 className="font-[family:var(--font-serif)] text-2xl md:text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                    {profile?.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[var(--accent-peach)]" />
                    Member since {formatDate(joinedAt)}
                  </p>
                </div>

                {/* Points Card */}
                <div className="rounded-2xl border border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/10 p-6 text-center md:text-right min-w-[200px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-peach)]">
                    Available Points
                  </p>
                  <p className="font-[family:var(--font-serif)] text-4xl md:text-5xl font-bold text-[var(--accent-orange)] mt-1 tabular-nums">
                    {points}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Accrues 1 pt per Rs 100 on every order
                  </p>
                </div>
              </div>
            </div>

            {/* Perks & WhatsApp Community Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp Community Direct Card */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--whatsapp-green)]/15 text-[var(--whatsapp-green)]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-[family:var(--font-serif)] text-lg font-bold uppercase text-[var(--text-primary)]">
                      VIP WhatsApp Group
                    </h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Instant announcements & secret weekend cuts
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-body)]">
                  As an active member, you have unrestricted access to our WhatsApp VIP Community. Connect directly with the pitmasters.
                </p>
                <a
                  href="https://chat.whatsapp.com/TikkayShikkayGrillFamVIP"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block pt-2"
                >
                  <Button variant="whatsapp" className="rounded-xl h-11 px-6 text-xs flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Open WhatsApp Community
                  </Button>
                </a>
              </div>

              {/* Special Menu Access Placeholder */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
                    <Lock className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-[family:var(--font-serif)] text-lg font-bold uppercase text-[var(--text-primary)]">
                      Secret Menu Access
                    </h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Member-exclusive seasonal cuts
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-body)]">
                  Our kitchen team is curating limited-batch, off-menu dishes exclusively for loyalty members. Watch this space and our WhatsApp VIP group for drop alerts.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent-peach)] pt-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Next Batch Drops Soon</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Non-Member CTA View */
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--accent-orange)]/40 bg-[var(--bg-surface)] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
            <div className="max-w-2xl space-y-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_30px_rgba(255,86,42,0.4)]">
                <Gift className="h-8 w-8" />
              </span>
              <div className="space-y-2">
                <h3 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                  Join the Tikkay Shikkay Loyalty Club
                </h3>
                <p className="text-sm text-[var(--text-body)] leading-relaxed">
                  Earn points automatically on every BBQ order, unlock exclusive WhatsApp community drops, and celebrate with a special birthday discount.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-4">
                  <Coins className="h-5 w-5 text-[var(--accent-orange)] mb-2" />
                  <p className="text-xs font-bold text-[var(--text-primary)]">Points Earning</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">1 pt per Rs 100 on every order</p>
                </div>
                <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-4">
                  <MessageCircle className="h-5 w-5 text-[var(--whatsapp-green)] mb-2" />
                  <p className="text-xs font-bold text-[var(--text-primary)]">VIP Community</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Private WhatsApp grill group</p>
                </div>
                <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-4">
                  <Calendar className="h-5 w-5 text-[var(--accent-peach)] mb-2" />
                  <p className="text-xs font-bold text-[var(--text-primary)]">Birthday Treats</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Special offers on your big day</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                  className="h-12 px-8 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(255,86,42,0.4)]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Join Loyalty Club Free</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <JoinLoyaltyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
