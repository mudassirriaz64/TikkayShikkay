"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Utensils,
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Sparkles,
  RefreshCw,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/accounts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { cateringService, CateringBookingRecord } from "@/lib/api";

const STATUS_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  inquiry: {
    label: "Inquiry Received",
    className: "border-neutral-700 bg-neutral-800 text-neutral-300",
  },
  "under-review": {
    label: "Under Review by Pitmaster",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
  confirmed: {
    label: "Date Confirmed & Booked",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  completed: {
    label: "Event Completed",
    className: "border-neutral-700 bg-neutral-800 text-neutral-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  },
};

export function CateringHistorySection() {
  const [bookings, setBookings] = useState<CateringBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const data = await cateringService.getMyBookings();
      setBookings(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMyBookings();
  }, []);

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <Reveal>
            <SectionHeading
              eyebrow="Custom Live Events & Galas"
              title="Your Catering"
              accent="& Bookings"
            />
          </Reveal>

          <Link href="/catering#book-catering">
            <Button variant="primary" className="rounded-xl h-11 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Book New Catering
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-[var(--text-faint)] flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading your event bookings...
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="No catering bookings yet"
            description="Planning a corporate event, birthday party, wedding, or bulk order? Book our pitmasters with live clay tandoor stations."
            ctaLabel="Explore Catering Packages"
            ctaHref="/catering"
          />
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => {
              const id = booking.id || booking._id || `booking-${index}`;
              const badge = STATUS_BADGE[booking.status] || STATUS_BADGE.inquiry;
              return (
                <Reveal key={id} delay={index * 0.05}>
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-warm)] pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                            {booking.event_type?.toUpperCase()} EVENT
                          </h3>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-faint)] mt-0.5">
                          Booking #{id} · Submitted on {formatDate(booking.createdAt)}
                        </p>
                      </div>

                      <p className="font-[family:var(--font-serif)] text-xl font-bold text-[var(--accent-orange)]">
                        {formatCurrency(booking.estimated_total)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
                        <Users className="h-4 w-4 text-[var(--accent-orange)] shrink-0" />
                        <span><strong>{booking.guest_count}</strong> Estimated Guests</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
                        <Calendar className="h-4 w-4 text-[var(--accent-peach)] shrink-0" />
                        <span>Date: <strong>{booking.event_date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
                        <Clock className="h-4 w-4 text-[var(--accent-gold)] shrink-0" />
                        <span>Time: <strong>{booking.event_time}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[var(--text-muted)] truncate">
                        <MapPin className="h-4 w-4 text-[var(--text-faint)] shrink-0" />
                        <span className="truncate">{booking.event_location}</span>
                      </div>
                    </div>

                    {booking.is_live_tandoor_requested && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 px-3 py-1 text-[11px] font-bold text-[var(--accent-peach)]">
                        <Flame className="h-3.5 w-3.5 text-[var(--accent-orange)]" />
                        Live Clay Tandoor Station Included
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--border-warm)] pt-4">
                      <p className="text-xs text-[var(--text-faint)]">
                        Package: <strong className="text-[var(--text-primary)]">{booking.package_tier}</strong>
                      </p>

                      <a
                        href={`https://wa.me/923001234567?text=${encodeURIComponent(
                          `Hello! I would like an update regarding my catering booking #${id} on ${booking.event_date}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="whatsapp" size="sm" className="h-9 px-4 rounded-xl text-xs flex items-center gap-1.5">
                          <MessageCircle className="h-3.5 w-3.5" />
                          Chat with Event Coordinator
                        </Button>
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
