# Sprint Plan (Completion Pass)

- Finish the SemanticTurbo/Roko public portfolio direction without reverting local work.
- Add static-first missing routes: `/search`, `/gallery`, `/buildlog`, `/private/login`, `/private`, and `/private/admin/gallery`.
- Keep MDX and generated JSON as the default source of truth for content, search, tags, gallery, and buildlog data.
- Wire GitHub Actions for CI and scheduled/release buildlog updates.
- Run `pnpm lint`, `pnpm test`, and `pnpm build` before pushing.
