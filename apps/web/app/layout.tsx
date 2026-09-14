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
    default: "UmberCore | Software, Data, Cloud & AI Consulting",
    template: "%s | UmberCore",
  },
  description:
    "UmberCore provides software development consulting, AI-assisted engineering, data processing, cloud hosting, backend development, integration, and technology delivery services.",
  keywords: [
    "software development consulting",
    "AI software development",
    "data processing services",
    "cloud hosting services",
    "application hosting",
    "backend development",
    "data integration",
    "technology consulting",
    "software engineering consulting",
  ],
  openGraph: {
    siteName: "UmberCore",
    type: "website",
    locale: "en_US",
    title: "UmberCore | Software, Data, Cloud & AI Consulting",
    description:
      "Software and technology consulting — design, build, integrate, host, and operate modern systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UmberCore | Software, Data, Cloud & AI Consulting",
    description:
      "Software development, data processing, cloud hosting, and AI-assisted engineering consulting.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UmberCore",
  description:
    "Software and technology consulting company helping businesses design, build, integrate, host, and operate modern software systems.",
  url: "https://umbercore.com",
  logo: "https://umbercore.com/og-image.png",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@umbercore.com",
    contactType: "customer service",
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
