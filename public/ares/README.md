# Ares full installation

Run this in a local terminal:

```bash
curl -fsSL https://recursiveintell.com/ares/install.sh | bash
```

The installer fetches the latest `RecursiveIntell/Ares` main branch, provisions the build tools and managed Python/Rust, builds the managed Ares runtime, Desktop, voice dependencies, and RecursiveIntell enhancements. It then opens Ares's local provider/model wizard. Enter the selected provider's API key or use a supported OAuth flow there. Your credentials never pass through this website. An OpenAI API key is optional.

Open a new terminal after installation:

```bash
ares
ares desktop
ares status
```

Use Linux or macOS. Windows users can use WSL2 with `--no-desktop --no-gateway`. System dependencies can request sudo; macOS may first require completion of Apple's Command Line Tools dialog. On macOS, the script provisions Homebrew when missing and uses it for native/audio prerequisites. On Linux it uses apt, dnf, or pacman; other distributions must already provide their build dependencies. Native builds and Desktop downloads can take tens of minutes on a fresh machine. Provider, messaging, or model-specific integrations can request additional credentials or download their own optional dependencies when selected.

## Included defaults

| Component | Setup |
| --- | --- |
| Ares runtime | Isolated `~/.ares` home, managed releases, `ares` launcher |
| Desktop and voice | Desktop build plus voice/wake dependencies |
| Context Governor | Current Rust CLI, configured strict engine, Ares-owned key initialization |
| Local semantic memory | Current published MCP package with its packaged lockfile; local store under `~/.ares/memory` |
| ClaimLedger | Local MCP and ledger under `~/.ares/claim-ledger` |
| Native enhancements | `llm-pipeline`, `agent-graph`, and `poly-kv` Python bindings, verified before activation |
| Agent Graph | Proxy and daemon binaries installed; remote execution awaits its provider/daemon setup below |
| CEA and Pilot Bridge | Installed CLIs; their jobs require your own workspace/database inputs |
| Memory kit and optional skills | Current kit helpers and skills installed; existing customized skills/plugins are preserved |
| Linux gateway | Separate `ares-full-gateway.service` starts after the wizard on a host with a working user systemd session |

The configured Context Governor engine uses the current Rust CLI. Ares documents a separate legacy PyO3 compressor; its current source does not build against the current Governor API, so this installer does not select or ship that legacy lane.

Rust binaries and kit helpers are bundled into each inactive Ares release before it is activated. The agent uses the tools in its selected release. Mutable source/build caches stay separate.

The recipe installs the published MCP SDK and wire-types packages at `2.2.0` after Ares's base locked dependencies. This recorded override fixes valid boolean tool sub-schemas rejected by the older SDK in Ares's lock. It preserves the remaining locked dependencies and is checked before activation.

## Options and unattended setup

Download first to review the source and choose flags:

```bash
curl -fsSL https://recursiveintell.com/ares/install.sh -o /tmp/ares-install.sh
bash /tmp/ares-install.sh --help
bash /tmp/ares-install.sh --plan
```

| Option | Effect |
| --- | --- |
| `--home PATH` | Choose the Ares home; default `~/.ares` |
| `--bin-dir PATH` | Choose the launcher location; default `~/.local/bin` |
| `--no-desktop` | Skip Desktop/voice builds |
| `--no-gateway` | Skip background gateway installation/start |
| `--minimal` | Skip the RecursiveIntell native enhancements and memory kit |
| `--skip-setup` | Defer provider sign-in; also defer gateway startup |
| `--no-path` | Leave shell startup files unchanged |
| `--branch NAME` | Select a specific Ares branch; default `main` |

If sign-in was deferred, run the provider wizard locally:

```bash
HERMES_HOME="${ARES_HOME:-$HOME/.ares}" \
  "${ARES_HOME:-$HOME/.ares}/runtime/current/.venv/bin/python" -m hermes_cli.main model
```

`hermes_cli` is Ares's retained compatible Python entry point. This command uses the selected Ares installation and its isolated home. It does not require another Hermes installation.

Provider discovery during the installer does not use ambient EC2/ECS metadata credentials. Cloud-role users should configure their chosen provider explicitly using Ares's provider documentation after installation. Completing or cancelling the wizard is not a successful-inference test.

## Agent Graph provider setup

The in-process native accelerator is included. The external graph daemon needs a selected provider/model and a running daemon before its MCP proxy can execute remote workflows. It has its own transport configuration; the installer does not copy OAuth tokens between applications.

For an OpenAI-compatible API or local endpoint, start it in a separate terminal. Choose your actual endpoint and model. A local endpoint may need no key:

```bash
ARES_DATA="${ARES_HOME:-$HOME/.ares}"
GRAPH_BIN="$ARES_DATA/runtime/current/.venv/bin"
mkdir -p "$ARES_DATA/agent-graph/run"
read -r -p 'Compatible API base URL: ' GRAPH_BASE_URL
read -r -p 'Model name: ' GRAPH_MODEL
read -r -s -p 'API key (empty for a keyless local endpoint): ' AGENT_GRAPH_API_KEY
printf '\n'
export AGENT_GRAPH_API_KEY
"$GRAPH_BIN/agent-graph-mcpd" \
  --data-dir "$ARES_DATA/agent-graph" \
  --socket "$ARES_DATA/agent-graph/run/mcp.sock" \
  --base-url "$GRAPH_BASE_URL" --model "$GRAPH_MODEL"
```

Keep that terminal running. Set `mcp_servers.agent_graph.enabled: true` in your Ares home's `config.yaml`, then restart Ares. The socket path must match the installed proxy configuration. The key above is entered without echo and is held in that terminal's environment; it is not saved as a shell command or put into a URL.

The daemon also documents a Codex App Server route using a separately installed/authenticated Codex CLI. Follow the [current Agent Graph provider guide](https://github.com/RecursiveIntell/agent-graph-mcp#provider-and-model-configuration) for that route, service management, and current compatibility limits.

## Updates, health and recovery

Rerun the website installer to update the full distribution. `ares update` alone uses Ares's base build recipe and does not reproduce this site's extra native/tool bundle.

The installer refuses unrelated launchers, dirty/unexpected source checkouts, conflicting MCP entries, and retrofit changes to an immutable release. Each release retains its original bundle inputs and wheel hashes. If the same Ares revision exists with different enhancement sources, recipe, or Desktop settings, use a new `--home` and `--bin-dir`, or wait for/install a newer Ares source revision. Adding Desktop to an already active CLI-only revision also requires a new home or revision.

Configuration and environment backups are private under `~/.ares/installer-backups`. Configuration changes occur after the new release is built and are restored if activation fails. The installer never imports another agent's home or credentials. It stops on required build, import, compaction, MCP, or started-gateway health failures.

The private installation record is `~/.ares/install-receipts/latest.json`, with completed records retained alongside it. It records source revisions, native-wheel hashes, installed Rust versions, and health-check states. A gateway that was explicitly disabled or unavailable is recorded as deferred. Upstream `ares doctor` currently reports any inactive gateway as a failed check, including on non-systemd hosts; review the individual runtime/MCP results and the installation record.

For an existing managed runtime:

```bash
ares status
ares rollback
```

Rollback selects the previous Ares release and its bundled native tools. It does not undo credentials you changed, user data, customized skills/plugins, or external services you configured separately.

For current provider support and platform boundaries, read [Ares's documentation](https://github.com/RecursiveIntell/Ares).
