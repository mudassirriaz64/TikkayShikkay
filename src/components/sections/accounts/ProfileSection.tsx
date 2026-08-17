"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  KeyRound,
  LogOut,
  Mail,
  Shield,
  Smartphone,
  Trash2,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAccount } from "@/providers/AccountProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

type SecurityPanel = "email" | "phone" | "password" | "delete" | null;

function SecurityRow({
  icon: Icon,
  title,
  subtitle,
  danger,
  open,
  onToggle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  danger?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border-warm)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60"
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              danger
                ? "bg-[var(--accent-ember)]/15 text-[var(--accent-ember)]"
                : "bg-[var(--accent-ember)]/15 text-[var(--accent-orange)]",
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {title}
            </span>
            <span className="text-xs text-[var(--text-faint)]">{subtitle}</span>
          </span>
        </span>
        <span
          className={cn(
            "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
            danger
              ? "text-[var(--accent-ember)]"
              : open
                ? "text-[var(--accent-peach)]"
                : "text-[var(--text-faint)]",
          )}
        >
          {danger ? "Manage" : open ? "Close" : "Change"}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ProfileSection() {
  const { profile, updateProfile, signOut, deleteAccount } = useAccount();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [saved, setSaved] = useState(false);

  const [password, setPassword] = useLocalStorage<string>(
    "tikkay-account-password",
    "",
  );

  const [openPanel, setOpenPanel] = useState<SecurityPanel>(null);
  const [newEmail, setNewEmail] = useState(profile?.email ?? "");
  const [newPhone, setNewPhone] = useState(profile?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showFeedback = (
    type: "success" | "error",
    text: string,
    duration = 2600,
  ) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback(null), duration);
  };

  const togglePanel = (panel: Exclude<SecurityPanel, null>) => {
    setFeedback(null);
    setConfirmDelete(false);
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({ name, email, phone, address });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const handleChangeEmail = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      showFeedback("error", "Please enter a valid email address.");
      return;
    }
    updateProfile({ email: newEmail.trim() });
    setEmail(newEmail.trim());
    showFeedback("success", "Email address updated.");
    setOpenPanel(null);
  };

  const handleChangePhone = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newPhone.trim()) {
      showFeedback("error", "Please enter a phone number.");
      return;
    }
    updateProfile({ phone: newPhone.trim() });
    setPhone(newPhone.trim());
    showFeedback("success", "Phone number updated.");
    setOpenPanel(null);
  };

  const handleChangePassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (password && currentPassword !== password) {
      showFeedback("error", "Current password is incorrect.");
      return;
    }
    if (newPassword.length < 6) {
      showFeedback("error", "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback("error", "New passwords do not match.");
      return;
    }
    setPassword(newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showFeedback("success", "Password updated.");
    setOpenPanel(null);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading eyebrow="Profile" title="Your" accent="Details" />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ContactInput
                  id="profile-name"
                  label="Full name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <ContactInput
                  id="profile-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
              </div>
              <ContactInput
                id="profile-phone"
                label="Phone number"
                type="tel"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
              />
              <ContactInput
                id="profile-address"
                label="Delivery address"
                textarea
                rows={3}
                value={address}
                onChange={setAddress}
                autoComplete="street-address"
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="flex items-center gap-2 rounded-xl">
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Saved!
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={signOut}
                  className="flex items-center gap-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </Button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-ember)]/15 text-[var(--accent-orange)]">
                  <Shield className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                    Account Security
                  </h3>
                  <p className="text-xs text-[var(--text-faint)]">
                    Manage your sign-in details
                  </p>
                </div>
              </div>

              <SecurityRow
                icon={Mail}
                title="Email address"
                subtitle={profile?.email ?? "—"}
                open={openPanel === "email"}
                onToggle={() => togglePanel("email")}
              >
                <form onSubmit={handleChangeEmail} className="flex flex-col gap-3">
                  <ContactInput
                    id="sec-email"
                    label="New email address"
                    type="email"
                    value={newEmail}
                    onChange={setNewEmail}
                    autoComplete="email"
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-lg">
                      Update email
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setOpenPanel(null)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </SecurityRow>

              <SecurityRow
                icon={Smartphone}
                title="Phone number"
                subtitle={profile?.phone || "Not set"}
                open={openPanel === "phone"}
                onToggle={() => togglePanel("phone")}
              >
                <form onSubmit={handleChangePhone} className="flex flex-col gap-3">
                  <ContactInput
                    id="sec-phone"
                    label="New phone number"
                    type="tel"
                    value={newPhone}
                    onChange={setNewPhone}
                    autoComplete="tel"
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-lg">
                      Update phone
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setOpenPanel(null)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </SecurityRow>

              <SecurityRow
                icon={KeyRound}
                title="Password"
                subtitle={password ? "••••••••••" : "Not set yet"}
                open={openPanel === "password"}
                onToggle={() => togglePanel("password")}
              >
                <form
                  onSubmit={handleChangePassword}
                  className="flex flex-col gap-3"
                >
                  {password ? (
                    <PasswordInput
                      id="sec-current-password"
                      label="Current password"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      autoComplete="current-password"
                    />
                  ) : null}
                  <PasswordInput
                    id="sec-new-password"
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                    autoComplete="new-password"
                  />
                  <PasswordInput
                    id="sec-confirm-password"
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-lg">
                      Update password
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setOpenPanel(null)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </SecurityRow>

              <SecurityRow
                icon={Trash2}
                title="Delete account"
                subtitle="Remove all your data from this browser"
                danger
                open={openPanel === "delete"}
                onToggle={() => togglePanel("delete")}
              >
                {confirmDelete ? (
                  <div className="flex flex-col gap-4 rounded-xl border border-[var(--accent-ember)]/30 bg-[var(--accent-ember)]/10 p-4">
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-body)]">
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-ember)]"
                        aria-hidden="true"
                      />
                      This will remove your profile, favourites and reviews
                      saved in this browser. This cannot be undone.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flame"
                        onClick={handleDeleteAccount}
                        className="rounded-lg"
                      >
                        Yes, delete my account
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDelete(false)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmDelete(true)}
                    className="rounded-lg border-[var(--accent-ember)]/40 text-[var(--accent-ember)] hover:bg-[var(--accent-ember)] hover:text-[var(--text-on-orange)]"
                  >
                    Delete my account
                  </Button>
                )}
              </SecurityRow>
            </div>

            <AnimatePresence>
              {feedback ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "mt-4 rounded-xl border px-4 py-3 text-xs font-bold",
                    feedback.type === "success"
                      ? "border-[var(--accent-peach)]/30 bg-[var(--accent-peach)]/10 text-[var(--accent-peach)]"
                      : "border-[var(--accent-ember)]/30 bg-[var(--accent-ember)]/10 text-[var(--accent-ember)]",
                  )}
                >
                  {feedback.text}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
