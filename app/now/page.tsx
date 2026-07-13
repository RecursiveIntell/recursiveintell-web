import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

export default function NowPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Now"
        title="Current Focus"
        description="Package the agent evidence stack. Keep TurboQuant/PolyKV as the research lane. Showcase Gloss and ESP32."
      />
      <Container className="py-12">
        <div className="prose">
          <p>
            Per the{" "}
            <strong>2026-07-10 portfolio audit</strong>, attention concentrates on four
            surfaces. Everything else either feeds those lanes or stays secondary.
          </p>

          <h2>
            1. Agent evidence stack (lead){" "}
            <Link href="/projects/agent-memory-kits">Agent Memory Kits</Link>
          </h2>
          <p>
            Highest-potential product wedge: a <strong>local flight recorder</strong> for
            agent work — hybrid memory, receipt-backed context compaction, and
            claim/evidence promote/reject decisions.
          </p>
          <ul>
            <li>
              <code>semantic-memory</code> / <code>semantic-memory-mcp</code> — SQLite-authoritative
              hybrid search, bitemporal truth, MCP tools
            </li>
            <li>
              <code>context-governor</code> — deterministic compaction with exact fallback
            </li>
            <li>
              <Link href="/projects/claimledger">
                <code>claim-ledger</code>
              </Link>{" "}
              — source-spanned claims, contradictions, testimony
            </li>
            <li>Nine host plugins (Claude Code, Cursor, Windsurf, Codex, and more)</li>
          </ul>
          <p>
            <strong>P0:</strong> one public demo a stranger can finish in under 15 minutes
            (install → ingest → recall → supersession → contradiction → proof packet).
          </p>

          <h2>
            2. Compression research{" "}
            <Link href="/projects/turbo-quant">TurboQuant</Link> ·{" "}
            <Link href="/projects/poly-kv">PolyKV</Link>
          </h2>
          <p>
            Strongest external technical signal (crates.io downloads / GitHub stars for
            turbo-quant). PolyKV targets shared compressed KV-cache pools with
            compressed-domain scoring and local benchmark receipts (including 5.81× multi-head
            batch at 32K vs exact f32 on CPU — local, not external superiority).
          </p>
          <ul>
            <li>Keep turbo-quant as the legible published crate</li>
            <li>Land one real inference-runtime integration with full replay scripts</li>
            <li>Do not lead the whole portfolio with compression until external reproduction exists</li>
          </ul>

          <h2>
            3. Edge proof{" "}
            <Link href="/projects/esp32-sentinel">ESP32-S3 Sentinel</Link>
          </h2>
          <p>
            Always-on $4 ESP32-S3 sentinel with a local char-LSTM decision tier and
            wake-on-need gateway. 11.6 tok/s H512 hardware-verified on Freenove WROOM N8R8.
            Best used as systems-depth proof, not the primary software company wedge.
          </p>

          <h2>
            4. Showcase app{" "}
            <Link href="/projects/gloss">Gloss</Link>
          </h2>
          <p>
            Highest repository star count in the inspected portfolio. Local-first knowledge
            desktop (NotebookLM-style positioning). Strategic role: visible application powered
            by the evidence stack — not a separate strategic center.
          </p>

          <h2>Published crates (selected)</h2>
          <ul>
            <li>
              <code>semantic-memory</code> / <code>semantic-memory-mcp</code>
            </li>
            <li>
              <code>turbo-quant</code>
            </li>
            <li>
              <code>poly-kv</code>
            </li>
            <li>
              <code>claim-ledger</code>
            </li>
            <li>
              <code>context-governor</code>
            </li>
            <li>
              <code>stack-ids</code>
            </li>
          </ul>

          <h2>Secondary (listed, not featured)</h2>
          <ul>
            <li>
              <Link href="/projects/recall">Recall</Link> — operator shell (consolidate over time)
            </li>
            <li>
              <Link href="/projects/aidens">AiDENs</Link> — mine modules; do not launch whole platform yet
            </li>
            <li>
              <Link href="/projects/palisade">Palisade</Link>,{" "}
              <Link href="/projects/visionforge">VisionForge</Link>,{" "}
              <Link href="/projects/sortarr">Sortarr</Link>,{" "}
              <Link href="/projects/projmind">projmind</Link>
            </li>
          </ul>

          <p className="text-sm text-[color:var(--color-muted)]">
            <em>Last updated: July 11, 2026 — aligned with portfolio potential audit</em>
          </p>

          <p>
            Browse <Link href="/projects">Projects</Link> (✦ = featured) or the{" "}
            <Link href="/">home</Link> work lanes.
          </p>
        </div>
      </Container>
    </div>
  );
}
