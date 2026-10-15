# Workshop and private Bridge

The user authorized these website additions on 2026-10-15.

- `/workshop` is the public Circuit Workshop, linked from the homepage, primary navigation and footer. Search, board/category/difficulty filters, bounded server pages, build notes, source attribution and a private planning handoff are included.
- `/api/workshop` reads only `app/data/workshop-public.json`. Default page 24, maximum 60. `?project=<id>` returns one exact build. It never reads personal workspace state.
- `/bridge` is a noindex entrance to the existing owner-private Bridge. A selected maker build is passed as a validated ID; the private application previews it and requires explicit Save before creating an action.
- The Bridge currently uses its existing ChatGPT owner sign-in. A standalone username/password login on this domain is **not configured**. Vercel settings access and a supported durable private-backend connection remain prerequisites. On 2026-10-15, the connected Vercel app listed the correct project but both project settings and environment reads returned team-scope HTTP 403. No authenticated Vercel CLI is available in this environment. Do not put temporary Sites bypass tokens in environment variables or expose the Bridge to make a proxy work.

## Catalog ownership and updates

Canonical maintenance Site: `appgprj_6ad00dfd63588191b0cb59ce4a27ffc4`, https://recursiveintell-circuit-workshop.sik-mindz.chatgpt.site .

Its private source `.openai/CATALOG_UPDATES.md` governs research and live storage. The catalog starts with a 1,000-project active ceiling, may expand in 1,000-project increments when necessary, and must never exceed 10,000. Three existing daily runs each seek 50 additional distinct, documented, photo-backed projects. Quality requirements remain binding; report a verified shortfall instead of fabricating or duplicating builds.

After a successful canonical update, its `scripts/catalog-client.py` action `export_public` writes an explicit maker-field allowlist and verified project photos into this checkout. Only `app/data/workshop-public.json` and `public/workshop-images/*` are allowed output. No Bridge snapshot, provenance, notes, drafts, calendar/email data, sessions or receipts belong here.

Validate the public projection with `node --test tests/workshop.test.mjs`, then the repository's AGENT_HANDOFF.md gates. Publish an atomic source commit through the existing GitHub→Vercel pipeline. Inspect the current main head before writing, use an expected-head lease, and preserve concurrent work. Confirm Vercel's exact-commit deployment status and the real website response. GitHub source publication alone is not a confirmed live update.

Public photos are credited in the build detail. The original source and model access terms remain attached to each record. Paid models, sign-in requirements and blocked automated binary downloads must remain explicit.

## Verification scope

A successful production build and server/API checks do not prove browser behavior. When the managed control-browser skill is unavailable, do not install or improvise browser tooling. Report the missing responsive and interactive render check.
