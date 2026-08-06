import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteEffects } from "./components/SiteEffects";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mnemes — Memory, With a Witness",
    template: "%s · Mnemes",
  },
  description:
    "Mnemes is a personal, self-hosted agent memory server. Run it on your own hardware, start with one-device Agent Memory Kits, or choose the optional Node R1 appliance.",
  keywords: [
    "Mnemes",
    "agent memory",
    "semantic memory",
    "MCP server",
    "local-first AI",
    "cross-device memory",
    "RecursiveIntell",
  ],
  metadataBase: new URL("https://recursiveintell.com"),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Mnemes — Memory, With a Witness",
    description:
      "Your personal, self-hosted agent memory server—run on your hardware, with an optional ready-to-go Node R1.",
    url: "/",
    siteName: "Mnemes",
    type: "website",
    images: [
      {
        url: "/mnemes-social.webp",
        width: 1200,
        height: 630,
        alt: "Mnemes, an ancient memory divinity rendered as a local-first computational system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mnemes — Memory, With a Witness",
    description:
      "Self-hosted agent memory for one device or every device you authorize, with temporal state, provenance, and receipts.",
    images: ["/mnemes-social.webp"],
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteEffects />
        {children}
      </body>
    </html>
  );
}
