import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import { InstallCockpit } from "../InstallCockpit";
import { getInstallGuide, INSTALL_GUIDES, type HostSlug } from "../data";

type GuidePageProps = { params: Promise<{ host: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return INSTALL_GUIDES.map((guide) => ({ host: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { host } = await params;
  const guide = getInstallGuide(host);
  if (!guide) return {};

  const title = `Install Agent Memory for ${guide.name} — RecursiveIntell`;
  const description = `${guide.description} Includes prerequisites, exact source-backed commands, verification, troubleshooting, uninstall guidance, and explicit limitations.`;
  const url = `/install/${guide.slug}`;
  const image = `/api/og?title=${encodeURIComponent(`Install memory for ${guide.name}`)}&kicker=SOURCE-BOUNDED%20INSTALL%20GUIDE&detail=${encodeURIComponent(`${guide.tier} · connect · prove · operate`)}&accent=cyan`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: [{ url: image, width: 1200, height: 630, alt: `${guide.name} agent-memory installation guide` }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function InstallGuidePage({ params }: GuidePageProps) {
  const { host } = await params;
  const guide = getInstallGuide(host);
  if (!guide) notFound();

  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `Install Agent Memory for ${guide.name}`,
    description: guide.description,
    dateModified: "2026-07-16",
    mainEntityOfPage: `https://recursiveintell.com/install/${guide.slug}`,
    author: {
      "@type": "Organization",
      name: "RecursiveIntell",
      url: "https://recursiveintell.com",
    },
    about: ["agent memory", guide.name, "Model Context Protocol", "local-first software"],
    isBasedOn: guide.sources.map((source) => source.href),
  };

  return (
    <>
      <Header current="install" />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replaceAll("<", "\\u003c") }}
        />
        <InstallCockpit initialHost={guide.slug as HostSlug} canonicalHost={guide.slug as HostSlug} />
      </main>
      <Footer />
    </>
  );
}
