import { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/logo/logo_transparent.png",
    shortcut: "/logo/logo_transparent.png",
    apple: "/logo/logo_transparent.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-[var(--accent-peach)] selection:text-[var(--text-on-peach)]"
      >
        {children}
      </body>
    </html>
  );
}
