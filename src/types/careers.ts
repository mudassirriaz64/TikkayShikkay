export interface JobListing {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract";
  location: string;
  description: string;
  postedDate: string;
}

export interface CultureValue {
  id: string;
  title: string;
  description: string;
  icon: "flame" | "users" | "star" | "heart";
}

export interface CareersHeroData {
  label: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  imageUrl: string;
}

export interface CareersCtaData {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  imageUrl: string;
}

export interface CareersPageData {
  hero: CareersHeroData;
  jobs: JobListing[];
  culture: CultureValue[];
  cta: CareersCtaData;
}
