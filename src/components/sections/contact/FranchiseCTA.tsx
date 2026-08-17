"use client";

import { useState, type FormEvent } from "react";
import { Flame, Sparkles } from "lucide-react";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { ContactButton } from "@/components/ui/contact/ContactButton";
import { Reveal } from "@/components/motion/Reveal";
import { FranchiseData } from "@/types/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FranchiseCTA({ data }: { data: FranchiseData }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [notified, setNotified] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(undefined);
    setNotified(true);
  };

  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-warm)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-deep)] px-6 py-12 md:px-12 md:py-16 lg:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[var(--accent-ember)]/12 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[var(--accent-peach)]/8 blur-[120px]"
            />

            <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-orange)]/25 bg-[var(--accent-orange)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-orange)]">
                  <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                  {data.eyebrow}
                </span>
                <h2 className="mt-5 font-[family:var(--font-serif)] text-3xl font-bold uppercase leading-[1.02] tracking-tight text-[var(--text-primary)] md:text-5xl">
                  {data.title}{" "}
                  <em className="font-normal italic text-[var(--accent-peach)]">
                    {data.titleAccent}
                  </em>
                </h2>
                <p className="mt-5 max-w-[46ch] text-[var(--text-body)]">
                  {data.description}
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                  <ContactInput
                    id="franchise-email"
                    label={data.placeholder}
                    name="email"
                    type="email"
                    value={email}
                    onChange={(value) => {
                      setEmail(value);
                      if (error) setError(undefined);
                    }}
                    error={error}
                    autoComplete="email"
                    required
                  />
                  {notified ? (
                    <p className="flex items-center gap-2 text-sm text-[var(--accent-gold)]">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      You&apos;re on the list — we&apos;ll be in touch.
                    </p>
                  ) : (
                    <ContactButton showArrow={false}>{data.notifyLabel}</ContactButton>
                  )}
                </form>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-gold)]/12 text-[var(--accent-gold)]">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {data.portalLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
