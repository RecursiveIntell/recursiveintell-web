# Decisions

## 2026-05-11: Static-first completion pass

- The SemanticTurbo benchmark bundle is treated as the visual direction for the public portfolio. The existing Roko/dojo port is preserved instead of replaced.
- Gallery defaults to static manifest mode through `public/data/gallery.json`. Dynamic upload/admin work is gated on Blob and database env vars so Vercel deploys stay cheap and predictable when those services are absent.
- Private mode is disabled when `PRIVATE_ACCESS_PASSWORD` is missing. Protected `/private/*` routes redirect to `/private/login`, which explains the disabled state.
- The content status schema keeps the existing `prototype` value because several Git-managed MDX files already use it. Removing it would break current content without improving runtime behavior.
