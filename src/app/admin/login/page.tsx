"use client";

import { useState, FormEvent } from "react";
import { useAccount } from "@/providers/AccountProvider";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { authenticate, authError, clearAuthError } = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    clearAuthError();

    try {
      const user = await authenticate({ email, password });
      if (user.role !== "admin") {
        clearAuthError();
        alert("Access denied. Admin accounts only.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      // authenticate() sets authError internally
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-deep)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-[family:var(--font-serif)] text-3xl font-bold text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-[var(--text-faint)]">
            Sign in with your admin credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-[var(--bg-surface)] p-6 shadow-xl">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
              placeholder="admin@tikkay.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2.5 pr-10 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]"
                placeholder="••••••••"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {authError && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--accent-orange)] py-2.5 text-sm font-bold uppercase tracking-widest text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-faint)]">
          © Tikkay Shikkay Admin
        </p>
      </div>
    </div>
  );
}
