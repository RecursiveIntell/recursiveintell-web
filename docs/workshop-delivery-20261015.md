# Workshop delivery — 2026-10-15

Recovered the interrupted Workshop/Bridge implementation from main baseline `34a25ad836f30385902503fc45769e3671254024`. This change publishes the public Workshop and a private Bridge entrance through the existing Next.js site.

## Delivered source

- 222 projects: all 56 original projects retained, with 166 additions. 98.65% support ESP32 or ESP32-S3; three use Arduino UNO Q. Each entry has a verified local image, original creator attribution, printable-model destination, parts, firmware information, and at least six build steps. Research checks do not constitute hardware tests.
- Search, board/interest/difficulty filters, bounded 24-item paging (API maximum 60), detail panels and part checklists. Homepage, navigation, footer and sitemap expose `/workshop`.
- `/bridge` is a noindex entrance to the existing owner-private workspace. A build ID is preserved for explicit review/save after sign-in. No private Bridge snapshots, notes, drafts or download files were copied to this public repository.
- Canonical Circuit Workshop remains the private maintenance owner. Its source revision `b519e3a3e62bf0ccc76b472fcae6fcee00558b3e` is deployed. The final migration preserves two provisional entries in `catalog_holds`, including their payloads/timestamps and existing revisions; these are excluded from the public projection. All 56 original payloads remain unchanged.
- Existing scheduled updates remain enabled at 08:00, 14:00 and 20:00 America/Chicago, targeting 50 qualified additions per run. Active capacity is 1,000; authorized increases are in 1,000-project steps up to 10,000. Future runs are configured, not claimed executed. Committed maintenance instructions include the maker-only GitHub publication path.

## Verification

- `npm ci --no-audit --no-fund`: exit 0.
- `npm test`: exit 0, including 21 installer, four Workshop, 66 game, 20 rendered-content and two game-route tests plus production build. These suites cover different surfaces; counts are not independent product guarantees.
- `npm run lint`, `npx tsc --noEmit`, `npm run validate:artifact`, `git diff --check`: pass on final source (final lint repeated after renaming a test harness variable).
- All 222 referenced images decode and match SHA-256 filename digests; hosted maintenance image readback completed during export. Three obsolete/unreferenced image files are excluded from publication.
- Independent read-only review found a filter/pagination race. The bounded repair prevents paging during pending/failed filter updates and ignores aborted responses. Two actual-component timer/event regressions now pass. Independent follow-up found no remaining confirmed scoped defect.
- Circuit storage tests exercise initial/absolute capacity, atomic failures, original-data preservation and exact evidence holds. Circuit typecheck/build pass; deployed `catalog_holds` contains the two expected IDs. Bridge's ten existing state/planner tests pass.

## Remaining limits

Standalone username/password hosting at this domain is not configured. Vercel can list the correct project, but project settings/environment reads return an owning-team HTTP 403; no Vercel CLI is available here. The Bridge continues to use its working owner-only ChatGPT sign-in. No temporary bypass token is stored as a production credential.

Managed browser tooling is unavailable; desktop/mobile layout, keyboard behavior and browser interaction have not been certified in this completion pass. Component logic, static rendered HTML, build, API and asset evidence are separate gates.

This receipt describes the validated source. Exact-commit Vercel status and live URL/API/image verification must be recorded separately at publication; a source commit alone is not proof of deployment.

## Rollback

Revert this website commit to remove the public routes/projection without changing the private catalog or Bridge data. The catalog source has its prior saved deployment; data recovery is separate and can re-upsert preserved hold payloads through the validated owner-private path after their evidence issues are resolved. Never restore a Bridge database snapshot over current user work.
