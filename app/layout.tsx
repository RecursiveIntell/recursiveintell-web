import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SiteAnalytics from "./SiteAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://recursiveintell.com"),
  title: {
    default: "RecursiveIntell — Agent Memory That Can Show Its Work",
    template: "%s",
  },
  description:
    "Local-first agent memory, live engineering activity, and an exhaustive atlas of the RecursiveIntell trust substrate.",
  applicationName: "RecursiveIntell",
  authors: [{ name: "Josh Stevenson", url: "https://github.com/RecursiveIntell" }],
  creator: "Josh Stevenson",
  publisher: "RecursiveIntell",
  category: "Developer Tools",
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    title: "RecursiveIntell — Agent Memory That Can Show Its Work",
    description: "Persistent agent memory with typed boundaries, temporal truth, receipts, replay, and measured compression.",
    url: "https://recursiveintell.com",
    siteName: "RecursiveIntell",
    type: "website",
    locale: "en_US",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "RecursiveIntell — agent memory that can show its work" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecursiveIntell — Agent Memory That Can Show Its Work",
    description: "Local-first agent memory with inspectable evidence, temporal truth, and replay.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://recursiveintell.com/#website",
      url: "https://recursiveintell.com/",
      name: "RecursiveIntell",
      description: "Local-first agent memory and evidence infrastructure.",
      publisher: { "@id": "https://recursiveintell.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://recursiveintell.com/#organization",
      name: "RecursiveIntell",
      url: "https://recursiveintell.com/",
      founder: { "@id": "https://recursiveintell.com/#josh-stevenson" },
      sameAs: ["https://github.com/RecursiveIntell", "https://crates.io/users/RecursiveIntell"],
    },
    {
      "@type": "Person",
      "@id": "https://recursiveintell.com/#josh-stevenson",
      name: "Josh Stevenson",
      url: "https://recursiveintell.com/about",
      sameAs: ["https://github.com/RecursiveIntell"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <SiteAnalytics />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
