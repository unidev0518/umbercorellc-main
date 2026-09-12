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
    default: "UmberCore — Technology Staffing & Delivery",
    template: "%s | UmberCore",
  },
  description:
    "UmberCore is a global technology staffing and delivery agency. We source vetted engineers, embed them in your team, and take ownership of project outcomes.",
  keywords: [
    "tech staffing",
    "IT agency",
    "software engineers",
    "staff augmentation",
    "project delivery",
    "technology consulting",
  ],
  openGraph: {
    siteName: "UmberCore",
    type: "website",
    locale: "en_US",
    title: "UmberCore — Technology Staffing & Delivery",
    description:
      "Global technology staffing and delivery agency — vetted engineers, real outcomes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UmberCore — Technology Staffing & Delivery",
    description: "We place the right engineers and take ownership of project outcomes.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UmberCore",
  description: "Global technology staffing and delivery agency — vetted engineers, real outcomes.",
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
