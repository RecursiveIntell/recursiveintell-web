"use client";

import { useEffect, useMemo, useState } from "react";
import crateSnapshot from "../data/published-crates.json";
import libraryCatalog from "../data/library-catalog-public.json";
import { portfolioDashboardState, sourceTimestamp } from "../lib/portfolio-state";

type Repository = {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  pushedAt: string | null;
  archived: boolean;
  topics: string[];
};

type Crate = {
  name: string;
  version: string;
  downloads: number;
  recentDownloads: number;
  updatedAt: string | null;
  description: string;
  repository: string | null;
  documentation: string | null;
  url: string;
};

type PackageRecord = {
  package_name: string;
  ecosystem: string;
  version: string;
  description: string;
  architectural_domain: string;
  sibling_dependency_count: number;
  publication: {
    state_key: string;
    state_label: string;
    registry?: {
      downloads_total?: number;
      registry_url?: string;
    } | null;
  };
  maturity_evidence: {
    status: string;
  };
};

type Metrics = {
  meta: {
    generatedAt: string;
    cacheSeconds?: number;
    partial: boolean;
    sources?: {
      github?: { state?: string; repositoriesComplete?: boolean };
      crates?: {
        state?: string;
        inventoryComplete?: boolean;
        snapshotInventoryComplete?: boolean;
        observedAt?: string;
      };
    };
  };
  github?: {
    totals: {
      publicRepositories: number;
      activeRepositories30d: number;
      stars: number;
      forks: number;
      openIssues: number;
    };
    repositories: Repository[];
  };
  crates?: {
    snapshot?: boolean;
    observedAt?: string;
    totals: {
      publishedCrates: number;
      updatedCrates30d: number;
      downloads: number;
      downloads90d: number;
    };
    items: Crate[];
  };
};

type View = "repos" | "crates" | "atlas";
type Sort = "updated" | "signal" | "name";

const fallbackCrates: Crate[] = crateSnapshot.crates.map((item) => ({
  name: item.name,
  version: item.version,
  downloads: item.downloads_total,
  recentDownloads: item.downloads_90d,
  updatedAt: item.updated_at,
  description: item.description || "No public crate description.",
  repository: item.repository_url,
  documentation: item.documentation_url,
  url: item.crates_io_url,
}));

const fallbackTotals = {
  publishedCrates: crateSnapshot.summary.published_crates,
  updatedCrates30d: crateSnapshot.summary.updated_30d,
  downloads: crateSnapshot.summary.downloads_total,
  downloads90d: crateSnapshot.summary.downloads_90d,
};

function number(value: number | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function age(value: string | null | undefined) {
  if (!value) return "date unavailable";
  const days = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 86_400_000));
  if (!Number.isFinite(days)) return "date unavailable";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function timestamp(value: string | null | undefined) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function label(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PortfolioExplorer() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [metricsFailed, setMetricsFailed] = useState(false);
  const [view, setView] = useState<View>("repos");
  const [sort, setSort] = useState<Sort>("updated");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(24);

  useEffect(() => {
    let active = true;
    fetch("/api/portfolio", { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<Metrics>;
      })
      .then((payload) => {
        if (active) setMetrics(payload);
      })
      .catch(() => {
        if (active) setMetricsFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const crates = useMemo(() => metrics?.crates?.items ?? fallbackCrates, [metrics]);
  const crateTotals = metrics?.crates?.totals ?? fallbackTotals;
  const repositories = useMemo(() => metrics?.github?.repositories ?? [], [metrics]);
  const packages = libraryCatalog.catalog as PackageRecord[];
  const needle = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (view === "repos") {
      return repositories
        .filter((item) => !needle || `${item.name} ${item.description} ${item.language} ${item.topics.join(" ")}`.toLowerCase().includes(needle))
        .sort((a, b) => sort === "name"
          ? a.name.localeCompare(b.name)
          : sort === "signal"
            ? (b.stars + b.forks) - (a.stars + a.forks)
            : timestamp(b.pushedAt) - timestamp(a.pushedAt));
    }
    if (view === "crates") {
      return crates
        .filter((item) => !needle || `${item.name} ${item.description} ${item.version}`.toLowerCase().includes(needle))
        .sort((a, b) => sort === "name"
          ? a.name.localeCompare(b.name)
          : sort === "signal"
            ? b.downloads - a.downloads
            : timestamp(b.updatedAt) - timestamp(a.updatedAt));
    }
    return packages
      .filter((item) => !needle || `${item.package_name} ${item.description} ${item.architectural_domain} ${item.maturity_evidence.status}`.toLowerCase().includes(needle))
      .sort((a, b) => sort === "name"
        ? a.package_name.localeCompare(b.package_name)
        : sort === "signal"
          ? (b.publication.registry?.downloads_total ?? 0) - (a.publication.registry?.downloads_total ?? 0)
          : a.architectural_domain.localeCompare(b.architectural_domain) || a.package_name.localeCompare(b.package_name));
  }, [view, repositories, crates, packages, needle, sort]);

  const { github: githubStatus, crates: cratesStatus } = portfolioDashboardState(
    metrics?.meta,
    metricsFailed,
    crateSnapshot.observed_at,
  );

  return (
    <section className="portfolio-explorer">
      <div className="portfolio-pulse">
        <div className="portfolio-pulse-head">
          <span><i className={githubStatus.live && cratesStatus.live ? "live" : ""} /> PUBLIC ENGINEERING PULSE</span>
          <b>SOURCE-BY-SOURCE FRESHNESS</b>
        </div>
        <div className="portfolio-source-strip">
          <article data-state={githubStatus.state}>
            <span>GITHUB</span>
            <strong>{githubStatus.label}</strong>
            <small>{githubStatus.detail}</small>
          </article>
          <article data-state={cratesStatus.state}>
            <span>CRATES.IO</span>
            <strong>{cratesStatus.label}</strong>
            <small>{cratesStatus.detail}</small>
          </article>
          <article data-state="snapshot">
            <span>LIBRARY ATLAS</span>
            <strong>REVIEWED PUBLIC PROJECTION</strong>
            <small>Audit observed {sourceTimestamp(libraryCatalog.generated_at)} · private repository metadata excluded.</small>
          </article>
        </div>
        <div className="portfolio-totals">
          <article><small>PUBLIC REPOSITORIES</small><strong>{metrics?.github?.totals.publicRepositories ?? "—"}</strong><span>{metrics?.github ? `${metrics.github.totals.activeRepositories30d} active in 30 days` : githubStatus.label.toLowerCase()}</span></article>
          <article><small>PUBLISHED CRATES</small><strong>{number(crateTotals.publishedCrates)}</strong><span>{number(crateTotals.updatedCrates30d)} updated in 30 days · {cratesStatus.label.toLowerCase()}</span></article>
          <article><small>CRATE DOWNLOADS</small><strong>{number(crateTotals.downloads)}</strong><span>{number(crateTotals.downloads90d)} in the observed 90-day field</span></article>
          <article><small>AUDITED PACKAGES</small><strong>{libraryCatalog.counts.total_catalog_entries}</strong><span>reviewed projection · snapshot {age(libraryCatalog.generated_at)}</span></article>
          <article><small>GITHUB STARS</small><strong>{metrics?.github ? number(metrics.github.totals.stars) : "—"}</strong><span>{metrics?.github ? `${number(metrics.github.totals.forks)} public forks` : "no value inferred"}</span></article>
        </div>
      </div>

      <div className="portfolio-controls">
        <div className="portfolio-view-tabs" role="tablist" aria-label="Portfolio data view">
          <button className={view === "repos" ? "active" : ""} onClick={() => { setView("repos"); setVisible(24); }} role="tab" aria-selected={view === "repos"}>Repositories <span>{repositories.length || "—"}</span></button>
          <button className={view === "crates" ? "active" : ""} onClick={() => { setView("crates"); setVisible(24); }} role="tab" aria-selected={view === "crates"}>Crates <span>{crates.length}</span></button>
          <button className={view === "atlas" ? "active" : ""} onClick={() => { setView("atlas"); setVisible(24); }} role="tab" aria-selected={view === "atlas"}>Library Atlas <span>{packages.length}</span></button>
        </div>
        <div className="portfolio-filters">
          <label>
            <span>SEARCH</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(24); }} placeholder={`Search ${view === "repos" ? "repositories" : view === "crates" ? "crates" : "packages"}…`} />
          </label>
          <label>
            <span>SORT</span>
            <select value={sort} onChange={(event) => { setSort(event.target.value as Sort); setVisible(24); }}>
              <option value="updated">{view === "atlas" ? "Domain" : "Recently updated"}</option>
              <option value="signal">{view === "repos" ? "Stars + forks" : "Downloads"}</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      <div className="portfolio-result-head">
        <span>{filtered.length} MATCHING RECORDS</span>
        <p>
          {view === "atlas"
            ? "A reviewed, allowlisted public projection of the dated package audit; private repository metadata is excluded."
            : "Values come from public APIs and report their own freshness or fallback state."}
        </p>
      </div>

      <div className={`portfolio-grid portfolio-${view}`} aria-live="polite">
        {view === "repos" && githubStatus.state === "loading" && (
          <div className="portfolio-loading"><i /><span>Collecting public GitHub repositories…</span></div>
        )}
        {view === "repos" && githubStatus.state === "unavailable" && (
          <div className="portfolio-loading"><span>GitHub inventory is unavailable. No repository count, star total, fork total, or repository cards are being inferred.</span></div>
        )}
        {view === "repos" && githubStatus.state === "partial" && (
          <div className="portfolio-loading"><span>GitHub returned a partial inventory. The cards below are shown, but they are not represented as a complete portfolio count.</span></div>
        )}

        {view === "repos" && (filtered as Repository[]).slice(0, visible).map((item, index) => (
          <a className="portfolio-card repo-card" href={item.url} target="_blank" rel="noreferrer" key={item.name}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><small>{item.language}</small><time>{age(item.pushedAt)}</time></header>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <dl>
              <div><dt>STARS</dt><dd>★ {number(item.stars)}</dd></div>
              <div><dt>FORKS</dt><dd>⑂ {number(item.forks)}</dd></div>
              <div><dt>ISSUES</dt><dd>{number(item.issues)}</dd></div>
            </dl>
            <footer>{item.archived ? "ARCHIVED" : "OPEN SOURCE"} <span>GitHub ↗</span></footer>
          </a>
        ))}

        {view === "crates" && (filtered as Crate[]).slice(0, visible).map((item, index) => (
          <article className="portfolio-card crate-card" key={item.name}>
            <header><span>{String(index + 1).padStart(3, "0")}</span><small>v{item.version}</small><time>{age(item.updatedAt)}</time></header>
            <h3><a href={item.url} target="_blank" rel="noreferrer">{item.name}</a></h3>
            <p>{item.description}</p>
            <dl>
              <div><dt>DOWNLOADS</dt><dd>{number(item.downloads)}</dd></div>
              <div><dt>RECENT</dt><dd>{number(item.recentDownloads)}</dd></div>
            </dl>
            <footer><a href={item.url} target="_blank" rel="noreferrer">crates.io ↗</a><a href={item.documentation ?? `https://docs.rs/${item.name}`} target="_blank" rel="noreferrer">docs.rs ↗</a></footer>
          </article>
        ))}

        {view === "atlas" && (filtered as PackageRecord[]).slice(0, visible).map((item, index) => (
          <article className="portfolio-card atlas-card" key={`${item.ecosystem}:${item.package_name}`}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><small>{item.ecosystem} · v{item.version}</small></header>
            <p className="portfolio-domain">{item.architectural_domain}</p>
            <h3>{item.package_name}</h3>
            <p>{item.description}</p>
            <dl>
              <div><dt>MATURITY</dt><dd>{label(item.maturity_evidence.status)}</dd></div>
              <div><dt>EDGES</dt><dd>{number(item.sibling_dependency_count)}</dd></div>
              <div><dt>DOWNLOADS</dt><dd>{item.publication.registry ? number(item.publication.registry.downloads_total) : "—"}</dd></div>
            </dl>
            <footer><span>{item.publication.state_label}</span>{item.publication.registry?.registry_url && <a href={item.publication.registry.registry_url} target="_blank" rel="noreferrer">crates.io ↗</a>}</footer>
          </article>
        ))}
      </div>

      {filtered.length > visible && (
        <button className="portfolio-more" onClick={() => setVisible((count) => count + 24)}>
          Show {Math.min(24, filtered.length - visible)} more <span>↓</span>
        </button>
      )}

      <div className="portfolio-source-law">
        <span>SOURCE LAW</span>
        <p>GitHub stars, forks, issues, and update times describe public repository state. Crate downloads and versions describe registry state. The 97-package Library Atlas is a reviewed public projection of a dated audit; private repository identity, branches, commit hashes, internal paths, source links, and audit gaps are not shipped. None of these numbers prove quality, adoption, production readiness, or customer use.</p>
      </div>
    </section>
  );
}
