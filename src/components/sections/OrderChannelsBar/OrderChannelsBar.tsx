import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { getSiteSettings } from "@/lib/data/getSiteSettings";
import { mockSiteSettings } from "@/lib/mock/settings";

export async function OrderChannelsBar() {
  const raw = await getSiteSettings();
  const settings = {
    ...mockSiteSettings,
    ...raw,
    contact: { ...mockSiteSettings.contact, ...(raw.contact ?? {}) },
  };

  return (
    <section className="bg-[var(--bg-deep)] py-12 border-y border-[var(--border-warm)]/30">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal className="h-full">
            <Card className="flex h-full flex-col items-center gap-4 bg-[var(--bg-surface-alt)] px-6 py-8 text-center hover:bg-[var(--bg-surface-hover)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--whatsapp-green)]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
                WhatsApp Order
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Fastest way to place a fresh order.
              </p>
              <Button variant="whatsapp" className="mt-2 w-full">
                Send WhatsApp Message
              </Button>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <Card className="flex h-full flex-col items-center gap-4 bg-[var(--bg-surface-alt)] px-6 py-8 text-center hover:bg-[var(--bg-surface-hover)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--accent-gold)]">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Direct Call
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Speak with the team and place the order directly.
              </p>
              <Button variant="secondary" className="mt-2 w-full">
                {settings.contact.phone}
              </Button>
            </Card>
          </Reveal>

          <Reveal delay={0.2} className="h-full">
            <Card className="flex h-full flex-col items-center gap-4 bg-[var(--bg-surface-alt)] px-6 py-8 text-center hover:bg-[var(--bg-surface-hover)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--accent-orange)]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Foodpanda
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                For the nights when delivery wins.
              </p>
              <Button
                variant="outline"
                className="mt-2 w-full border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--text-on-gold)]"
              >
                Visit Foodpanda
              </Button>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
