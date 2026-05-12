# JSense / RecursiveIntell Website

A production-ready personal site built with Next.js App Router, TypeScript, and a
static-first architecture. It serves as both a public portfolio and a private
workbench, with content authored in MDX and published via Git commits.

## Local development

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

## Content authoring (MDX)

Content lives in `content/**`:

- `content/projects/*.mdx`
- `content/lab/*.mdx`
- `content/writing/*.mdx`
- `content/vault/prompts/*.mdx`
- `content/vault/tools/*.mdx`
- `content/vault/downloads/*.mdx`

Minimum frontmatter schema:

```yaml
title: "Title"
date: "2024-01-01"
summary: "Short summary"
tags: ["tag"]
status: "active" # required for projects + lab
featured: true # optional
links:
  demo: "https://example.com"
images:
  - "/images/example.jpg"
```

- `slug` can be provided; otherwise it is derived from the filename.
- Frontmatter is validated at build time and invalid files fail the build.

## Content index generation

Build-time indexing generates:

- `public/data/search-index.json`
- `public/data/tag-map.json`

Run manually:

```bash
pnpm content:index
```

This runs automatically on `pnpm build` via `prebuild`.

## Search, gallery, buildlog, and private mode

- `/search` reads `public/data/search-index.json` and supports keyword, type, tag, and status filters.
- `/gallery` reads `public/data/gallery.json` in static mode. Configure Blob and database env vars before adding dynamic upload behavior.
- `/buildlog` reads `public/data/buildlog.json`. The `Buildlog` GitHub Action refreshes this JSON on release publish, nightly schedule, or manual dispatch.
- `/private/*` is protected by middleware when `PRIVATE_ACCESS_PASSWORD` is set. Without it, `/private/login` shows a disabled state.

## Environment variables

See `.env.example` for optional configuration. No secrets should be committed.

## Deployment

Deploy via GitHub + Vercel. The project is static-first and optimized for Vercel
build output.

## Quality gates

```bash
pnpm lint
pnpm test
pnpm build
```
