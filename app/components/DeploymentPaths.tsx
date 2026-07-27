"use client";

import Link from "next/link";
import { useState } from "react";
import { coreLinks } from "../content";
import { StatusBadge } from "./SiteChrome";

const paths = [
  {
    id: "single",
    number: "01",
    eyebrow: "ONE DEVICE",
    title: "Agent Memory Kits",
    badge: "start here",
    tone: "released" as const,
    summary:
      "Install semantic-memory-mcp beside the agent you already use. Its memory stays on that machine and uses the same semantic-memory engine, hybrid retrieval, temporal state, provenance, and receipts.",
    includes: [
      "The same core memory and retrieval quality",
      "Local SQLite authority on your device",
      "Agent lifecycle integration through a host kit",
    ],
    boundary:
      "No Mnemes server copy, cross-device routing, or server-side recovery layer. Nothing about the underlying memory engine is downgraded.",
    primaryHref: "/install",
    primaryLabel: "Choose an agent kit",
    sourceHref: coreLinks.kitsGithub,
    sourceLabel: "Agent Memory Kits",
  },
  {
    id: "server",
    number: "02",
    eyebrow: "YOUR HARDWARE",
    title: "Mnemes server",
    badge: "self-hosted",
    tone: "released" as const,
    summary:
      "Run your own personal agent memory server on Linux hardware you already own. Mnemes adds device and actor identity, per-device server shards, routed witnessed search, and one operator-controlled place for your agents to remember together.",
    includes: [
      "Your hardware, storage, and network boundary",
      "Multiple authorized agents and devices",
      "Server-side memory copies with source identity",
    ],
    boundary:
      "Current source supports server-side per-device shards. Continuous device-owned replication and fully proven recovery remain in development.",
    primaryHref: "/install",
    primaryLabel: "Install Mnemes yourself",
    sourceHref: coreLinks.mnemesGithub,
    sourceLabel: "Mnemes source",
  },
  {
    id: "node",
    number: "03",
    eyebrow: "READY-TO-GO",
    title: "Mnemes Node R1",
    badge: "optional hardware",
    tone: "proposed" as const,
    summary:
      "Choose the same Mnemes server as a configured physical appliance when you do not have suitable hardware or would rather skip assembly and initial setup.",
    includes: [
      "Mnemes installed on a compact Linux board",
      "Hermes environment and visible status surface",
      "A configuration shaped around your boundary",
    ],
    boundary:
      "Node R1 does not unlock better memory than self-hosted Mnemes. It is the convenience path, and its repeatable build, battery, price, and availability remain early.",
    primaryHref: "/node",
    primaryLabel: "Explore Node R1",
    sourceHref: coreLinks.nodeInterest,
    sourceLabel: "Discuss a custom build",
  },
];

export function DeploymentPaths({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(compact ? 1 : 0);
  const path = paths[selected];

  return (
    <section className={`deployment-paths ${compact ? "deployment-paths-compact" : ""}`}>
      <div className="deployment-path-tabs" role="tablist" aria-label="Choose a memory deployment path">
        {paths.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={selected === index}
            aria-controls={`deployment-path-${item.id}`}
            className={selected === index ? "active" : ""}
            onClick={() => setSelected(index)}
          >
            <span>{item.number}</span>
            <small>{item.eyebrow}</small>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>

      <div
        className="deployment-path-panel"
        id={`deployment-path-${path.id}`}
        role="tabpanel"
      >
        <div className="deployment-path-copy">
          <StatusBadge tone={path.tone}>{path.badge}</StatusBadge>
          <p className="deployment-path-kicker">{path.eyebrow}</p>
          <h3>{path.title}</h3>
          <p>{path.summary}</p>
          <div className="deployment-path-actions">
            <Link className="button button-primary" href={path.primaryHref}>
              {path.primaryLabel} <span>→</span>
            </Link>
            <a className="button button-secondary" href={path.sourceHref}>
              {path.sourceLabel} <span>↗</span>
            </a>
          </div>
        </div>

        <div className="deployment-path-contract">
          <small>WHAT THIS PATH KEEPS</small>
          <ul>
            {path.includes.map((item) => <li key={item}><i />{item}</li>)}
          </ul>
          <div>
            <span>BOUNDARY</span>
            <p>{path.boundary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
