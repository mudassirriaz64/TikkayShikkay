export interface FounderDetails {
  portraitUrl: string;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  eyebrow: string;
  title: string;
  bio: string;
  caption: string;
  mission: string;
  vision: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export const mockFounderDetails: FounderDetails = {
  portraitUrl: "/images/our_legacy.png",
  quote: "The grill doesn't lie. It reveals the soul of the spice. Once the charcoal catches, there are no shortcuts.",
  quoteAuthor: "Ahmed Raza",
  quoteRole: "Founder & Pitmaster",
  eyebrow: "The Visionary",
  title: "Meet Ahmed",
  bio: "Ahmed Raza started Tikkay Shikkay with a simple obsession: to preserve the authentic, raw heat of ancestral Pakistani street BBQ. What began as a single backyard grill in Ahmed's home has become a brand built on fire, family, and a refusal to cut corners.",
  caption: "Ahmed Raza, 2024",
  mission: "Serve honest, fire-grilled food that feels handcrafted from the first bite to the last, without compromise.",
  vision: "To be Pakistan's benchmark for fire-grilled flavor, where ancestral methods meet modern consistency.",
};

export const mockAboutStats: StatItem[] = [
  { value: "12", label: "Active Hubs" },
  { value: "850k+", label: "Tikkas Served" },
  { value: "42", label: "Secret Blends" },
  { value: "12", label: "Years of Fire" },
];
