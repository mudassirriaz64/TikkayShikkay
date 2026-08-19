"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Clock, Send, AlertCircle, MessageCircle, Loader2 } from "lucide-react";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { ContactButton } from "@/components/ui/contact/ContactButton";
import { Reveal } from "@/components/motion/Reveal";
import { ContactFormData } from "@/types/contact";
import { contactService } from "@/lib/api";

interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,}$/;

function validate(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please share your name.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please add a phone number.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.email.trim()) {
    errors.email = "Please add your email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Please add a subject.";
  }

  if (!values.message.trim()) {
    errors.message = "Please write us a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "A little more detail helps (10+ characters).";
  }

  return errors;
}

export function ContactForm({ data }: { data: ContactFormData }) {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const setField =
    (field: keyof ContactFormValues) => (value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (submitError) {
        setSubmitError(null);
      }
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await contactService.submitForm({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("[ContactForm] Submit error:", err);
      setSubmitError(
        err?.message || "Something went wrong sending your message. Please try again or reach us directly on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="border-t border-[var(--border-warm)]/30 bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
          <Reveal>
            <div className="mx-auto max-w-xl rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-10 text-center shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Message received.
              </h2>
              <p className="mt-3 text-[var(--text-body)]">
                Thanks for reaching out — the grill crew will get back to you
                within 2 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setValues(INITIAL_VALUES);
                  setSubmitted(false);
                }}
                className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)] transition-colors duration-300 hover:text-[var(--accent-orange)]"
              >
                Send another message
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[var(--border-warm)]/30 bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.45fr_0.55fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
                Get in touch
              </span>
              <h2 className="mt-4 font-[family:var(--font-serif)] text-3xl font-bold uppercase leading-[1.05] tracking-tight text-[var(--text-primary)] md:text-5xl">
                {data.heading}{" "}
                <em className="font-normal italic text-[var(--accent-peach)]">
                  {data.accent}
                </em>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[var(--text-body)]">
                {data.description}
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-peach)]/12 text-[var(--accent-peach)]">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Response time
                  </p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {data.responseTime}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ContactInput
                  id="contact-name"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={setField("name")}
                  error={errors.name}
                  required
                  autoComplete="name"
                />
                <ContactInput
                  id="contact-phone"
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={setField("phone")}
                  error={errors.phone}
                  required
                  autoComplete="tel"
                />
              </div>
              <ContactInput
                id="contact-email"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={setField("email")}
                error={errors.email}
                required
                autoComplete="email"
              />
              <ContactInput
                id="contact-subject"
                label="Subject"
                name="subject"
                value={values.subject}
                onChange={setField("subject")}
                error={errors.subject}
                required
              />
              <ContactInput
                id="contact-message"
                label="Message"
                name="message"
                value={values.message}
                onChange={setField("message")}
                error={errors.message}
                required
                textarea
                rows={5}
              />
              {submitError ? (
                <div className="flex items-start gap-3 rounded-2xl border border-[var(--accent-coral)]/40 bg-[var(--accent-coral)]/10 p-4 text-left">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-coral)]" />
                  <div className="flex-1 text-xs leading-relaxed text-[var(--text-primary)]">
                    <p className="font-bold text-[var(--accent-coral)]">Submission Failed</p>
                    <p className="mt-1">{submitError}</p>
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 font-bold text-[var(--whatsapp-green)] hover:underline"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat with Pitmaster on WhatsApp instead
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[var(--text-muted)]">
                  <span aria-hidden="true" className="text-[var(--accent-ember)]">
                    *
                  </span>{" "}
                  Required fields — we reply within 2 hours.
                </p>
                <ContactButton showArrow={false} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </ContactButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
