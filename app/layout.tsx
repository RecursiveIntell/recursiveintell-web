import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";

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
  openGraph: {
    title: "RecursiveIntell — Agent Memory That Can Show Its Work",
    description: "Persistent agent memory with typed boundaries, temporal truth, receipts, replay, and measured compression.",
    type: "website",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
