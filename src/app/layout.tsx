import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Syne } from "next/font/google";
import type { ReactNode } from "react";
import { Footer, Navbar, Providers } from "@/components/layout";
import { PropertyQuickViewModal } from "@/components/listings";
import { Cursor } from "@/components/ui";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Display: architectural, wide-set grotesque for headlines and figures.
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

// Text: razor-sharp geometric sans with tabular numerals for pricing.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Accent: high-contrast serif italic for the editorial emphasis words.
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-svh">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-obsidian transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>

        <Providers>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />

          {/* Global overlays */}
          <PropertyQuickViewModal />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
