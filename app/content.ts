export const coreLinks = {
  mnemesGithub: "https://github.com/RecursiveIntell/mnemes",
  mnemesCrate: "https://crates.io/crates/mnemes",
  mnemesDocs: "https://docs.rs/mnemes",
  memoryGithub: "https://github.com/RecursiveIntell/semantic-memory",
  memoryCrate: "https://crates.io/crates/semantic-memory",
  memoryDocs: "https://docs.rs/semantic-memory",
  mcpGithub: "https://github.com/RecursiveIntell/semantic-memory-mcp",
  mcpCrate: "https://crates.io/crates/semantic-memory-mcp",
  kitsGithub: "https://github.com/RecursiveIntell/agent-memory-kits",
  recursiveIntell: "https://recursiveintell.com",
  recursiveGithub: "https://github.com/RecursiveIntell",
  recursiveCrates: "https://crates.io/users/RecursiveIntell",
  email: "mailto:josh@recursiveintell.com",
  nodeInterest: "mailto:josh@recursiveintell.com?subject=Mnemes%20Node%20R1%20custom%20build",
  arduinoUnoQ: "https://docs.arduino.cc/hardware/uno-q",
  hermesGithub: "https://github.com/NousResearch/hermes-agent",
  qwenModel: "https://huggingface.co/Qwen/Qwen3.5-0.8B",
};

export const statusLanes = [
  {
    status: "released",
    title: "Self-hosted Mnemes server",
    body: "Public Rust software for hardware you control, with device and actor identity, per-device server shards, routed witnessed search, idempotent operation envelopes, and durable routing receipts.",
  },
  {
    status: "released",
    title: "Semantic memory engine",
    body: "SQLite-authoritative hybrid retrieval with temporal views, graph relationships, provenance, governed mutation, optional receipts, and explicit replay privacy.",
  },
  {
    status: "in development",
    title: "Device-owned replication",
    body: "The target design keeps canonical databases on their home devices and synchronizes replayable server replicas. Continuous replication is not yet a released claim.",
  },
];

export const doctrines = [
  ["01", "Local before remote", "Keep durable context near the work. Expose network and authority boundaries instead of turning a hosted service into an invisible dependency."],
  ["02", "Memory is not authority", "Retrieval may surface evidence. It does not decide whether an agent may assert, act, export, or rewrite durable state."],
  ["03", "Truth has two clocks", "Valid time records when a statement applies. Recorded time preserves when the system learned it. Historical questions require both."],
  ["04", "Receipts, not theatre", "Record what ran, which state was used, what degraded, and what was retained. A receipt is evidence—not factual correctness."],
  ["05", "Append, then supersede", "Corrections become new linked artifacts. Prior states remain inspectable instead of disappearing behind a confident overwrite."],
  ["06", "Indexes accelerate truth", "FTS, vectors, compressed candidates, caches, and summaries are rebuildable projections. SQLite remains authoritative."],
  ["07", "Typed failure is product", "Blocked, degraded, partial, stale, and failed must not collapse into a successful-looking response."],
  ["08", "Claims stop at proof", "Source, package, live runtime, benchmark, and receipt evidence are separate scopes. No layer inherits a stronger claim for free."],
];

export const hosts = [
  ["Claude Code", "Hook tier", "Recall, primer, capture, and compaction lifecycle hooks."],
  ["Codex", "Hook tier", "MCP configuration, Python hooks, prompts, and memory skills."],
  ["Hermes", "Hook tier", "Hooks, commands, and skills around one canonical store."],
  ["Cursor", "Context tier", "MCP plus project-local memory context rules."],
  ["Windsurf", "Context tier", "MCP and deterministic context-injection guidance."],
  ["Cline", "Context tier", "MCP plus project or user-scoped rules."],
  ["Roo Code", "Context tier", "MCP tools with host-native instruction files."],
  ["Continue", "Context tier", "MCP registration and shared context commands."],
  ["OpenCode", "Context tier", "MCP registration and local memory rules."],
];
