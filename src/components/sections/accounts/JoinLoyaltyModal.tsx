"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  X,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Loader2,
  Calendar,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { usersService } from "@/lib/api";
import { useAccount } from "@/providers/AccountProvider";

interface JoinLoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function JoinLoyaltyModal({
  isOpen,
  onClose,
  onSuccess,
}: JoinLoyaltyModalProps) {
  const { profile, updateProfile, refreshSession } = useAccount();
  const [birthday, setBirthday] = useState(profile?.birthday || "");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState(
    "https://chat.whatsapp.com/TikkayShikkayGrillFamVIP"
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await usersService.joinLoyalty({
        birthday: birthday.trim() || undefined,
        whatsapp_opt_in: whatsappOptIn,
      });

      if (res.whatsapp_community_url) {
        setWhatsappLink(res.whatsapp_community_url);
      }

      await refreshSession();
      setJoinedSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to join Loyalty Club. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {!joinedSuccess ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_25px_rgba(255,86,42,0.4)]">
                <Gift className="h-7 w-7" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                    Join Grill Fam VIP
                  </h2>
                  <span className="rounded-full bg-[var(--accent-gold)]/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[var(--accent-gold)]">
                    Free
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Exclusive WhatsApp community, points on every order, and birthday treats.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/40 p-4 space-y-2">
                <p className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-[var(--accent-orange)]" />
                  What you get as a member:
                </p>
                <ul className="text-xs text-[var(--text-body)] space-y-1.5 list-disc list-inside">
                  <li><strong>1 Point per Rs 100 spent</strong> automatically accrued on delivery</li>
                  <li>Direct access to our <strong>VIP WhatsApp Community</strong> for secret drops</li>
                  <li>Special <strong>Birthday surprise discount</strong> during your birth month</li>
                </ul>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)] mb-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[var(--accent-peach)]" />
                  Birthday Date (Optional for Birthday Treats)
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-[var(--text-faint)] mt-1">
                  We&apos;ll send you an exclusive grill treat during your birthday week.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-[var(--border-warm)]/60 bg-[var(--bg-base)]/50 p-3.5 cursor-pointer hover:border-[var(--accent-peach)]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--border-warm)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)]"
                />
                <div className="text-xs">
                  <p className="font-bold text-[var(--text-primary)]">
                    Receive VIP WhatsApp Community Updates
                  </p>
                  <p className="text-[var(--text-muted)] mt-0.5">
                    Get weekly secret menu items and limited-batch notifications.
                  </p>
                </div>
              </label>

              {error && (
                <p className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(255,86,42,0.35)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Complete Membership (Free)
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* Success Step */
          <div className="text-center space-y-6 py-2">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_35px_rgba(255,86,42,0.45)]">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-peach)]">
                Welcome to the Family
              </span>
              <h2 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)] mt-2">
                You&apos;re Officially a Loyalty Member!
              </h2>
              <p className="mt-2 text-xs text-[var(--text-body)] leading-relaxed max-w-[42ch] mx-auto">
                Your points will automatically accrue every time you order. Join our VIP WhatsApp channel below for member-only perks.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-block"
              >
                <Button
                  variant="whatsapp"
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <MessageCircle className="h-5 w-5" />
                  Join WhatsApp Community
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-11 rounded-xl text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
