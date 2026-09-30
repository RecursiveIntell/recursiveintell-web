# Legacy route alias backup

These files are the exact source snapshots of the seven legacy alias pages that
were active before the canonical-route redirect pass. They are retained as a
non-executable rollback record outside `app/`, so Next.js will not expose them
as duplicate pages.

Source commit: `2b08e5cd585c81a2f4fdaa2cf6a532c9cff446e0`

| Legacy route | Canonical route | Backed-up source |
| --- | --- | --- |
| `/architecture` | `/platform` | `architecture/page.tsx` |
| `/archive` | `/proof` | `archive/page.tsx` |
| `/capabilities` | `/platform` | `capabilities/page.tsx` |
| `/ecosystem` | `/platform` | `ecosystem/page.tsx` |
| `/network` | `/product` | `network/page.tsx` |
| `/origin` | `/doctrine` | `origin/page.tsx` |
| `/technology` | `/platform` | `technology/page.tsx` |

To roll back an alias, restore its backed-up page under `app/<alias>/page.tsx`
and remove the corresponding redirect entry from `app/config/routes.ts`.
`next.config.ts` projects that shared list; preserve its unrelated redirects and
security-header wiring.
