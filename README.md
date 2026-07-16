# recursiveintell-web

The production source for [recursiveintell.com](https://recursiveintell.com/).

This edition synthesizes the original **Witness Plane** agent-memory product site with the broader **Systems Observatory** for the RecursiveIntell libraries.

## Product surface

- immediate installation paths for Claude Code, Codex CLI, Hermes Agent, six MCP/rules hosts, direct MCP clients, and Rust applications
- the `agent-memory-kits` → `semantic-memory-mcp` → `semantic-memory` product spine
- witnessed retrieval, SQLite authority, Context Governor, claim trust, and operator boundaries
- the preservation/ownership contract, scoped evidence vocabulary, receipt example, and SciFact snapshot
- six product compositions, frontier research radar, and a 180-day execution sequence
- preserved design-history route at `/concepts`

## Architecture

The production site is deliberately buildless: standalone HTML, CSS, and JavaScript served from the repository root by Vercel. There is no package manager, application runtime, or build step.

| Path | Purpose |
|---|---|
| `index.html` | Main product and systems-observatory experience |
| `install.html` | Full six-path installation field guide |
| `concepts.html` | Preserved design council history |
| `styles.css` | Shared visual and responsive system |
| `site.js` | Accessible tabs, copying, observatory, trace, filters, and navigation |
| `scripts/verify_static.py` | Fail-fast content, link, accessibility-contract, syntax, SEO, and hosting verifier |
| `vercel.json` | No-build deployment and security headers |

## Local preview

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open:

- `http://127.0.0.1:8765/`
- `http://127.0.0.1:8765/install.html`
- `http://127.0.0.1:8765/concepts.html`

## Verification

```bash
python3 scripts/verify_static.py
```

GitHub Actions runs the same verifier on pull requests and pushes to `main`.

## Evidence boundary

The public status is **source-hardened, not release-certified**. Source tests, package evidence, live evidence, and execution receipts are distinct scopes. A receipt records observed execution evidence; it does not prove factual truth, correctness, security, authorization, or task success.

## Backup

The untouched pre-synthesis production tree is preserved at `archive/pre-stack-synthesis-2026-07-16`.
