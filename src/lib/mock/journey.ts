import { JourneyPost } from "@/types";

export const mockJourneyPosts: JourneyPost[] = [
  {
    id: "journey-1",
    day_number: 1,
    title: "The Dream",
    content:
      "Ahmed brought the first grill to life after years of cooking for family and neighbors.",
    media_type: "Image",
    media_url: "https://picsum.photos/1000/700?random=41",
    created_at: new Date("2023-01-01").toISOString(),
  },
  {
    id: "journey-2",
    day_number: 14,
    title: "The Street Stall",
    content:
      "A single cart and a charcoal line. Word spread fast through the old city lanes.",
    media_type: "Image",
    media_url: "https://picsum.photos/1000/700?random=42",
    created_at: new Date("2023-01-14").toISOString(),
  },
  {
    id: "journey-3",
    day_number: 100,
    title: "Brand Identity",
    content:
      "The flame gained a name, a mark, and a loyal line that returned every night.",
    media_type: "Image",
    media_url: "https://picsum.photos/1000/700?random=43",
    created_at: new Date("2023-04-10").toISOString(),
  },
  {
    id: "journey-4",
    day_number: 365,
    title: "Going Viral",
    content:
      "One sold-out night turned a street kitchen into a story shared across the city.",
    media_type: "Image",
    media_url: "https://picsum.photos/1000/700?random=44",
    created_at: new Date("2023-12-31").toISOString(),
  },
];
