"use client";

import { useMemo, useState } from "react";
import styles from "./observatory.module.css";

type Mode = "a" | "b" | "diff";

const query = "Which migration target did the team approve for the cache layer?";

const runA = {
  run_id: "demo-run-a",
  state_view: "known_then / fixture-t0",
  candidates: "0 durable decision records",
  result: "INSUFFICIENT_EVIDENCE",
  degradation: "memory context unavailable",
  replay: "receipt only; source material not retained",
};

const runB = {
  run_id: "demo-run-b",
  state_view: "known_now / fixture-t1",
  candidates: "lexical:1 · dense:1 · fused:1",
  result: "Retain SQLite as canonical owner; treat the vector index as derived.",
  degradation: "none declared in fixture",
  replay: "deterministic fixture source retained",
};

const explanations: Record<keyof typeof runA, { title: string; copy: string; scope: string }> = {
  run_id: { title: "Run identity", copy: "A receipt needs a stable identity so another artifact can refer to this execution without copying or silently rewriting it.", scope: "Identity supports correlation. It does not establish correctness." },
  state_view: { title: "Temporal state view", copy: "The answer is bound to the state the run was allowed to see. “Known then” and “known now” can legitimately produce different results.", scope: "A state view explains temporal scope; it does not prove the source was true." },
  candidates: { title: "Retrieval candidates", copy: "Candidate lanes show which retrieval paths contributed before fusion. Run A had no durable decision; Run B had a deterministic fixture record.", scope: "Candidate counts are a demo fixture, not benchmark measurements." },
  result: { title: "Typed result", copy: "The first run refuses to manufacture an answer. The second returns the retained decision only after the fixture makes it available.", scope: "A retrieved decision is relevant context, not automatic action authority." },
  degradation: { title: "Degradation record", copy: "Optional capability loss remains visible. A degraded path should not masquerade as a complete, fully witnessed result.", scope: "“None declared” means this fixture recorded none; it is not a system-wide health claim." },
  replay: { title: "Replay boundary", copy: "Receipts and replay are distinct. Reproduction requires deliberate retention of the material needed to reconstruct the run.", scope: "This page replays static fixture data. It does not execute a model or inspect a visitor's machine." },
};

const keys = Object.keys(runA) as Array<keyof typeof runA>;

export default function ReceiptLab() {
  const [mode, setMode] = useState<Mode>("a");
  const [field, setField] = useState<keyof typeof runA>("state_view");
  const [copyState, setCopyState] = useState("Copy demo receipt");
  const activeReceipt = mode === "b" ? runB : runA;
  const activeLabel = mode === "b" ? "Run B / retained fixture" : "Run A / no durable memory";
  const detail = explanations[field];
  const json = useMemo(() => JSON.stringify({ fixture: true, redacted: true, query, ...activeReceipt }, null, 2), [activeReceipt]);

  async function copyReceipt() {
    try {
      await navigator.clipboard.writeText(json);
      setCopyState("Copied demo JSON");
      window.setTimeout(() => setCopyState("Copy demo receipt"), 1800);
    } catch {
      setCopyState("Copy unavailable");
    }
  }

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <div className={styles.fixtureFlag}><span>Demo fixture</span><span>Redacted</span><span>Not live AI</span></div>
        <div className={styles.modeTabs} aria-label="Receipt view">
          <button type="button" aria-pressed={mode === "a"} onClick={() => setMode("a")} data-event="receipt_run_selected" data-event-label="a">Run A</button>
          <button type="button" aria-pressed={mode === "b"} onClick={() => setMode("b")} data-event="receipt_run_selected" data-event-label="b">Run B</button>
          <button type="button" aria-pressed={mode === "diff"} onClick={() => setMode("diff")} data-event="receipt_diff_opened">Compare</button>
        </div>
      </div>
      <div className={styles.queryStrip}><span>FIXTURE_QUERY</span><code>{query}</code></div>

      {mode === "diff" ? (
        <div className={styles.diffGrid}>
          {[{ label: "RUN A", title: "No durable decision", receipt: runA }, { label: "RUN B", title: "Retained decision available", receipt: runB }].map((run) => (
            <section className={styles.diffRun} key={run.label} aria-label={run.title}>
              <div className={styles.diffHead}><span className={styles.cardLabel}>{run.label}</span><strong>{run.title}</strong></div>
              <dl className={styles.diffRows}>
                {keys.map((key) => <div className={`${styles.diffRow} ${runA[key] !== runB[key] ? styles.changed : ""}`} key={key}><dt>{key.replace("_", " ")}</dt><dd>{run.receipt[key]}</dd></div>)}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.receiptGrid}>
          <div className={styles.fieldRail} aria-label="Receipt fields">
            {keys.map((key) => (
              <button className={styles.fieldButton} type="button" key={key} aria-pressed={field === key} onClick={() => setField(key)} data-event="receipt_field_opened" data-event-label={key}>
                <span className={styles.fieldDot} aria-hidden="true" /><b>{key.replace("_", " ")}</b><small>inspect</small>
              </button>
            ))}
          </div>
          <section className={styles.fieldDetail} aria-live="polite">
            <span className={styles.cardLabel}>{activeLabel}</span>
            <h3>{detail.title}</h3>
            <p>{detail.copy}</p>
            <div className={styles.valueBlock}><small>OBSERVED FIXTURE VALUE</small><code>{activeReceipt[field]}</code></div>
            <p className={styles.boundaryNote}>{detail.scope}</p>
          </section>
        </div>
      )}

      <div className={styles.labFooter}>
        <span>Deterministic teaching fixture · no visitor data · no model call · demo identifiers are non-operational</span>
        {mode !== "diff" ? <button className={styles.copyButton} type="button" onClick={copyReceipt} data-event="receipt_demo_copied"><span aria-live="polite">{copyState}</span></button> : null}
      </div>
    </div>
  );
}
