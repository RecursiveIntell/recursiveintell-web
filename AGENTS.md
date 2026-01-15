# AGENTS.md

This repository is a personal website for **JSense / RecursiveIntell**, deployed via **GitHub + Vercel**.
It is both a public portfolio and a private “workbench” the owner enjoys using daily.

If you are an agent working in this repo: follow these rules. No freelancing.

---

## Non-negotiables

### Deployment
- Must deploy cleanly on **Vercel** from **GitHub**.
- Prefer **static-first** (SSG/build-time generation) for speed and cost control.
- Avoid long-running server logic and heavy compute in Vercel functions.

### Safety + secrets
- Never commit secrets.
- All secrets belong in Vercel env vars.
- Keep `.env.example` accurate.
- Never log secrets.

### Don’t invent requirements
- Implement what’s specified.
- If something is unclear, choose the simplest reliable interpretation and document it in `DECISIONS.md`.

---

## Definition of Done (DoD)

A feature is “done” only when:
- It works locally (`pnpm dev`) and builds (`pnpm build`).
- It has no broken routes or obvious UI traps.
- It is documented (README updates if user-facing behavior changes).
- CI passes (lint + tests).
- Frontmatter/content schema validation fails fast at build time (no silent bad content).

---

## Build Phases (must follow in order)

### Phase 0: Bootstrap
- Next.js App Router + TypeScript
- Tailwind
- ESLint + Prettier
- Basic layout (header/nav/footer), theme support if included
- Minimal home page

### Phase 1: Content system (MDX)
- Content lives in `/content/**`
- Implement MDX rendering pipeline
- Implement build-time content indexing scripts:
  - generate `public/data/search-index.json`
  - generate `public/data/tag-map.json`
- Routes:
  - `/projects` + `/projects/[slug]`
  - `/lab` + `/lab/[slug]`
  - `/writing` + `/writing/[slug]`
  - `/vault/*` (prompts/tools/downloads)
  - `/now`, `/about`

### Phase 2: Search + Command palette
- Global search page and components
- Command palette (Ctrl+K and optional `/`)
- Search supports tags/status filters on index pages

### Phase 3: Build Log
- `/buildlog` consumes `public/data/buildlog.json`
- GitHub Action updates buildlog JSON:
  - on release publish
  - nightly schedule
- Action commits updated JSON back to repo

### Phase 4: Private mode
- Middleware protects `/private/*`
- `/private/login` sets secure cookie on correct password
- Feature is disabled if `PRIVATE_ACCESS_PASSWORD` is missing

### Phase 5: Gallery
- Public `/gallery` grid with captions/tags
- If Vercel Blob/Postgres configured:
  - `/private/admin/gallery` supports upload + metadata editing
  - uploads are direct-to-blob via signed URL endpoint
- If not configured:
  - gallery runs in “static mode” (manifest-based or empty state)

### Phase 6: Polish
- SEO: sitemap + RSS + metadata
- Accessibility: keyboard navigation, focus states
- Performance: keep bundle lean
- Final README pass

---

## Content Rules

### Frontmatter schema (minimum)
- `title` (string)
- `date` (ISO string)
- `summary` (string)
- `tags` (string[])
- `status` (projects/lab): `active | shipping | paused | archived`
- `featured` (optional boolean)
- `links` (optional object)
- `images` (optional array)

### Content ownership
- Content is Git-managed. MDX files are the primary source of truth for Projects/Lab/Writing/Vault.
- Dynamic DB content is allowed only for:
  - gallery metadata/uploads
  - contact submissions (optional)

---

## Engineering Rules

### Reliability first
- Prefer simple code that survives refactors.
- Prefer build-time generation and caching over runtime fetching.

### No dependency bloat
- Add libraries only when they clearly reduce complexity.
- Avoid “frameworks on frameworks” for content.

### Type safety
- TypeScript strict mode stays on.
- Validate frontmatter and fail builds on invalid schema.

### UI consistency
- Keep consistent typography, spacing, and page layout across sections.
- Build reusable components for:
  - content cards
  - tag chips
  - status badges
  - pagination/filter controls

---

## Required Project Structure (target)

- `app/` (routes)
- `components/` (UI)
- `content/` (mdx content)
- `lib/` (content loaders, search index builders, db clients)
- `public/data/` (generated indices + buildlog)
- `scripts/` (index generation, rss/sitemap generators)
- `.github/workflows/` (CI + buildlog generator)

---

## Quality Gates (run before pushing)

- `pnpm lint`
- `pnpm test` (at least smoke tests)
- `pnpm build`
- Verify routes:
  - `/projects`, `/lab`, `/writing`, `/vault/*`, `/gallery`, `/buildlog`, `/now`, `/about`
  - `/private/login` (denies when disabled, works when enabled)

---

## What to write down (so we don’t forget later)

Create/update:
- `PLAN.md` for current sprint plan
- `DECISIONS.md` for tradeoffs and rationale
- `README.md` for usage + deployment notes

---

## Common pitfalls to avoid

- Putting heavy logic in serverless routes (Vercel limits are real).
- Fetching GitHub API at runtime without caching (rate limits).
- Making gallery uploads go “through” Vercel functions instead of direct-to-blob.
- Letting content parsing silently fail or skip bad files.

---

## If something conflicts
This file wins, unless a newer decision in `DECISIONS.md` explicitly overrides it.
