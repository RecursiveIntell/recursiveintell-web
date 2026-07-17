"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./composer.module.css";

type Package = { name: string; description: string; domain: string; version: string; published: boolean };

const goals = [
  { id: "memory", label: "Durable agent memory", line: "Capture, supersede, retrieve, and explain local memory.", packages: ["semantic-memory", "bitemporal-runtime", "knowledge-runtime", "continuity-runtime"] },
  { id: "execution", label: "Witnessed agent execution", line: "Bound plans, tools, effects, and workspace mutation.", packages: ["agent-graph", "llm-tool-runtime", "effect-runtime", "sandbox-workspace"] },
  { id: "release", label: "Release truth gate", line: "Separate claims, attestations, policy, and reproducible evidence.", packages: ["claim-ledger", "attestation-exchange", "verification-policy", "receipt-bench"] },
  { id: "authority", label: "Governed authority", line: "Make delegation, assurance, adjudication, and guard posture explicit.", packages: ["authority-delegation", "assurance-runtime", "verification-adjudication", "agent-guard"] },
  { id: "compression", label: "Measured compression", line: "Encode only behind evaluation and quality gates.", packages: ["quant-codec-core", "quant-eval", "quant-governor", "turbo-quant"] },
] as const;

const postures = [
  { id: "prototype", label: "Minimal", note: "Smallest orientation slice", additions: [] },
  { id: "inspectable", label: "Inspectable", note: "Add receipt measurement", additions: ["receipt-bench"] },
  { id: "authority", label: "Authority boundary", note: "Add claims + policy + assurance", additions: ["claim-ledger", "verification-policy", "assurance-runtime"] },
] as const;

function slug(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export default function StackComposer({ packages }: { packages: Package[] }) {
  const [goalId, setGoalId] = useState<(typeof goals)[number]["id"]>("memory");
  const [postureId, setPostureId] = useState<(typeof postures)[number]["id"]>("inspectable");
  const [copied, setCopied] = useState(false);
  const goal = goals.find((item) => item.id === goalId) || goals[0];
  const posture = postures.find((item) => item.id === postureId) || postures[1];
  const output = useMemo(() => {
    const names = [...new Set([...goal.packages, ...posture.additions])];
    const chosen = names.map((name) => packages.find((item) => item.name === name)).filter((item): item is Package => Boolean(item));
    return postureId === "prototype" ? chosen.slice(0, 2) : chosen;
  }, [goal, packages, posture.additions, postureId]);
  const published = output.filter((item) => item.published);
  const command = published.length ? `cargo add ${published.map((item) => `${item.name}@${item.version}`).join(" ")}` : "No current registry-ready packages in this slice.";

  async function copyCommand() {
    if (!published.length) return;
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className={styles.composer}>
      <div className="wrap">
        <div className={styles.shell}>
          <aside className={styles.inputs}>
            <div className={styles.inputHead}><span>01</span><div><b>Choose an outcome</b><p>One primary responsibility at a time.</p></div></div>
            <div className={styles.goalList}>{goals.map((item) => <button type="button" key={item.id} aria-pressed={goalId === item.id} onClick={() => setGoalId(item.id)} data-event="composer_goal_selected" data-event-label={item.id}><i aria-hidden="true" /><span><b>{item.label}</b><small>{item.line}</small></span></button>)}</div>
            <div className={styles.inputHead}><span>02</span><div><b>Choose the evidence posture</b><p>More posture means more explicit boundaries.</p></div></div>
            <div className={styles.postureList}>{postures.map((item) => <button type="button" key={item.id} aria-pressed={postureId === item.id} onClick={() => setPostureId(item.id)} data-event="composer_posture_selected" data-event-label={item.id}><b>{item.label}</b><small>{item.note}</small></button>)}</div>
          </aside>

          <div className={styles.output}>
            <header><div><span>COMPOSITION / {goal.id.toUpperCase()}</span><h2>{goal.label}</h2></div><b>{output.length} packages</b></header>
            <div className={styles.graph}>
              <div className={styles.core}><small>OUTCOME</small><b>{goal.label}</b><i aria-hidden="true" /></div>
              <div className={styles.nodes}>{output.map((item, index) => <Link href={`/libraries/${slug(item.name)}`} key={item.name} style={{ "--node": index } as React.CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.name}</b><small>{item.domain}</small><em>{item.published ? `crates.io · ${item.version}` : "source record"}</em></Link>)}</div>
            </div>
            <div className={styles.manifest}>
              <div><span>REGISTRY-READY STARTER</span><code tabIndex={0} aria-label="Generated Cargo starter command">{command}</code></div>
              <button type="button" disabled={!published.length} onClick={copyCommand} data-event="composer_command_copied" data-event-label={goal.id}>{copied ? "Copied" : "Copy starter"}</button>
            </div>
            <footer><p>Read each record before composing. Package presence, registry publication, or a suggested edge does not establish compatibility, fitness, or release readiness.</p><Link href="/services" data-event="services_opened" data-event-context="composer">Scope a production boundary with Josh →</Link></footer>
          </div>
        </div>
      </div>
    </section>
  );
}
