# RecursiveIntell website repair and publication handoff — 2026-11-19

This report is an evidence-bound source and CI handoff, not a claim that the live custom domain or a complete native Ares install was independently verified.

## Source-of-truth decisions
- Canonical Ares installer: `RecursiveIntell/Ares/install.sh` at merge `284bf862d79e174192abcbd261846d0bbdd9ce5f`.
- Published website copy: `public/ares/install.sh` with exact source custody in `public/ares/source-lock.json`. A GitHub Actions gate compares it against pinned Ares bytes. Do not directly edit the website copy without updating source/lock and proving identity.
- Public website claims: `app/data/work.ts`, `app/data/achievements.ts`, `app/data/public-highlights.ts`, `app/data/public-evidence.ts` and the dated `app/data/public-repositories.json` snapshot. They have different owners/refresh contracts; avoid new duplicate mutable truth.
- Public-only repository inventory: 47 visible public repositories at 2026-11-18 observation, not a count of supported products, nor the 66 total authorized repositories (private metadata is excluded).
- Mnemes local server and experimental device-owned replication must not be conflated. RSI substrate merged changes remain inactive; no fully autonomous improvement claim.
- Forked code must attribute Hermes/NVIDIA/OpenAI and other original upstream owners where appropriate.

## Merged implementation (GitHub)
| PR | Revision | Scope |
| --- | --- | --- |
| [Ares #264](https://github.com/RecursiveIntell/Ares/pull/264) | `284bf862d79e174192abcbd261846d0bbdd9ce5f` | Fix full-install Python `sys` import and add source-based test |
| [Website #25](https://github.com/RecursiveIntell/recursiveintell-web/pull/25) | `ad84ebd31585b0d4985e0ae3478d6f87d431e90f` | SSR portfolio, systems and Ares pages, new cases, corrected sitemap and source disclosure |
| [Website #24](https://github.com/RecursiveIntell/recursiveintell-web/pull/24) | `7911c5f80cc5efc01d22dcfe4047c64ca51e1842` | Exact canonical installer mirror, source lock, installer CI |
| [Website #26](https://github.com/RecursiveIntell/recursiveintell-web/pull/26) | `4353c1b5eb967b73b96f89e4faa66d2f732e8397` | Reconcile Ares install guide and website capability evidence |

## Qualification evidence
- Ares #264: primary CI successful, macOS advisory successful, Docker CI successful on submitted head. These are repository-scoped, not live deployment proof.
- Website PR #25: `Source-backed website verification` successful on reviewed head `774babee2550309f5d48597af89767ce62091516`.
- Website PR #24: `Website source and publish gates` successful on reviewed head `e9a312d565a1b2c0dd59f971f75c99f6ae76997b`.
- Website PR #26: both website workflows successful on reviewed head `500d017fb4a41267d961b57ea47968d0de42cd61`.
- Both workflows successful on combined website main commit `4353c1b5eb967b73b96f89e4faa66d2f732e8397` before this evidence-page PR.
- Previous failed CI attempts were repaired and remain discoverable in GitHub Actions. Do not erase history or claim they never occurred.

## Known blockers / follow-up gates
1. **Production delivery:** authenticated Vercel project/team access returned 403 until operator approves team-scoped consent. A Vercel success check is not independent proof that `recursiveintell.com` serves the expected commit. Verify production alias, exact commit, `/ares`, `/systems`, `/portfolio`, `/evidence`, `/changes`, `/ares/install.sh`, and custom-domain/WWW redirects after authorization.
2. **Native install:** isolated script and source checks pass, but a full network/native Ares installation on a disposable test host with provider-less setup, explicit release receipt inspection, rollback and recovery has not been performed here.
3. **Browser quality:** mobile/desktop browser render tests at 320/375/768/1440, keyboard focus, accessibility, screenshots, and private-URL scanning should be run against the exact preview/production build.
4. **Data refresh:** dated public snapshot and curated historical evidence require periodic human-controlled refresh. `app/sitemap.ts` intentionally omits unsupportable uniform `lastModified` stamps.
5. **Publication:** tests and source commits are independent of custom-domain production promotion. Do not mark this work production-verified absent a deployment receipt.

## Commands for source validation
```bash
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run validate:artifact
```
The source-integrity CI additionally fetches the pinned canonical Ares installer and checks byte identity. Do not execute third-party install scripts merely to compare them.

## Rollback
- On website source: revert exact website merge commits in reverse dependency order (this evidence PR first if merged, then #26, #24, #25) on a review branch; rebuild and retest before any deployment. Existing previous commits remain retained.
- On installed Ares: use `ares status` and the Ares runtime's supported `ares rollback` only after verifying managed-release ownership and the selected home; website source revert does not roll back installed user data or external services.
- On hosting: promote/redeploy a previously validated deployment revision after confirming team, project, SHA and environment. No production Vercel rollback was initiated here.
