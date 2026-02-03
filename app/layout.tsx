import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPalette } from "@/components/CommandPalette";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recursiveintell.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Josh Stevenson | AI Engineer | RecursiveIntell",
    template: "%s | Josh Stevenson - RecursiveIntell",
  },
  description:
    "Josh Stevenson - AI systems engineer building intelligent, autonomous systems. Portfolio showcasing AI projects, agentic systems, and full-stack development work.",
  keywords: [
    "Josh Stevenson",
    "AI engineer",
    "portfolio",
    "Python",
    "TypeScript",
    "Rust",
    "machine learning",
    "agentic systems",
    "LangChain",
    "RAG",
    "infrastructure",
    "RecursiveIntell",
    "full-stack developer",
  ],
  authors: [{ name: "Josh Stevenson", url: siteUrl }],
  creator: "Josh Stevenson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RecursiveIntell",
    title: "Josh Stevenson | AI Engineer | RecursiveIntell",
    description:
      "AI systems engineer building intelligent, autonomous systems. Portfolio showcasing AI projects, agentic systems, and full-stack development.",
    images: [
      {
        url: "/images/ai_pic.png",
        width: 1200,
        height: 630,
        alt: "Josh Stevenson - AI Systems Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Stevenson | AI Engineer",
    description:
      "AI systems engineer building intelligent, autonomous systems. Portfolio showcasing AI projects, agentic systems, and full-stack development.",
    images: ["/images/ai_pic.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Josh Stevenson",
    alternateName: ["JSense", "RecursiveIntell"],
    url: siteUrl,
    image: `${siteUrl}/images/ai_pic.png`,
    email: "josh@recursiveintell.com",
    jobTitle: "AI Systems Engineer",
    description:
      "AI systems engineer building intelligent, autonomous systems. Specializing in agentic architectures, RAG systems, and full-stack development.",
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Agentic Systems",
      "LangChain",
      "LangGraph",
      "RAG Systems",
      "Python",
      "TypeScript",
      "Rust",
      "C++",
      "Java",
      "Next.js",
      "React",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Linux",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Magna Cum Laude",
        description: "Graduated with high academic distinction",
      },
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "Phi Theta Kappa",
        description: "International honor society for academic excellence",
      },
      {
        "@type": "Organization",
        name: "Sigma Kappa Delta",
        description: "National English honor society",
      },
    ],
    sameAs: [
      "https://github.com/recursiveintell",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "RecursiveIntell",
    description: "AI Engineer Portfolio and Lab Workbench",
    author: { "@id": `${siteUrl}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLd = [personJsonLd, websiteJsonLd];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider>
          <ChatProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[color:var(--color-accent)] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
              Skip to main content
            </a>
            <div className="min-h-screen flex flex-col">
              <SiteHeader />
              <main id="main-content" className="flex-1 pb-16">
                {children}
              </main>
              <SiteFooter />
            </div>
            <ChatWidget />
            <CommandPalette />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
