"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./TimeMachine.module.css";

const scenes = [
  {
    id: "capture",
    index: "01",
    label: "Capture",
    time: "TUE · 09:14",
    title: "A decision becomes durable.",
    query: "Remember: package truth comes from the packed artifact.",
    state: "CURRENT",
    source: "host/codex · session 48f2",
    receipt: "write-7c91…",
    note: "The authoritative record is local. Source and observed time remain attached.",
  },
  {
    id: "supersede",
    index: "02",
    label: "Supersede",
    time: "THU · 16:42",
    title: "The decision changes without erasing history.",
    query: "Package truth now requires packed-crate and clean-install parity.",
    state: "SUPERSEDES 7c91",
    source: "host/claude · session b013",
    receipt: "write-a44e…",
    note: "Bitemporal state keeps the prior belief inspectable while the current view advances.",
  },
  {
    id: "recall",
    index: "03",
    label: "Recall",
    time: "MON · 08:03",
    title: "A later agent asks what is true now.",
    query: "What did we decide about package truth?",
    state: "AS-OF / CURRENT",
    source: "FTS5 + dense + weighted RRF",
    receipt: "recall-e806…",
    note: "The answer explains ranking and temporal state instead of flattening every matching memory.",
  },
  {
    id: "witness",
    index: "04",
    label: "Witness",
    time: "MON · 08:03:04",
    title: "The answer leaves a scoped receipt.",
    query: "Clean-install parity is part of the current package-truth rule.",
    state: "WITNESSED",
    source: "2 candidates · 1 superseded",
    receipt: "mcp-witness-e806…",
    note: "The receipt shows what execution observed. It does not turn the answer into factual truth.",
  },
] as const;

export default function MemoryTimeMachine() {
  const [active, setActive] = useState(2);
  const scene = scenes[active];

  return (
    <section className={styles.machine} aria-labelledby="time-machine-title">
      <header className={styles.header}>
        <div><span>MEMORY TIME MACHINE</span><b>DEMO FIXTURE / LOCAL-FIRST</b></div>
        <i aria-hidden="true"><u /></i>
      </header>

      <div className={styles.viewport} data-scene={scene.id}>
        <div className={styles.orbits} aria-hidden="true"><i /><i /><i /><b /></div>
        <div className={styles.readout}>
          <span>{scene.time}</span>
          <small>STATE / {scene.state}</small>
          <h2 id="time-machine-title">{scene.title}</h2>
          <blockquote>{scene.query}</blockquote>
        </div>

        <div className={styles.receipt} aria-live="polite">
          <div><span>AUTHORITY</span><b>LOCAL SQLITE</b></div>
          <div><span>PATH</span><b>{scene.source}</b></div>
          <div><span>RECEIPT</span><b>{scene.receipt}</b></div>
          <p>{scene.note}</p>
        </div>
      </div>

      <div className={styles.controls} role="group" aria-label="Choose a moment in the memory lifecycle">
        {scenes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            data-event="memory_demo_step"
            data-event-label={item.id}
          >
            <span>{item.index}</span><b>{item.label}</b><i aria-hidden="true" />
          </button>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>Move through capture, supersession, recall, and witnessed evidence.</p>
        <Link href="/install" data-event="primary_cta_clicked" data-event-context="time_machine">Install the memory plane →</Link>
      </footer>
    </section>
  );
}
