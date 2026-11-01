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

## Production publication

[PR #16](https://github.com/RecursiveIntell/recursiveintell-web/pull/16) merged at `4b6da001cb00f2896678287c94e8327d625592e9`, with source tree `e97fa95d129454aeda1b12aae8e325a5a052e939`. The exact merge commit received a successful Vercel deployment status. Live HTTP readback completed at 2026-10-15 05:19 UTC; see `docs/workshop-publication-20261015.json`.

- Homepage, Workshop, Bridge entry (including selected-build handoff), and sitemap returned HTTP 200. Workshop is linked on the homepage and sitemap; the Bridge entry is noindex and excluded from the sitemap.
- All 222 live API records exactly matched the allowlisted source projection. Paging defaults to 24 and caps at 60. All 222 public image responses exactly matched their local bytes and SHA-256 filename digests (23,605,932 bytes total).
- The authenticated private Bridge successfully read the live `canary-nightlight` build. Invalid and missing build IDs returned 400 and 404. Three private downloads matched their source bytes. Unauthenticated root, APIs, and private downloads all returned 403; private saved state remained unchanged throughout these read-only checks.
- The existing daily maintenance schedule was read back as enabled with the website-publication instructions present. No future run is claimed executed.

These observations certify source and HTTP delivery, not the blocked browser or standalone password gates above.

## Rollback

Revert this website commit to remove the public routes/projection without changing the private catalog or Bridge data. The catalog source has its prior saved deployment; data recovery is separate and can re-upsert preserved hold payloads through the validated owner-private path after their evidence issues are resolved. Never restore a Bridge database snapshot over current user work.
