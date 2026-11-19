import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import { PortfolioExplorer } from "../components/PortfolioExplorer";
import publicRepos from "../data/public-repositories.json";
import { publicHighlights } from "../data/public-highlights";
import {
  Footer,
  Header,
  PageIntro,
  StatusBadge,
} from "../components/SiteChrome";

export const metadata: Metadata = pageMetadata("/portfolio", {
  alternates: { canonical: "/portfolio" },
  title: "Portfolio",
  description:
    "Explore RecursiveIntell repositories, published crates, and a reviewed package catalog, with source status visible.",
});

export default function PortfolioPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="05"
        eyebrow="THE REPOSITORY LIBRARY"
        title="The whole laboratory."
        accent="One place to explore."
        body="Search the public repositories, published crates, and reviewed package catalog. Source status distinguishes live results, partial inventories, and dated snapshots. Open any project to inspect the underlying work."
      >
        <div className="intro-badges">
          <StatusBadge>public source status</StatusBadge>
          <StatusBadge tone="observed">
            dated reviewed audit projection
          </StatusBadge>
        </div>
      </PageIntro>

      <section className="content-section shell portfolio-source-index" aria-labelledby="source-index-heading">
        <header>
          <p className="studio-eyebrow">CURATED / PUBLIC SOURCE</p>
          <h2 id="source-index-heading">The engineering, readable without JavaScript.</h2>
          <p>These descriptions identify source-owned work, not commercial deployments or guaranteed behavior. Source review: November 2026.</p>
        </header>
        <div className="portfolio-source-grid">
          {publicHighlights.map((project) => (
            <article className="portfolio-source-card" key={project.name}>
              <small>{project.category} · {project.status}</small>
              <h3><a href={project.source} target="_blank" rel="noreferrer">{project.name} ↗</a></h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
        <details className="portfolio-repo-snapshot">
          <summary>All {publicRepos.total_public_repositories} public repositories in the dated GitHub snapshot ({publicRepos.observed_date})</summary>
          <p>Includes historical, archived and forked repositories. Public repository count is not an original-software or production-readiness claim. Live metrics below have separate freshness indicators.</p>
          <ul>{publicRepos.repositories.map((project) => (
            <li key={project.name}><a href={project.url} target="_blank" rel="noreferrer">{project.name}</a>{project.archived ? " · archived" : ""}</li>
          ))}</ul>
        </details>
      </section>
      <section className="content-section shell portfolio-page">
        <PortfolioExplorer />
      </section>
      <Footer />
    </main>
  );
}
