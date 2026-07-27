"use client";

import { useEffect, useMemo, useState } from "react";

const scenarios = [
  {
    id: "decision",
    label: "Current decision",
    query: "What owns package identity now?",
    answer: "stack-ids owns canonical identity. Adapter-local identifiers were superseded after ADR-031.",
    source: "architecture-ledger / ADR-031",
    conflict: "3 older statements excluded",
  },
  {
    id: "failure",
    label: "Past failure",
    query: "Why did the last release gate fail?",
    answer: "The packed crate omitted a migration asset. A prior receipt records the same failure class and the accepted repair.",
    source: "release-run-1842 / receipt b74a",
    conflict: "1 stale success claim quarantined",
  },
  {
    id: "device",
    label: "Other device",
    query: "What did the edge node observe before restart?",
    answer: "The memory service crossed its watchdog threshold, restarted, passed integrity checks, and retained the prior receipt chain.",
    source: "device:uno-q / service-observation",
    conflict: "replica freshness disclosed",
  },
];

const phaseNames = ["scope", "candidates", "fuse", "resolve", "witness"];
const nodes = Array.from({ length: 126 }, (_, index) => ({
  x: (index * 53 + 13) % 96,
  y: (index * 71 + 9) % 92,
  group: index % 8,
  size: 2 + (index % 4),
}));

export function MemoryProof({ extended = false }: { extended?: boolean }) {
  const [scenario, setScenario] = useState(0);
  const [density, setDensity] = useState(76);
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const current = scenarios[scenario];
  const visible = useMemo(() => Math.round((nodes.length * density) / 100), [density]);

  useEffect(() => {
    if (!running) return;
    const timers = [1, 2, 3, 4, 5].map((next, index) =>
      window.setTimeout(() => setPhase(next), 620 * (index + 1)),
    );
    const end = window.setTimeout(() => setRunning(false), 3900);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(end);
    };
  }, [running, scenario]);

  function start() {
    setPhase(0);
    setRunning(false);
    requestAnimationFrame(() => setRunning(true));
  }

  return (
    <section className={`memory-proof proof-phase-${phase} ${running ? "proof-running" : ""}`}>
      <header className="proof-toolbar">
        <span><i /> WITNESSED RETRIEVAL / CAPABILITY MODEL</span>
        <b>{Math.round(64000 * density / 100).toLocaleString()} RECORDS · 18 NAMESPACES · 31,842 EDGES</b>
      </header>
      <div className="proof-layout">
        <aside className="proof-controls">
          <small>CHOOSE THE QUESTION</small>
          {scenarios.map((item, index) => (
            <button
              key={item.id}
              className={scenario === index ? "active" : ""}
              onClick={() => {
                setScenario(index);
                setPhase(0);
                setRunning(false);
              }}
            >
              <span>0{index + 1}</span>
              {item.label}
            </button>
          ))}
          <label>
            <span>ARCHIVE DENSITY</span>
            <b>{density}%</b>
            <input
              type="range"
              min="24"
              max="100"
              value={density}
              aria-label="Archive density"
              onChange={(event) => setDensity(Number(event.target.value))}
            />
          </label>
          <button className="proof-run" onClick={start}>
            {running ? "RECALL IN MOTION" : "RUN THE RECALL"}
            <span>▶</span>
          </button>
          <ol>
            {phaseNames.map((name, index) => (
              <li key={name} className={phase > index ? "done" : phase === index ? "now" : ""}>
                <i />
                <span>0{index + 1}</span>
                {name}
              </li>
            ))}
          </ol>
        </aside>

        <div className="proof-field">
          <div className="proof-radar"><i /><i /><i /></div>
          <div className="proof-core">Q<i /><i /></div>
          {nodes.slice(0, visible).map((node, index) => (
            <i
              key={index}
              className={`memory-dot group-${node.group} ${index % 11 === 0 ? "candidate" : ""}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: node.size,
                height: node.size,
                "--node-delay": `${(index % 19) * 34}ms`,
              } as React.CSSProperties}
            />
          ))}
          <div className="retrieval-lane lane-lexical">FTS5 / 428</div>
          <div className="retrieval-lane lane-dense">DENSE / 612</div>
          <div className="retrieval-lane lane-graph">GRAPH / 84</div>
          <div className="candidate-count">1,124 candidates → 12 current results</div>
        </div>

        <div className="proof-output">
          <small>AGENT QUERY</small>
          <blockquote>“{current.query}”</blockquote>
          <div className="score-stack">
            <div><span>BM25</span><i style={{ width: "76%" }} /><b>.76</b></div>
            <div><span>dense</span><i style={{ width: "91%" }} /><b>.91</b></div>
            <div><span>graph</span><i style={{ width: "64%" }} /><b>.64</b></div>
          </div>
          <div className="state-gate">
            <span>{current.conflict}</span>
            <b>current head resolved</b>
          </div>
          <article className="witness-answer">
            <small>WITNESSED ANSWER</small>
            <p>{current.answer}</p>
            <footer>
              <span>{current.source}</span>
              <b>receipt 8c31…e91</b>
            </footer>
          </article>
          <p className="model-caveat">
            Interactive capability model—not a benchmark. Counts illustrate a dense archive and do not report measured performance.
          </p>
        </div>
      </div>

      {extended && (
        <div className="proof-explain">
          <article><span>01</span><h3>Retrieve more than matching text</h3><p>Lexical search preserves exact language; dense search finds meaning; graph traversal follows typed relationships.</p></article>
          <article><span>02</span><h3>Resolve what is true now</h3><p>Current, historical, superseded, contradicted, and quarantined records remain different states.</p></article>
          <article><span>03</span><h3>Return the path with the answer</h3><p>The receipt can disclose candidates, backend, exactness, filters, fallback, degradation, and source identity.</p></article>
        </div>
      )}
    </section>
  );
}

