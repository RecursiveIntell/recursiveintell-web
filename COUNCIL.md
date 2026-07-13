# RecursiveIntell Website Council — Synthesized Decision

Date: 2026-07-13

## Council

1. Product Strategy + Information Architecture
2. Technical Truth + Developer Experience
3. Brand + Visual/Interaction Design

Each member independently inspected the live site and current local/public product sources. Full source memos were written to `/tmp/recursiveintell-council-*-output.md`.

## Unanimous verdict

The current site is memorable but strategically wrong for the flagship product family. It makes visitors decode a personal portfolio/dojo identity before understanding the system. The replacement should make one stack legible:

1. `semantic-memory` — Core: Rust retrieval and durable local state
2. `semantic-memory-mcp` — Server: MCP profiles, witnessed retrieval, replay, authority decisions
3. `agent-memory-kits` — Kits: host integrations, setup, doctors, ingest, companion workflows

`context-governor`, `claim-ledger`, the codebase ingester, and doctors are supporting capabilities wired by Kits. Unrelated applications/research move out of the primary journey.

## Chosen strategy

**Strong-fit product strategy + The Witness Plane visual direction.**

Why:

- It makes the three install layers immediately comparable.
- It turns real retrieval, trust, privacy, and authority boundaries into the brand.
- It replaces decorative mascot theater with observable system behavior.
- It preserves one disciplined fragment of the existing identity: magenta as the witness/receipt signal.
- It supports technical scrutiny without becoming visually anonymous.

## Homepage contract

1. Hero: category, outcome, local boundary, two actions
2. Interactive Core / Server / Kits chooser
3. Witnessed retrieval trace
4. End-to-end architecture and trust boundaries
5. Preservation/ownership map
6. Host integration tiers and install paths
7. Evidence, status, limitations
8. Developer resources
9. Final install / inspect / contact decision

## Navigation

Stack · Architecture · Evidence · Docs · GitHub · Install

## Chosen visual tokens

- Ground: `#101312`
- Panel: `#171B19`
- Text: `#F1F0E8`
- Muted: `#A4AAA3`
- Line: `#38413B`
- Witness/receipt: `#E657A7`
- Authority/verified: `#B7E36A`
- Warning/qualified: `#F0A45D`

No gradients. Magenta occupies under 5% of a screen. Lime is state/authority only, never body text.

## Typography

- Compact technical sans for headlines/UI
- Sparse editorial serif for explanatory callouts
- Mono for commands, IDs, receipts, and evidence

The prototype uses CDN-accessible substitutes while preserving this functional split.

## Interaction posture

State-driven, never ambient. A user changes the selected layer or steps a witnessed trace; connectors respond once. No floating, pulsing, parallax, glow atmosphere, or perpetual rotation. Reduced-motion mode removes transitions.

## Retain

- RecursiveIntell name
- blunt local-first language
- technical density
- evidence/receipt motif
- one calibrated magenta signature
- Josh’s accountability and direct contact
- Roko only as a tiny footer/404 signature

## Kill

- dojo/summon/kata/ninja language in primary navigation and CTAs
- mascot hero
- purple atmospheric background
- sticker labels and rotated tags
- project/stack monument counts
- workbench/“shipping daily” theater
- hiring-first content
- fixed MCP tool counts
- unrelated portfolio catalog in the main journey
- generic chat widget on the product homepage

## Technical launch boundary

The replacement can be previewed now as a **source-scoped technical preview**. It is not ready to claim release-wide platform maturity.

Public launch requires:

- clean immutable source revisions
- source/package/registry version parity
- advisory status resolved or explicitly scoped
- package/install smoke tests
- generated rather than hand-entered technical facts
- current `tools/list` evidence for tool surfaces
- exact source/package/live hashes
- benchmark methods and limitations attached to every number

## Content rule

Every evidence claim must declare:

- source revision
- command/method
- environment/configuration
- artifact or receipt
- date
- limitations

Receipts demonstrate recorded execution evidence. They do not prove truth, correctness, security, or task success.
