import { getContactPageData } from "@/lib/data/getContact";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactInfo } from "@/components/sections/contact/ContactInfo";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { CateringCTA } from "@/components/sections/contact/CateringCTA";
import { FranchiseCTA } from "@/components/sections/contact/FranchiseCTA";

export const metadata = {
  title: "Contact - Tikkay Shikkay",
  description:
    "Reach the Tikkay Shikkay team — WhatsApp, phone, walk-ins, catering and franchise enquiries.",
};

export default async function ContactPage() {
  const data = await getContactPageData();

  return (
    <div className="bg-[var(--bg-base)]">
      <ContactHero data={data.hero} />
      <ContactInfo
        methods={data.methods}
        openingHours={data.openingHours}
        map={data.map}
      />
      <ContactForm data={data.form} />
      <CateringCTA data={data.catering} />
      <FranchiseCTA data={data.franchise} />
    </div>
  );
}
