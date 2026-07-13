---
version: alpha
name: Witness Plane
description: High-trust operational design for inspectable local-first agent memory infrastructure.
colors:
  primary: "#101312"
  ground: "#101312"
  panel: "#171B19"
  panel-alt: "#1D221F"
  text: "#F1F0E8"
  muted: "#A4AAA3"
  faint: "#7B837D"
  line: "#38413B"
  line-strong: "#566159"
  witness: "#E657A7"
  authority: "#B7E36A"
  warning: "#F0A45D"
  danger: "#E36D67"
  paper: "#E9E7DE"
  paper-ink: "#171B19"
typography:
  display:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 6.25rem
    fontWeight: 500
    lineHeight: 0.91
    letterSpacing: "-0.052em"
  heading-lg:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 3rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  body:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 1.08rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  explanatory:
    fontFamily: Newsreader
    fontSize: 1.38rem
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
  mono:
    fontFamily: Azeret Mono
    fontSize: 0.73rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
rounded:
  none: 0px
  focus: 2px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section: 112px
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.authority}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 48px
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: 16px
  panel-alt:
    backgroundColor: "{colors.panel-alt}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: 16px
  secondary-copy:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: 8px
  metadata:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.faint}"
    rounded: "{rounded.none}"
    padding: 8px
  rule:
    backgroundColor: "{colors.line}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    height: 1px
  rule-strong:
    backgroundColor: "{colors.line-strong}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    height: 1px
  receipt:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: 16px
  receipt-state:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.witness}"
    rounded: "{rounded.none}"
    padding: 8px
  qualified-state:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.warning}"
    rounded: "{rounded.none}"
    padding: 8px
  blocked-state:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.danger}"
    rounded: "{rounded.none}"
    padding: 8px
  install-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.none}"
    padding: 16px
---

## Overview

The Witness Plane treats the running system as the brand. The page should feel like a local runtime under observation: precise enough for scrutiny, distinctive enough to belong only to RecursiveIntell.

This is a **Decide / Learn** surface. Its job is to help a technical evaluator identify the correct layer, understand authority boundaries, inspect evidence scope, and execute a bounded installation path.

Personality comes from sentence rhythm, diagram craft, receipt notation, and exact interaction—not mascots, gradients, stickers, or ambient effects.

## Colors

- **Ground (`#101312`)** is the primary canvas: a green-black rather than generic blue-black.
- **Panel (`#171B19`)** differentiates interactive and inspectable surfaces without shadows.
- **Text (`#F1F0E8`)** is a warm off-white used for primary reading and actions.
- **Witness (`#E657A7`)** marks receipts, trace state, and selected evidence. Keep it under 5% of a screen.
- **Authority (`#B7E36A`)** marks authoritative or verified state. Never use it for body text.
- **Warning (`#F0A45D`)** marks qualified or limited claims.
- **Danger (`#E36D67`)** is reserved for blocked claims or failed gates.
- **Paper (`#E9E7DE`)** creates one high-contrast install zone and breaks the dark-page rhythm.

No atmospheric color gradients. Thin grid rules may be rendered as 1px structural lines only.

## Typography

- **IBM Plex Sans Condensed** handles compact technical headlines and UI.
- **Newsreader** appears sparingly in explanatory text to add editorial clarity without turning the page into a manifesto.
- **Azeret Mono** handles commands, IDs, receipts, evidence, labels, and status.

Headlines are upright, compact, and left-aligned. Avoid oversized italic slogans and default Inter.

## Layout

- Maximum content width: 92rem.
- Desktop hero: asymmetric 5/7 split.
- Core / Server / Kits are connected horizontal bands, not three equal feature cards.
- Major sections use 112px vertical rhythm on desktop and 72px on mobile.
- Diagrams and code are primary media.
- Mobile becomes a decision sequence: claim → action → layer → command → trace → architecture → evidence.

## Elevation & Depth

Depth comes from solid background layers and 1px rules. No card shadows or unearned blur.

Only genuinely overlaid UI, such as the mobile menu, may cover another surface. It still uses a solid background and border.

## Shapes

The system is rectangular. Buttons, tabs, panels, evidence rows, and code surfaces use 0px radius. Focus rings use a two-pixel witness outline with spacing from the element.

## Components

- **Primary button:** warm text surface on dark ground; authority green on hover.
- **Secondary button:** transparent/dark surface with a visible rule.
- **Layer tabs:** one selected high-contrast tab; keyboard arrow navigation.
- **Witness trace:** seven labeled stages; animation only after user action.
- **Receipt drawer:** anonymized source-derived JSON with explicit “can / cannot prove” copy.
- **Evidence status:** dated subject, status, scope, and observation columns; no naked status badge.
- **Architecture focus:** controls update highlighted ownership/trust zones and a static summary.

All touch targets are at least 44px. Every interactive diagram has a static text summary. Motion respects `prefers-reduced-motion`.

## Do's and Don'ts

### Do

- Lead with the Core → Server → Kits architecture.
- Label authoritative, derived, trust, privacy, and operator boundaries.
- Attach scope and limitations to every evidence claim.
- Use magenta only for witness/receipt state.
- Use lime only for authority/verified state.
- Prefer rules, type, diagrams, and source excerpts over decorative containers.
- Keep Roko to a tiny footer, 404, or release-note signature.

### Don't

- Do not use dojo, summon, kata, ninja, or shuriken language in primary product UI.
- Do not use gradients, glassmorphism, ambient glow, pulsing, floating, or parallax.
- Do not create a centered hero plus three equal feature cards.
- Do not show fake metrics, testimonials, logo walls, or fixed MCP tool counts.
- Do not imply that receipts prove truth, correctness, security, or task success.
- Do not make project counts or “shipping daily” status part of the product hierarchy.
