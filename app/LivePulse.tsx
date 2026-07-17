"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Metrics = {
  meta?: { generatedAt?: string; partial?: boolean };
  github?: { totals: { publicRepositories: number; activeRepositories30d: number }; repositories: { name: string; url: string; pushedAt: string }[] };
  crates?: { snapshot?: boolean; totals: { publishedCrates: number; updatedCrates30d: number }; items: { name: string; version: string; url: string; updatedAt: string }[] };
};

const fallback = {
  repos: 42,
  active: 25,
  crates: 111,
  updated: 104,
  repo: { name: "recursiveintell-web", url: "https://github.com/RecursiveIntell/recursiveintell-web", date: "2026-07-16T10:18:50Z" },
  crate: { name: "claim-ledger · v0.2.1", url: "https://crates.io/crates/claim-ledger", date: "2026-07-16T04:56:26Z" },
};

function age(value: string) {
  const days = Math.round((Date.now() - Date.parse(value)) / 86400000);
  if (!Number.isFinite(days)) return "time unavailable";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default function LivePulse() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch("/api/metrics", { headers: { Accept: "application/json" } })
      .then((response) => { if (!response.ok) throw new Error(String(response.status)); return response.json(); })
      .then(setMetrics)
      .catch(() => setFailed(true));
  }, []);

  const repo = metrics?.github?.repositories[0];
  const crate = metrics?.crates?.items[0];
  const state = failed ? "Verified snapshot" : metrics ? (metrics.meta?.partial ? "Partial signal" : "All sources live") : "Refreshing…";
  return (
    <aside className="pulse" aria-label="Public system pulse">
      <div className="pulse-head"><span>PUBLIC SYSTEM PULSE</span><b className={metrics && !metrics.meta?.partial ? "live" : "snapshot"}>{state}</b></div>
      <div className="pulse-title"><div><small>Live engineering signal</small><h2>The stack is moving.</h2></div><Link href="/activity">Full activity →</Link></div>
      <div className="pulse-stats"><div><small>Public repos</small><strong>{metrics?.github?.totals.publicRepositories ?? fallback.repos}</strong><span>{metrics?.github?.totals.activeRepositories30d ?? fallback.active} active in 30 days</span></div><div><small>Published crates</small><strong>{metrics?.crates?.totals.publishedCrates ?? fallback.crates}</strong><span>{metrics?.crates?.totals.updatedCrates30d ?? fallback.updated} updated in 30 days</span></div></div>
      <a className="pulse-latest" href={repo?.url ?? fallback.repo.url} target="_blank" rel="noreferrer"><span>Latest repository update</span><b>{repo?.name ?? fallback.repo.name}</b><time>{age(repo?.pushedAt ?? fallback.repo.date)}</time></a>
      <a className="pulse-latest" href={crate?.url ?? fallback.crate.url} target="_blank" rel="noreferrer"><span>Latest crate publication</span><b>{crate ? `${crate.name} · v${crate.version}` : fallback.crate.name}</b><time>{age(crate?.updatedAt ?? fallback.crate.date)}</time></a>
      <p>Private Libraries activity is an audited snapshot. Public telemetry is cached and degrades to verified data.</p>
    </aside>
  );
}
