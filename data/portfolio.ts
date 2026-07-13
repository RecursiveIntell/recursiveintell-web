/**
 * Portfolio data ranked by PORTFOLIO_POTENTIAL_AUDIT_2026-07-10.
 * Featured = strategic showcase. Listed but unfeatured = keep as depth, not lead.
 */
export const categories = [
  {
    id: "evidence",
    name: "Agent Evidence",
    glyph: "✦",
    tag: "flight-recorder",
    desc: "Local memory, claims, receipts, and governed context for coding agents.",
    pose: "scroll",
  },
  {
    id: "research",
    name: "Compression Research",
    glyph: "✧",
    tag: "kv-cache",
    desc: "Published crates and benchmark-backed compression work.",
    pose: "brush",
  },
  {
    id: "edge",
    name: "Edge & Hardware",
    glyph: "◈",
    tag: "measured-boards",
    desc: "ESP32-S3 edge AI with real-device receipts.",
    pose: "shuriken",
  },
  {
    id: "apps",
    name: "Applications",
    glyph: "✺",
    tag: "showcase",
    desc: "User-facing apps powered by the stack, plus operator tools.",
    pose: "sword",
  },
] as const;

export const projects = [
  // --- Featured: audit ranks 1–4 + core substrate ---
  {
    id: "agent-memory-kits",
    slug: "agent-memory-kits",
    name: "Agent Memory Kits",
    cat: "evidence",
    featured: true,
    status: "active",
    date: "July 2026",
    blurb:
      "Local flight recorder for agent work: persistent memory, receipt-backed compaction, and claim/evidence provenance across nine agent hosts.",
    stack: ["rust", "mcp", "semantic-memory", "receipts"],
  },
  {
    id: "claimledger",
    slug: "claimledger",
    name: "ClaimLedger",
    cat: "evidence",
    featured: true,
    status: "active",
    date: "July 2026",
    blurb:
      "Deterministic claim/evidence ledger: source spans, support judgments, contradictions, promote/reject/quarantine decisions, and testimony export.",
    stack: ["claims", "evidence", "schemas", "receipts"],
  },
  {
    id: "rust-libraries",
    slug: "rust-libraries",
    name: "Rust Libraries",
    cat: "evidence",
    featured: true,
    status: "active",
    date: "July 2026",
    blurb:
      "Canonical crate workspace: semantic-memory, context-governor, bitemporal-runtime, verification lanes, and shared contracts.",
    stack: ["rust", "sqlite", "mcp", "verification"],
  },
  {
    id: "turbo-quant",
    slug: "turbo-quant",
    name: "TurboQuant",
    cat: "research",
    featured: true,
    status: "active",
    date: "July 2026",
    blurb:
      "Published vector compression crate (PolarQuant, TurboQuant, QJL). Strongest external signal: crates.io downloads and GitHub stars.",
    stack: ["rust", "compression", "embeddings", "crates.io"],
  },
  {
    id: "poly-kv",
    slug: "poly-kv",
    name: "PolyKV",
    cat: "research",
    featured: true,
    status: "active",
    date: "July 2026",
    blurb:
      "Shared compressed KV-cache pool with compressed-domain scoring — 5.81× multi-head batch at 32K vs exact f32 (local CPU receipt).",
    stack: ["rust", "kv-cache", "multi-agent", "benchmarks"],
  },
  {
    id: "esp32-sentinel",
    slug: "esp32-sentinel",
    name: "ESP32-S3 Sentinel",
    cat: "edge",
    featured: true,
    status: "active",
    date: "July 2026",
    blurb:
      "Always-on $4 ESP32-S3 sentinel with local char-LSTM tier and wake-on-need gateway. 11.6 tok/s H512 hardware-verified.",
    stack: ["rust", "esp32s3", "no_std", "tinyml"],
  },
  {
    id: "gloss",
    slug: "gloss",
    name: "Gloss",
    cat: "apps",
    featured: true,
    status: "active",
    date: "May 2026",
    blurb:
      "Local-first NotebookLM-style desktop app: grounded chat over personal documents with source-linked answers (highest repo star count).",
    stack: ["rust", "tauri", "ollama", "rag"],
  },
  // --- Listed depth, not lead surfaces ---
  {
    id: "recall",
    slug: "recall",
    name: "Recall",
    cat: "apps",
    featured: false,
    status: "active",
    date: "May 2026",
    blurb:
      "Operator-grade local memory/control runtime with daemon authority, doctor reports, and repair packets.",
    stack: ["rust", "ipc", "sqlite", "receipts"],
  },
  {
    id: "aidens",
    slug: "aidens",
    name: "AiDENs",
    cat: "apps",
    featured: false,
    status: "active",
    date: "June 2026",
    blurb:
      "Closed-loop self-learning modules on semantic-memory — gap detection and provenance-attributed facts (component mine, not platform launch).",
    stack: ["rust", "autonomous", "knowledge-graph"],
  },
  {
    id: "palisade",
    slug: "palisade",
    name: "Palisade",
    cat: "apps",
    featured: false,
    status: "active",
    date: "May 2026",
    blurb:
      "Native Linux nftables GUI with privilege separation, validate → snapshot → apply → rollback.",
    stack: ["rust", "tauri", "linux", "nftables"],
  },
  {
    id: "sortarr",
    slug: "sortarr",
    name: "Sortarr",
    cat: "apps",
    featured: false,
    status: "active",
    date: "May 2026",
    blurb:
      "Self-hosted media organizer with metadata matching, review gates, and planned dry-run/rollback receipts.",
    stack: ["rust", "sqlite", "websocket", "media"],
  },
  {
    id: "visionforge",
    slug: "visionforge",
    name: "VisionForge",
    cat: "apps",
    featured: false,
    status: "active",
    date: "May 2026",
    blurb:
      "Local Ollama + ComfyUI prompt studio with queues, gallery, and generation metadata.",
    stack: ["rust", "tauri", "ollama", "comfyui"],
  },
  {
    id: "projmind",
    slug: "projmind",
    name: "projmind",
    cat: "apps",
    featured: false,
    status: "active",
    date: "May 2026",
    blurb:
      "Rust CLI daemon that maintains a local software-project knowledge base via git, tree-sitter, and Ollama.",
    stack: ["rust", "cli", "daemon", "ollama"],
  },
] as const;

export const recentAudit = [
  {
    when: "Jul 10",
    label: "Portfolio audit: focus agent evidence + TurboQuant/PolyKV + ESP32 + Gloss",
    cat: "audit",
  },
  {
    when: "Jul 3",
    label: "ESP32-S3 Sentinel: 11.6 tok/s on real hardware",
    cat: "content",
  },
  {
    when: "Jun 25",
    label: "AiDENs autonomous loop demonstrated",
    cat: "content",
  },
  {
    when: "Jun 24",
    label: "semantic-memory published; agent-memory-kits host plugins live",
    cat: "content",
  },
] as const;

export const stack = [
  { name: "rust", n: 12, ctx: "crates, daemons, desktop, embedded" },
  { name: "mcp", n: 3, ctx: "agent host plugins" },
  { name: "sqlite", n: 6, ctx: "authoritative local state" },
  { name: "receipts", n: 5, ctx: "operation proof surfaces" },
  { name: "compression", n: 2, ctx: "turbo-quant · poly-kv" },
  { name: "tauri", n: 4, ctx: "desktop shells" },
  { name: "ollama", n: 5, ctx: "local inference" },
  { name: "embedded", n: 1, ctx: "esp32-s3 no_std" },
  { name: "linux", n: 2, ctx: "operator target" },
] as const;

/** Featured-only view helpers for hero stats */
export const featuredCount = projects.filter((p) => p.featured).length;
export const projectCount = projects.length;
