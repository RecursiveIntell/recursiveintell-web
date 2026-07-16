(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuButton = byId("menuButton");
  const mobileMenu = byId("mobileMenu");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "Close" : "Menu";
      mobileMenu.classList.toggle("open", open);
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
      mobileMenu.classList.remove("open");
    }));
  }

  async function copyText(text, button) {
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "Copied";
    button.setAttribute("aria-live", "polite");
    window.setTimeout(() => { button.textContent = original; }, 1600);
  }

  function wireTablist(buttons, activate) {
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(button));
      button.addEventListener("keydown", (event) => {
        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % buttons.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = buttons.length - 1;
        else return;
        event.preventDefault();
        buttons[next].focus();
        activate(buttons[next]);
      });
    });
  }

  const quickPaths = {
    kits: {
      title: "Recommended entry · Claude Code",
      command: "/plugin marketplace add RecursiveIntell/agent-memory-kits\n/plugin install semantic-memory@semantic-memory-kit\n/memory-setup",
      hint: "Restart once, ingest a real repository, run the doctor, then test recall. An empty Day-1 store is expected."
    },
    mcp: {
      title: "Protocol entry · MCP server 0.5.4",
      command: "cargo install semantic-memory-mcp --locked --version '=0.5.4'\nsemantic-memory-mcp \\\n  --memory-dir \"$HOME/.local/share/semantic-memory\" \\\n  --tool-profile agent",
      hint: "Use one canonical memory directory. The package version matches the current repository manifest checked July 16, 2026."
    },
    core: {
      title: "Library entry · semantic-memory 0.5.10",
      command: "cargo add semantic-memory@0.5.10\n# begin with the deterministic MockEmbedder quick start\n# before selecting a production embedder",
      hint: "The MockEmbedder path is deterministic and requires no hosted service. Version checked against the current manifest."
    }
  };

  const quickTabs = [...document.querySelectorAll(".quick-tab")];
  const quickPanel = byId("quickPanel");
  const quickTitle = byId("quickTitle");
  const quickCommand = byId("quickCommand");
  const quickHint = byId("quickHint");
  function activateQuick(button) {
    const data = quickPaths[button.dataset.quick];
    quickTabs.forEach((tab) => {
      const active = tab === button;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    quickPanel.setAttribute("aria-labelledby", button.id);
    quickTitle.textContent = data.title;
    quickCommand.textContent = data.command;
    quickHint.textContent = data.hint;
  }
  if (quickTabs.length) wireTablist(quickTabs, activateQuick);
  const copyQuick = byId("copyQuick");
  if (copyQuick) copyQuick.addEventListener("click", () => copyText(quickCommand.textContent.trim(), copyQuick));

  const domains = {
    governance: {
      title: "Governance",
      owner: "constitutional-memory + verification-policy",
      accepts: "PolicyRef · RoleGrant · continuity state",
      receipt: "Decision attestation",
      failure: "Blocks on missing, malformed, unavailable, or contradictory authority state."
    },
    tools: {
      title: "Tools & effects",
      owner: "llm-tool-runtime + agent-graph",
      accepts: "ToolCall · execution context · permit",
      receipt: "Tool result + invocation receipt",
      failure: "Execution failures remain typed failures; they cannot become completion."
    },
    verification: {
      title: "Verification",
      owner: "kernel-oracles + attestation-exchange",
      accepts: "VerifyReq · evidence set · oracle profile",
      receipt: "Certificate · witness · refutation",
      failure: "Unproven states remain restricted instead of silently promoted."
    },
    receipts: {
      title: "Receipts & replay",
      owner: "claim-ledger + receipt-bench",
      accepts: "Claim · evidence · run event",
      receipt: "Hash-linked ledger entry",
      failure: "Malformed records fail closed and do not disappear from the audit path."
    },
    compression: {
      title: "Measured compression",
      owner: "turbo-quant + fib-quant + quant-governor",
      accepts: "CompressReq · codec profile · quality budget",
      receipt: "Measurement + compression receipt",
      failure: "Unsupported codecs return typed errors; compressed bytes cannot pose as exact."
    }
  };
  const domainButtons = [...document.querySelectorAll(".domain-button")];
  const domainDetail = byId("domainDetail");
  function closeDomain() {
    if (!domainDetail) return;
    domainDetail.hidden = true;
    domainButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  }
  domainButtons.forEach((button) => button.addEventListener("click", () => {
    const data = domains[button.dataset.domain];
    const alreadyOpen = button.getAttribute("aria-pressed") === "true" && !domainDetail.hidden;
    if (alreadyOpen) { closeDomain(); return; }
    domainButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    byId("domainTitle").textContent = data.title;
    byId("domainOwner").textContent = data.owner;
    byId("domainAccepts").textContent = data.accepts;
    byId("domainReceipt").textContent = data.receipt;
    byId("domainFailure").textContent = data.failure;
    domainDetail.hidden = false;
  }));
  const closeDomainButton = byId("closeDomain");
  if (closeDomainButton) closeDomainButton.addEventListener("click", closeDomain);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDomain(); });

  const traceNodes = [...document.querySelectorAll(".trace-node")];
  const runTrace = byId("runTrace");
  let traceTimer;
  function resetTrace() {
    window.clearInterval(traceTimer);
    traceNodes.forEach((node) => node.classList.remove("active", "complete"));
  }
  if (runTrace) runTrace.addEventListener("click", () => {
    resetTrace();
    runTrace.textContent = "Tracing…";
    let index = 0;
    const advance = () => {
      traceNodes.forEach((node, nodeIndex) => {
        node.classList.toggle("complete", nodeIndex < index);
        node.classList.toggle("active", nodeIndex === index);
      });
      if (index >= traceNodes.length) {
        traceNodes.forEach((node) => { node.classList.remove("active"); node.classList.add("complete"); });
        runTrace.textContent = "Run again";
        window.clearInterval(traceTimer);
      }
      index += 1;
    };
    advance();
    traceTimer = window.setInterval(advance, reducedMotion ? 20 : 170);
  });

  const installPaths = {
    claude: {
      title: "Claude Code · plugin path",
      summary: "The recommended operator entry. Marketplace setup installs the kit, MCP surface, lifecycle hooks, commands, and doctor workflow.",
      code: "/plugin marketplace add RecursiveIntell/agent-memory-kits\n/plugin install semantic-memory@semantic-memory-kit\n/memory-setup",
      steps: [
        ["Restart", "Restart Claude Code once so newly installed hooks load."],
        ["Ingest", "Run /memory-ingest . inside a repository you use."],
        ["Verify", "Run the doctor, then ask a question about the ingested codebase."]
      ],
      note: "A new store returning no recall is expected. The system fails open until it has facts worth recalling.",
      docs: "https://github.com/RecursiveIntell/agent-memory-kits/tree/main/claude"
    },
    codex: {
      title: "Codex CLI · plugin path",
      summary: "A hook-capable Codex integration with MCP configuration, Python lifecycle hooks, prompts, skills, doctors, ingestion, and evidence workflows.",
      code: "git clone https://github.com/RecursiveIntell/agent-memory-kits\ncd agent-memory-kits\ncodex plugin marketplace add ./codex\ncodex plugin add semantic-memory@semantic-memory-codex-kit",
      steps: [
        ["Store", "Choose one canonical memory directory for every Codex project."],
        ["Owner", "Use one owner for any warm HTTP port; avoid competing processes."],
        ["Verify", "Run the Codex doctor and ingest a real repository before testing recall."]
      ],
      note: "This is a hook-capable reference integration. A clean Day-1 store has nothing to recall until you ingest or capture facts.",
      docs: "https://github.com/RecursiveIntell/agent-memory-kits/tree/main/codex"
    },
    hermes: {
      title: "Hermes Agent · plugin + MCP path",
      summary: "Installs the Hermes plugin, enables it, registers the semantic-memory MCP server, and checks the connection.",
      code: "git clone https://github.com/RecursiveIntell/agent-memory-kits\ncd agent-memory-kits\ncp -R hermes \"$HOME/.hermes/plugins/semantic-memory-mcp\"\nhermes plugins enable semantic-memory-mcp\nhermes mcp add semantic_memory \\\n  --command semantic-memory-mcp \\\n  --args --memory-dir \"$HOME/.local/share/semantic-memory\" --tool-profile agent\nhermes mcp configure semantic_memory\nhermes mcp list\nhermes mcp test semantic_memory",
      steps: [
        ["Order", "Keep --args last because it consumes every remaining argument."],
        ["Restart", "Restart Hermes after installing or changing plugin code."],
        ["Verify", "Run mcp list and mcp test, then ingest before evaluating recall."]
      ],
      note: "Do not hand-edit legacy configuration as the primary path. Use the plugin and MCP commands so the active configuration stays inspectable.",
      docs: "https://github.com/RecursiveIntell/agent-memory-kits/tree/main/hermes"
    },
    rules: {
      title: "MCP + rules tier · host project setup",
      summary: "For Cursor, Cline, Roo Code, Windsurf, Continue, and OpenCode. Installs MCP configuration plus explicit host-native rules/context.",
      code: "git clone https://github.com/RecursiveIntell/agent-memory-kits\ncd agent-memory-kits\ncursor/scripts/setup.sh --write-project /path/to/project\nshared/scripts/doctor-all.py --deep",
      steps: [
        ["Select", "Replace cursor with the directory for your supported host."],
        ["Configure", "Write project or user MCP configuration through the host kit."],
        ["Verify", "Run the deep shared doctor and inspect the generated rule/context files."]
      ],
      note: "This tier provides MCP tools plus host-native guidance. It does not claim hidden prompt, session, or compaction hooks.",
      docs: "https://github.com/RecursiveIntell/agent-memory-kits#per-host-docs"
    },
    mcp: {
      title: "Direct MCP server · protocol surface",
      summary: "Install the published Rust binary and start a bounded agent profile against a canonical local memory directory.",
      code: "cargo install semantic-memory-mcp --locked --version '=0.5.4'\nsemantic-memory-mcp \\\n  --memory-dir \"$HOME/.local/share/semantic-memory\" \\\n  --tool-profile agent",
      steps: [
        ["Install", "Use --locked and the repository-matched 0.5.4 version."],
        ["Profile", "Begin with agent; inspect tools/list for the binary's actual surface."],
        ["Connect", "Configure the stdio command in your MCP client and run a witnessed search."]
      ],
      note: "Published-package use still needs a clean-install receipt and source/package parity before it can support a release-wide certification claim.",
      docs: "https://github.com/RecursiveIntell/semantic-memory-mcp"
    },
    core: {
      title: "Rust library · retrieval core",
      summary: "Embed the SQLite-authoritative retrieval library directly and start with a deterministic embedder before selecting a production model.",
      code: "cargo add semantic-memory@0.5.10\n# begin with the MockEmbedder quick start\n# before selecting a production embedder",
      steps: [
        ["Start", "Use the MockEmbedder example to verify storage and retrieval deterministically."],
        ["Select", "Choose a production embedder and explicit network/model boundary."],
        ["Measure", "Run evaluation for your corpus before enabling optional research modules."]
      ],
      note: "SQLite is authoritative. Indexes and vector artifacts accelerate retrieval and must remain rebuildable or exactly fall back where configured.",
      docs: "https://github.com/RecursiveIntell/semantic-memory"
    }
  };

  const installTabs = [...document.querySelectorAll(".install-tab")];
  const installPanel = byId("installPanel");
  function activateInstall(button) {
    const data = installPaths[button.dataset.install];
    installTabs.forEach((tab) => {
      const active = tab === button;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    installPanel.setAttribute("aria-labelledby", button.id);
    byId("installName").textContent = data.title;
    byId("installSummary").textContent = data.summary;
    byId("installCode").textContent = data.code;
    byId("installSteps").innerHTML = data.steps.map(([title, text]) => `<li><b>${title}</b>${text}</li>`).join("");
    byId("installNote").textContent = data.note;
    byId("installDocs").href = data.docs;
  }
  if (installTabs.length) wireTablist(installTabs, activateInstall);
  const copyInstall = byId("copyInstall");
  if (copyInstall) copyInstall.addEventListener("click", () => copyText(byId("installCode").textContent.trim(), copyInstall));

  const archSummaries = {
    host: "Host lifecycle is explicit: hooks are automatic where supported; rule-tier integrations require the host or agent to invoke MCP workflows. Missing memory must never block a prompt.",
    memory: "SQLite is authoritative searchable state. FTS5, raw embeddings, vector indexes, sparse artifacts, and candidate codecs remain rebuildable or derived acceleration—not shadow truth stores.",
    trust: "Claim trust remains a separate verified authority. Ledger verification failure disables enrichment and ledger writes while ordinary memory storage and retrieval continue without promoting unverified state.",
    operator: "Mutation, deletion, import, feedback, vacuum, rebuild, and broad maintenance belong to an explicit operator context. Tool annotations do not replace client approvals or authority checks."
  };
  const archTabs = [...document.querySelectorAll(".arch-tab")];
  archTabs.forEach((button) => button.addEventListener("click", () => {
    archTabs.forEach((tab) => tab.setAttribute("aria-pressed", String(tab === button)));
    document.querySelectorAll(".arch-zone").forEach((zone) => zone.classList.toggle("active", zone.dataset.zone === button.dataset.arch));
    byId("archSummary").textContent = archSummaries[button.dataset.arch];
  }));

  const products = {
    "witnessed-agent": {
      lane: "Now · highest integration leverage",
      title: "Witnessed coding agent",
      promise: "A coding agent whose memory, tool calls, policy decisions, and final claims can be replayed.",
      thesis: "The shortest path to demonstrate the whole stack without requiring every subsystem to become a platform first.",
      crates: "semantic-memory · llm-tool-runtime · agent-graph · stack-ids · claim-ledger · knowledge-runtime",
      emits: "typed tool results · policy decisions · evidence-linked claims · replay bundle",
      gate: "Ten representative coding tasks replay to the same evidence graph; ordinary failures never surface as completion."
    },
    "truth-gate": {
      lane: "Now · fastest route to trust revenue",
      title: "Release Truth Gate",
      promise: "A release boundary that refuses unsupported status, stale evidence, or unbound benchmark claims.",
      thesis: "It converts the stack's internal audit discipline into a product teams can adopt before a wider agent-runtime migration.",
      crates: "claim-ledger · attestation-exchange · verification-policy · stack-ids · receipt-bench",
      emits: "release verdict · omission receipt · source binding · human-readable evidence pack",
      gate: "Default-branch commit, artifact digest, CI run, and every public claim bind into one terminal release certificate."
    },
    "operator-memory": {
      lane: "Next · strongest user-facing wedge",
      title: "Operator Memory OS",
      promise: "Local-first working memory that understands what changed, what was superseded, and what still needs proof.",
      thesis: "It makes the strongest existing differentiator—authoritative temporal memory—legible to an operator instead of only a runtime.",
      crates: "semantic-memory · bitemporal-runtime · living-memory · knowledge-runtime · forge-memory-bridge",
      emits: "temporal answers · contradiction set · provenance trail · selective-forgetting receipt",
      gate: "LongMemEval- and MemoryAgentBench-derived suites meet published retrieval, update, abstention, and forgetting targets."
    },
    "governed-kernel": {
      lane: "Next · largest long-run platform moat",
      title: "Governed agent kernel",
      promise: "A multi-agent execution kernel with explicit authority, state transitions, effects, and settlement.",
      thesis: "This is the platform endgame: agents become principals in a typed system rather than prompts in a loop.",
      crates: "recursive-kernel-core · kernel-execution · kernel-oracles · authority-delegation · federated-settlement",
      emits: "delegation chain · effect journal · oracle result · settlement certificate",
      gate: "Concurrency, cancellation, delegation expiry, and oracle disagreement pass model-, property-, and schedule-level tests."
    },
    "context-fabric": {
      lane: "Research · high upside, evidence intensive",
      title: "Long-context inference fabric",
      promise: "A governed cache and vector layer that compresses only when quality budgets allow it.",
      thesis: "Compression becomes defensible when the same stack measures drift, preserves provenance, and refuses unsupported decode paths.",
      crates: "turbo-quant · fib-quant · poly-kv · quant-governor · semantic-memory",
      emits: "quality budget · codec receipt · drift measurement · fallback decision",
      gate: "Hardware-specific benchmarks bind accuracy, latency, memory, codec, dataset, and fallback behavior to reproducible receipts."
    },
    "evidence-mcp": {
      lane: "Next · best ecosystem distribution path",
      title: "Evidence-native MCP",
      promise: "An MCP surface where every retrieved fact and tool result carries source, scope, and confidence.",
      thesis: "A standards-aligned distribution layer can expose the stack's trust semantics without flattening them into plain text.",
      crates: "semantic-memory-mcp · stack-ids · claim-ledger · boundary-compiler · remote-oracle-admission",
      emits: "typed content · provenance link · policy context · tool receipt",
      gate: "MCP 2025-11-25 conformance plus adversarial prompt-injection and confused-deputy tests at every data/tool boundary."
    }
  };
  const productTabs = [...document.querySelectorAll(".composition-tab")];
  const compositionPanel = byId("compositionPanel");
  function activateProduct(button) {
    const data = products[button.dataset.product];
    productTabs.forEach((tab) => {
      const active = tab === button;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    compositionPanel.setAttribute("aria-labelledby", button.id);
    byId("productLane").textContent = data.lane;
    byId("productTitle").textContent = data.title;
    byId("productPromise").textContent = data.promise;
    byId("productThesis").textContent = data.thesis;
    byId("productCrates").textContent = data.crates;
    byId("productEmits").textContent = data.emits;
    byId("productGate").textContent = data.gate;
  }
  if (productTabs.length) wireTablist(productTabs, activateProduct);

  const researchFilters = [...document.querySelectorAll(".research-filter")];
  const researchCards = [...document.querySelectorAll(".research-card")];
  researchFilters.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.researchFilter;
    researchFilters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    researchCards.forEach((card) => { card.hidden = filter !== "all" && card.dataset.horizon !== filter; });
  }));

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = byId(button.dataset.copyTarget);
      if (target) copyText(target.textContent.trim(), button);
    });
  });
})();
