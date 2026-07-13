# Plan: Feature Best Stack Items on Portfolio Site

**Created**: 2026-07-11
**Status**: Complete
**Source**: `~/Coding/PORTFOLIO_POTENTIAL_AUDIT_2026-07-10.md`

---

## Goal

Align the RecursiveIntell portfolio website with the ranked audit: feature the highest-potential surfaces (agent evidence stack, TurboQuant/PolyKV, ESP32-S3, Gloss) and demote secondary apps so visitors see the best work first.

---

## Research

- [x] Read portfolio potential audit (2026-07-10)
- [x] Inspect recursiveintell-web vs website/
- [x] Read READMEs: agent-memory-kits, semantic-memory, turbo-quant, poly-kv, Gloss, ESP32

### Research Notes

**Topic**: Ranked product surfaces
**Source**: PORTFOLIO_POTENTIAL_AUDIT_2026-07-10.md
**Finding**: Top 4 focus lanes are (1) agent memory+evidence, (2) turbo-quant/poly-kv, (3) ESP32-S3, (4) Gloss. VisionForge/Sortarr/AiDENs whole-platform should not lead.
**Impact**: Featured flags, homepage hero, project list order, new MDX pages.

---

## Analysis

### Current State
- `recursiveintell-web` is the newer site (v2026.07) with 10 surfaces.
- Featured almost everything equally including Sortarr, VisionForge, Palisade, AiDENs.
- Missing explicit pages for agent-memory-kits, turbo-quant, poly-kv.
- Hero still centers "Recall + Gloss" rather than the flight-recorder wedge.

### Proposed Changes
1. Add projects: agent-memory-kits, turbo-quant, poly-kv
2. Featured: agent-memory-kits, turbo-quant, poly-kv, esp32-sentinel, gloss, claimledger, rust-libraries
3. Unfeature: sortarr, visionforge, palisade, aidens, projmind, recall (keep listed)
4. Update hero, NOW, marks strip, layout metadata
5. Write MDX for new projects; demote featured in existing MDX

---

## Implementation Steps

### Phase 1: Data model
- [x] Rewrite `data/portfolio.ts` with ranked projects and categories
- [x] Update `data/projects.json`

### Phase 2: Content
- [x] Create `content/projects/agent-memory-kits.mdx`
- [x] Create `content/projects/turbo-quant.mdx`
- [x] Create `content/projects/poly-kv.mdx`
- [x] Update featured flags on existing MDX

### Phase 3: Surfaces
- [x] Update homepage hero / NOW / marks
- [x] Update layout metadata keywords/description
- [x] Update about + now pages
- [x] Sort projects index featured-first

### Phase 4: Verify
- [x] `pnpm content:index` / build smoke
- [x] `pnpm test` if present

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `data/portfolio.ts` | modify | Ranked featured projects |
| `data/projects.json` | modify | Sync inventory |
| `app/page.tsx` | modify | Hero + NOW messaging |
| `app/layout.tsx` | modify | SEO metadata |
| `content/projects/*.mdx` | create/modify | New + featured flags |
| `PLAN.md` | modify | This plan |

---

## Verification

- [x] Homepage lists best items first with featured stars
- [x] `/projects/agent-memory-kits`, `/projects/turbo-quant`, `/projects/poly-kv` resolve
- [x] Secondary projects remain linked but not featured
- [x] `pnpm test` / `pnpm build` succeed (39 static pages)

---

## Progress Log

### 2026-07-11 — Planning
- Examined ~/Coding stack and portfolio audit
- Chose recursiveintell-web as canonical site

### 2026-07-11 — Implementation
- Featured: agent-memory-kits, claimledger, rust-libraries, turbo-quant, poly-kv, esp32, gloss
- Unfeatured: recall, aidens, palisade, sortarr, visionforge, projmind
- Hero reframed as flight recorder wedge
- Build green

---

## Status Checklist
- [x] Plan created
- [x] Research completed
- [x] Tests written (LOCKED) — N/A content-only; smoke test still run
- [x] Implementation started
- [x] All steps completed
- [x] Verification passed
- [x] **DONE**
