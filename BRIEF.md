# RecursiveIntell Website Replacement — Design Brief

Status: selected production direction

Surface: Decide / Learn

Primary artifact: standalone responsive static site deployed through the existing GitHub/Vercel project

## Goal

Make RecursiveIntell legible as one technical product family:

1. **agent-memory-kits** — host integrations and memory workflows
2. **semantic-memory-mcp** — governed MCP access, witnessed retrieval, replay, profiles
3. **semantic-memory** — local-first Rust retrieval and durable state core

Supporting systems such as context-governor and claim-ledger belong below that product spine, not beside unrelated portfolio work.

## Primary audiences

- AI coding-agent users choosing an install path
- Agent/tool builders evaluating an MCP memory layer
- Rust and infrastructure engineers inspecting retrieval, storage, trust, and authority boundaries

## Primary actions

1. Choose a host and install the kit
2. Understand the three-layer architecture
3. Inspect source, docs, and evidence scope
4. Evaluate the retrieval and receipt contract
5. Contact Josh only after the product story is clear

## Claim boundary

Safe current-source claims:

- `semantic-memory` is a local-first Rust library for durable hybrid retrieval.
- SQLite is authoritative; indexes and vector artifacts are accelerators/derived state.
- The baseline hybrid path combines FTS5/BM25 and dense-vector candidates with weighted RRF.
- Search receipts and privacy-aware opt-in replay exist in current source.
- `semantic-memory-mcp` serves stdio MCP, runtime tool profiles, witnessed retrieval, replay, governed assertion/action decisions, and an optional loopback HTTP sidecar.
- `agent-memory-kits` currently documents nine host integrations in two integration tiers.
- Current local source gates passed for the flagship crates in the 2026-07-12 hostile audit.

Must qualify:

- Local build/test results are not package, release, deployment, security, or production-readiness certification.
- “Local-first” means hosted storage is not required. First-run model download may contact Hugging Face; Ollama can be remote if configured.
- Tool availability depends on build and runtime profile. `tools/list` is runtime truth; do not freeze the full profile count.
- Receipts prove recorded execution evidence, not total correctness or task success.

Do not claim:

- customers, adoption, revenue, funding, compliance, production maturity, external superiority, or universal privacy/security
- repository-wide release readiness
- fixed full-profile tool counts
- that all feature-gated research modules execute in normal `search()`

## Source evidence

- `/home/sikmindz/Coding/Libraries/semantic-memory/README.md`
- `/home/sikmindz/Coding/Libraries/semantic-memory-mcp/README.md`
- `/home/sikmindz/Coding/agent-memory-kits/README.md`
- `/home/sikmindz/Downloads/recursiveintell-libraries-hostile-audit-2026-07-12.md`
- Public repos under `https://github.com/RecursiveIntell/`

## Composition rule

This is a product-learning surface, not a project gallery. Architecture, code, proof scope, and install paths are the hero media. No centered hero plus three equal feature cards; no fake metrics; no testimonials; no logo wall; no decorative dashboard.

## Visual system requirements

- Design tokens from the first line of CSS
- Original visual identity, not a named-site clone
- One restrained accent system
- Diagrams and source excerpts as primary imagery
- Typography chosen deliberately; not default Inter
- 44px minimum touch targets
- visible focus states
- semantic HTML
- reduced-motion support
- clean collapse of architecture on mobile

## Archive and production boundary

The previous Next.js site, including its previously uncommitted work, is preserved on `archive/pre-witness-plane-2026-07-13` and in a verified local Git bundle. The Witness Plane static site now owns `main`; public claims remain bounded by the evidence rules above.
