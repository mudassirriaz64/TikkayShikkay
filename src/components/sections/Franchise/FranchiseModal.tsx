"use client";

import { useState, type FormEvent } from "react";
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Loader2,
  Sparkles,
  Phone,
  Mail,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { franchiseService } from "@/lib/api/franchise.service";
import { useAccount } from "@/providers/AccountProvider";

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BUDGET_TIERS = [
  "PKR 15M - 25M (Express / Cloud Kitchen)",
  "PKR 25M - 40M (Standard Dine-In & Live BBQ)",
  "PKR 40M - 60M+ (Flagship Experience Center)",
  "Overseas / International (UAE, UK, GCC)",
];

const TIMELINE_OPTIONS = [
  "Immediate (Next 30-60 Days)",
  "1-3 Months",
  "3-6 Months",
  "Exploring for next year",
];

export function FranchiseModal({ isOpen, onClose }: FranchiseModalProps) {
  const { profile } = useAccount();

  // Form State
  const [fullName, setFullName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [targetCity, setTargetCity] = useState("Islamabad");
  const [proposedLocation, setProposedLocation] = useState("");
  const [investmentBudget, setInvestmentBudget] = useState(BUDGET_TIERS[1]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [experienceSummary, setExperienceSummary] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await franchiseService.submitInquiry({
        full_name: fullName,
        email,
        phone,
        target_city: targetCity,
        proposed_location: proposedLocation,
        investment_budget: investmentBudget,
        timeline,
        experience_summary: experienceSummary,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit franchise inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => !submitting && onClose()}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] text-[#e5e2e1] shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-white shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-[family:var(--font-serif)] text-base font-bold uppercase text-white">
                Franchise & Expansion
              </h3>
              <p className="text-xs text-neutral-400">
                Partner with Pakistan’s First BBQ Brand (National & Global)
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase text-white">
              Franchise Prospectus Request Received!
            </h4>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{fullName}</strong>. Our executive leadership and expansion team will review your inquiry for <strong>{targetCity}</strong> and contact you within 24–48 business hours with unit economics and location feasibility.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={onClose}
                className="rounded-xl px-6 text-xs font-bold uppercase"
              >
                Close Window
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6 space-y-4 scrollbar-none">
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name / Principal Investor *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  WhatsApp / Direct Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="email"
                    required
                    placeholder="investor@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Target City / Region *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad, Rawalpindi, Karachi, Dubai"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Financials & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Investment Readiness *
                </label>
                <select
                  value={investmentBudget}
                  onChange={(e) => setInvestmentBudget(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                >
                  {BUDGET_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Target Launch Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                >
                  {TIMELINE_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Proposed Site / Area (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. F-7 Markaz, Blue Area, Bahria Town, or Commercial Hub"
                value={proposedLocation}
                onChange={(e) => setProposedLocation(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Business & Hospitality Background
              </label>
              <textarea
                rows={3}
                placeholder="Share any past commercial, food & beverage, or retail business experience..."
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none resize-none"
              />
            </div>

            {submitError && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                {submitError}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] -mx-6 -mb-6 px-6 py-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitting}
                className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Request Franchise Prospectus
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
