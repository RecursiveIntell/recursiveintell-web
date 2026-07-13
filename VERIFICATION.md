# Verification Receipt

Date: 2026-07-13

Repository: `/home/sikmindz/Coding/recursiveintell-web`

## Artifact checks

| Check | Result |
|---|---|
| `index.html` HTML parser | PASS |
| `concepts.html` HTML parser | PASS |
| inline JavaScript syntax via Node | PASS |
| local `index.html` HTTP response | 200 |
| local `concepts.html` HTTP response | 200 |
| local `favicon.svg` HTTP response | 200 |
| `DESIGN.md` structural/token/WCAG lint | PASS — 0 errors, 0 warnings |
| duplicate IDs, dead fragments, bare `#` links, missing ARIA controls | PASS — none found |
| public GitHub/docs resource links | PASS — all returned HTTP 200 |
| axe-core 4.12.1, `index.html` | PASS — 0 violations |
| axe-core 4.12.1, `concepts.html` | PASS — 0 violations |
| `scripts/verify_static.py` | PASS — HTML, links, ARIA targets, JavaScript, artifacts, Vercel settings |
| `vercel.json` current schema instance validation | PASS |

## Production deployment receipt

Content commit: `efc94ec24283b9193f332dbb14b1bc54d44987e5`

- GitHub Actions `Static site CI` run `29259420542`: PASS
- `https://recursiveintell.com/`: HTTP 200 with the Witness Plane title
- `https://recursiveintell-web.vercel.app/`: HTTP 200 with the Witness Plane title
- `/concepts`, `/favicon.svg`, and both screenshot artifacts: HTTP 200
- Content Security Policy, Permissions Policy, Referrer Policy, HSTS, `nosniff`, and frame denial headers: present
- Live browser console and page-error capture: clean
- Live Core/MCP/Kits, architecture, host, and seven-stage trace interactions: PASS

## Browser interaction receipt

Independent Playwright run using system Chrome at 1440×900 and 390×844:

```json
{
  "status": 200,
  "errors": [],
  "state": {
    "layer": "mcp",
    "arch": "trust",
    "host": "codex",
    "trace": 7,
    "button": "Run trace"
  }
}
```

This exercises:

- Core / MCP / Kits layer selection
- arrow-key selection and a single tab stop for product and host tabs
- architecture focus selection
- host install-tab selection
- source-matched Hermes plugin + MCP install rendering
- clipboard action and delayed label reset
- complete seven-stage witnessed trace
- delayed trace-button reset
- mobile menu open and Escape-to-close focus return
- mobile resource-title/description separation
- fixed mobile action clearance above footer content
- browser console and page-error capture

A prior run exposed an asynchronous `event.currentTarget` bug in the trace completion handler. The handler now captures the button element before the event lifecycle ends; the repeated independent browser run returned zero errors.

## Visual receipts

- Desktop: `docs/witness-plane-desktop.png`, full page at a 1440×900 viewport
- Mobile: `docs/witness-plane-mobile.png`, full page at a 390×844 viewport

Reviewed:

- header and menu hierarchy
- headline wrapping
- CTA priority
- product-layer selector
- witness-plane alignment
- section rhythm
- architecture legibility
- install contrast zone
- mobile clipping and overflow
- mobile developer-resource row separation
- persistent mobile Install / Docs action

No blocking visual defect remained in the reviewed viewports.

The browser geometry receipt reported exact document/viewport width parity:

```json
{
  "desktop": { "viewport": 1440, "document": 1440, "body": 1440 },
  "mobile": { "viewport": 390, "document": 390, "body": 390 },
  "mobileFooter": { "quickActionTop": 782, "lastContentBottom": 739.6875 }
}
```

## WCAG token correction

Initial formal design lint measured the metadata color at 4.05:1 against the ground, below the WCAG AA 4.5:1 minimum. The `faint` token was changed from `#6F7771` to `#7B837D`, measured at 4.79:1. The final design lint reports zero warnings.

An axe-core pass then found low-contrast secondary text in architecture, install, and concept-board surfaces plus one trace heading-order issue. Secondary text tokens were raised, trace-stage labels were changed from headings to semantic strong labels, and the resource layout was corrected for mobile. The repeated axe runs returned zero violations on both pages.

## Slop diagnostic

Final score: **0/10**.

| Tell | Present? | Evidence |
|---|---:|---|
| Tech gradient | No | Flat structural surfaces; no atmospheric gradient |
| Generic indigo | No | Green-black, witness magenta, authority lime |
| Feature-tile grid | No | Connected product bands and architecture planes |
| Accent rail | No | Rules describe structure, not decoration |
| Unearned blur | No | Solid layers; no glassmorphism |
| Monument stats | No | Metrics appear only in a scoped benchmark table |
| Icon topper | No | No generic icon-card pattern |
| Center stack | No | Asymmetric 5/7 hero and left-aligned sections |
| Default Inter | No | IBM Plex Sans Condensed, Newsreader, Azeret Mono |
| Wrong surface | No | Decide / Learn composition with install and evidence paths |

## Claim-integrity review

The prototype does not claim:

- customers, adoption, revenue, funding, compliance, or production maturity
- repository-wide release readiness
- universal security or privacy
- fixed full-profile MCP tool counts
- that every operation emits a receipt
- that receipts prove correctness or factual truth

The page explicitly labels the current state as a source-scoped preview and exposes the release-wide blocker scope.

Copy and install paths were cross-checked against the current local source on 2026-07-13:

- `semantic-memory` at `f4cc89b33ca9`
- `semantic-memory-mcp` at `d232f40ca531`
- `agent-memory-kits` at `e325d0ee7345`

Those source trees contained uncommitted changes, so the prototype preserves the dated audit boundary and does not promote the check into package, release, or live-system certification.

## Not verified

- clean-machine installation of every displayed host path
- package/source/live artifact parity

Those remain outside the website deployment claim.
