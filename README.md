<!-- last-verified: 2026-11-21 (public contribution/coverage ledger only) -->

# RecursiveIntell Web

Public website for Josh Stevenson and RecursiveIntell. The site has two explicit product surfaces:

- a RecursiveIntell studio/portfolio shell for independent AI systems engineering and consulting;
- the preserved dark Mnemes product shell for the local-first agent-memory system and its technical proof.

## Canonical routes

### RecursiveIntell

- `/` — business front door
- `/josh` — mobile-first business-card landing page
- `/services` — bounded service offers and technical consulting
- `/work` — artifact-grounded engineering cases
- `/systems` — source-linked architecture, canonical owners and admission states
- `/evidence` — curated NVIDIA merges, Hermes reviews, independent articles and community coverage with explicit claim limits
- `/changes` — dated accepted changes, reviews and coverage; status-specific, curated, not an automated complete changelog
- `/about` — Josh Stevenson and RecursiveIntell
- `/contact` — hiring, consulting and collaboration contact options
- `/privacy` — current website data boundary
- `/pro` — transparent proposed-product status
- `/portfolio` — server-rendered public repository snapshot and reviewed case index, enhanced by live API data
- `/workshop` — public Circuit Workshop catalog and build guides; see [Workshop and Bridge maintenance](docs/workshop-and-bridge.md)
- `/api/workshop` — read-only queries over the public maker-data projection
- `/bridge` — noindex entrance to the existing owner-private Bridge, using its ChatGPT owner sign-in
- `/game/claw` — standalone RecursiveIntell action RPG; see [game maintenance](docs/claw-game.md)

### Mnemes

- `/mnemes` — Mnemes homepage
- `/product`, `/node`, `/proof`, `/platform`, `/install`, `/doctrine` — stable Mnemes routes

The Mnemes homepage has one canonical owner at `app/components/mnemes/MnemesHome.tsx`. It is not duplicated into the business root.

## Source owners

- `app/config/site.ts` — site identity, public contact, business navigation
- `app/data/business.ts` — service categories, process, deterministic workflow fixtures
- `app/data/achievements.ts` — single owner for NVIDIA accepted contributions, Hermes review pointers and externally published coverage shown on the business pages
- `app/config/brand.json` — canonical Recursive Cube vector geometry and asset colors
- `app/components/BrandMark.tsx` — inline brand mark; `scripts/sync-brand.mjs` produces its downloadable SVGs and favicon
- `app/data/services.ts` — consulting and implementation offers
- `app/data/work.ts` — curated public case studies and their evidence boundaries
- `app/data/public-highlights.ts` — source-reviewed public portfolio highlights
- `app/data/public-evidence.ts` — curated records for `/evidence` and `/changes`, importing shared outside-credibility facts from `achievements.ts`
- `app/data/public-repositories.json` — dated public-only GitHub repository snapshot; never project private repository metadata
- `app/components/StudioChrome.tsx` and `app/components/Studio.tsx` — current studio shell, shared sections and selected-project rendering
- `app/components/business/*` — retained business components; follow the active page imports before treating these as the current shell
- `app/lib/page-metadata.ts` — shared route metadata
- `app/components/mnemes/MnemesHome.tsx` — Mnemes homepage
- `app/data/published-crates.json` — dated public crate snapshot
- `app/data/library-catalog-public.json` — allowlisted public Library Atlas projection
- `app/data/workshop-public.json` and `public/workshop-images/` — allowlisted public maker catalog and project images
- `app/lib/workshop-query.ts` and `app/api/workshop/route.ts` — catalog filtering, exact-build lookup, and bounded pagination over the public projection
- `app/bridge/page.tsx` — checks the format of an optional build ID for the private Bridge handoff; private workspace records are not part of the public catalog

## Claim boundary

Public repositories, packages, tests, and demonstrations show implementation scope. They do not establish customers, revenue, funding, compliance, certification, production readiness, security, universal correctness, or fitness for a particular business.

NVIDIA PAIR PRs #62 (September 23, 2026) and #139 (October 30, 2026) are both accepted upstream changes; the second is test-only. The official NVIDIA 1.0 release notes credit @RecursiveIntell for #62, not for #139. Neither implies NVIDIA employment, sponsorship or partnership. Hermes #91293/#94878 are still unmerged; maintainer acknowledgment and historical review of architecture do not constitute current-head approval. The Singularity companion #362 remains a dependency-blocked draft. Michael Hannecke's TurboQuant article and the Hermes community digest are external mentions, not independent benchmark validation. The separate Teknium social record links the original public highlight, Josh's later Ares update and the repost feed; no unverified exact repost date or product endorsement is inferred.

The November 2026 source-backed portfolio adds a static, crawlable public-only repository index and architecture map. Its 2026-11-18 snapshot is historical and must never be labeled live or complete for all accessible private repositories. The October 2026 refresh evidence, changed claims, and validation receipt are in [docs/site-refresh-20261001](docs/site-refresh-20261001/VALIDATION_RECEIPT.md). The recursive sculpture is conceptual brand artwork, not a product photograph or architecture diagram.

To regenerate the brand SVGs after changing their canonical geometry:

```bash
node scripts/sync-brand.mjs
```

## Build contract

The canonical runtime is Next.js on Node, with Vercel-compatible scripts. The retired ChatGPT Sites/Vinext/Cloudflare Worker path was removed because it no longer matched the repository's canonical `next build` command or produced the artifact expected by the active tests.

Requirements:

- Node `>=22.13.0`
- npm and the committed `package-lock.json`

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run build
node --test tests/rendered-html.test.mjs
npm run validate:artifact
```

`npm test` runs the installer regressions, Workshop catalog and component-logic checks (`npm run test:workshop`), game regressions, the canonical production build, the rendered HTML and public-data boundary suite, and the game route/asset checks. The Workshop interaction tests do not establish browser layout or behavior.

For local development:

```bash
npm run dev
```

For a local production server after building:

```bash
npm run start
```

## Publication

A passing local build does not mean the site was deployed. Commit, push, preview deployment, and production promotion are separate external actions and must be recorded separately.
