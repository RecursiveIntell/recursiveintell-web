"use client";

import { useEffect, useState } from "react";
import crateSnapshot from "../data/published-crates.json";
import { type RegistryItem, resolveRegistryItem } from "../lib/registry-state";

const definitions = [
  {
    name: "mnemes",
    role: "control plane",
    github: "https://github.com/RecursiveIntell/mnemes",
    crate: "https://crates.io/crates/mnemes",
  },
  {
    name: "semantic-memory-mcp",
    role: "agent protocol",
    github: "https://github.com/RecursiveIntell/semantic-memory-mcp",
    crate: "https://crates.io/crates/semantic-memory-mcp",
  },
  {
    name: "semantic-memory",
    role: "memory engine",
    github: "https://github.com/RecursiveIntell/semantic-memory",
    crate: "https://crates.io/crates/semantic-memory",
  },
];

const seed: RegistryItem[] = definitions.map((item) => {
  const snapshot = crateSnapshot.crates.find((candidate) => candidate.name === item.name);
  return {
    ...item,
    version: snapshot?.version ?? null,
    downloads: snapshot?.downloads_total ?? null,
    stars: null,
    pushedAt: null,
    registryLive: false,
    githubLive: false,
    snapshotObservedAt: snapshot ? crateSnapshot.observed_at : null,
  };
});

function compact(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("en", {
    notation: value > 999 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function relativeDate(value: string | null) {
  if (!value) return "unavailable";
  const days = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 86_400_000));
  if (days === 0) return "updated today";
  if (days === 1) return "updated yesterday";
  return `updated ${days}d ago`;
}

function shortDate(value: string | null) {
  const parsed = Date.parse(value || "");
  if (!Number.isFinite(parsed)) return "no fallback";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function LiveRegistry({ compactMode = false }: { compactMode?: boolean }) {
  const [items, setItems] = useState(seed);

  useEffect(() => {
    let active = true;
    Promise.all(
      seed.map(async (item) => {
        const [repo, crate] = await Promise.allSettled([
          fetch(`https://api.github.com/repos/RecursiveIntell/${item.name}`).then((response) => {
            if (!response.ok) throw new Error("github unavailable");
            return response.json();
          }),
          fetch(`https://crates.io/api/v1/crates/${item.name}`).then((response) => {
            if (!response.ok) throw new Error("registry unavailable");
            return response.json();
          }),
        ]);
        return resolveRegistryItem(item, repo, crate);
      }),
    ).then((next) => {
      if (active) setItems(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={`registry ${compactMode ? "registry-compact" : ""}`} aria-label="Public source status">
      <div className="registry-head">
        <span><i className={items.some((item) => item.registryLive || item.githubLive) ? "live" : ""} /> public source pulse</span>
        <b>LIVE WHERE AVAILABLE · FALLBACK {shortDate(crateSnapshot.observed_at).toUpperCase()}</b>
      </div>
      <div className="registry-grid">
        {items.map((item, index) => (
          <article key={item.name}>
            <div className="registry-index">0{index + 1}</div>
            <div>
              <small>{item.role}</small>
              <h3>{item.name}</h3>
            </div>
            <strong className="registry-version">
              <span>{item.version ? `v${item.version}` : "—"}</span>
              <small>{item.registryLive ? "live crates.io" : item.snapshotObservedAt ? `snapshot ${shortDate(item.snapshotObservedAt)}` : "registry unavailable"}</small>
            </strong>
            <dl>
              <div><dt>downloads · {item.registryLive ? "live" : item.snapshotObservedAt ? "snapshot" : "unavailable"}</dt><dd>{compact(item.downloads)}</dd></div>
              <div><dt>stars · {item.githubLive ? "live" : "unavailable"}</dt><dd>{compact(item.stars)}</dd></div>
              <div><dt>GitHub activity</dt><dd>{relativeDate(item.pushedAt)}</dd></div>
            </dl>
            <footer>
              <a href={item.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={item.crate} target="_blank" rel="noreferrer">crates.io ↗</a>
            </footer>
          </article>
        ))}
      </div>
      {!compactMode && (
        <p className="registry-note">
          Registry and repository values are requested from public APIs in your browser. If crates.io is unavailable, versions and downloads use only the bundled snapshot observed {shortDate(crateSnapshot.observed_at)} and are labeled as such. Missing GitHub values remain unavailable; nothing is inferred from a different source.
        </p>
      )}
    </section>
  );
}
