import {
  CustomerStory,
  GalleryCategoryFilter,
  GalleryCtaData,
  GalleryHeroData,
  GalleryImage,
  GoogleReview,
  InstagramPost,
  JourneyMilestone,
  KitchenProcess,
  VideoTestimonial,
} from "@/types";

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  tag: string;
}

export const mockGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    url: "/images/gallery/kitchen-marinade.jpg",
    alt: "Hand marination with authentic secret spices",
    tag: "Marination",
  },
  {
    id: "gal-2",
    url: "/images/gallery/kitchen-spices.jpg",
    alt: "Hand-grinding fresh spices every morning",
    tag: "Prep Work",
  },
  {
    id: "gal-3",
    url: "/images/gallery/kitchen-grilling.jpg",
    alt: "Grilling over red-hot natural charcoal skewers",
    tag: "The Fire",
  },
];

export const mockGalleryHero: GalleryHeroData = {
  label: "Our Memories",
  titleLead: "Every Picture",
  titleMid: "Tells A",
  titleAccent: "Story.",
  description:
    "Every meal, every guest and every flame leaves a memory worth sharing. Step inside our journey - from the first ember to the latest midnight order.",
  imageUrl: "/images/gallery/hero-fire.jpg",
};

export const mockGalleryTabs = [
  {
    id: "customers" as const,
    sectionId: "customers",
    label: "Customer Reviews",
    shortLabel: "Reviews",
    title: "Customer Reviews",
    description: "Hear the voices that fill our tables",
    icon: "users" as const,
  },
  {
    id: "behind-scenes" as const,
    sectionId: "behind-scenes",
    label: "Behind The Scenes",
    shortLabel: "Kitchen",
    title: "Behind The Scenes",
    description: "How fire, spice and patience work",
    icon: "chef-hat" as const,
  },
  {
    id: "journey" as const,
    sectionId: "journey",
    label: "Building Pakistan's First BBQ Brand",
    shortLabel: "Journey",
    title: "Our Journey",
    description: "The story of fire from day one",
    icon: "flame" as const,
  },
  {
    id: "gallery" as const,
    sectionId: "gallery",
    label: "Photo Gallery",
    shortLabel: "Gallery",
    title: "Photo Gallery",
    description: "The moments we get to keep",
    icon: "camera" as const,
  },
];

export const mockVideoTestimonials: VideoTestimonial[] = [
  {
    id: "video-1",
    customer_name: "Hina R. · Lahore",
    title: "The platter that broke the table",
    duration: "0:42",
    thumbnail: "/images/reviews/video-1.jpg",
    source: "Instagram",
  },
  {
    id: "video-2",
    customer_name: "Fahad M. · Islamabad",
    title: "Boti fresh off the coals",
    duration: "1:05",
    thumbnail: "/images/reviews/video-2.jpg",
    source: "TikTok",
  },
  {
    id: "video-3",
    customer_name: "Sana K. · Karachi",
    title: "Our office order, live from the grill",
    duration: "0:58",
    thumbnail: "/images/reviews/video-3.jpg",
    source: "Instagram",
  },
  {
    id: "video-4",
    customer_name: "Rehan A. · Faisalabad",
    title: "Tastes exactly like home",
    duration: "0:36",
    thumbnail: "/images/reviews/video-4.jpg",
    source: "Facebook",
  },
];

export const mockInstagramPosts: InstagramPost[] = [
  {
    id: "insta-1",
    imageUrl: "/images/reviews/gallery-2.jpg",
    caption: "Sunday, family, and one very full platter.",
    tag: "@bakar.family",
    likes: 1240,
    comments: 86,
  },
  {
    id: "insta-2",
    imageUrl: "/images/reviews/gallery-3.jpg",
    caption: "That post-biryani group photo hits different.",
    tag: "@lahoreeats",
    likes: 986,
    comments: 42,
  },
  {
    id: "insta-3",
    imageUrl: "/images/gallery/gallery-food-1.jpg",
    caption: "The biryani that breaks meetings.",
    tag: "@foodie.fatima",
    likes: 2143,
    comments: 120,
  },
  {
    id: "insta-4",
    imageUrl: "/images/gallery/gallery-grill-1.jpg",
    caption: "Charcoal hours begin at 4am.",
    tag: "@grillmaster.tikkay",
    likes: 1782,
    comments: 67,
  },
  {
    id: "insta-5",
    imageUrl: "/images/gallery/gallery-customer-1.jpg",
    caption: "New friends, old recipes.",
    tag: "@karachistory",
    likes: 734,
    comments: 29,
  },
  {
    id: "insta-6",
    imageUrl: "/images/reviews/gallery-6.jpg",
    caption: "Terrace season is officially open.",
    tag: "@nights.under.sky",
    likes: 1654,
    comments: 91,
  },
];

export const mockGoogleReviews: GoogleReview[] = [
  {
    id: "grev-1",
    customer_name: "M. Ibrahim",
    rating: 5,
    visit_date: "April 2026",
    review_text:
      "It took one visit to convert my whole office. The bharli boti is the best in Lahore, and the staff remembers your order from last time.",
    verified: true,
    source: "Google",
  },
  {
    id: "grev-2",
    customer_name: "Khadija S.",
    rating: 5,
    visit_date: "March 2026",
    review_text:
      "Booked a birthday corner table and they handled candles, cake and fifteen guests without a single hiccup. Food arrived hot and fast.",
    verified: true,
    source: "Google",
  },
  {
    id: "grev-3",
    customer_name: "Raza Haider",
    rating: 4,
    visit_date: "February 2026",
    review_text:
      "Consistent, smoky and generous. Green chili tikka is dangerously good. Just wish weekends were a little less packed.",
    verified: true,
    source: "Google",
  },
  {
    id: "grev-4",
    customer_name: "Aiman Malik",
    rating: 5,
    visit_date: "January 2026",
    review_text:
      "The kachumber is fresh, the naan is never stale, and the reshmi tikka melts. We drive forty minutes for dinner now.",
    verified: true,
    source: "Google",
  },
];

export const mockCustomerStories: CustomerStory[] = [
  {
    id: "story-1",
    customer_name: "Rashid & The Weekday Ritual",
    imageUrl: "/images/gallery/customer-1.jpg",
    favorite_meal: "Bharli Boti",
    years_visiting: 4,
    visits: 68,
    quote:
      "Every Tuesday at eight, the same corner table, the same boti. Four years and the charcoal still surprises me.",
    timeline: [
      { year: "2022", label: "First Tuesday", note: "Walked in alone, left with a regular table." },
      { year: "2023", label: "The Family Joined", note: "Brought the wife and kids; the boti sold them instantly." },
      { year: "2024", label: "Order #500", note: "The staff surprised him with a free dessert." },
      { year: "2025", label: "The Corner Table", note: "Now reserved every Tuesday under his name." },
    ],
  },
  {
    id: "story-2",
    customer_name: "Amna's Sunday Table",
    imageUrl: "/images/gallery/customer-2.jpg",
    favorite_meal: "Malai Boti",
    years_visiting: 3,
    visits: 41,
    quote:
      "Sundays mean one thing in our house now: malai boti and garlic naan, served hot while the stories get loud.",
    timeline: [
      { year: "2023", label: "First Sunday", note: "Came for the hype, stayed for the smoke." },
      { year: "2024", label: "The Celebration", note: "Anniversary dinner with the same order as the first date." },
      { year: "2025", label: "Family Tradition", note: "Three generations, one table, every Sunday." },
    ],
  },
  {
    id: "story-3",
    customer_name: "The Malik Family Tradition",
    imageUrl: "/images/reviews/featured-customer.jpg",
    favorite_meal: "The Grand Feast",
    years_visiting: 5,
    visits: 96,
    quote:
      "From our first Eid to our youngest's graduation, Tikkay Shikkay has been the table we keep coming back to.",
    timeline: [
      { year: "2021", label: "Eid Day One", note: "The feast fed twelve of us and converted the whole family." },
      { year: "2022", label: "The Second Branch", note: "Followed them to the new branch the week it opened." },
      { year: "2024", label: "The Graduation", note: "Forty guests, one grand platter, zero leftovers." },
      { year: "2025", label: "Five Years Strong", note: "Ninety-six visits and counting." },
    ],
  },
];

export const mockKitchenProcesses: KitchenProcess[] = [
  {
    id: "kitchen-1",
    step: 1,
    title: "Grinding Fresh Spices",
    imageUrl: "/images/gallery/kitchen-spices.jpg",
    story:
      "Every morning the mortar starts before the sun. Cumin, coriander, green cardamom and black pepper are pounded by hand in small batches so nothing sits long enough to go flat.",
    fact: "We grind in 2kg batches - never more than one service can use.",
    time: "20 min",
  },
  {
    id: "kitchen-2",
    step: 2,
    title: "The 24 Hour Marinade",
    imageUrl: "/images/gallery/kitchen-marinade.jpg",
    story:
      "Yogurt, raw papaya, ginger, garlic and a family recipe of secret masala. Every cut goes in for a full day - never rushed, never skipped.",
    fact: "The marinade is pressed by hand for three minutes to work the spices into the fibres.",
    time: "24 hrs",
  },
  {
    id: "kitchen-3",
    step: 3,
    title: "Preparing The Secret Sauces",
    imageUrl: "/images/menu/dip-trilogy.jpg",
    story:
      "Three sauces leave our kitchen every morning: a mint-ginger chutney, a smoked tomato reduction and a house 'secret' that we still won't name.",
    fact: "The unnamed sauce is made from eight ingredients - only two people know the list.",
    time: "45 min",
  },
  {
    id: "kitchen-4",
    step: 4,
    title: "Lighting Natural Charcoal",
    imageUrl: "/images/gallery/kitchen-charcoal.jpg",
    story:
      "No gas, no shortcuts. Natural charcoal is lit in iron chimneys until it glows white-hot, then knocked down onto the grill to find its even bed of fire.",
    fact: "A full bed takes 30 minutes to reach the right heat - the grill is never rushed.",
    time: "30 min",
  },
  {
    id: "kitchen-5",
    step: 5,
    title: "The Traditional Grill",
    imageUrl: "/images/gallery/kitchen-grilling.jpg",
    story:
      "Skewers are turned by hand over the coals - baste, turn, rest, repeat. The fat drops, the fire flares, and that's the sound of dinner happening.",
    fact: "Every skewer is turned at least twelve times during a single cook.",
    time: "40 min",
  },
];

export const mockJourneyMilestones: JourneyMilestone[] = [
  {
    id: "mile-1",
    year: "2019",
    title: "Day One: The First Flame",
    imageUrl: "/images/gallery/kitchen-charcoal.jpg",
    story:
      "Before the doors, before the sign, there was one charcoal chimney and one impossible idea - that a family grill could become a brand.",
    badge: "Day 1",
    type: "milestone",
  },
  {
    id: "mile-2",
    year: "2019",
    title: "Opening Day",
    imageUrl: "/images/gallery/journey-opening.jpg",
    story:
      "We opened with six tables, one grill and a queue that wrapped past the corner. The grill ran out by 9pm.",
    badge: "Opening Day",
    type: "milestone",
  },
  {
    id: "mile-3",
    year: "2019",
    title: "The First Customer",
    imageUrl: "/images/gallery/customer-3.jpg",
    story:
      "Our first guest ordered bharli boti, ate it slowly, and asked for the recipe. We said 'come back a hundred times and maybe.'",
    badge: "Guest #1",
    type: "milestone",
  },
  {
    id: "mile-4",
    year: "2020",
    title: "The Hundredth Plate",
    imageUrl: "/images/gallery/gallery-food-2.jpg",
    story:
      "One hundred orders in a quiet month felt like a stadium. The kitchen team celebrated with a plate of the very thing they had been cooking all day.",
    badge: "100 Orders",
    type: "milestone",
    stat: { value: 100, suffix: "", label: "Orders" },
  },
  {
    id: "mile-5",
    year: "2020",
    title: "The Lockdown Year",
    imageUrl: "/images/gallery/journey-crowd.jpg",
    story:
      "Dining rooms emptied overnight. We packed the charcoal in boxes, taught our cooks delivery portions, and kept the flame alive from the parking lot.",
    badge: "Challenge",
    type: "challenge",
  },
  {
    id: "mile-6",
    year: "2021",
    title: "1,000 Orders",
    imageUrl: "/images/gallery/gallery-food-1.jpg",
    story:
      "The thousandth order went to a hospital ward at midnight. We still remember the note: 'From the staff that never sleeps - thank you.'",
    badge: "1,000 Orders",
    type: "milestone",
    stat: { value: 1000, suffix: "", label: "Orders" },
  },
  {
    id: "mile-7",
    year: "2022",
    title: "The Second Branch",
    imageUrl: "/images/gallery/journey-branch.jpg",
    story:
      "A second address, a second grill, and the same 24-hour marinade. This time the queue knew what it was waiting for.",
    badge: "Branch #2",
    type: "milestone",
  },
  {
    id: "mile-8",
    year: "2022",
    title: "Charcoal Knows Patience",
    imageUrl: "/images/gallery/kitchen-spices.jpg",
    story:
      "We learned the hard way that speeding up the fire speeds up nothing. The lesson: the grill decides the pace, not the clock.",
    badge: "Lesson",
    type: "lesson",
  },
  {
    id: "mile-9",
    year: "2023",
    title: "City Recognition",
    imageUrl: "/images/gallery/journey-award.jpg",
    story:
      "The first award was a surprise - a small plaque and a loud night of clapping from a kitchen that usually only hears the grill.",
    badge: "Award",
    type: "achievement",
  },
  {
    id: "mile-10",
    year: "2024",
    title: "In The Press",
    imageUrl: "/images/gallery/journey-media.jpg",
    story:
      "Newspapers and food shows started calling us 'Pakistan's first real BBQ brand.' We mostly stayed quiet and kept turning skewers.",
    badge: "Press",
    type: "achievement",
  },
  {
    id: "mile-11",
    year: "2025",
    title: "The Road Ahead",
    imageUrl: "/images/gallery/journey-future.jpg",
    story:
      "Next is a bigger flame, a younger team, and a goal to put Pakistani BBQ on a map much larger than ours.",
    badge: "Future",
    type: "future",
  },
];

export const mockGalleryCategories: GalleryCategoryFilter[] = [
  { id: "all", label: "All Moments" },
  { id: "food", label: "Food Photography" },
  { id: "grill", label: "Grill Photography" },
  { id: "customers", label: "Customer Moments" },
  { id: "atmosphere", label: "Restaurant Atmosphere" },
];

export const mockGalleryImages: GalleryImage[] = [
  {
    id: "img-1",
    imageUrl: "/images/gallery/gallery-food-1.jpg",
    caption: "Charcoal Biryani Nights",
    location: "Dastarkhwan, Lahore",
    category: "food",
    alt: "Charcoal-cooked biryani plate",
  },
  {
    id: "img-2",
    imageUrl: "/images/gallery/gallery-food-2.jpg",
    caption: "The Grand Platter",
    location: "Gulberg, Lahore",
    category: "food",
    alt: "Grand mixed grill platter",
  },
  {
    id: "img-3",
    imageUrl: "/images/gallery/gallery-food-3.jpg",
    caption: "Seared To Order",
    location: "Clifton, Karachi",
    category: "food",
    alt: "Plated grilled dish seared to order",
  },
  {
    id: "img-4",
    imageUrl: "/images/menu/reshmi-tikka.jpg",
    caption: "Silk On Skewers",
    location: "Blue Area, Islamabad",
    category: "food",
    alt: "Reshmi tikka skewers",
  },
  {
    id: "img-5",
    imageUrl: "/images/menu/garlic-naan.jpg",
    caption: "Fresh From The Tandoor",
    location: "Dastarkhwan, Lahore",
    category: "food",
    alt: "Garlic butter naan",
  },
  {
    id: "img-6",
    imageUrl: "/images/gallery/gallery-grill-1.jpg",
    caption: "Chops Over The Coals",
    location: "Gulberg, Lahore",
    category: "grill",
    alt: "Chops grilling over the coals",
  },
  {
    id: "img-7",
    imageUrl: "/images/gallery/kitchen-grilling.jpg",
    caption: "Skewers At Dusk",
    location: "Saddar, Karachi",
    category: "grill",
    alt: "Skewers grilling at dusk",
  },
  {
    id: "img-8",
    imageUrl: "/images/reviews/gallery-5.jpg",
    caption: "Ember & Iron",
    location: "Bahria Town, Rawalpindi",
    category: "grill",
    alt: "Steak searing on the grill",
  },
  {
    id: "img-9",
    imageUrl: "/images/menu/grill-mix.jpg",
    caption: "The Grill Mix",
    location: "Blue Area, Islamabad",
    category: "grill",
    alt: "Mixed grill selection",
  },
  {
    id: "img-10",
    imageUrl: "/images/gallery/gallery-customer-1.jpg",
    caption: "Friends At First Light",
    location: "Clifton, Karachi",
    category: "customers",
    alt: "Friends sharing breakfast",
  },
  {
    id: "img-11",
    imageUrl: "/images/gallery/customer-3.jpg",
    caption: "A Birthday To Remember",
    location: "Gulberg, Lahore",
    category: "customers",
    alt: "Birthday dinner at the table",
  },
  {
    id: "img-12",
    imageUrl: "/images/reviews/gallery-2.jpg",
    caption: "Dinner For Six",
    location: "Dastarkhwan, Lahore",
    category: "customers",
    alt: "Family dinner table",
  },
  {
    id: "img-13",
    imageUrl: "/images/reviews/gallery-3.jpg",
    caption: "Laughter Over Tikkas",
    location: "Saddar, Karachi",
    category: "customers",
    alt: "Friends celebrating over tikkas",
  },
  {
    id: "img-14",
    imageUrl: "/images/reviews/gallery-4.jpg",
    caption: "Candles & Coal",
    location: "Bahria Town, Rawalpindi",
    category: "customers",
    alt: "Birthday candles at the table",
  },
  {
    id: "img-15",
    imageUrl: "/images/gallery/gallery-atmosphere-1.jpg",
    caption: "Warm Light, Warm Table",
    location: "Clifton, Karachi",
    category: "atmosphere",
    alt: "Warm restaurant interior lighting",
  },
  {
    id: "img-16",
    imageUrl: "/images/gallery/journey-crowd.jpg",
    caption: "The Quiet Hour",
    location: "Gulberg, Lahore",
    category: "atmosphere",
    alt: "Quiet hour in the dining room",
  },
  {
    id: "img-17",
    imageUrl: "/images/reviews/gallery-1.jpg",
    caption: "The Room That Hums",
    location: "Dastarkhwan, Lahore",
    category: "atmosphere",
    alt: "Restaurant interior full of life",
  },
  {
    id: "img-18",
    imageUrl: "/images/reviews/gallery-6.jpg",
    caption: "Evenings Under The Sky",
    location: "Blue Area, Islamabad",
    category: "atmosphere",
    alt: "Outdoor terrace dining at night",
  },
];

export const mockGalleryCta: GalleryCtaData = {
  title: "Hungry For Your Own Chapter?",
  description:
    "Come write your story at our table. The charcoal is lit, the sauces are ready, and the camera is always welcome.",
  primaryLabel: "Reserve A Table",
  primaryHref: "/contact",
  secondaryLabel: "Explore The Menu",
  secondaryHref: "/menu",
  imageUrl: "/images/reviews/cta-fire.jpg",
};
