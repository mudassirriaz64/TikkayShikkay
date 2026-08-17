import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Flame } from "lucide-react";
import { getSiteSettings } from "@/lib/data/getSiteSettings";
import { mockSiteSettings } from "@/lib/mock/settings";

export async function Footer() {
  const raw = await getSiteSettings();
  const settings = {
    ...mockSiteSettings,
    ...raw,
    address: { ...mockSiteSettings.address, ...(raw.address ?? {}) },
    socials: { ...mockSiteSettings.socials, ...(raw.socials ?? {}) },
    contact: { ...mockSiteSettings.contact, ...(raw.contact ?? {}) },
  };

  return (
    <footer className="bg-[var(--bg-deep)] border-t border-[var(--border-warm)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 py-12 w-full max-w-7xl mx-auto px-6">
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-4">
          <Link href="/" className="inline-block">
            <span className="font-[family:var(--font-serif)] text-2xl lg:text-3xl font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Tikkay
              <span className="text-[var(--accent-orange)]">Shikkay</span>
            </span>
          </Link>
          <p className="text-xs text-stone-400 max-w-[320px] leading-relaxed mt-2">
            {siteConfig.footer.tagline}
          </p>
          
          {/* Social Links Row */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href={settings.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-warm)]/60 flex items-center justify-center text-[var(--accent-peach)] hover:bg-[var(--accent-orange)] hover:text-black transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href={settings.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-warm)]/60 flex items-center justify-center text-[var(--accent-peach)] hover:bg-[var(--accent-orange)] hover:text-black transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href={settings.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-warm)]/60 flex items-center justify-center text-[var(--accent-peach)] hover:bg-[var(--accent-orange)] hover:text-black transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.02.99 2.44 1.55 3.84 1.64v3.91c-1.39-.02-2.78-.45-3.91-1.29-.22-.16-.43-.34-.63-.54-.05 1.66-.02 3.32-.03 4.98-.05 2.12-.57 4.29-1.92 5.95-1.57 2.01-4.14 3.19-6.66 3.08-2.67-.02-5.26-1.51-6.56-3.84-1.42-2.48-1.18-5.78.58-8.02 1.48-1.93 3.99-3.04 6.42-2.82.02 1.29-.01 2.58-.02 3.87-1.14-.15-2.35.25-3.08 1.13-.77.87-.85 2.19-.24 3.09.58.91 1.7 1.46 2.76 1.34 1.09-.05 2.04-.84 2.24-1.92.09-1.27.03-2.55.05-3.82.02-3.14.01-6.28.02-9.42z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-200 tracking-widest uppercase mb-4">
            QUICK LINKS
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            {siteConfig.footer.quickLinks.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="hover:text-[#E5A93C] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-200 tracking-widest uppercase mb-4">
            EXPLORE
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            {siteConfig.footer.explore.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="hover:text-[#E5A93C] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-200 tracking-widest uppercase mb-4">
            CONTACT INFO
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>{settings.address.full}</li>
            <li>
              <a
                href={`tel:${settings.contact.phone}`}
                className="hover:text-[#E5A93C] transition-colors"
              >
                {settings.contact.phone}
              </a>
            </li>
          </ul>
          <a
            href={settings.address.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#E8927C] hover:underline mt-2"
          >
            📍 View on Google Maps
          </a>
        </div>
      </div>

      <div className="border-t border-stone-800/80 pt-8 pb-6 text-center">
        <p className="font-[family:var(--font-serif)] text-[11px] tracking-widest text-stone-500 uppercase">
          {siteConfig.footer.copyright}
        </p>
        <Link
          href="/admin"
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 transition-colors hover:text-[var(--accent-orange)]"
        >
          <Flame className="h-3 w-3" />
          Admin Studio
        </Link>
      </div>
    </footer>
  );
}
