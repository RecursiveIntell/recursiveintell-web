import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

export default function NowPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Now"
        title="Current Focus"
        description="Rust-first local AI runtimes, evidence-aware memory, and autonomous agents."
      />
      <Container className="py-12">
        <div className="prose">
          <p>
            The primary focus right now is the Rust evidence-runtime stack and
            autonomous AI: <Link href="/projects/aidens"><strong>AiDENs</strong></Link>{" "}
            closed-loop self-learning, <strong>semantic-memory</strong> as a
            published MCP server, and the broader RecursiveIntell library
            workspace.
          </p>

          <h2>AiDENs Autonomous Loop</h2>
          <p>
            AiDENs is a closed-loop self-learning AI system built in Rust. It
            audits its own typed knowledge graph to find structural and
            content-level gaps, generates prioritized tasks to fill them,
            executes those tasks via a local LLM (Ollama), captures results as
            provenance-attributed facts with graph edges, evaluates fact
            quality through a governance gate, and records RL routing feedback
            for adaptive retrieval.
          </p>
          <ul>
            <li>
              <strong>14 iterations</strong> demonstrated,{" "}
              <strong>12/12 tasks completed</strong>,{" "}
              <strong>29 facts captured</strong>.
            </li>
            <li>
              <strong>8 mission types</strong> with adaptive priority
              scheduling: verify published crates, detect contradictions, verify
              file references, verify codebase sync, trace provenance chains,
              stale date detection, find duplicates, and audit namespace
              completeness.
            </li>
            <li>
              <strong>56K LOC across 36 crates</strong> with 668 tests (506 core
              + 162 autonomous).
            </li>
            <li>
              In development &mdash; not yet published to crates.io.
            </li>
          </ul>

          <h2>semantic-memory</h2>
          <p>
            The knowledge graph substrate that powers AiDENs is now published
            on crates.io. It provides typed edges (semantic, temporal, causal,
            entity), bitemporal search, contradiction detection, factor graph
            belief propagation, and RL-trained adaptive retrieval routing.
          </p>
          <ul>
            <li><strong>48 MCP tools</strong> with tool profile gating (lean / standard / full)</li>
            <li><strong>15 HTTP endpoints</strong> for programmatic access</li>
            <li><strong>RL routing</strong> with persistence across sessions</li>
            <li><strong>Auto-management</strong>: integrity checks, vacuum, re-embed via HTTP</li>
            <li>Available on crates.io: <code>semantic-memory</code> and <code>semantic-memory-mcp</code></li>
          </ul>

          <h2>semantic-memory-claude-kit</h2>
          <p>
            A Claude Code plugin for semantic-memory integration. Version
            0.5.2 is available on GitHub with auto-recall, auto-capture, dedup
            guard, receipts, primer, and maintenance hooks.
          </p>

          <h2>Published Crates</h2>
          <p>
            The following crates are published on crates.io:
          </p>
          <ul>
            <li><code>semantic-memory</code> &mdash; typed knowledge graph with provenance</li>
            <li><code>semantic-memory-mcp</code> &mdash; MCP server binary</li>
            <li><code>turbo-quant</code> &mdash; quantization research (4K+ downloads)</li>
            <li><code>claim-ledger</code> &mdash; claim and evidence compiler</li>
            <li><code>stack-ids</code> &mdash; shared identifiers and trace primitives</li>
          </ul>

          <h2>Other Active Tracks</h2>
          <ul>
            <li>
              <strong>Recall</strong> &mdash; enforcing daemon-owned authority,
              runtime truth, receipts, doctor reports, and repair packet
              generation.
            </li>
            <li>
              <strong>Gloss</strong> &mdash; proving desktop chat produces visible
              tokens, visible errors, or durable attempt traces for every
              prompt.
            </li>
            <li>
              <strong>ClaimLedger</strong> &mdash; turning raw claim compilation into
              source-spanned bundles, support judgments, contradiction records,
              review queues, and testimony exports for Gloss.
            </li>
            <li>
              <strong>Libraries</strong> &mdash; keeping canonical Rust crates,
              satellite utilities, and quantization research separated by
              explicit support boundaries.
            </li>
          </ul>

          <p className="text-sm text-[color:var(--color-muted)]">
            <em>Last updated: June 2026</em>
          </p>

          <p>
            Want more detail? Browse the{" "}
            <Link href="/projects">Projects</Link>, the{" "}
            <Link href="/lab">Lab</Link>, or the latest{" "}
            <Link href="/writing">Writing</Link>.
          </p>
        </div>
      </Container>
    </div>
  );
}