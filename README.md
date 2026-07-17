# RecursiveIntell Web

The production source for [recursiveintell.com](https://recursiveintell.com/).

This release combines the agent-memory installation experience with a detailed map of the broader RecursiveIntell trust substrate.

## Routes

- `/` — focused product overview and public system pulse
- `/activity` — cached public GitHub and crates.io engineering telemetry
- `/libraries` — exhaustive 97-package audited Library Atlas
- `/install` — six installation paths and verification steps
- `/concepts` — eight-chapter architectural field manual
- `/api/metrics` — public-only, source-labeled telemetry with dated fallbacks

## Local verification

```bash
npm ci
npm test
```

The metrics endpoint uses only public metadata. `GITHUB_TOKEN` is optional and server-only; it raises GitHub API limits when configured. Crates.io requests are sequential and the response is cached for 15 minutes.

## Evidence boundary

The public status is source-hardened, not release-certified. A receipt records observed execution evidence; it does not prove factual truth, correctness, security, authorization, or task success.

## Backup

The production tree immediately before this release is preserved at `archive/pre-live-metrics-catalog-2026-07-16`.
