import { MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { ContactCard } from "@/components/ui/contact/ContactCard";
import { OpeningHours } from "@/components/ui/contact/OpeningHours";
import { ContactMap } from "@/components/sections/contact/ContactMap";
import { Reveal } from "@/components/motion/Reveal";
import {
  ContactMethod,
  MapDetails,
  OpeningDay,
} from "@/types/contact";

const methodIcons = {
  whatsapp: <MessageCircle className="h-6 w-6" aria-hidden="true" />,
  phone: <Phone className="h-6 w-6" aria-hidden="true" />,
  "map-pin": <MapPin className="h-6 w-6" aria-hidden="true" />,
} as const;

interface ContactInfoProps {
  methods: ContactMethod[];
  openingHours: OpeningDay[];
  map: MapDetails;
}

export function ContactInfo({
  methods,
  openingHours,
  map,
}: ContactInfoProps) {
  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
          <div className="flex flex-col gap-5">
            {methods.map((method, index) => (
              <Reveal key={method.id} delay={index * 0.1} className="h-full">
                <ContactCard
                  title={method.title}
                  value={method.value}
                  helper={method.helper}
                  href={method.href}
                  accent={method.accent}
                  icon={methodIcons[method.icon]}
                />
              </Reveal>
            ))}
            <Reveal delay={methods.length * 0.1} className="h-full">
              <ContactCard accent="gold" icon={<Clock className="h-6 w-6" aria-hidden="true" />}>
                <OpeningHours days={openingHours} />
              </ContactCard>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="h-full">
            <ContactMap map={map} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
