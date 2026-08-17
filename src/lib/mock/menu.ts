import {
  BotiData,
  FeaturedItem,
  MenuCategory,
  MenuItem,
  MenuTab,
  PlatterData,
  SideItem,
} from "@/types";

export const mockMenuCategories: MenuCategory[] = [
  { id: "cat-1", name: "Tikka", slug: "tikka", display_order: 1 },
  { id: "cat-2", name: "Boti", slug: "boti", display_order: 2 },
  { id: "cat-3", name: "Platters", slug: "platters", display_order: 3 },
  { id: "cat-4", name: "Sides", slug: "sides", display_order: 4 },
  { id: "cat-5", name: "Drinks", slug: "drinks", display_order: 5 },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "menu-1",
    category_id: "cat-1",
    title: "Reshmi Boti",
    slug: "classic-chicken-tikka",
    description:
      "Velvety smooth chicken morsels in a rich, cream-kissed marinade.",
    price: 850,
    spice_level: "Mild",
    is_bestseller: true,
    is_available: true,
    image_url: "/images/menu/reshmi-tikka.jpg",
  },
  {
    id: "menu-2",
    category_id: "cat-2",
    title: "Bharli Tikka",
    slug: "beef-behari-boti",
    description:
      "Smoky, charred, and lacquered with our signature spice blend.",
    price: 1320,
    spice_level: "Hot",
    is_bestseller: true,
    is_available: true,
    image_url: "/images/menu/bharli-boti.jpg",
  },
  {
    id: "menu-3",
    category_id: "cat-3",
    title: "The Grand Feast",
    slug: "the-shikkay-platter",
    description:
      "A crowd-pleasing spread built for generous tables and hungry nights.",
    price: 4500,
    spice_level: "Medium",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/platter-biryani.jpg",
  },
  {
    id: "menu-4",
    category_id: "cat-4",
    title: "Nuktaan Chops",
    slug: "nuktaan-chops",
    description: "Lamb chops finished over coal for a deep, savory edge.",
    price: 1830,
    spice_level: "Extra Spicy",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/grill-mix.jpg",
  },
];

export const mockMenuTabs: MenuTab[] = [
  { id: "tab-tikka", label: "Tikka", sectionId: "tikka" },
  { id: "tab-boti", label: "Boti", sectionId: "boti" },
  { id: "tab-platters", label: "Platters", sectionId: "platters" },
  { id: "tab-sides", label: "Sides & Sauces", sectionId: "sides" },
];

export const mockFeaturedItems: FeaturedItem[] = [
  {
    id: "featured-1",
    category_id: "cat-1",
    title: "Reshmi Tikka",
    slug: "reshmi-tikka",
    description:
      "Silk-soft chicken morsels in a cream-kissed cashew marinade, kissed by charcoal.",
    price: 850,
    spice_level: "Mild",
    is_bestseller: true,
    is_available: true,
    image_url: "/images/menu/reshmi-tikka.jpg",
    ribbon: "Legendary",
    tags: ["Silk Marinade", "Char-Grilled"],
  },
  {
    id: "featured-2",
    category_id: "cat-1",
    title: "Malai Tikka",
    slug: "malai-tikka",
    description:
      "Creamy malai glaze over tender chicken, finished with green cardamom.",
    price: 780,
    spice_level: "Medium",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/malai-tikka.jpg",
    tags: ["Cream Glaze"],
  },
  {
    id: "featured-3",
    category_id: "cat-1",
    title: "Green Chili Tikka",
    slug: "green-chili-tikka",
    description:
      "Blistered chicken in a fiery green-chili paste — for those who respect the heat.",
    price: 720,
    spice_level: "Hot",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/green-chili-tikka.jpg",
    ribbon: "Chef's Choice",
    tags: ["House Blend", "High Heat"],
  },
];

export const mockPlatterData: PlatterData = {
  baseLabel: "Platter Base",
  basePrice: 500,
  imageUrl: "/images/menu/platter-biryani.jpg",
  meats: [
    { id: "meat-chicken", name: "Chicken Tikka", price: 850 },
    { id: "meat-seekh", name: "Beef Seekh Kabab", price: 980 },
    { id: "meat-lamb", name: "Lamb Chops", price: 1450 },
    { id: "meat-fish", name: "Fish Tikka", price: 1100 },
  ],
  sides: [
    { id: "side-naan", name: "Garlic Naan", price: 150 },
    { id: "side-pulao", name: "Pulao Rice", price: 280 },
    { id: "side-fries", name: "Masala Fries", price: 350 },
  ],
};

export const mockBotiData: BotiData = {
  featured: {
    id: "boti-featured",
    category_id: "cat-2",
    title: "Bharli Boti",
    slug: "bharli-boti",
    description:
      "Beef cubes lacquered in our signature spice blend, charred until smoky and jewel-red.",
    price: 1320,
    spice_level: "Hot",
    is_bestseller: true,
    is_available: true,
    image_url: "/images/menu/bharli-boti.jpg",
    ribbon: "Legendary",
  },
  compact: [
    {
      id: "boti-1",
      category_id: "cat-2",
      title: "Malai Boti",
      slug: "malai-boti",
      description: "Butter-soft beef boti in a rich cream and yogurt marinade.",
      price: 980,
      spice_level: "Medium",
      is_bestseller: false,
      is_available: true,
      image_url: "/images/menu/malai-boti.jpg",
    },
    {
      id: "boti-2",
      category_id: "cat-2",
      title: "Kaleji Boti",
      slug: "kaleji-boti",
      description:
        "Charcoal-seared liver boti with onion, green chili, and ghee.",
      price: 890,
      spice_level: "Extra Spicy",
      is_bestseller: false,
      is_available: true,
      image_url: "/images/menu/kaleji-boti.jpg",
    },
  ],
};

export const mockSideItems: SideItem[] = [
  {
    id: "side-1",
    category_id: "cat-4",
    title: "Garlic Butter Naan",
    slug: "garlic-butter-naan",
    description: "Charred naan brushed hot with garlic butter.",
    price: 150,
    spice_level: "Mild",
    is_bestseller: true,
    is_available: true,
    image_url: "/images/menu/garlic-naan.jpg",
    isSignature: true,
  },
  {
    id: "side-2",
    category_id: "cat-4",
    title: "Masala Fries",
    slug: "masala-fries",
    description: "Crisp fries dusted with our fiery street masala.",
    price: 350,
    spice_level: "Hot",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/masala-fries.jpg",
  },
  {
    id: "side-3",
    category_id: "cat-4",
    title: "Kachumber Salad",
    slug: "kachumber-salad",
    description: "Tomato, onion, and cucumber tossed in citrus and black salt.",
    price: 220,
    spice_level: "Mild",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/kachumber-salad.jpg",
  },
  {
    id: "side-4",
    category_id: "cat-4",
    title: "Dip Trilogy",
    slug: "dip-trilogy",
    description: "Green chili chutney, tamarind, and raita — the essential trio.",
    price: 400,
    spice_level: "Medium",
    is_bestseller: false,
    is_available: true,
    image_url: "/images/menu/dip-trilogy.jpg",
  },
];
