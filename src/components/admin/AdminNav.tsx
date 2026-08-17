import {
  Images,
  LayoutDashboard,
  Phone,
  Settings,
  ShoppingBag,
  Star,
  UserRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { AdminTabId } from "@/types/admin";

export interface AdminTabItem {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_TABS: AdminTabItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Site Settings", icon: Settings },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "about", label: "About", icon: UserRound },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];
