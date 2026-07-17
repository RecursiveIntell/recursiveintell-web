export type HostSlug =
  | "claude-code"
  | "codex"
  | "hermes"
  | "cursor"
  | "mcp"
  | "rust";

export type OsId = "macos" | "linux" | "windows";
export type ShellId = "zsh" | "bash" | "powershell";

export interface CommandBlock {
  id: string;
  label: string;
  context: string;
  code: string;
  language: "bash" | "powershell" | "text" | "json" | "rust";
}

interface PlatformCommands {
  all?: readonly CommandBlock[];
  posix?: readonly CommandBlock[];
  powershell?: readonly CommandBlock[];
}

export interface InstallGuide {
  slug: HostSlug;
  name: string;
  shortName: string;
  index: string;
  tier: string;
  fit: string;
  summary: string;
  description: string;
  capability: readonly string[];
  prerequisites: readonly { label: string; detail: string }[];
  supportedOs: readonly OsId[];
  osBoundary?: string;
  commands: {
    setup: PlatformCommands;
    verify: PlatformCommands;
    dayOne?: PlatformCommands;
  };
  expected: readonly { title: string; detail: string }[];
  dayOne: readonly string[];
  troubleshooting: readonly { symptom: string; response: string }[];
  uninstall: readonly string[];
  boundary: string;
  sources: readonly { label: string; href: string }[];
}

const repository = "https://github.com/RecursiveIntell/agent-memory-kits";

export const INSTALL_GUIDES: readonly InstallGuide[] = [
  {
    slug: "claude-code",
    name: "Claude Code",
    shortName: "Claude",
    index: "01",
    tier: "Tier 0 · hooked",
    fit: "Recommended first install",
    summary: "The shortest path to lifecycle-aware memory.",
    description:
      "A marketplace plugin with session primer, prompt recall, pre-compaction capture guidance, ingestion, doctors, and evidence workflows.",
    capability: ["Session primer", "Prompt recall", "Pre-compact guidance", "Fail-open hooks"],
    prerequisites: [
      { label: "Claude Code", detail: "Installed and able to open the /plugin interface." },
      { label: "Rust + cargo", detail: "A stable Rust toolchain; /memory-setup uses it to install the server." },
      { label: "Python 3", detail: "Used by setup, ingestion, doctor, and evidence helpers." },
      { label: "Model cache", detail: "Allow roughly 550 MB for the first local embedding-model download." },
    ],
    supportedOs: ["macos", "linux"],
    osBoundary:
      "The shipped lifecycle hooks and helper recipes use POSIX shell scripts. The upstream guide does not publish a native-Windows sequence; use macOS, Linux, or a deliberately validated POSIX environment rather than translating the hooks by guesswork.",
    commands: {
      setup: {
        all: [
          {
            id: "claude-install",
            label: "Run inside Claude Code",
            context: "These are host commands, not terminal commands.",
            language: "text",
            code: "/plugin marketplace add RecursiveIntell/agent-memory-kits\n/plugin install semantic-memory@semantic-memory-kit\n/memory-setup",
          },
        ],
      },
      verify: {
        all: [
          {
            id: "claude-verify",
            label: "Ingest a repository you understand",
            context: "Restart Claude Code once before running these host commands.",
            language: "text",
            code: "/memory-ingest .\n/hooks",
          },
        ],
      },
      dayOne: {
        all: [
          {
            id: "claude-debug",
            label: "Optional hook trace",
            context: "Run in your shell before starting Claude Code; the file may contain operational context, so keep it local.",
            language: "bash",
            code: "export SEMANTIC_MEMORY_HOOK_DEBUG=~/sm-hooks.log\ntail -f ~/sm-hooks.log",
          },
        ],
      },
    },
    expected: [
      { title: "Plugin loaded", detail: "After one restart, /hooks shows the installed lifecycle wiring." },
      { title: "Facts written", detail: "/memory-ingest . creates repository facts in a code-scoped namespace." },
      { title: "Selective recall", detail: "A question answerable from that repository can return relevant facts; unrelated prompts should inject nothing." },
      { title: "Empty is healthy", detail: "A clean store returning no recall before ingestion is the documented day-one behavior." },
    ],
    dayOne: [
      "Ingest the repositories you actually use instead of seeding synthetic facts.",
      "Ask a codebase question whose answer you already know and inspect the returned evidence.",
      "Keep one canonical memory directory if several agent hosts share the same store.",
      "Let recall fail open; a missing or low-scoring memory must never block a prompt.",
    ],
    troubleshooting: [
      { symptom: "Hooks do not fire", response: "Restart Claude Code or open /hooks once. Hook configuration reloads at session start." },
      { symptom: "Recall is silent", response: "Confirm the warm server is available. The hook can fall back to a slower stdio cold start." },
      { symptom: "Recall is noisy", response: "Raise SM_RECALL_MINTOP from its documented 0.58 default; measure before keeping the change." },
      { symptom: "/memory-setup fails", response: "Update the stable Rust toolchain, then rerun /memory-setup." },
    ],
    uninstall: [
      "Remove semantic-memory@semantic-memory-kit through Claude Code's plugin interface.",
      "Restart Claude Code so the removed hooks are no longer loaded.",
      "The plugin removal does not imply deletion of ~/.local/share/semantic-memory; retain or remove that local data separately and deliberately.",
    ],
    boundary:
      "Capture is model-nudged, not an automatic transcript dump. Recall is relevance evidence, not truth or permission to act. Every hook is designed to fail open.",
    sources: [
      { label: "Claude integration source", href: `${repository}/tree/main/claude` },
      { label: "Capability matrix", href: `${repository}#capability-matrix` },
    ],
  },
  {
    slug: "codex",
    name: "Codex CLI",
    shortName: "Codex",
    index: "02",
    tier: "Tier 0 · hooked",
    fit: "Hooks + prompt library",
    summary: "Memory workflows built into a Codex plugin.",
    description:
      "A reference integration with prompt recall, project priming, automatic deduplicated codebase ingestion, compaction receipts, skills, and operation-specific prompts.",
    capability: ["Prompt recall", "Auto-ingest hook", "Compaction receipts", "Operation prompts"],
    prerequisites: [
      { label: "Codex CLI", detail: "A build with plugin marketplace support available." },
      { label: "Git", detail: "The published installation uses a local checkout as its marketplace source." },
      { label: "Rust + cargo", detail: "Stable toolchain for the local MCP companion binaries." },
      { label: "Python 3", detail: "Required by hooks, doctors, ingestion, and evidence scripts." },
    ],
    supportedOs: ["macos", "linux"],
    osBoundary:
      "The published hooks, doctors, and optional trace recipe use POSIX shell and Python. The upstream guide does not document a native-Windows sequence; use macOS, Linux, or a deliberately validated POSIX environment.",
    commands: {
      setup: {
        all: [
          {
            id: "codex-install",
            label: "Clone and register the plugin",
            context: "Run from the parent directory where you want to keep the canonical checkout.",
            language: "bash",
            code: "git clone https://github.com/RecursiveIntell/agent-memory-kits\ncd agent-memory-kits\ncodex plugin marketplace add ./codex\ncodex plugin add semantic-memory@semantic-memory-codex-kit",
          },
        ],
      },
      verify: {
        all: [
          {
            id: "codex-doctor",
            label: "Run the host and deep doctors",
            context: "Run from the agent-memory-kits checkout.",
            language: "bash",
            code: "python3 codex/plugins/semantic-memory/scripts/doctor-all.py\npython3 shared/scripts/doctor-all.py --deep",
          },
        ],
      },
      dayOne: {
        all: [
          {
            id: "codex-debug",
            label: "Optional hook trace",
            context: "Set before launching Codex; keep debug output local.",
            language: "bash",
            code: "export SEMANTIC_MEMORY_HOOK_DEBUG=~/sm-hooks.log\ntail -f ~/sm-hooks.log",
          },
        ],
      },
    },
    expected: [
      { title: "Plugin registered", detail: "Codex can load the semantic-memory plugin from the local marketplace checkout." },
      { title: "Doctor receipt", detail: "The deep doctor completes its binary, storage, configuration, and MCP tool-surface checks and writes a local receipt bundle." },
      { title: "Repository queued once", detail: "The prompt hook can queue a deduplicated ingest when it encounters a new working tree." },
      { title: "Hooks are fail-open", detail: "A missing binary, timeout, or malformed response does not block the Codex prompt." },
    ],
    dayOne: [
      "Restart Codex after installation so hook configuration loads at session start.",
      "Open a real repository and verify the automatic ingest once; use the explicit memory-ingest prompt when a large repository exceeds the hook timeout.",
      "Keep Codex's default warm port distinct from another active hook host, or set a stdio-only client to port 0.",
      "Retain the deep doctor receipt when diagnosing a later configuration change.",
    ],
    troubleshooting: [
      { symptom: "Hooks do not fire", response: "Restart Codex. Hook configuration loads at session start." },
      { symptom: "Auto-ingest no-ops", response: "It is bounded by a short timeout. Run the explicit memory-ingest workflow for a larger repository." },
      { symptom: "Warm port conflict", response: "Only one process should own a warm HTTP port. Set SEMANTIC_MEMORY_HTTP_PORT=0 for a stdio-only client." },
      { symptom: "Recall is silent", response: "Check the configured warm port and use the doctor receipt to distinguish a healthy empty store from a missing server." },
    ],
    uninstall: [
      "Remove semantic-memory@semantic-memory-codex-kit through Codex's plugin management surface.",
      "Remove the local marketplace registration if no other plugin depends on the checkout, then restart Codex.",
      "Delete the checkout only if you no longer need its scripts. Treat the memory store and receipt directories as separate local data with their own retention decision.",
    ],
    boundary:
      "Automatic ingest is a convenience with a bounded timeout, not proof that every file was indexed. Receipt-bearing compaction proves retained material and execution scope, not task success.",
    sources: [
      { label: "Codex integration source", href: `${repository}/tree/main/codex` },
      { label: "Top-level architecture", href: `${repository}#architecture` },
    ],
  },
  {
    slug: "hermes",
    name: "Hermes Agent",
    shortName: "Hermes",
    index: "03",
    tier: "Tier 0 · local plugin",
    fit: "Plugin + direct MCP",
    summary: "A local Hermes plugin with guarded setup helpers.",
    description:
      "Copy the current Hermes general plugin from a canonical checkout, enable it, and register semantic-memory-mcp directly with the bounded agent profile.",
    capability: ["Local plugin", "Direct sm_* tools", "Skills + commands", "Proof helpers"],
    prerequisites: [
      { label: "Hermes Agent", detail: "Installed with the plugins and MCP command groups available." },
      { label: "Git", detail: "Keep a checkout because the richer kit expects hermes/ and shared/ as siblings." },
      { label: "Rust + cargo", detail: "Used to install the published semantic-memory-mcp binary." },
      { label: "POSIX shell", detail: "The current published copy-and-enable recipe is written for bash/zsh." },
    ],
    supportedOs: ["macos", "linux"],
    osBoundary:
      "The upstream Hermes guide currently publishes a POSIX copy recipe. A native PowerShell plugin-install sequence is not documented; use a supported POSIX environment or follow the canonical Hermes guide rather than translating paths by guesswork.",
    commands: {
      setup: {
        posix: [
          {
            id: "hermes-checkout",
            label: "Prepare the canonical checkout and binary",
            context: "The exact MCP package pin matches the current published server snapshot used by this site.",
            language: "bash",
            code: "git clone https://github.com/RecursiveIntell/agent-memory-kits\ncd agent-memory-kits\ncargo install semantic-memory-mcp --locked --version '=0.5.4'",
          },
          {
            id: "hermes-install",
            label: "Copy, enable, and register",
            context: "Run from the agent-memory-kits checkout. Keep --args last because it consumes the remaining arguments.",
            language: "bash",
            code: "cp -R hermes \"$HOME/.hermes/plugins/semantic-memory-mcp\"\nhermes plugins enable semantic-memory-mcp\nhermes mcp add semantic_memory --command semantic-memory-mcp \\\n  --args --memory-dir \"$HOME/.local/share/semantic-memory\" --tool-profile agent\nhermes mcp test semantic_memory\nhermes mcp configure semantic_memory",
          },
        ],
      },
      verify: {
        posix: [
          {
            id: "hermes-verify",
            label: "Inspect and test the registered server",
            context: "Restart Hermes after installing or changing plugin code.",
            language: "bash",
            code: "hermes mcp list\nhermes mcp test semantic_memory",
          },
        ],
      },
    },
    expected: [
      { title: "Plugin enabled", detail: "Hermes recognizes semantic-memory-mcp as an enabled local plugin." },
      { title: "MCP test succeeds", detail: "The semantic_memory entry starts the installed binary and completes Hermes's connection test." },
      { title: "Bounded profile", detail: "The MCP server is registered with --tool-profile agent; tools/list remains the runtime source of truth." },
      { title: "Local data path", detail: "The canonical example writes under ~/.local/share/semantic-memory." },
    ],
    dayOne: [
      "Restart Hermes after the copy so plugin code and skills are reloaded.",
      "Use the plugin and MCP command surfaces as published; do not treat plugin.json as Hermes's native loader manifest.",
      "If you deploy the richer kit, keep hermes/ and shared/ as siblings and set SEMANTIC_MEMORY_KIT_ROOT to the checkout.",
      "Use one warm HTTP owner. A stdio-only Hermes client can set the port to 0 when another host owns it.",
    ],
    troubleshooting: [
      { symptom: "Skills are absent", response: "Confirm the installed skill directories exist under the Hermes user directory, then restart Hermes." },
      { symptom: "MCP test fails", response: "Confirm semantic-memory-mcp resolves on PATH and rerun hermes mcp test semantic_memory." },
      { symptom: "--args behaves strangely", response: "Keep --args last. Hermes passes every remaining token to the MCP server." },
      { symptom: "Warm HTTP requests fail", response: "The richer HTTP launcher requires a token. Use a token file or set the port to 0 for stdio-only operation." },
    ],
    uninstall: [
      "Disable semantic-memory-mcp through Hermes's plugin management surface.",
      "Remove the semantic_memory MCP registration through Hermes's MCP configuration surface.",
      "Remove ~/.hermes/plugins/semantic-memory-mcp only after confirming it is the copied plugin directory. The memory database remains separate local data.",
    ],
    boundary:
      "Hermes's current general-plugin loader reads plugin.yaml; plugin.json describes the richer deployment kit and is not itself a native Hermes loader manifest. HTTP use adds an explicit bearer-token boundary.",
    sources: [
      { label: "Hermes integration source", href: `${repository}/tree/main/hermes` },
      { label: "MCP server source", href: "https://github.com/RecursiveIntell/semantic-memory-mcp" },
    ],
  },
  {
    slug: "cursor",
    name: "Cursor",
    shortName: "Cursor",
    index: "04",
    tier: "Tier 1 · MCP + rules",
    fit: "Explicit tool invocation",
    summary: "MCP tools plus project-native context rules.",
    description:
      "A project-local MCP configuration and Cursor rule layer that teaches the agent when to retrieve memory without claiming an unavailable prompt lifecycle hook.",
    capability: ["MCP tool access", "Workspace rules", "Context command", "Deep doctor"],
    prerequisites: [
      { label: "Cursor", detail: "Installed and able to load project-local .cursor configuration." },
      { label: "Git", detail: "The setup scripts run from the agent-memory-kits checkout." },
      { label: "Rust + cargo", detail: "The doctor expects semantic-memory-mcp to be discoverable." },
      { label: "POSIX shell + Python 3", detail: "The published setup is a shell script; doctors and rule installers use Python." },
    ],
    supportedOs: ["macos", "linux"],
    osBoundary:
      "The repository currently publishes setup.sh for Cursor. Native PowerShell setup is not documented. On Windows, use a compatible POSIX environment only if that is also where Cursor resolves the generated absolute server path.",
    commands: {
      setup: {
        posix: [
          {
            id: "cursor-install",
            label: "Install the server and preview the project write",
            context: "Enter the absolute project path above. This block is a dry run and should complete before the write step.",
            language: "bash",
            code: "git clone https://github.com/RecursiveIntell/agent-memory-kits\ncd agent-memory-kits\ncargo install semantic-memory-mcp --locked --version '=0.5.4'\ncursor/scripts/setup.sh --dry-run --write-project \"{{PROJECT_PATH}}\"",
          },
          {
            id: "cursor-write",
            label: "Apply the inspected project write",
            context: "Copy is enabled only after you enter a project path. Run this only after reviewing the dry-run output.",
            language: "bash",
            code: "cursor/scripts/setup.sh --write-project \"{{PROJECT_PATH}}\"",
          },
        ],
      },
      verify: {
        posix: [
          {
            id: "cursor-doctor",
            label: "Run both verification layers",
            context: "Run from the agent-memory-kits checkout, then restart Cursor.",
            language: "bash",
            code: "python3 cursor/scripts/doctor.py\npython3 shared/scripts/doctor-all.py --deep",
          },
        ],
      },
      dayOne: {
        posix: [
          {
            id: "cursor-context",
            label: "Test the explicit context path",
            context: "Tier 1 context retrieval is a command/rule workflow, not an automatic pre-prompt hook.",
            language: "bash",
            code: "python3 shared/scripts/semantic-memory-context.py --prompt \"What decisions have we recorded for this repository?\"",
          },
        ],
      },
    },
    expected: [
      { title: "Project files written", detail: "The setup creates a project MCP entry and a .cursor/rules instruction surface." },
      { title: "Four baseline tools", detail: "The host doctor checks for sm_search, sm_add_fact, sm_stats, and sm_supersede_fact." },
      { title: "Warm HTTP is optional", detail: "A warm-health warning does not mean Cursor's stdio MCP path is broken." },
      { title: "Rule-driven recall", detail: "Cursor can invoke the explicit context command or MCP tools when its installed rule applies." },
    ],
    dayOne: [
      "Restart Cursor after writing the project configuration.",
      "Ask Cursor to search semantic memory before a change, then inspect which MCP tool it actually called.",
      "Save a deliberate decision with a code:<repo-name> namespace and a source; do not auto-dump the transcript.",
      "Keep the generated absolute run-server path valid if you move or replace the agent-memory-kits checkout.",
    ],
    troubleshooting: [
      { symptom: "MCP does not load", response: "Restart Cursor, inspect its MCP logs, and confirm the generated absolute server path still exists." },
      { symptom: "Rule does not apply", response: "Re-run setup with --write-project and confirm a .cursor/rules/*.mdc file was created in the intended project." },
      { symptom: "Doctor warns on HTTP", response: "Cursor uses stdio for the MCP lifecycle. Treat warm HTTP as an optional optimization for hooked hosts." },
      { symptom: "Context is not automatic", response: "That is the published Tier 1 boundary. Invoke the MCP workflow or context command explicitly." },
    ],
    uninstall: [
      "Remove the semantic-memory entry from the project's .cursor/mcp.json without disturbing unrelated MCP servers.",
      "Remove only the semantic-memory rule files written under the project's .cursor/rules directory, then restart Cursor.",
      "Keep or remove the agent-memory-kits checkout and local memory store independently; neither is deleted by editing Cursor configuration.",
    ],
    boundary:
      "Cursor is a Tier 1 integration: MCP tools and rules are verified, but automatic pre-prompt recall and transcript or compaction hooks are not claimed.",
    sources: [
      { label: "Cursor integration source", href: `${repository}/tree/main/cursor` },
      { label: "Tier boundary", href: `${repository}#two-tiers-of-integration` },
    ],
  },
  {
    slug: "mcp",
    name: "Generic MCP client",
    shortName: "MCP",
    index: "05",
    tier: "Protocol · stdio",
    fit: "Portable server boundary",
    summary: "Connect the published binary to any compatible client.",
    description:
      "Install the exact server package, select one canonical local store, and expose the bounded agent profile over MCP stdio.",
    capability: ["Portable stdio", "Profile-bounded tools", "Local SQLite", "Witnessed search"],
    prerequisites: [
      { label: "MCP client", detail: "A host that can launch a local stdio server and pass arguments." },
      { label: "Rust + cargo", detail: "Stable toolchain with ~/.cargo/bin or its platform equivalent on PATH." },
      { label: "Local storage", detail: "Choose one canonical memory directory and back it up according to your own policy." },
      { label: "Model cache", detail: "The first embedding run may download roughly 550 MB; subsequent use is local." },
    ],
    supportedOs: ["macos", "linux", "windows"],
    commands: {
      setup: {
        posix: [
          {
            id: "mcp-install-posix",
            label: "Install and start over stdio",
            context: "The version pin is the current published server version represented by this site.",
            language: "bash",
            code: "cargo install semantic-memory-mcp --locked --version '=0.5.4'\nsemantic-memory-mcp \\\n  --memory-dir \"$HOME/.local/share/semantic-memory\" \\\n  --tool-profile agent",
          },
        ],
        powershell: [
          {
            id: "mcp-install-powershell",
            label: "Install and start over stdio",
            context: "PowerShell expands $HOME in the same canonical path used by the published recipe.",
            language: "powershell",
            code: "cargo install semantic-memory-mcp --locked --version '=0.5.4'\nsemantic-memory-mcp --memory-dir \"$HOME/.local/share/semantic-memory\" --tool-profile agent",
          },
        ],
        all: [
          {
            id: "mcp-config",
            label: "Equivalent client configuration",
            context: "Adapt the outer shape to your client and replace ABSOLUTE_MEMORY_PATH. MCP clients do not universally expand ~ or shell variables in argument arrays.",
            language: "json",
            code: "{\n  \"mcpServers\": {\n    \"semantic-memory\": {\n      \"command\": \"semantic-memory-mcp\",\n      \"args\": [\n        \"--memory-dir\",\n        \"ABSOLUTE_MEMORY_PATH\",\n        \"--tool-profile\",\n        \"agent\"\n      ]\n    }\n  }\n}",
          },
        ],
      },
      verify: {
        all: [
          {
            id: "mcp-verify",
            label: "Verify from the initialized client",
            context: "After your client completes the MCP initialization handshake, inspect this method through its tool or server inspector.",
            language: "text",
            code: "tools/list",
          },
        ],
      },
    },
    expected: [
      { title: "Server launches", detail: "The client keeps the stdio process attached rather than waiting for a normal command prompt to return." },
      { title: "Profile is visible", detail: "tools/list returns the live tool surface for the agent profile; do not rely on a hard-coded count." },
      { title: "Store is local", detail: "SQLite and derived retrieval artifacts live under the selected memory directory." },
      { title: "Fresh recall is empty", detail: "The server is not unhealthy merely because a new store has no facts to retrieve." },
    ],
    dayOne: [
      "Use tools/list as runtime truth for the installed binary and selected profile.",
      "Add one deliberate fact, search for it, and inspect the witnessed-search receipt before integrating broader workflows.",
      "Run only one warm HTTP owner for a shared port; pure stdio clients do not need a warm sidecar.",
      "Keep canonical SQLite state distinct from rebuildable indexes and vector artifacts.",
    ],
    troubleshooting: [
      { symptom: "Client reports command not found", response: "Confirm semantic-memory-mcp resolves on the PATH inherited by the graphical or CLI host, not only in your interactive shell." },
      { symptom: "Server appears to hang", response: "An MCP stdio server remains attached and waits for protocol messages. That is expected; launch it through the client." },
      { symptom: "No memories are returned", response: "Verify the directory, profile, and facts written. A clean store is intentionally empty." },
      { symptom: "Tool is missing", response: "Inspect tools/list and the selected profile. Maintenance tools may be intentionally hidden from the bounded agent profile." },
    ],
    uninstall: [
      "Remove the semantic-memory server entry from the MCP client without disturbing its other servers.",
      "Run cargo uninstall semantic-memory-mcp if no remaining client uses the binary.",
      "The local memory directory is not removed by cargo uninstall. Retain, export, or delete it as a separate data-governance decision.",
    ],
    boundary:
      "MCP exposes a tool transport, not automatic lifecycle behavior. A receipt records execution evidence and result identity; it does not establish truth, safety, or authority to act.",
    sources: [
      { label: "MCP server source", href: "https://github.com/RecursiveIntell/semantic-memory-mcp" },
      { label: "Agent memory kit", href: repository },
    ],
  },
  {
    slug: "rust",
    name: "Rust library",
    shortName: "Rust",
    index: "06",
    tier: "Library · embedded",
    fit: "Application-owned integration",
    summary: "Embed the SQLite-authoritative retrieval core directly.",
    description:
      "Start with the deterministic MockEmbedder, prove storage and retrieval locally, then choose a production embedding boundary deliberately.",
    capability: ["Direct Rust API", "Deterministic fixture", "Hybrid retrieval", "Typed receipts"],
    prerequisites: [
      { label: "Rust 1.75+", detail: "The upstream crate contract currently declares Rust 1.75 as its minimum." },
      { label: "Cargo project", detail: "A binary or library crate where you own storage, lifecycle, and embedder configuration." },
      { label: "SQLite-compatible runtime", detail: "SQLite is authoritative; indexes and vector artifacts remain derived and rebuildable." },
      { label: "Embedder decision", detail: "Begin with MockEmbedder. Select a production provider only after the local contract works." },
    ],
    supportedOs: ["macos", "linux", "windows"],
    commands: {
      setup: {
        all: [
          {
            id: "rust-dependencies",
            label: "Add the current published dependencies",
            context: "Version 0.5.10 is the version documented by the current upstream README and Cargo manifest. The registry snapshot also observes 0.5.11, whose quick-start sample is not asserted here without matching source documentation.",
            language: "bash",
            code: "cargo add semantic-memory@0.5.10\ncargo add tokio --features macros,rt",
          },
          {
            id: "rust-example",
            label: "Use a deterministic embedder first",
            context: "Save as src/main.rs. This fixture needs no hosted model or embedding download.",
            language: "rust",
            code: "use semantic_memory::{EmbeddingConfig, MemoryConfig, MemoryStore, MockEmbedder};\nuse std::path::PathBuf;\n\n#[tokio::main(flavor = \"current_thread\")]\nasync fn main() -> Result<(), semantic_memory::MemoryError> {\n    let config = MemoryConfig {\n        base_dir: PathBuf::from(\"memory-example\"),\n        embedding: EmbeddingConfig {\n            dimensions: 768,\n            ..Default::default()\n        },\n        ..Default::default()\n    };\n\n    let store = MemoryStore::open_with_embedder(\n        config,\n        Box::new(MockEmbedder::new(768)),\n    )?;\n\n    store\n        .add_fact(\"general\", \"Rust was first released in 2015\", None, None)\n        .await?;\n\n    let results = store\n        .search(\"when was Rust released\", Some(5), Some(&[\"general\"]), None)\n        .await?;\n\n    for result in results {\n        println!(\"{:.4} {}\", result.score, result.content);\n    }\n\n    Ok(())\n}",
          },
        ],
      },
      verify: {
        all: [
          {
            id: "rust-run",
            label: "Compile and run the deterministic proof",
            context: "Run from the Cargo project containing the example.",
            language: "bash",
            code: "cargo run",
          },
        ],
      },
    },
    expected: [
      { title: "Local database", detail: "The example creates its authoritative state beneath memory-example." },
      { title: "Deterministic embedding", detail: "MockEmbedder avoids a network service and makes the first contract test repeatable." },
      { title: "Scored result", detail: "The program prints a score followed by the stored Rust release fact." },
      { title: "Explicit next boundary", detail: "Production behavior still depends on your embedder, corpus, features, filters, and authority policy." },
    ],
    dayOne: [
      "Keep MockEmbedder until storage, mutation, and search behavior pass in your application.",
      "Choose MemoryStore::search_with_context when you need explicit receipt or replay behavior.",
      "Evaluate a production embedder on your own corpus before tuning optional research modules.",
      "Treat search receipts as execution evidence, not claim-ledger judgments or downstream action permission.",
    ],
    troubleshooting: [
      { symptom: "Backend build fails", response: "The default enables usearch-backend. The upstream guide documents a default-features=false brute-force alternative for a pure-Rust exact path." },
      { symptom: "No result is printed", response: "Confirm the add_fact call completed, the namespace filter is general, and the same store instance performs the search." },
      { symptom: "Production results differ", response: "Record the embedder identity, purpose, feature set, filters, and exactness route; MockEmbedder is a deterministic fixture, not a quality benchmark." },
      { symptom: "A receipt is interpreted as truth", response: "Separate retrieval execution evidence from claim support, safety, and authority to act." },
    ],
    uninstall: [
      "Run cargo remove semantic-memory in the application crate, then remove integration code and any now-unused tokio features.",
      "Delete derived build artifacts through your normal Cargo workflow.",
      "Retain, migrate, export, or remove application memory directories according to your product's data policy; dependency removal does not delete them.",
    ],
    boundary:
      "semantic-memory is research-grade with a tested default retrieval contract. Feature-gated research and orchestration modules are not implicit guarantees of MemoryStore::search() behavior.",
    sources: [
      { label: "Rust library source", href: "https://github.com/RecursiveIntell/semantic-memory" },
      { label: "Published crate", href: "https://crates.io/crates/semantic-memory" },
    ],
  },
] as const;

export function getInstallGuide(slug: string): InstallGuide | undefined {
  return INSTALL_GUIDES.find((guide) => guide.slug === slug);
}

export function getShellOptions(os: OsId): readonly ShellId[] {
  if (os === "windows") return ["powershell"];
  return os === "macos" ? ["zsh", "bash"] : ["bash", "zsh"];
}

export function getCommandBlocks(
  guide: InstallGuide,
  phase: keyof InstallGuide["commands"],
  os: OsId,
  projectPath: string,
): readonly CommandBlock[] {
  const commands = guide.commands[phase];
  if (!commands) return [];

  const platform = os === "windows" ? commands.powershell : commands.posix;
  const blocks = [...(platform ?? []), ...(commands.all ?? [])];
  return blocks.map((block) => ({
    ...block,
    code: block.code.replaceAll("{{PROJECT_PATH}}", projectPath || "REPLACE_WITH_ABSOLUTE_PROJECT_PATH"),
  }));
}
