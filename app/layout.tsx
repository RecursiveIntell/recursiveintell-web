import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./business.css";
import "./studio.css";
import { SiteEffects } from "./components/SiteEffects";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RecursiveIntell | Independent AI Systems Engineering",
    template: "%s · RecursiveIntell",
  },
  description:
    "Independent AI systems engineering by Josh Stevenson: agent runtimes, local memory, Rust infrastructure, and focused consulting.",
  keywords: [
    "custom AI systems",
    "workflow automation",
    "AI consulting",
    "business knowledge",
    "Hermes Agent",
    "local-first AI",
    "RecursiveIntell",
  ],
  metadataBase: new URL("https://recursiveintell.com"),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "AI systems. Built to be understood.",
    description:
      "Agent runtimes, local memory, and Rust infrastructure by Josh Stevenson.",
    url: "/",
    siteName: "RecursiveIntell",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RecursiveIntell AI systems by Josh Stevenson",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI systems. Built to be understood.",
    description:
      "Independent AI systems engineering: agents, memory, and infrastructure.",
    images: ["/opengraph-image"],
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteEffects />
        {children}
      </body>
    </html>
  );
}
