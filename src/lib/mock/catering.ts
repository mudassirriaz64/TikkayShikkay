import { CateringPageData } from "@/types";

export const mockCateringPageData: CateringPageData = {
  hero: {
    label: "Private & Corporate Events",
    titleLead: "Make Your Event",
    titleAccent: "Legendary",
    description:
      "From intimate family dinners to full-scale corporate gatherings — bring the live charcoal grill to your table.",
    imageUrl: "/images/hero_image.png",
  },
  eventTypes: [
    {
      id: "corporate",
      title: "Corporate Events",
      description:
        "Team lunches, client dinners, and office celebrations with a live grill station that impresses.",
      capacity: "20–200 guests",
      icon: "building",
    },
    {
      id: "weddings",
      title: "Weddings & Receptions",
      description:
        "Make your special day unforgettable with a bespoke BBQ menu and live cooking experience.",
      capacity: "50–500 guests",
      icon: "utensils",
    },
    {
      id: "private-parties",
      title: "Private Parties",
      description:
        "Birthday bashes, anniversary dinners, and intimate gatherings — we bring the fire to you.",
      capacity: "10–80 guests",
      icon: "cake",
    },
    {
      id: "festivals",
      title: "Festivals & Community",
      description:
        "Large-scale catering for community events, food festivals, and outdoor celebrations.",
      capacity: "100–1000+ guests",
      icon: "graduation",
    },
  ],
  menuComingSoon: true,
  cta: {
    title: "Let's Plan Your Event",
    description:
      "Tell us about your event and we'll craft a custom menu that brings the Tikkay Shikkay experience to your guests.",
    primaryLabel: "Request a Quote",
    primaryHref: "mailto:catering@tikkayshikkay.com",
    secondaryLabel: "Call Us",
    secondaryHref: "/contact",
    imageUrl: "/images/hero_image.png",
  },
};
