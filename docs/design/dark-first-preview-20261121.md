# Dark-first website preview — 2026-11-21

## Scope and user approval boundary
This branch implements a **single permanent dark theme**, not a selectable light/dark toggle. It is a review artifact only until the user explicitly approves the appearance. **Do not merge or promote to production prior to visual approval.** Existing production content, upstream proof wording, Ares installer provenance, and Mnemes functionality must remain intact.

## Visual direction
- **Background:** graphite `#0e1119`; deep header/hero `#090c12`; elevated cards `#191e28`.
- **Readable typography:** warm off-white `#f3efe7` primary; silver `#b9bac6` secondary.
- **Signature accent:** satin champagne-brass `#e5bf7c`; hover `#f4d8a7`; on-gold ink `#141821`.
- **Controls:** distinct `#7c7f8d` outlines on panels; always-visible focus rings. Original purple logo geometry and cool Mnemes technical accents remain complementary.
- **Fonts:** preserve Geist (text), Geist Mono (code/data), existing serif for highlighted phrases; no unlicensed or unverified specialty font.
- **Hierarchy:** use gold selectively on large display phrases and meaningful links, never as blanket small-body copy.

## Why this direction
W3C WCAG 2.2 AA contrast targets are at least 4.5:1 for normal text and 3:1 for sufficiently large text; important UI boundaries need 3:1. An almost-black hierarchy of surfaces avoids a single flat `#000` slab. Color alone is not used to distinguish proof status. Primary actions use dark text on gold rather than white text on bright gold.

## Source boundaries
- `app/studio.css`: studio and shared semantic palette, dark-first support for Mnemes technical pages.
- `app/business.css`: retained privacy/pro business chrome.
- `app/workshop/workshop.module.css`: standalone catalog, search, modal, filters.
- `app/bridge/bridge.module.css`: private Bridge entry.
- `app/layout.tsx`: browser theme metadata for native dark controls.
- `tests/theme-contrast.test.mjs`: static token/role contrast assertions; cannot replace browser computed-style inspection.
- `public/game/claw/*`: RPG artwork and game-specific styling remain independent (already dark by design).

## Acceptance gates
1. `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run test:theme`, `npm test`, `npm run validate:artifact` all pass on exact PR head.
2. Inspect preview at 320, 375, 768 and 1440 CSS pixels on home, /josh, /about, /work, /services, /contact, /systems, /portfolio, /evidence, /changes, /workshop (including dialogs), /bridge, /mnemes, /proof, /privacy and /pro. Check readability, fields, hover, keyboard focus, color-coded statuses, and reduced motion.
3. No gold-on-gold or dark-on-dark text; mobile nav overlays and workshop dialog remain keyboard operable.
4. Obtain explicit user visual approval before merge and domain promotion. Preview production state separately from a working PR build.

## Rollback
Unmerged: delete/close draft branch without affecting production. If later merged and deployed: revert the exact merge commit on a review branch, run both website workflows, and promote the previously verified Vercel production deployment if necessary. No Ares runtime, data, installer, catalog contents, or unrelated routes are changed by this design branch.
