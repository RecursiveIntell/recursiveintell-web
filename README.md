# RecursiveIntell Web

Public website for Josh Stevenson and RecursiveIntell. The site has two explicit product surfaces:

- a cream, ink, purple, and pink RecursiveIntell business shell for custom AI systems and consulting;
- the preserved dark Mnemes product shell for the local-first agent-memory system and its technical proof.

## Canonical routes

### RecursiveIntell

- `/` — business front door
- `/josh` — mobile-first business-card landing page
- `/services` — bounded service offers and technical consulting
- `/work` — artifact-grounded engineering cases
- `/about` — Josh Stevenson and RecursiveIntell
- `/privacy` — current website data boundary
- `/pro` — transparent proposed-product status
- `/portfolio` — public repository and crate projection

### Mnemes

- `/mnemes` — Mnemes homepage
- `/product`, `/node`, `/proof`, `/platform`, `/install`, `/doctrine` — stable Mnemes routes

The Mnemes homepage has one canonical owner at `app/components/mnemes/MnemesHome.tsx`. It is not duplicated into the business root.

## Source owners

- `app/config/site.ts` — site identity, public contact, business navigation
- `app/data/business.ts` — service categories, process, deterministic workflow fixtures, public recognition wording
- `app/data/services.ts` — consulting and implementation offers
- `app/data/work.ts` — curated public case studies and their evidence boundaries
- `app/components/business/*` — RecursiveIntell shell and workflow selector
- `app/components/mnemes/MnemesHome.tsx` — Mnemes homepage
- `app/data/published-crates.json` — dated public crate snapshot
- `app/data/library-catalog-public.json` — allowlisted public Library Atlas projection

## Claim boundary

Public repositories, packages, tests, and demonstrations show implementation scope. They do not establish customers, revenue, funding, compliance, certification, production readiness, security, universal correctness, or fitness for a particular business.

The Teknium note links the original August 5, 2026 public interaction. The site explicitly describes it as recognition of Josh's engineering work, not a testimonial, endorsement, partnership, or customer result.

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
