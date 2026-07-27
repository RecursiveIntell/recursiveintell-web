# Mnemes site handoff

This archive is the complete source handoff for the Mnemes product website. It is
intended for an agent that will inspect, modify, build, and publish the site.

## Product identity

- **Mnemes** is the personal, self-hosted agent memory server. It runs on
  hardware the operator owns.
- **Agent Memory Kits / semantic-memory-mcp** are the complete one-device path.
  They use the same underlying semantic-memory engine and retrieval quality, but
  do not add a Mnemes server copy or routed cross-device memory layer.
- **Mnemes Node R1** is optional ready-to-go hardware. It packages the same
  Mnemes server for people who lack suitable hardware or prefer a configured
  appliance. It is not a higher-quality memory tier.
- **RecursiveIntell** is the founder-led engineering studio and portfolio behind
  the work.

## Primary routes

- `/` — flagship product story and deployment-path selector
- `/product` — Mnemes architecture, database ownership, lifecycle, API, and truth matrix
- `/install` — Agent Memory Kits, semantic-memory-mcp, and self-hosted Mnemes setup
- `/node` — optional Node R1 hardware concept and interactive operator instrument
- `/portfolio` — live GitHub/crates.io telemetry, searchable cards, and Library Atlas
- `/platform` — semantic-memory → MCP → Mnemes layer map
- `/proof` — witnessed retrieval, receipts, and evidence boundaries
- `/doctrine` — RecursiveIntell software doctrine and Mneme mythology
- `/about` — founder, custom-build, and studio context

## Important implementation surfaces

- `app/components/DeploymentPaths.tsx` is the canonical three-path product
  selector. Keep its hierarchy consistent across pages.
- `app/components/PortfolioExplorer.tsx` owns the interactive portfolio UI.
- `app/api/portfolio/route.ts` collects public GitHub and crates.io telemetry.
  It rejects query widening, bounds pagination, reports source-specific state,
  and falls back only to the dated public crate snapshot when necessary.
- `app/components/LiveRegistry.tsx` shows the core registry pulse. Its fallback
  must remain sourced from `app/data/published-crates.json`; unavailable GitHub
  values must remain unavailable.
- `app/data/library-catalog-public.json` is the public 97-record allowlisted
  Atlas projection. Do not replace it with a raw private audit export.
- `scripts/project-library-atlas.mjs` is the strict projection generator. It
  intentionally excludes repository identity, branches, commits, internal paths,
  source links, access notes, and audit gaps.
- `app/lib/portfolio-state.ts` contains the source freshness/state contract.
- `tests/rendered-html.test.mjs` contains the hierarchy, data-boundary,
  fallback, pagination, and mocked upstream-failure tests.

## Build and validation

Prerequisites: Node.js `>=22.13.0`, Linux, GNU `timeout`, `flock`, and `curl`.

```bash
npm ci
npm run lint
npm test
npm run validate:artifact
```

`npm test` runs the verified Vinext production build and the complete test suite.
Do not add `node_modules`, `dist`, `.sites-runtime`, `.vinext`, or other generated
directories to a source handoff or commit.

## Deployment

This is a Vinext/Sites project. Preserve `vite.config.ts`, `next.config.ts`,
`build/`, `scripts/build-verified.sh`, `scripts/validate-artifact.sh`, and
`.openai/hosting.json`. The hosting manifest contains the existing Sites project
identity. A deployment agent should use the platform's normal lifecycle rather
than inventing a second hosting configuration.

## Claim boundaries

- Do not describe continuous device-owned replication or recovery as complete;
  those remain in development until an end-to-end canary proves them.
- Node battery capacity, all-day endurance, enclosure production, onboarding,
  price, and availability remain early targets.
- The Atlas is a dated reviewed projection, not proof of package quality,
  adoption, production readiness, or customer use.
- Prototype hardware language should remain qualified as founder-reported and
  dated, not independently certified.
- The current Site access policy is owner-only unless the owner explicitly
  authorizes a change.

## Verified source snapshot

- Source commit: `4e029e975c907cbd9a88a909ff37de94a8a1b3db`
- Site checkpoint: version 11
- Main validation: lint passed; 8 tests passed; verified production build passed
- Public telemetry observed during validation: 39 complete GitHub repositories,
  114 complete crates, and 97 Atlas records
- The deployed Site had an empty recent production error log at handoff

Start by inspecting the current files and running `npm test`. Preserve the
source/freshness contracts before changing visual or product copy.
