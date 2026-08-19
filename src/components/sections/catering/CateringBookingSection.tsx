"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Cake,
  Heart,
  Boxes,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Loader2,
  Flame,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import {
  cateringService,
  CateringEventType,
  CateringPackageTier,
  AvailabilityResult,
} from "@/lib/api";
import { useAccount } from "@/providers/AccountProvider";

interface EventTypeOption {
  id: CateringEventType;
  title: string;
  subtitle: string;
  icon: typeof Briefcase;
  minGuests: number;
}

const EVENT_TYPES: EventTypeOption[] = [
  {
    id: "corporate",
    title: "Corporate Events",
    subtitle: "Boardroom platters, annual galas, and team feasts",
    icon: Briefcase,
    minGuests: 20,
  },
  {
    id: "birthday",
    title: "Birthday Parties",
    subtitle: "Family BBQ celebrations with live grill counters",
    icon: Cake,
    minGuests: 15,
  },
  {
    id: "wedding",
    title: "Weddings & Walima",
    subtitle: "Grand charcoal BBQ spreads & live tandoor stations",
    icon: Heart,
    minGuests: 50,
  },
  {
    id: "bulk-order",
    title: "Bulk Meal Boxes",
    subtitle: "Pre-portioned hot grill boxes delivered to your venue",
    icon: Boxes,
    minGuests: 25,
  },
];

interface PackageOption {
  id: CateringPackageTier;
  name: string;
  pricePerHead: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const PACKAGES: PackageOption[] = [
  {
    id: "classic-grill",
    name: "Classic Pitmaster Spread",
    pricePerHead: 1450,
    description: "Our core favorites: Chicken Tikka, Seekh Kabab, Roghani Naan, Raita & Mint Chutney.",
    features: [
      "Chicken Boti & Reshmi Tikka",
      "Beef Seekh Kababs",
      "Fresh Roghani Naans",
      "Mint Chutney & Fresh Kachumber",
      "Standard Buffet Setup & Warmers",
    ],
  },
  {
    id: "royal-bbq-feast",
    name: "Royal BBQ & Karahi Feast",
    pricePerHead: 2150,
    popular: true,
    description: "The complete Tikkay Shikkay feast with live grills, mutton karahi, and traditional desserts.",
    features: [
      "Mutton Karahi or Chicken Handi",
      "Mutton Chops & Malai Boti",
      "Beef Gola Kababs & Fish Tikka",
      "Live Tandoor Station (Unlimited Hot Naans)",
      "Kheer / Shahi Tukray Dessert",
      "Full Service Pit Crew & Service Team",
    ],
  },
  {
    id: "pitmaster-live-station",
    name: "Live Tandoor & Charcoal Experience",
    pricePerHead: 2950,
    description: "Premium on-site open-flame live cooking with master pitmasters and bespoke presentation.",
    features: [
      "On-site Custom Charcoal Grills",
      "Whole Stuffed Lamb / Sajji options",
      "Live Hot Tandoor Roti & Garlic Naan",
      "Specialty Signature Smoke Platter",
      "Dedicated Event Manager & Service Staff",
      "VIP Cutlery, Chafing Dishes & Presentation",
    ],
  },
];

export function CateringBookingSection() {
  const { profile, isSignedIn } = useAccount();

  // Form State
  const [eventType, setEventType] = useState<CateringEventType>("corporate");
  const [guestCount, setGuestCount] = useState<number>(50);
  const [eventDate, setEventDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [eventTime, setEventTime] = useState<string>("19:30");
  const [packageTier, setPackageTier] = useState<CateringPackageTier>("royal-bbq-feast");
  const [isLiveTandoor, setIsLiveTandoor] = useState(true);

  // Customer Contact State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Sync profile when signed in
  useEffect(() => {
    if (profile) {
      if (profile.name && !contactName) setContactName(profile.name);
      if (profile.phone && !contactPhone) setContactPhone(profile.phone);
      if (profile.email && !contactEmail) setContactEmail(profile.email);
      if (profile.address && !eventLocation) setEventLocation(profile.address);
    }
  }, [profile]);

  // Real-time Availability State
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [isCheckingDate, setIsCheckingDate] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check Availability when date changes
  useEffect(() => {
    if (!eventDate) return;
    setIsCheckingDate(true);
    cateringService
      .checkAvailability(eventDate)
      .then((res) => setAvailability(res))
      .catch(() => setAvailability(null))
      .finally(() => setIsCheckingDate(false));
  }, [eventDate]);

  // Calculate pricing
  const selectedPkg = PACKAGES.find((p) => p.id === packageTier) || PACKAGES[1];
  const liveTandoorAddon = isLiveTandoor ? 150 * guestCount : 0;
  const estimatedTotal = selectedPkg.pricePerHead * guestCount + liveTandoorAddon;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await cateringService.createBooking({
        user_id: profile?.id || (profile as any)?._id,
        event_type: eventType,
        guest_count: guestCount,
        event_date: eventDate,
        event_time: eventTime,
        package_tier: packageTier,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail || profile?.email,
        event_location: eventLocation,
        special_instructions: specialInstructions,
        estimated_total: estimatedTotal,
        is_live_tandoor_requested: isLiveTandoor,
      });

      setSubmittedBooking(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit booking inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-catering" className="bg-[var(--bg-deep)] py-[96px] lg:py-[120px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-14 text-center">
          <SectionHeading
            eyebrow="Custom Live Events & Feasts"
            title="Book Your BBQ Catering"
            accent="& Live Station"
          />
          <p className="mt-3 text-sm text-[var(--text-muted)] max-w-[62ch] mx-auto">
            From 20-person boardroom dinners to 1,000+ guest grand wedding receptions. Select your event size, check real-time pit capacity, and get an instant quote.
          </p>
        </Reveal>

        {!submittedBooking ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Event Configurator (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Event Type */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)] flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)] text-[10px] font-extrabold">
                      1
                    </span>
                    Select Event Type
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {EVENT_TYPES.map((ev) => {
                    const Icon = ev.icon;
                    const isSelected = eventType === ev.id;
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => {
                          setEventType(ev.id);
                          if (guestCount < ev.minGuests) setGuestCount(ev.minGuests);
                        }}
                        className={`flex flex-col text-left p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 shadow-[0_0_25px_rgba(255,86,42,0.15)]"
                            : "border-[var(--border-warm)] bg-[var(--bg-base)] hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className={`p-2 rounded-xl ${isSelected ? "bg-[var(--accent-orange)] text-white" : "bg-[var(--bg-surface-raised)] text-[var(--text-muted)]"}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-[var(--accent-orange)]" />}
                        </div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">{ev.title}</p>
                        <p className="text-xs text-[var(--text-faint)] mt-1 line-clamp-2">{ev.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date, Time & Live Availability */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)] text-[10px] font-extrabold">
                    2
                  </span>
                  Date, Time & Live Availability Check
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* Guest Count */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-faint)] mb-1.5">
                      Guests ({guestCount})
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={2000}
                      step={5}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(10, Number(e.target.value)))}
                      className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                    />
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-faint)] mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                    />
                  </div>

                  {/* Event Time */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-faint)] mb-1.5">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Availability Banner */}
                <div className="mt-2 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-[var(--accent-orange)] shrink-0" />
                    <div>
                      {isCheckingDate ? (
                        <p className="text-[var(--text-muted)] flex items-center gap-1.5">
                          <Loader2 className="h-3 w-3 animate-spin" /> Checking pit capacity for selected date...
                        </p>
                      ) : availability?.is_available ? (
                        <p className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Date Available & Pit Crew Open ({availability.remaining_slots} slots open)
                        </p>
                      ) : (
                        <p className="font-bold text-amber-400 flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" /> High demand date — Inquiries reviewed personally by Pitmaster
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                    Real-time slot
                  </span>
                </div>
              </div>

              {/* Step 3: Package Tiers */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)] text-[10px] font-extrabold">
                    3
                  </span>
                  Select BBQ Package
                </span>

                <div className="space-y-3 pt-1">
                  {PACKAGES.map((pkg) => {
                    const isSelected = packageTier === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setPackageTier(pkg.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 shadow-[0_0_25px_rgba(255,86,42,0.15)]"
                            : "border-[var(--border-warm)] bg-[var(--bg-base)] hover:border-white/20"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-[var(--text-primary)]">{pkg.name}</h4>
                            {pkg.popular && (
                              <span className="rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-[9px] font-extrabold uppercase px-2 py-0.5">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--accent-orange)]">
                            {formatCurrency(pkg.pricePerHead)} <span className="text-xs text-[var(--text-faint)] font-sans font-normal">/ person</span>
                          </p>
                        </div>
                        <p className="text-xs text-[var(--text-body)] mb-3">{pkg.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.features.map((f) => (
                            <span
                              key={f}
                              className="rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-warm)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add-on: Live Tandoor */}
                <label className="flex items-start gap-3 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-4 cursor-pointer hover:border-[var(--accent-peach)]/50 transition-colors mt-2">
                  <input
                    type="checkbox"
                    checked={isLiveTandoor}
                    onChange={(e) => setIsLiveTandoor(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[var(--border-warm)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-[var(--accent-orange)]" />
                      Include On-Site Live Clay Tandoor (+Rs 150 / person)
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Our pitmasters set up a live clay tandoor at your venue to bake piping hot garlic and roghani naans live.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right Column: Contact & Estimated Summary Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)]">
                    Contact & Venue
                  </span>
                  <h3 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase text-[var(--text-primary)] mt-1">
                    Booking Summary
                  </h3>
                </div>

                {/* Contact Inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--text-faint)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mudassir Riaz"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[var(--text-faint)] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[var(--text-faint)] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--text-faint)] mb-1">
                      Venue / Event Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DHA Phase 5, Lahore or Office Hall"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--text-faint)] mb-1">
                      Special Requests / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special dietary needs, preferred cuts, seating setup..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Pricing Calculation Breakdown */}
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>{selectedPkg.name}</span>
                    <span className="font-bold text-[var(--text-primary)]">{formatCurrency(selectedPkg.pricePerHead * guestCount)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-faint)] text-[11px]">
                    <span>{guestCount} guests × {formatCurrency(selectedPkg.pricePerHead)}</span>
                  </div>
                  {isLiveTandoor && (
                    <div className="flex justify-between text-[var(--text-muted)] pt-1 border-t border-[var(--border-warm)]/40">
                      <span>Live Clay Tandoor Setup</span>
                      <span className="font-bold text-[var(--text-primary)]">{formatCurrency(liveTandoorAddon)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-[var(--border-warm)] text-sm font-bold">
                    <span className="text-[var(--text-primary)]">Estimated Total</span>
                    <span className="font-[family:var(--font-serif)] text-2xl text-[var(--accent-orange)]">
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,86,42,0.35)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting Booking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Request Catering & Lock Date
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-[var(--text-faint)] text-center">
                  No immediate payment required. Our Pitmaster Coordinator will call you within 2 business hours.
                </p>
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto rounded-[32px] border border-[var(--accent-orange)]/40 bg-[var(--bg-surface)] p-8 md:p-12 text-center space-y-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_35px_rgba(255,86,42,0.45)]">
              <CheckCircle2 className="h-9 w-9" />
            </span>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-peach)]">
                Booking In Review
              </span>
              <h3 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] mt-2">
                Your Catering Request is Confirmed!
              </h3>
              <p className="text-xs text-[var(--text-body)] mt-2">
                Booking ID: <strong className="text-[var(--text-primary)] font-mono">#{submittedBooking._id || submittedBooking.id}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-5 text-left text-xs space-y-2">
              <p className="text-[var(--text-muted)]">
                <strong>Event:</strong> {submittedBooking.event_type?.toUpperCase()} for <strong>{submittedBooking.guest_count} Guests</strong>
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Date & Time:</strong> {submittedBooking.event_date} at {submittedBooking.event_time}
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Venue:</strong> {submittedBooking.event_location}
              </p>
              <p className="text-[var(--text-muted)]">
                <strong>Estimated Quote:</strong> <span className="font-bold text-[var(--accent-orange)]">{formatCurrency(submittedBooking.estimated_total)}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/923001234567?text=${encodeURIComponent(
                  `Hello! I just submitted a catering request #${submittedBooking._id || submittedBooking.id} for ${submittedBooking.event_date} (${submittedBooking.guest_count} guests). Let's coordinate details!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-block"
              >
                <Button
                  variant="whatsapp"
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  Connect with Pitmaster via WhatsApp
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => setSubmittedBooking(null)}
                className="rounded-xl h-12 text-xs"
              >
                Book Another Event
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
