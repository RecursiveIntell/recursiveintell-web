import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "../lib/page-metadata";
import { StudioHeader, StudioFooter } from "../components/StudioChrome";
import { StudioIntro, StudioCTA } from "../components/Studio";
import { publicEvidence, siteReleaseEvents } from "../data/public-evidence";

export const metadata: Metadata = pageMetadata("/changes", {
  title: "Public engineering changes",
  description: "Dated, source-linked RecursiveIntell changes and accepted contributions, with explicit release and verification boundaries.",
});

const timeline = [
  ...publicEvidence.map((item) => ({
    key: item.id,
    date: item.date,
    title: item.title,
    scope: item.summary,
    boundary: item.boundary,
    source: item.source,
    revision: item.revision,
  })),
  ...siteReleaseEvents.map((item) => ({
    key: item.revision,
    date: item.date,
    title: item.title,
    scope: item.scope,
    boundary: item.boundary,
    source: item.source,
    revision: item.revision,
  })),
].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export default function ChangesPage() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro label="PUBLIC HISTORY / SELECTED EVENTS" title="What changed." accent="With a revision attached." body="A curated timeline of accepted changes, upstream reviews and independent coverage—not a comprehensive automated changelog or proof of production deployment. Dates reflect each source event; publication and review are not merges." />
      <section className="studio-section studio-shell">
        <div className="ri-architecture-grid">
          {timeline.map((event) => (
            <article key={event.key} className="ri-architecture-card">
              <p className="studio-eyebrow">{event.date}</p>
              <h3>{event.title}</h3>
              <p>{event.scope}</p>
              <div><strong>Limit of evidence</strong><p>{event.boundary}</p></div>
              <a className="studio-text-link" href={event.source} target="_blank" rel="noreferrer">Inspect original source ↗</a>
              {event.revision && <small>Reviewed or merged revision: <code>{event.revision.slice(0, 12)}</code></small>}
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-shell">
        <p>This list is manually curated; open drafts, review comments and media mentions are explicitly not shipped features. Use the <Link href="/portfolio">source repository directory</Link> for broader exploration.</p>
      </section>
      <StudioCTA />
      <StudioFooter />
    </main>
  );
}
