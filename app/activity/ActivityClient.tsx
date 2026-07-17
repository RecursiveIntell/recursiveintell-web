"use client";

import { useEffect, useMemo, useState } from "react";

type Repo = {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  pushedAt: string;
};

type Language = { name: string; repositories: number };

type Crate = {
  name: string;
  version: string;
  url: string;
  description: string;
  downloads: number;
  updatedAt: string;
};

export type GitHubSnapshot = {
  observedAt: string;
  profile: { followers: number };
  totals: {
    publicRepositories: number;
    activeRepositories30d: number;
    stars: number;
  };
  repositories: Repo[];
  languages: Language[];
};

export type CrateSnapshot = {
  observedAt: string;
  totals: {
    publishedCrates: number;
    updatedCrates30d: number;
    downloads: number;
    downloads90d: number;
  };
  items: Crate[];
};

type Metrics = {
  meta?: {
    generatedAt?: string;
    partial?: boolean;
    errors?: { source: string; code: string }[];
    sources?: {
      github?: { state?: string; repositoriesComplete?: boolean };
      crates?: { state?: string; observedAt?: string; inventoryComplete?: boolean; snapshotInventoryComplete?: boolean };
    };
  };
  github?: {
    profile: { followers: number };
    totals: { publicRepositories: number; activeRepositories30d: number; stars: number };
    repositories: Repo[];
    languages: Language[];
  };
  crates?: {
    snapshot?: boolean;
    observedAt?: string;
    totals: { publishedCrates: number; updatedCrates30d: number; downloads: number; downloads90d: number };
    items: Crate[];
  };
};

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const exact = new Intl.NumberFormat("en-US");
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const moment = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" });

function validDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.valueOf()) ? parsed : null;
}

function date(value: string) {
  const parsed = validDate(value);
  return parsed ? day.format(parsed) : "Time unavailable";
}

function dateTime(value?: string) {
  const parsed = validDate(value);
  return parsed ? moment.format(parsed) : "Time unavailable";
}

function sourceState(state: string | undefined, fallback: string) {
  if (state === "live") return "Live public API";
  if (state === "partial") return "Partial public API";
  if (state === "snapshot") return "Verified snapshot";
  if (state === "unavailable") return "Verified snapshot shown";
  return fallback;
}

export default function ActivityClient({ githubSnapshot, crateSnapshot }: { githubSnapshot: GitHubSnapshot; crateSnapshot: CrateSnapshot }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/metrics", { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((payload: Metrics) => setMetrics(payload))
      .catch(() => setFailed(true));
  }, []);

  const github = metrics?.github;
  const crates = metrics?.crates;
  const repos = github?.repositories.slice(0, 12) ?? githubSnapshot.repositories;
  const crateItems = crates?.items.slice(0, 12) ?? crateSnapshot.items.slice(0, 12);
  const languages = github?.languages?.length ? github.languages : githubSnapshot.languages;
  const rankedCrates = useMemo(
    () => (crates?.items ?? crateSnapshot.items).slice().sort((a, b) => b.downloads - a.downloads).slice(0, 10),
    [crateSnapshot.items, crates?.items],
  );
  const maxLanguageCount = Math.max(...languages.map((entry) => entry.repositories), 1);

  const endpointChecked = metrics?.meta?.generatedAt;
  const githubObservedAt = github ? endpointChecked : githubSnapshot.observedAt;
  const cratesObservedAt = crates
    ? crates.snapshot ? crates.observedAt ?? metrics?.meta?.sources?.crates?.observedAt ?? crateSnapshot.observedAt : endpointChecked
    : crateSnapshot.observedAt;
  const githubState = failed
    ? "Verified snapshot shown"
    : metrics
      ? sourceState(metrics.meta?.sources?.github?.state, github ? "Live public API" : "Verified snapshot shown")
      : "Refreshing live · snapshot visible";
  const cratesState = failed
    ? "Verified snapshot shown"
    : metrics
      ? sourceState(metrics.meta?.sources?.crates?.state, crates?.snapshot ? "Verified snapshot" : "Live public API")
      : "Refreshing live · snapshot visible";
  const state = failed
    ? "Live endpoint unavailable · verified snapshots shown"
    : metrics
      ? metrics.meta?.partial ? "Live endpoint returned a partial signal" : "All public sources live"
      : "Refreshing live public sources";

  return (
    <>
      <section className="source-state-wrap" aria-label="Telemetry freshness">
        <div className="wrap source-state" role="status" aria-live="polite" aria-atomic="true">
          <div><span>GitHub</span><b>{githubState}</b><time dateTime={githubObservedAt}>Observed {dateTime(githubObservedAt)}</time></div>
          <div><span>crates.io</span><b>{cratesState}</b><time dateTime={cratesObservedAt}>Observed {dateTime(cratesObservedAt)}</time></div>
          <p>{state}{endpointChecked ? ` · endpoint checked ${dateTime(endpointChecked)}` : ""}</p>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="section-head"><div><span className="kicker">01 · PUBLIC SNAPSHOT</span><h2>Current footprint, without vanity math.</h2></div><p>Public GitHub and crates.io data only. Private work is deliberately excluded from live counts.</p></div>
          <div className="stat-grid">
            <article><small>GitHub</small><strong>{compact.format(github?.totals.publicRepositories ?? githubSnapshot.totals.publicRepositories)}</strong><span>{github?.totals.activeRepositories30d ?? githubSnapshot.totals.activeRepositories30d} repositories pushed in 30 days</span></article>
            <article><small>crates.io</small><strong>{compact.format(crates?.totals.publishedCrates ?? crateSnapshot.totals.publishedCrates)}</strong><span>{crates?.totals.updatedCrates30d ?? crateSnapshot.totals.updatedCrates30d} crates updated in 30 days</span></article>
            <article><small>Distribution</small><strong>{compact.format(crates?.totals.downloads ?? crateSnapshot.totals.downloads)}</strong><span>{exact.format(crates?.totals.downloads90d ?? crateSnapshot.totals.downloads90d)} downloads in the 90-day window</span></article>
            <article><small>Community</small><strong>{compact.format(github?.totals.stars ?? githubSnapshot.totals.stars)}</strong><span>{github?.profile.followers ?? githubSnapshot.profile.followers} public followers · public repositories only</span></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head"><div><span className="kicker">02 · LATEST SIGNAL</span><h2>What moved most recently.</h2></div><p>Repository pushes and crate release timestamps are public change signals—not a score for effort, quality, or impact.</p></div>
          <div className="activity-stream">
            <section className="signal-panel" aria-labelledby="github-stream-title"><div className="panel-head"><div><small>GITHUB / PUBLIC</small><h2 id="github-stream-title">Repository updates</h2></div><a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">Open source ↗</a></div>{repos.map((repo) => <a className="signal-row" key={repo.name} href={repo.url} target="_blank" rel="noreferrer"><i className="signal-dot" aria-hidden="true" /><div><b>{repo.name}</b><p>{repo.description || "No public description."}</p><small>{repo.language || "Unclassified"} · {exact.format(repo.stars)} stars</small></div><time dateTime={repo.pushedAt}>{date(repo.pushedAt)}</time></a>)}</section>
            <section className="signal-panel" aria-labelledby="crate-stream-title"><div className="panel-head"><div><small>CRATES.IO / OWNED</small><h2 id="crate-stream-title">Crate releases</h2></div><a href="https://crates.io/users/RecursiveIntell" target="_blank" rel="noreferrer">Open source ↗</a></div>{crateItems.map((item) => <a className="signal-row" key={item.name} href={item.url} target="_blank" rel="noreferrer"><i className="signal-dot crate" aria-hidden="true" /><div><b>{item.name} · v{item.version}</b><p>{item.description || "No public description."}</p><small>{exact.format(item.downloads)} lifetime downloads</small></div><time dateTime={item.updatedAt}>{date(item.updatedAt)}</time></a>)}</section>
          </div>
        </div>
      </section>

      <section className="section footprint-section">
        <div className="wrap">
          <div className="section-head"><div><span className="kicker">03 · PORTFOLIO SHAPE</span><h2>Where the public surface concentrates.</h2></div><p>Language share uses each repository&apos;s primary language. Download rank is cumulative package distribution—not a claim of adoption or production readiness.</p></div>
          <div className="footprint-grid">
            <section className="distribution-panel" aria-labelledby="language-title"><small>REPOSITORY LANGUAGE MIX</small><h3 id="language-title">Primary languages</h3><div className="bar-list">{languages.slice(0, 8).map((entry) => <div className="bar-row" key={entry.name}><span><b>{entry.name}</b><em>{exact.format(entry.repositories)} repos</em></span><i aria-hidden="true"><u style={{ width: `${Math.max(4, (entry.repositories / maxLanguageCount) * 100)}%` }} /></i></div>)}</div></section>
            <section className="distribution-panel" aria-labelledby="downloads-title"><small>CRATE DISTRIBUTION</small><h3 id="downloads-title">Most downloaded packages</h3><div className="rank-list">{rankedCrates.map((item, index) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, "0")}</span><b>{item.name}</b><em>{exact.format(item.downloads)}</em></a>)}</div></section>
          </div>
        </div>
      </section>

      <section className="section paper"><div className="wrap method-grid"><div><span className="kicker">04 · METHODOLOGY</span><h2>Telemetry is a witness, not a verdict.</h2><p>Public APIs can show that a repository was pushed or a crate record changed. They cannot prove source/package parity, security, correctness, or the amount of private work behind an artifact.</p></div><div><ul><li>GitHub totals cover public repositories; public events are a delayed sample and are not used as a complete activity count.</li><li>crates.io ownership pages are fetched sequentially under its request policy.</li><li>The edge endpoint caches for 15 minutes and retains the dated 111-crate owner snapshot for degradation.</li><li>Private Libraries activity is represented only by a dated audited catalog.</li></ul><p><strong>Connection state:</strong> {state}.</p></div></div></section>
    </>
  );
}
