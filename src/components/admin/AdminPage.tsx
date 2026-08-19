"use client";

import { useEffect, useState } from "react";
import { AdminTabId } from "@/types/admin";
import { AdminShell } from "./AdminShell";
import { OverviewModule } from "./modules/OverviewModule";
import { SettingsModule } from "./modules/SettingsModule";
import { MenuModule } from "./modules/MenuModule";
import { ReviewsModule } from "./modules/ReviewsModule";
import { GalleryModule, GalleryTabKey } from "./modules/GalleryModule";
import { SocialModule } from "./modules/SocialModule";
import { AboutModule } from "./modules/AboutModule";
import { ContactModule } from "./modules/ContactModule";
import { MessagesModule } from "./modules/MessagesModule";
import { OrdersModule } from "./modules/OrdersModule";
import { CustomersModule } from "./modules/CustomersModule";
import { CateringModule } from "./modules/CateringModule";
import { BlogModule } from "./modules/BlogModule";
import { CareersModule } from "./modules/CareersModule";
import { FranchiseModule } from "./modules/FranchiseModule";
import { contactService } from "@/lib/api";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("dashboard");
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    contactService
      .getSubmissions()
      .then((subs) => {
        const unread = (subs || []).filter((s) => !s.is_read).length;
        setUnreadMessages(unread);
      })
      .catch(() => {});
  }, []);

  // Determine Gallery subtab if navigating directly from sidebar
  const gallerySubTab: GalleryTabKey =
    activeTab === "gallery-customers"
      ? "customers"
      : activeTab === "gallery-kitchen"
      ? "kitchen"
      : activeTab === "gallery-journey"
      ? "journey"
      : "media";

  return (
    <AdminShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      unreadMessagesCount={unreadMessages}
    >
      {activeTab === "dashboard" && <OverviewModule onNavigate={setActiveTab} />}
      {activeTab === "settings" && <SettingsModule />}
      {activeTab === "menu" && <MenuModule />}
      {activeTab === "reviews" && <ReviewsModule />}
      {(activeTab === "gallery" ||
        activeTab === "gallery-customers" ||
        activeTab === "gallery-kitchen" ||
        activeTab === "gallery-journey" ||
        activeTab === "gallery-media") && (
        <GalleryModule
          key={gallerySubTab}
          initialSubTab={gallerySubTab}
          onSubTabChange={(sub) => setActiveTab(`gallery-${sub}` as AdminTabId)}
        />
      )}
      {activeTab === "social" && <SocialModule />}
      {activeTab === "about" && <AboutModule />}
      {activeTab === "contact" && <ContactModule />}
      {activeTab === "contact-messages" && (
        <MessagesModule onUnreadCountChange={setUnreadMessages} />
      )}
      {activeTab === "orders" && <OrdersModule />}
      {activeTab === "customers" && <CustomersModule />}
      {activeTab === "catering" && <CateringModule />}
      {activeTab === "blog" && <BlogModule />}
      {activeTab === "careers" && <CareersModule />}
      {activeTab === "franchise" && <FranchiseModule />}
    </AdminShell>
  );
}
