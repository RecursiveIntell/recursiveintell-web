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
- `/about` — Josh Stevenson and RecursiveIntell
- `/contact` — hiring, consulting and collaboration contact options
- `/privacy` — current website data boundary
- `/pro` — transparent proposed-product status
- `/portfolio` — public repository and crate projection

### Mnemes

- `/mnemes` — Mnemes homepage
- `/product`, `/node`, `/proof`, `/platform`, `/install`, `/doctrine` — stable Mnemes routes

The Mnemes homepage has one canonical owner at `app/components/mnemes/MnemesHome.tsx`. It is not duplicated into the business root.

## Source owners

- `app/config/site.ts` — site identity, public contact, business navigation
- `app/data/business.ts` — service categories, process, deterministic workflow fixtures
- `app/data/achievements.ts` — source-linked upstream contribution and community recognition, shared across public pages
- `app/config/brand.json` — canonical Recursive Cube vector geometry and asset colors
- `app/components/BrandMark.tsx` — inline brand mark; `scripts/sync-brand.mjs` produces its downloadable SVGs and favicon
- `app/data/services.ts` — consulting and implementation offers
- `app/data/work.ts` — curated public case studies and their evidence boundaries
- `app/components/StudioChrome.tsx` and `app/components/Studio.tsx` — current studio shell, shared sections and selected-project rendering
- `app/components/business/*` — retained business components; follow the active page imports before treating these as the current shell
- `app/lib/page-metadata.ts` — shared route metadata
- `app/components/mnemes/MnemesHome.tsx` — Mnemes homepage
- `app/data/published-crates.json` — dated public crate snapshot
- `app/data/library-catalog-public.json` — allowlisted public Library Atlas projection

## Claim boundary

Public repositories, packages, tests, and demonstrations show implementation scope. They do not establish customers, revenue, funding, compliance, certification, production readiness, security, universal correctness, or fitness for a particular business.

The NVIDIA PAIR contribution links merged upstream PR #62 and its September 23, 2026 merge record. It does not imply NVIDIA employment, sponsorship, or partnership. The Teknium note links the original public highlight, Josh's later Ares update, and the repost feed. Social recognition is an observed interaction, with no invented exact repost date or customer/endorsement claim.

The October 2026 refresh evidence, changed claims, and validation receipt are in [docs/site-refresh-20261001](docs/site-refresh-20261001/VALIDATION_RECEIPT.md). The recursive sculpture is conceptual brand artwork, not a product photograph or architecture diagram.

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

`npm test` runs the canonical production build and then the rendered HTML and public-data boundary suite.

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
