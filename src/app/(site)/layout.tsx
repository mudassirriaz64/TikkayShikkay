import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyOrderBar } from "@/components/sections/StickyOrderBar";
import { MotionProvider } from "@/providers/MotionProvider";
import { CartProvider } from "@/context/CartContext";
import { AccountProvider } from "@/providers/AccountProvider";
import { getSiteSettings } from "@/lib/data/getSiteSettings";
import { mockSiteSettings } from "@/lib/mock/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const raw = await getSiteSettings();
  const settings = {
    ...mockSiteSettings,
    ...raw,
    address: { ...mockSiteSettings.address, ...(raw.address ?? {}) },
    socials: { ...mockSiteSettings.socials, ...(raw.socials ?? {}) },
    contact: { ...mockSiteSettings.contact, ...(raw.contact ?? {}) },
  };

  return (
    <MotionProvider>
      <CartProvider>
        <AccountProvider>
          <div className="pb-[89px] md:pb-0">
            <Navbar socials={settings.socials} contact={settings.contact} />
            <main>{children}</main>
            <Footer />
            <StickyOrderBar whatsapp={settings.contact.whatsapp} />
          </div>
        </AccountProvider>
      </CartProvider>
    </MotionProvider>
  );
}
