"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAccount } from "@/providers/AccountProvider";
import { Lock } from "lucide-react";

type AuthMode = "login" | "register";

export function AccountsSignIn() {
  const { authenticate, createAccount, authError, clearAuthError } = useAccount();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  function switchMode(next: AuthMode) {
    setMode(next);
    clearAuthError();
    setFieldError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError("");
    clearAuthError();

    if (mode === "register") {
      if (!name.trim()) {
        setFieldError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setFieldError("Passwords do not match. Please re-enter.");
        return;
      }
    }
    if (!email.trim()) {
      setFieldError("Please enter your email address.");
      return;
    }
    if (!password || password.length < 6) {
      setFieldError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await createAccount({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
        });
      } else {
        await authenticate({ email: email.trim(), password });
      }
      window.location.href = "/";
    } catch {
      // authError is set internally by AccountProvider
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--bg-deep)] py-[88px] lg:py-[120px]">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/gallery/hero-fire.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-deep)] via-[var(--bg-deep)]/80 to-[var(--bg-deep)]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="mx-auto max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)]/90 p-8 backdrop-blur-md"
          >
            <div className="flex flex-col gap-3 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_30px_rgba(255,86,42,0.4)]">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </span>
              <h1 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-[-0.02em] text-[var(--text-primary)]">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm leading-relaxed text-[var(--text-body)]">
                {mode === "login"
                  ? "Sign in to track your orders, save favourites and manage your profile."
                  : "Register to start ordering, track your orders and save favourite dishes."}
              </p>
            </div>

            <div className="flex rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === "login"
                    ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-faint)] hover:text-[var(--text-body)]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === "register"
                    ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-faint)] hover:text-[var(--text-body)]"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <>
                  <ContactInput
                    id="auth-name"
                    label="Full name"
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                    required
                  />
                  <ContactInput
                    id="auth-phone"
                    label="Phone number (optional)"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    autoComplete="tel"
                  />
                </>
              )}
              <ContactInput
                id="auth-email"
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                required
              />
              <PasswordInput
                id="auth-password"
                label={mode === "register" ? "Create Password (min. 6 characters)" : "Password"}
                value={password}
                onChange={setPassword}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
              {mode === "register" && (
                <PasswordInput
                  id="auth-confirm-password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  required
                />
              )}

              {(fieldError || authError) && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {fieldError || authError}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full rounded-xl mt-2">
                {loading
                  ? mode === "login"
                    ? "Signing in…"
                    : "Creating account…"
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-xs text-[var(--text-faint)]">
              {mode === "login" ? (
                <p>
                  Don&rsquo;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-bold text-[var(--accent-peach)] hover:underline"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-bold text-[var(--accent-peach)] hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
