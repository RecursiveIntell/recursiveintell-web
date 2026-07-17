import type { Metadata } from "next";
import crateData from "../data/published-crates.json";
import { Footer, Header } from "../components";
import ActivityClient, { type CrateSnapshot, type GitHubSnapshot } from "./ActivityClient";

export const metadata: Metadata = {
  title: "Live Engineering Activity — RecursiveIntell",
  description: "Live, scoped public GitHub and crates.io activity for RecursiveIntell.",
  alternates: { canonical: "/activity" },
  openGraph: {
    title: "Live Engineering Activity — RecursiveIntell",
    description: "Public repository and crate movement, with explicit freshness and fallback state.",
    url: "/activity",
    images: [{ url: "/api/og?title=The%20work%20leaves%20a%20signal.&kicker=LIVE%20ENGINEERING%20TIMELINE&detail=GitHub%20%2B%20crates.io%20%C2%B7%20scoped%20and%20dated&accent=green", width: 1200, height: 630 }],
  },
};

const githubSnapshot: GitHubSnapshot = {
  observedAt: "2026-07-16T10:18:50Z",
  profile: { followers: 7 },
  totals: { publicRepositories: 42, activeRepositories30d: 25, stars: 90 },
  repositories: [
    { name: "recursiveintell-web", url: "https://github.com/RecursiveIntell/recursiveintell-web", description: "RecursiveIntell’s public website and technical portfolio.", language: "HTML", stars: 0, pushedAt: "2026-07-16T10:18:50Z" },
    { name: "Gloss", url: "https://github.com/RecursiveIntell/Gloss", description: "A local-first, privacy-preserving NotebookLM alternative built with Tauri, React, Rust, and Ollama.", language: "Rust", stars: 42, pushedAt: "2026-07-15T20:24:07Z" },
    { name: "chat-rs", url: "https://github.com/RecursiveIntell/chat-rs", description: "Local-first Rust chat shell with provider routing, credential boundaries, and invocation receipts.", language: "Rust", stars: 0, pushedAt: "2026-07-15T18:07:27Z" },
    { name: "MiniRecall", url: "https://github.com/RecursiveIntell/MiniRecall", description: "Android-first local memory assistant prototype.", language: "Python", stars: 0, pushedAt: "2026-07-15T18:07:15Z" },
  ],
  languages: [
    { name: "Rust", repositories: 20 },
    { name: "Python", repositories: 15 },
    { name: "Unclassified", repositories: 2 },
    { name: "Assembly", repositories: 1 },
    { name: "HTML", repositories: 1 },
    { name: "TypeScript", repositories: 1 },
  ],
};

const crateSnapshot: CrateSnapshot = {
  observedAt: crateData.observed_at,
  totals: {
    publishedCrates: crateData.summary.published_crates,
    updatedCrates30d: crateData.summary.updated_30d,
    downloads: crateData.summary.downloads_total,
    downloads90d: crateData.summary.downloads_90d,
  },
  items: crateData.crates.map((item) => ({
    name: item.name,
    version: item.version,
    url: item.crates_io_url,
    description: item.description || "No public crate description.",
    downloads: item.downloads_total,
    updatedAt: item.updated_at,
  })),
};

export default function ActivityPage() {
  return (
    <>
      <Header current="activity" />
      <main id="main">
        <section className="route-hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap route-hero-grid">
            <div><span className="eyebrow">Public engineering pulse · 15-minute cache</span><h1>The work leaves <em>a signal.</em></h1><p className="lede">A live record of public repository updates and crates.io releases—presented as engineering evidence, not a productivity score.</p></div>
            <aside className="route-card"><small>LIVE / PUBLIC</small><strong>Fresh when possible.<br />Honest when degraded.</strong><p>Each source reports its own state and observation time. Audited snapshots remain visible when an upstream service cannot answer.</p></aside>
          </div>
        </section>
        <ActivityClient githubSnapshot={githubSnapshot} crateSnapshot={crateSnapshot} />
      </main>
      <Footer />
    </>
  );
}
