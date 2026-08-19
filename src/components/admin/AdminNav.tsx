import {
  BookOpen,
  Briefcase,
  Building2,
  ChefHat,
  Compass,
  Film,
  Globe,
  Images,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Settings,
  ShoppingBag,
  Star,
  UserRound,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { AdminTabId } from "@/types/admin";

export interface AdminSubTabItem {
  id: AdminTabId;
  label: string;
  icon?: LucideIcon;
}

export interface AdminTabItem {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
  children?: AdminSubTabItem[];
}

export const ADMIN_TABS: AdminTabItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Hero & Settings", icon: Settings },
  { id: "menu", label: "Menu Items", icon: ChefHat },
  { id: "reviews", label: "Reviews", icon: Star },
  {
    id: "gallery",
    label: "Media & Moments",
    icon: Images,
    children: [
      { id: "gallery-media", label: "All Media", icon: Images },
      { id: "gallery-customers", label: "Customers", icon: UserRound },
      { id: "gallery-kitchen", label: "Kitchen", icon: Film },
      { id: "gallery-journey", label: "Our Journey", icon: Compass },
    ],
  },
  { id: "social", label: "Social Feeds", icon: Globe },
  { id: "about", label: "About / Founder", icon: UserRound },
  { id: "contact", label: "Contact Info", icon: Phone },
  { id: "contact-messages", label: "Contact Messages", icon: MessageSquare },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "customers", label: "Customers & Loyalty", icon: Users },
  { id: "catering", label: "Catering & Events", icon: UtensilsCrossed },
  { id: "blog", label: "Blog & SEO Stories", icon: BookOpen },
  { id: "careers", label: "Careers & Hiring", icon: Briefcase },
  { id: "franchise", label: "Franchise & Expansion", icon: Building2 },
];
