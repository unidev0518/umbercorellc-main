import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UmberCore Admin",
  description: "UmberCore internal admin portal",
  robots: "noindex,nofollow",
  openGraph: {
    title: "UmberCore Admin",
    description: "UmberCore internal admin portal",
    siteName: "UmberCore",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UmberCore Admin",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
