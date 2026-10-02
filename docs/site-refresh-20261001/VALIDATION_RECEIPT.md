# Website refresh validation receipt

Repository: `RecursiveIntell/recursiveintell-web`. Branch: `codex/professional-site-achievements-20261001`. Base: `1ad410e6786b1201929f79f475c7b08493651b2f`. Evidence review: October 1, 2026. Validation: October 2, 2026 UTC.

## Required local checks

| Check                                                  | Result                                          |
| ------------------------------------------------------ | ----------------------------------------------- |
| Clean dependency install (`npm ci`)                    | Passed                                          |
| Production build (`npm run build`)                     | Passed; canonical Next output, 23 route entries |
| Lint (`npm run lint`)                                  | Passed                                          |
| TypeScript (`npx tsc --noEmit`)                        | Passed                                          |
| Rendered HTML / metadata / public-data boundary tests  | 19 passed, no skipped tests                     |
| Next artifact validation (`npm run validate:artifact`) | Passed                                          |
| Diff whitespace (`git diff --check`)                   | Passed                                          |

## Render and interaction checks

Local rendering uses the production artifact, not the development server. The [machine-readable render report](render-report.json) records:

- 18 public routes at 320, 375, 768, and 1440 pixels: 72 successful renders, no document-width overflow, one H1 per page, no broken images.
- WCAG 2 A/AA and 2.1 A/AA automated checks on all 18 desktop routes and four mobile routes: 22 scans, zero detected violations.
- 21 distinct internal links: successful responses and valid fragments, including the homepage service-offer anchors.
- Keyboard mobile-menu open, first-link focus, Escape close/focus return, and keyboard service-scope expansion: passed.
- No browser page errors in the rendered route sweep.
- Optimized hero image: WebP, 58,808 bytes at desktop size and 28,946 bytes at the tested smaller sizes.
- Manual inspection of desktop/mobile home, profile, services, contact, Mnemes, repository library, tablet/small-phone home, and the generated social card.

Representative previews: [desktop](home-desktop.png), [mobile](home-mobile.png), and [full homepage](home-full-desktop.png). Automated accessibility checks supplement visual inspection; they are not a blanket accessibility certification. Headless Chromium 153, Playwright, and axe-core were used for the rendered checks.

Publication is a separate check. A local build does not establish Vercel deployment. The PR publication receipt records the exact tested head, preview result, merge SHA, production state, and live checks after those actions occur.

## Evidence limits

NVIDIA PR #62's accepted patch and merge record were inspected. The upstream project's regression suite was not run locally as part of this website change. Ares lifecycle wording was inspected against the pinned source revision, not certified across an installed runtime/platform matrix. Repeat Teknium recognition is observed public context plus the user's report; no exact new repost timestamp is asserted. Existing numeric research claims retain their original limits and were not re-benchmarked here.
