import { nvidiaContribution } from "./achievements";

export const workCases = [
  {
    number: "01",
    title: "Mnemes and semantic-memory",
    summary:
      "Persistent agent memory with source history, temporal retrieval, and explicit device ownership.",
    maturity: "Current core / R&D system",
    problem:
      "Agent memory must persist, retrieve relevant prior state, preserve provenance and time, and remain operator-owned.",
    built:
      "A Rust-first memory engine, MCP access layer, agent integration kits, and self-hosted Mnemes server with explicit ownership boundaries.",
    evidence:
      "Public repositories, crates, documentation, tests, and a dedicated product/proof surface.",
    boundary:
      "Public artifacts establish implementation scope, not customer adoption, universal correctness, or production fitness.",
    source: "https://github.com/RecursiveIntell/semantic-memory",
    sourceLabel: "Inspect semantic-memory",
  },
  {
    number: "02",
    title: "Ares agent runtime",
    summary:
      "A Hermes-compatible agent workbench with managed runtime releases, rollback, and explicit evidence boundaries.",
    maturity: "Active development / downstream Hermes distribution",
    problem:
      "A long-running agent needs a stable runtime, inspectable outcomes, and explicit control over its integrations.",
    built:
      "An isolated Ares launcher and runtime control plane with immutable releases, atomic runtime selection, doctor/status checks, rollback, and opt-in RecursiveIntell integrations.",
    evidence:
      "The October 1 source review remains a dated case study. A separate November 16, 2026 source review at Ares revision 4318fe506c60be78e868403d3d9a83b1e704ce33 identified Ares-owned continuity, collaboration, authority and managed-runtime modules alongside inherited Hermes and separately gated Rust integrations. Neither source inspection establishes a completed install or production acceptance.",
    boundary:
      "Ares is an independent RecursiveIntell downstream distribution, not an official Nous Research product. Source presence does not establish installed activation, every provider/platform combination, or production fitness.",
    source: "https://github.com/RecursiveIntell/Ares",
    sourceLabel: "Explore Ares",
  },
  {
    number: "03",
    title: "ClaimLedger and agent-graph",
    summary:
      "Typed execution graphs and claim/evidence history that keep observed outcomes separate from asserted success.",
    maturity: "Public R&D components",
    problem:
      "Agent plans and claims lose value when evidence identity, promotion rules, execution history, and failure states remain implicit.",
    built:
      "Public Rust components for claim/evidence history, typed graph execution, receipt-bearing tool paths, and bounded orchestration.",
    evidence:
      "Published crates, public source, schemas, examples, and test surfaces that can be inspected directly.",
    boundary:
      "Receipts report observed execution. They do not prove factual truth, authorization, security, or task success.",
    source: "https://github.com/RecursiveIntell/agent-graph-mcp",
    sourceLabel: "Inspect agent-graph-mcp",
  },
  {
    number: "04",
    title: "turbo-quant and compression research",
    summary:
      "Experimental Rust quantization and compression with explicit formats and benchmark boundaries.",
    maturity: "Experimental",
    problem:
      "Resource-constrained AI needs smaller representations without hiding formats, quality budgets, or exact fallback paths.",
    built:
      "Experimental Rust quantization and compression primitives with explicit codecs, benchmark surfaces, and raw/exact escape hatches.",
    evidence:
      "Published package records and public source for turbo-quant and related components.",
    boundary:
      "No comparative performance or memory-savings claim is published here without a reproducible, revision-bound benchmark.",
    source: "https://github.com/RecursiveIntell/turbo-quant",
    sourceLabel: "Inspect turbo-quant",
  },
  {
    number: "05",
    title: "proveKV hybrid-state research",
    summary:
      "Content-addressed cache research with receipts that expose both storage savings and model-quality costs.",
    maturity: "Measured research / quality gate open",
    problem:
      "KV-cache and hybrid-state work needs explicit identity, inspectable formats, and evidence that separates storage wins from model-quality costs.",
    built:
      "A receipted two-tier content-addressed cache pool stores one shared cold prefix plus per-agent hot shells, with explicit codecs, manifests, and baseline contracts.",
    evidence:
      "The current N=8 receipts report 40.50× versus an f32-raw baseline for the f32-radii profile and 76.54× for BlockLogU8-radii; the fp16-equivalent ratios are 20.25× and 38.27×.",
    boundary:
      "The current cache-aligned continuation check also degrades from 7.203125 oracle PPL to 24.234375 (+236.44%). N=8 PPL neutrality, framework-cache reduction, decode speedup, and production fitness are explicitly not claimed.",
    source: "https://github.com/RecursiveIntell/proveKV",
    sourceLabel: "Inspect proveKV and its receipts",
  },
  {
    number: "06",
    title: "Recursive Linux recovery workbench",
    summary:
      "A recovery-oriented workstation installer prototype with interactive storage and device decisions.",
    maturity: "Recovery / installer prototype",
    problem:
      "A workstation supporting long-running AI work needs a recoverable operating environment without silently taking storage, credential, or device authority.",
    built:
      "A Fedora 44 recovery-oriented workstation installer prototype packages bounded Wi-Fi recovery, targeted PCIe ASPM mitigation, TLP policy, disk reporting, health projection, and Hermes Workbench profiles while leaving destructive storage and identity choices interactive.",
    evidence:
      "Public source includes a structurally checked hardware-target ISO candidate, a disposable BIOS/QEMU install-and-boot fixture, project tests, and a sanitized evidence receipt dated September 6, 2026.",
    boundary:
      "The repository remains NO-GO for physical USB writing or laptop installation. UEFI installed-system behavior, physical-media validity, full workstation restoration, and hardware safety remain unverified.",
    source: "https://github.com/RecursiveIntell/Recursive-Linux",
    sourceLabel: "Inspect Recursive Linux",
  },
  {
    number: "07",
    title: "NVIDIA PAIR: cluster trust notifications",
    summary:
      "An accepted upstream fix that ties cluster trust notifications to successfully persisted endorsement changes.",
    maturity: `Merged upstream / ${nvidiaContribution.dateLabel}`,
    problem:
      "Duplicate endorsements and unsuccessful persistence must not announce a cluster trust change that did not happen.",
    built:
      "Changed the cluster manager to announce successfully saved endorsement changes. Added regression coverage for duplicates, failed writes, re-pins, concurrent submissions, and persisted read-back.",
    evidence: `${nvidiaContribution.project} PR #${nvidiaContribution.pullRequestNumber} was merged on ${nvidiaContribution.dateLabel} as ${nvidiaContribution.mergeCommit}. The accepted patch and its review are publicly inspectable.`,
    boundary: nvidiaContribution.boundary,
    source: nvidiaContribution.pullRequest,
    sourceLabel: "Inspect the accepted NVIDIA contribution",
  },
  {
    number: "14",
    title: "NVIDIA PAIR: reliable real-socket deadline regression",
    summary:
      "Merged test-only upstream patch ensuring proxy flush timeouts are exercised under real socket backpressure.",
    maturity: "Merged upstream / October 30, 2026",
    problem:
      "An unbounded socket buffer could let the original flush test exhaust its five-second window without reaching blocked I/O.",
    built:
      "Bounded the test's socket buffers and preserved real sockets, pacing, idle deadlines and cancellation assertions without modifying production proxy behavior.",
    evidence:
      "NVIDIA PAIR PR #139 was merged October 30, 2026. A reviewer independently reproduced the negative control by disabling the flush timeout and observing the revised regression fail.",
    boundary:
      "Test reliability is established for this accepted patch; this is not a production proxy fix, performance benchmark, or NVIDIA employment/partnership claim.",
    source: "https://github.com/NVIDIA/Personal-AI-Router/pull/139",
    sourceLabel: "Inspect the merged regression and review",
  },
  {
    "number": "08",
    "title": "Gloss: source-grounded desktop research",
    "summary": "Local-first research notebooks, citations and provider boundaries in a Rust/Tauri desktop app.",
    "maturity": "Source-distributed development",
    "problem": "Researchers need source-aware conversations without surrendering ownership of local documents.",
    "built": "Tauri notebook, source ingestion, local retrieval, citation-aware chat, notes and diagnostic workflows.",
    "evidence": "Public source and repository-scoped verification fixtures; no tagged end-user binary release.",
    "boundary": "Source/build checks do not prove installed workflow, all providers, non-Linux support or production fitness.",
    "source": "https://github.com/RecursiveIntell/Gloss",
    "sourceLabel": "Inspect Gloss"
  },
  {
    "number": "09",
    "title": "ClawGuard: agent skill analysis",
    "summary": "Static and optional semantic inspection of AI agent skills and untrusted extension packages.",
    "maturity": "Development / security analysis tool",
    "problem": "Agent skills can embed prompt injection, obfuscation, credential collection or unsafe executable code.",
    "built": "Python scanners using AST, YARA and static patterns, with optional LLM-assisted semantic review.",
    "evidence": "Public source, rules and tests for the available detector surface.",
    "boundary": "Detection and risk scores are heuristic, not an assurance that a package is malware-free or secure.",
    "source": "https://github.com/RecursiveIntell/ClawGuard",
    "sourceLabel": "Inspect ClawGuard"
  },
  {
    "number": "10",
    "title": "ESP32-S3: measured on-device inference",
    "summary": "Microcontroller LSTM inference with board-specific performance receipts and constrained-runtime optimization.",
    "maturity": "Hardware research / fixture-bound measurement",
    "problem": "Constrained edge devices need useful inference without cloud or GPU assumptions.",
    "built": "Character-level LSTM firmware, trained weights, optimization iterations and testable hardware receipts.",
    "evidence": "Reports 39.52 characters/second for a specific ESP32-S3 H256 fixture; token-equivalent figures are derived.",
    "boundary": "Not a measured BPE tokenizer benchmark, generalized language-model quality result or production hardware certification.",
    "source": "https://github.com/RecursiveIntell/esp32-s3-lstm-proof",
    "sourceLabel": "Inspect hardware proof"
  },
  {
    "number": "11",
    "title": "Recursive Agent: evidence-bearing Rust kernel",
    "summary": "Typed operation envelopes, local bounded execution, verified run packs and offline replay.",
    "maturity": "Experimental local-first execution kernel",
    "problem": "Claimed task completion must be distinguishable from observed and verifiable execution evidence.",
    "built": "Rust workspace for typed operation admission, daemon IPC, run custody, receipts and recorded-evidence replay.",
    "evidence": "Source tests, claims ledger and dated run-pack verification evidence in the public repository.",
    "boundary": "No production, unattended autonomy, live provider-loop or recursive self-improvement qualification is implied.",
    "source": "https://github.com/RecursiveIntell/recursive-agent",
    "sourceLabel": "Inspect Recursive Agent"
  },
  {
    "number": "12",
    "title": "Agent memory integration kits",
    "summary": "Recall hooks, compaction and source-aware memory connections for supported coding agents.",
    "maturity": "Host-specific integration kit",
    "problem": "Agent memory needs explicit lifecycle, access and identity boundaries across hosts.",
    "built": "MCP tools and host integrations linking semantic memory, context governance and source-evidence workflows.",
    "evidence": "Public host-specific packages, contracts, setup instructions and test surfaces.",
    "boundary": "Installed, registered and exercised integrations are different claims; each environment requires its own validation.",
    "source": "https://github.com/RecursiveIntell/agent-memory-kits",
    "sourceLabel": "Inspect host kits"
  },
  {
    "number": "13",
    "title": "Linux operator tooling and bounded remote builds",
    "summary": "Diagnostics, reversible operations and restricted architecture-specific Rust compilation.",
    "maturity": "Tools and Linux alpha",
    "problem": "Reliable AI work depends on recoverable hosts and reproducible build environments.",
    "built": "PortalDoctor checks Wayland portal errors; CPU Router performs digest-bound allowlisted Cargo jobs over restricted SSH.",
    "evidence": "Two independent public codebases and documented local verification surfaces.",
    "boundary": "Not a certified fleet management platform. CPU Router is explicitly Linux-only alpha.",
    "source": "https://github.com/RecursiveIntell/cpu-router-cargo-automation",
    "sourceLabel": "Inspect CPU Router"
  },
] as const;

// One hiring-oriented order shared by the identity and selected-work pages.
export const careerWorkCases = [
  "07",
  "14",
  "02",
  "11",
  "10",
  "08",
  "09",
  "12",
  "13",
  "01",
  "03",
  "06",
  "05",
  "04",
].flatMap((number) => workCases.filter((item) => item.number === number));

export const featuredWorkCases = ["02", "01", "03"].flatMap((number) =>
  workCases.filter((item) => item.number === number),
);
