import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./business.css";
import { SiteEffects } from "./components/SiteEffects";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RecursiveIntell — AI Systems Built Around Your Business",
    template: "%s · RecursiveIntell",
  },
  description:
    "Custom AI systems, workflow automation, business knowledge, tool integrations, and evidence-led technical consulting by Josh Stevenson.",
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
    title: "AI systems built around your business.",
    description:
      "Custom agents, workflow automation, business knowledge, integrations, and technical consulting by Josh Stevenson.",
    url: "/",
    siteName: "RecursiveIntell",
    type: "website",
    images: [
      {
        url: "/josh-social.png",
        width: 1200,
        height: 630,
        alt: "RecursiveIntell AI systems by Josh Stevenson",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI systems built around your business.",
    description:
      "Custom agents, workflow automation, business knowledge, integrations, and technical consulting.",
    images: ["/josh-social.png"],
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
