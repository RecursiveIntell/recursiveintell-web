# Public surfaces and owners

Canonical repository: `RecursiveIntell/recursiveintell-web`. Runtime: Next.js 16.3.5 on Vercel. Production domain: https://recursiveintell.com. Starting main revision: `1ad410e6786b1201929f79f475c7b08493651b2f`.

| Surface                    | Owner                                                          | Refresh                                                                                                   |
| -------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Home                       | `app/page.tsx`                                                 | New sculpture, dark hero, prominent achievements, three concise projects, four service entry points       |
| Profile                    | `app/josh/page.tsx`                                            | Shared achievements, accepted NVIDIA case first, current Ares lifecycle description                       |
| About                      | `app/about/page.tsx`                                           | Shared achievements and recursive geometry                                                                |
| Selected work              | `app/data/work.ts`, `app/work/page.tsx`                        | Seven cases, canonical NVIDIA evidence, pinned Ares source review                                         |
| Services / contact         | `app/data/services.ts`, route files                            | Clearer workflow-map offer; stable inquiry email, telephone, SMS; anchor links into offers                |
| Shared navigation / footer | `StudioChrome.tsx`, `BrandMark.tsx`, `studio.css`              | Cube-led identity, graphite/purple/paper palette, keyboard mobile menu, compact footer                    |
| Social image / favicon     | `app/opengraph-image.tsx`, `public/favicon.svg`                | Matching cube mark, palette, typography, contributor line                                                 |
| Mnemes / technical routes  | `MnemesHome.tsx`, existing route owners                        | Retained functional content, new geometric art and shared palette; readable controls and inventory labels |
| Repository library         | Existing portfolio projection and API                          | Retained source freshness and privacy boundaries; readable controls, cards, and labels                    |
| Historical Ares cases      | Existing `/work/ares-runtime-case`, `/work/ares-approval-case` | Retained as dated evidence; not silently promoted to current runtime certification                        |

Achievement facts have one owner at `app/data/achievements.ts`. Brand geometry has one owner at `app/config/brand.json`; run `node scripts/sync-brand.mjs` to update public SVG assets. Contact information remains owned by `app/config/site.ts`.

The logo follows the requested combination of the initial options 1, 2, 3, and 6, emphasizing option 3's nested 3D cube. Two sets of six visual concepts were produced before implementing the cube-led hybrid. The final vector is a native geometric asset. The raster sculpture is generated conceptual brand art, never presented as hardware, a customer result, or an exact system diagram.
