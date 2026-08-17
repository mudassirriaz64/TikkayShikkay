import { CareersPageData } from "@/types";

export const mockCareersPageData: CareersPageData = {
  hero: {
    label: "Join the Fire",
    titleLead: "Build Your",
    titleAccent: "Career",
    description:
      "We're not just serving food — we're building a movement. Join the team behind the charcoal and grow with us.",
    imageUrl: "/images/hero_image.png",
  },
  jobs: [
    {
      id: "grill-master",
      title: "Grill Master",
      department: "Kitchen",
      type: "Full-time",
      location: "On-site",
      description:
        "Lead the charcoal grill station. Manage skewer prep, fire management, and plating with precision.",
      postedDate: "2026-08-10",
    },
    {
      id: "shift-supervisor",
      title: "Shift Supervisor",
      department: "Operations",
      type: "Full-time",
      location: "On-site",
      description:
        "Oversee daily operations during peak hours. Coordinate kitchen and front-of-house teams.",
      postedDate: "2026-08-08",
    },
    {
      id: "social-media",
      title: "Social Media Lead",
      department: "Marketing",
      type: "Full-time",
      location: "Hybrid",
      description:
        "Create content that captures the fire, the flavor, and the culture of Tikkay Shikkay across all platforms.",
      postedDate: "2026-08-05",
    },
    {
      id: "delivery-coord",
      title: "Delivery Coordinator",
      department: "Logistics",
      type: "Part-time",
      location: "On-site",
      description:
        "Manage delivery orders, coordinate riders, and ensure every order arrives hot and fresh.",
      postedDate: "2026-08-01",
    },
  ],
  culture: [
    {
      id: "fire-first",
      title: "Fire First",
      description:
        "We lead with passion. Every skewer, every plate, every interaction carries the heat of our commitment.",
      icon: "flame",
    },
    {
      id: "team-grill",
      title: "Team Grill",
      description:
        "We cook together. Collaboration isn't a buzzword — it's how we keep the fire burning strong.",
      icon: "users",
    },
    {
      id: "craft-matters",
      title: "Craft Matters",
      description:
        "We respect the process. From spice blends to charcoal timing, the details define the dish.",
      icon: "star",
    },
    {
      id: "heart-of-it",
      title: "Heart of It",
      description:
        "We care about our people. Growth, respect, and a seat at the table — that's the Tikkay way.",
      icon: "heart",
    },
  ],
  cta: {
    title: "Ready to Join the Fire?",
    description:
      "We're always looking for people who bring heat. Drop your details and we'll reach out when the right role opens up.",
    primaryLabel: "Apply Now",
    primaryHref: "mailto:careers@tikkayshikkay.com",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
    imageUrl: "/images/hero_image.png",
  },
};
