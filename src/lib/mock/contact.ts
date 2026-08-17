import { ContactPageData } from "@/types/contact";

export const mockContactPageData: ContactPageData = {
  hero: {
    label: "Connections & Heat",
    titleLead: "Get In",
    titleAccent: "Touch.",
    availability: "Available 12PM — 11PM",
  },
  methods: [
    {
      id: "whatsapp",
      icon: "whatsapp",
      accent: "whatsapp",
      title: "WhatsApp",
      value: "+1 234 567 890",
      helper: "Fastest response — chat with the grill team directly.",
      href: "https://wa.me/1234567890",
    },
    {
      id: "phone",
      icon: "phone",
      accent: "orange",
      title: "Phone",
      value: "+1 234 567 890",
      helper: "Call us for reservations, takeaway & special requests.",
      href: "tel:+1234567890",
    },
    {
      id: "address",
      icon: "map-pin",
      accent: "peach",
      title: "Restaurant Address",
      value: "123 Spice Street, Food District",
      helper: "Find us in the heart of the food district.",
      href: "https://maps.google.com/?q=123+Spice+Street+Food+District",
    },
  ],
  openingHours: [
    { id: "mon-thu", day: "Monday — Thursday", hours: "12PM — 11PM" },
    { id: "fri", day: "Friday", hours: "12PM — 12AM" },
    { id: "sat", day: "Saturday", hours: "1PM — 12AM" },
    { id: "sun", day: "Sunday", hours: "1PM — 11PM" },
  ],
  map: {
    restaurantName: "Tikkay Shikkay",
    description:
      "Fire-grilled BBQ hub in the food district. Look for the smoke, follow the smell.",
    address: "123 Spice Street, Food District",
    mapsUrl: "https://maps.google.com/?q=123+Spice+Street+Food+District",
  },
  form: {
    heading: "Send us a",
    accent: "Message",
    description:
      "Questions, specials, private dining — drop us a line and the crew will get back to you.",
    responseTime: "Average response under 2 hours",
  },
  catering: {
    eyebrow: "Private & Corporate Events",
    titleLead: "Make Your Event",
    titleAccent: "Legendary",
    description:
      "From intimate family dinners to full-scale corporate gatherings — bring the live charcoal grill to your table.",
    menuLabel: "Download Catering Menu",
    quoteLabel: "Request Quote",
    imageUrl: "/images/hero_image.png",
  },
  franchise: {
    eyebrow: "Franchise",
    title: "Join",
    titleAccent: "the Flame.",
    description:
      "Own the heat. We're opening Tikkay Shikkay kitchens with partners who respect the craft and the charcoal.",
    placeholder: "Your email address",
    notifyLabel: "Notify",
    portalLabel: "Franchise Portal — Coming Soon",
  },
};
