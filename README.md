# RecursiveIntell Web

The production source for [recursiveintell.com](https://recursiveintell.com/).

This release turns the site into a proof-to-adoption platform: visitors can understand the system, inspect evidence boundaries, compose a candidate stack, install agent memory, and choose a clear next step.

## Routes

- `/` — interactive memory time machine, outcome routing, proof trace, and public system pulse
- `/activity` — cached public GitHub and crates.io engineering telemetry
- `/libraries` — searchable 97-package audited Library Atlas
- `/libraries/[slug]` — static package evidence records with dependency topology
- `/domains/[slug]` — 13 static architectural-domain maps
- `/install` — guided installation cockpit
- `/install/[host]` — canonical guides for Claude Code, Codex, Hermes, Cursor, MCP, and Rust
- `/compose` — goal-to-stack composer with registry-aware starter commands
- `/proof` — interactive receipt inspector and deterministic replay comparison
- `/benchmarks` — methodology-first benchmark lab
- `/work` — selected public work and artifact trails
- `/services` — bounded engineering offers and contact paths
- `/pro` — agent-memory pilot scope
- `/about` — public profile, principles, and source trail
- `/changelog` and `/feed.xml` — dated release notes and RSS
- `/concepts` — eight-chapter architectural field manual
- `/api/metrics` — public-only, source-labeled telemetry with dated fallbacks
- `/api/og` — generated route-specific social cards

## Local verification

```bash
npm ci
npm test
```

`npm test` verifies public data invariants, lint, TypeScript, and the complete production build. `npm run verify:routes` can crawl every sitemap URL against a running build and validate status, document headings, canonical metadata, and social images.

The metrics endpoint uses only public metadata. `GITHUB_TOKEN` is optional and server-only; it raises GitHub API limits when configured. Crates.io requests are sequential and the response is cached for 15 minutes. Vercel Analytics and Speed Insights are enabled without collecting form contents or command text.

## Evidence boundary

The public status is source-hardened, not release-certified. A receipt records observed execution evidence; it does not prove factual truth, correctness, security, authorization, or task success.

## Backup

The production tree immediately before this release is preserved at `archive/pre-roi-blueprint-2026-07-16`.
