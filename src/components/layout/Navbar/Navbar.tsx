"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { Menu, X, MessageCircle, Instagram, Facebook, UserRound, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { SiteSocials, SiteContactInfo } from "@/types";

interface NavbarProps {
  socials: SiteSocials;
  contact: SiteContactInfo;
}

export function Navbar({ socials, contact }: NavbarProps) {
  const pathname = usePathname();
  const { cartItemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur-[6px] transition-all duration-300 ease-in-out",
          scrolled
            ? "h-[60px] border-[var(--border-warm)]/50 bg-[rgba(32,31,31,0.92)] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
            : "h-[80px] border-transparent bg-[rgba(32,31,31,0.45)]",
        )}
      >
        <div className="relative mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-4 lg:px-[64px]">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className={cn(
              "relative overflow-hidden transition-all duration-300 ease-in-out",
              scrolled ? "h-9 w-9" : "h-11 w-11"
            )}>
              <Image
                src="/logo/logo_transparent.png"
                alt="Tikkay Shikkay Logo"
                fill
                sizes="(max-width: 768px) 36px, 44px"
                className="object-contain"
              />
            </div>
            <span className={cn(
              "hidden font-[family:var(--font-serif)] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] transition-all duration-300 ease-in-out min-[420px]:inline-block",
              scrolled ? "text-base" : "text-lg"
            )}>
              Tikkay
              <span className="text-[var(--accent-orange)]">Shikkay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center justify-center gap-7 xl:flex absolute left-1/2 transform -translate-x-1/2">
            {siteConfig.nav
              .filter((item) => !["Home", "Catering", "Careers"].includes(item.title))
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "relative pb-1.5 font-[family:var(--font-serif)] text-[13px] font-bold uppercase tracking-[0.14em] transition-colors whitespace-nowrap after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[var(--accent-peach)] after:transition-transform after:duration-500 after:ease-[var(--ease-out-soft)]",
                      isActive
                        ? "text-[var(--accent-peach)] after:scale-x-100"
                        : "text-[var(--text-primary)] after:scale-x-0 hover:text-[var(--accent-peach)] hover:after:scale-x-100",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
          </nav>

          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <Button
              variant="primary"
              size="sm"
              className={cn(
                "hidden rounded-xl px-5 md:inline-flex transition-all duration-300 ease-in-out",
                scrolled ? "h-9 text-xs" : "h-10 text-sm"
              )}
            >
              Order on WhatsApp
            </Button>

            <Link
              href="/checkout"
              aria-label="View Cart & Checkout"
              className={cn(
                "relative flex items-center justify-center rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/40 text-[var(--text-primary)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-peach)] active:scale-95",
                scrolled ? "h-9 w-9" : "h-10 w-10",
              )}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent-orange)] px-1 text-[10px] font-extrabold text-white shadow-md animate-in fade-in zoom-in duration-200">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/accounts"
              aria-label="My Account"
              className={cn(
                "flex items-center justify-center rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/40 text-[var(--text-primary)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent-peach)] active:scale-95",
                scrolled ? "h-9 w-9" : "h-10 w-10",
              )}
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/40 text-[var(--text-primary)] transition-all hover:bg-[var(--bg-surface-hover)] active:scale-95 xl:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer Container */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-[var(--bg-base)] border-l border-[var(--border-warm)] p-6 shadow-2xl transition-transform duration-300 ease-in-out transform xl:hidden flex flex-col justify-between",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col gap-8">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-warm)] pb-4">
            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                Tikkay<span className="text-[var(--accent-orange)]">Shikkay</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/60 text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] active:scale-95"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex flex-col gap-5">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-[0.14em] transition-colors py-1 border-b border-[var(--border-warm)]/10",
                    isActive ? "text-[var(--accent-peach)]" : "text-[var(--text-primary)] hover:text-[var(--accent-peach)]"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}

            <Link
              href="/checkout"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center justify-between font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-[0.14em] transition-colors py-1 border-b border-[var(--border-warm)]/10",
                pathname === "/checkout"
                  ? "text-[var(--accent-peach)]"
                  : "text-[var(--text-primary)] hover:text-[var(--accent-peach)]",
              )}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Cart / Checkout
              </div>
              {cartItemCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent-orange)] px-1.5 text-[10px] font-extrabold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/accounts"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-[0.14em] transition-colors py-1 border-b border-[var(--border-warm)]/10",
                pathname === "/accounts"
                  ? "text-[var(--accent-peach)]"
                  : "text-[var(--text-primary)] hover:text-[var(--accent-peach)]",
              )}
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              My Account
            </Link>
          </nav>
        </div>

        {/* Drawer Footer Contact/Socials */}
        <div className="flex flex-col gap-6 border-t border-[var(--border-warm)] pt-6 mt-6">
          <div className="flex flex-col gap-2 text-sm text-[var(--text-body)] font-[family:var(--font-serif)]">
            <p className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[11px]">Contact Us</p>
            <a href={`tel:${contact.phone}`} className="hover:text-[var(--accent-peach)] transition-colors">
              Call: {contact.phone}
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent-peach)] transition-colors"
            >
              WhatsApp: {contact.whatsapp}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-warm)] text-[var(--text-muted)] hover:text-[var(--accent-peach)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href={socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-warm)] text-[var(--text-muted)] hover:text-[var(--accent-peach)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>

          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <Button variant="whatsapp" className="w-full rounded-xl flex items-center justify-center gap-2 py-3.5">
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}

