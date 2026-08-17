"use client";

import { useState } from "react";
import { AdminTabId } from "@/types/admin";
import { AdminShell } from "./AdminShell";
import { OverviewModule } from "./modules/OverviewModule";
import { SettingsModule } from "./modules/SettingsModule";
import { MenuModule } from "./modules/MenuModule";
import { ReviewsModule } from "./modules/ReviewsModule";
import { GalleryModule } from "./modules/GalleryModule";
import { AboutModule } from "./modules/AboutModule";
import { ContactModule } from "./modules/ContactModule";
import { OrdersModule } from "./modules/OrdersModule";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("dashboard");

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <OverviewModule onNavigate={setActiveTab} />}
      {activeTab === "settings" && <SettingsModule />}
      {activeTab === "menu" && <MenuModule />}
      {activeTab === "reviews" && <ReviewsModule />}
      {activeTab === "gallery" && <GalleryModule />}
      {activeTab === "about" && <AboutModule />}
      {activeTab === "contact" && <ContactModule />}
      {activeTab === "orders" && <OrdersModule />}
    </AdminShell>
  );
}
