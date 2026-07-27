"use client";

import { useMemo, useState } from "react";

const devices = [
  { id: "laptop", label: "Laptop", kind: "coding agent", color: "cyan", memory: "architecture decision" },
  { id: "node", label: "Mnemes node", kind: "control plane", color: "gold", memory: "routing receipt" },
  { id: "server", label: "GPU server", kind: "heavy retrieval", color: "violet", memory: "benchmark context" },
  { id: "edge", label: "UNO Q", kind: "edge proof", color: "green", memory: "service observation" },
  { id: "phone", label: "Phone", kind: "capture surface", color: "rose", memory: "field note" },
];

const results = [
  ["Laptop", "ADR-044", "Keep device identity separate from memory relevance.", ".96"],
  ["UNO Q", "receipt 8f2…", "The edge service restarted cleanly after the watchdog event.", ".91"],
  ["GPU server", "run-1842", "Exact f32 rerank remained the deciding stage.", ".87"],
];

export function MeshStory({ extended = false }: { extended?: boolean }) {
  const [origin, setOrigin] = useState("laptop");
  const [mode, setMode] = useState<"current" | "target">("current");
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState(0);
  const active = useMemo(() => devices.find((device) => device.id === origin)!, [origin]);

  function search() {
    setRunning(false);
    requestAnimationFrame(() => {
      setRun((value) => value + 1);
      setRunning(true);
      window.setTimeout(() => setRunning(false), 3200);
    });
  }

  return (
    <section className={`mesh-story ${running ? "mesh-running" : ""} mode-${mode}`} key={run}>
      <div className="mesh-toolbar">
        <div>
          <span className="signal" />
          <b>PRIVATE MEMORY TOPOLOGY</b>
          <small>{mode === "current" ? "CURRENT CANDIDATE" : "TARGET ARCHITECTURE"}</small>
        </div>
        <div className="segmented" aria-label="Architecture status">
          <button className={mode === "current" ? "active" : ""} onClick={() => setMode("current")}>What exists</button>
          <button className={mode === "target" ? "active" : ""} onClick={() => setMode("target")}>What comes next</button>
        </div>
      </div>

      <div className="mesh-canvas">
        <div className="mesh-grid" />
        <div className="mesh-orbit orbit-one" />
        <div className="mesh-orbit orbit-two" />
        <div className="mesh-core">
          <span>Μ</span>
          <strong>Mnemes</strong>
          <small>{mode === "current" ? "pooled.db + server shards" : "replica-aware control plane"}</small>
          <i />
        </div>
        {devices.filter((device) => device.id !== "node").map((device, index) => (
          <button
            className={`mesh-device device-${index} tone-${device.color} ${origin === device.id ? "active" : ""}`}
            key={device.id}
            onClick={() => setOrigin(device.id)}
            aria-pressed={origin === device.id}
          >
            <i />
            <b>{device.label}</b>
            <small>{device.kind}</small>
            <span>{mode === "current" ? "server shard" : "home DB + replica"}</span>
          </button>
        ))}
        <div className="mesh-path path-a" />
        <div className="mesh-path path-b" />
        <div className="mesh-path path-c" />
        <div className="mesh-path path-d" />
        <div className="mesh-packet packet-a">scope</div>
        <div className="mesh-packet packet-b">receipt</div>
      </div>

      <div className="mesh-query">
        <div>
          <small>QUERY ORIGIN · {active.label.toUpperCase()}</small>
          <p>“What did we decide about the memory authority—and what evidence survived?”</p>
        </div>
        <button onClick={search}>
          {running ? "ROUTING AUTHORIZED SHARDS" : "RUN WITNESSED SEARCH"}
          <span>↗</span>
        </button>
      </div>

      <div className="mesh-results">
        {results.map((result, index) => (
          <article key={result[1]} style={{ "--delay": `${index * 130 + 900}ms` } as React.CSSProperties}>
            <span>{result[0]}</span>
            <strong>{result[3]}</strong>
            <p>{result[2]}</p>
            <small>{result[1]} · source bound · current</small>
          </article>
        ))}
      </div>

      <div className="truth-strip">
        <b>{mode === "current" ? "SOURCE-ESTABLISHED" : "IN DEVELOPMENT"}</b>
        <p>
          {mode === "current"
            ? "Current source implements server-side per-device shards and routed witnessed search."
            : "The target design keeps canonical databases on home devices and synchronizes durable server replicas. Continuous replication still requires end-to-end proof."}
        </p>
      </div>

      {extended && (
        <div className="mesh-contracts">
          <article><b>Identity before relevance</b><p>Authorization filters eligible shards before semantic ranking begins.</p></article>
          <article><b>Reachability is not sync</b><p>A tailnet can connect devices. It does not prove replication, freshness, merge, or replay.</p></article>
          <article><b>Replica state stays visible</b><p>Results should disclose origin, owner, replica freshness, temporal state, and route evidence.</p></article>
        </div>
      )}
    </section>
  );
}

