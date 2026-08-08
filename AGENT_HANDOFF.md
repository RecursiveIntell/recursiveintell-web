# RecursiveIntell Web Agent Handoff

## Current contract

- Production build owner: Next.js (`npm run build` -> `next build`)
- Default public identity: RecursiveIntell
- Mnemes canonical home: `/mnemes`
- Business-card conversion route: `/josh`
- Public contact owner: `app/config/site.ts`
- Public data projections: `app/data/published-crates.json` and `app/data/library-catalog-public.json`

Do not reintroduce the retired Vinext/Sites Worker build, `.openai/hosting.json`, D1 example, or Cloudflare binding stubs unless an explicitly authorized migration establishes a new dual-target contract with independent build and test gates.

## Required invariants

1. `/` remains business-first.
2. `/josh` preserves the exact card headline, service order, proof rail, phone, and domain email.
3. `/mnemes` preserves the Mnemes product story and `SoftwareApplication` metadata.
4. Existing Mnemes URLs remain stable.
5. No duplicate Mnemes homepage or second contact configuration is created.
6. Portfolio API query refusal and public allowlist tests continue to pass.
7. No customer, testimonial, revenue, funding, compliance, certification, production-readiness, security, or benchmark-superiority claim is added without new dated evidence.
8. Teknium's public post may be described only within the boundary in `app/data/business.ts`.
9. Analytics must not collect inquiry text, email content, phone numbers, or other free-form PII. No analytics provider is implemented in the current source.

## Validation

Run separately and record exit status:

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run build
node --test tests/rendered-html.test.mjs
npm run validate:artifact
```

Then inspect at minimum 320, 375, 768, and 1440 CSS pixels. Verify keyboard navigation, visible focus, internal links, metadata, and reduced-motion behavior.

## Publication boundary

Local implementation authority does not authorize commit, push, PR creation, preview deployment, or production deployment. Report those states explicitly.
