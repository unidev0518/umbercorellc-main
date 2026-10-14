import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

function getMetadataBase(): URL {
  const fallback = "http://localhost:3000";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return new URL(fallback);
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return new URL(fallback);
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "TravelGuards LLC | Drone Products & Accessories",
    template: "%s | TravelGuards LLC",
  },
  description:
    "TravelGuards LLC is a retail business focused on drone products, accessories, and related merchandise, offering product information, purchasing coordination, and customer assistance.",
  keywords: [
    "drone products",
    "drone accessories",
    "drone retail",
    "consumer drones",
    "drone product sales",
    "drone purchasing",
    "drone product sourcing",
  ],
  openGraph: {
    siteName: "TravelGuards LLC",
    type: "website",
    locale: "en_US",
    title: "TravelGuards LLC | Drone Products & Accessories",
    description:
      "Retail sales of drone products, accessories, and related merchandise, with purchasing help by inquiry.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelGuards LLC | Drone Products & Accessories",
    description:
      "A customer-focused retailer for drone products, accessories, and related merchandise.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TravelGuards LLC",
  description:
    "Retail and commerce business focused on drone products, accessories, and related merchandise.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "84 W Broadway, Ste 200",
    addressLocality: "Derry",
    addressRegion: "NH",
    postalCode: "03038",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
