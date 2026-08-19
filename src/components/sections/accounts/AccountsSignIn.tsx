"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAccount } from "@/providers/AccountProvider";
import { authService } from "@/lib/api/auth.service";
import { Lock, KeyRound, ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";

type AuthMode = "login" | "register" | "forgot";

export function AccountsSignIn() {
  const { authenticate, createAccount, authError, clearAuthError } = useAccount();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  // Forgot password & OTP reset state
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  function switchMode(next: AuthMode) {
    setMode(next);
    clearAuthError();
    setFieldError("");
    if (next === "forgot") {
      setForgotStep("request");
      setResetSuccess(false);
      setResetOTP("");
      setNewPassword("");
      setConfirmNewPassword("");
      if (email) setResetEmail(email);
    }
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
        await authenticate({ email: email.trim(), password, rememberMe });
      }
      window.location.href = "/";
    } catch {
      // authError is set internally by AccountProvider
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotRequest(e: FormEvent) {
    e.preventDefault();
    setFieldError("");
    if (!resetEmail.trim()) {
      setFieldError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(resetEmail.trim());
      setForgotStep("verify");
    } catch (err: any) {
      setFieldError(err?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError("");

    if (!resetOTP || resetOTP.trim().length !== 6) {
      setFieldError("Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setFieldError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFieldError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: resetEmail.trim(),
        otp: resetOTP.trim(),
        newPassword,
      });
      setResetSuccess(true);
    } catch (err: any) {
      setFieldError(err?.message || "Invalid or expired OTP code.");
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
            {mode === "forgot" ? (
              /* Forgot Password Flow */
              <div className="flex flex-col gap-6">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-peach)] hover:underline self-start"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </button>

                <div className="flex flex-col gap-2 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_30px_rgba(255,86,42,0.4)]">
                    <KeyRound className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h1 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase text-[var(--text-primary)]">
                    {resetSuccess
                      ? "Password Reset!"
                      : forgotStep === "request"
                      ? "Forgot Password"
                      : "Enter 6-Digit OTP"}
                  </h1>
                  <p className="text-xs leading-relaxed text-[var(--text-body)] max-w-sm mx-auto">
                    {resetSuccess
                      ? "Your password has been successfully updated. You can now sign in."
                      : forgotStep === "request"
                      ? "Enter your account email. We will generate a 6-digit OTP code to verify your request."
                      : `Enter the 6-digit verification code generated for ${resetEmail}. (Check server console)`}
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <Button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="w-full rounded-xl"
                    >
                      Sign In with New Password
                    </Button>
                  </div>
                ) : forgotStep === "request" ? (
                  <form onSubmit={handleForgotRequest} className="flex flex-col gap-4">
                    <ContactInput
                      id="reset-email"
                      label="Your registered email address"
                      type="email"
                      value={resetEmail}
                      onChange={setResetEmail}
                      autoComplete="email"
                      required
                    />

                    {fieldError && (
                      <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                        {fieldError}
                      </p>
                    )}

                    <Button type="submit" disabled={loading} className="w-full rounded-xl mt-2">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending Code…
                        </span>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={resetOTP}
                        onChange={(e) => setResetOTP(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.5em] text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-[var(--text-faint)] text-center">
                        💡 In development mode, the OTP is printed directly in your backend terminal / console.
                      </p>
                    </div>

                    <PasswordInput
                      id="new-password"
                      label="New Password (min. 6 characters)"
                      value={newPassword}
                      onChange={setNewPassword}
                      autoComplete="new-password"
                      required
                    />

                    <PasswordInput
                      id="confirm-new-password"
                      label="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={setConfirmNewPassword}
                      autoComplete="new-password"
                      required
                    />

                    {fieldError && (
                      <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                        {fieldError}
                      </p>
                    )}

                    <Button type="submit" disabled={loading} className="w-full rounded-xl mt-2">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Resetting Password…
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              /* Normal Sign In / Register Flow */
              <>
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

                  {mode === "login" && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-[var(--border-warm)] bg-[var(--bg-surface-alt)] text-[var(--accent-orange)] accent-[var(--accent-orange)] focus:ring-[var(--accent-orange)]"
                        />
                        <span className="text-xs text-[var(--text-body)] hover:text-[var(--text-primary)]">
                          Remember me
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs font-semibold text-[var(--accent-peach)] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
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
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
