import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Static, deterministic contrast checks for the permanent dark-first palette.
// This protects the authored role tokens; it is not a browser/computed-style audit.
const studio = await readFile(new URL("../app/studio.css", import.meta.url), "utf8");
const workshop = await readFile(new URL("../app/workshop/workshop.module.css", import.meta.url), "utf8");
const bridge = await readFile(new URL("../app/bridge/bridge.module.css", import.meta.url), "utf8");
const business = await readFile(new URL("../app/business.css", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

const root = studio.match(/:root\s*\{([^}]+)\}/);
assert.ok(root, "The studio palette must have one root source");
const tokens = Object.fromEntries(
  [...root[1].matchAll(/(--[\w-]+):\s*(#[\da-f]{6})\s*;/gi)]
    .map((match) => [match[1], match[2].toLowerCase()]),
);

function relativeLuminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function ratio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function expectContrast(name, fg, bg, minimum) {
  assert.ok(ratio(fg, bg) >= minimum, `${name}: ${ratio(fg, bg).toFixed(2)}:1 below ${minimum}:1`);
}

test("permanent studio canvas, card, text, supporting text and gold meet contrast targets", () => {
  assert.equal(tokens["--studio-paper"], "#0e1119");
  assert.equal(tokens["--studio-white"], "#191e28");
  assert.equal(tokens["--studio-dark"], "#090c12");
  for (const surface of ["--studio-paper", "--studio-white", "--studio-dark"]) {
    expectContrast(`body on ${surface}`, tokens["--studio-ink"], tokens[surface], 7);
    expectContrast(`supporting text on ${surface}`, tokens["--studio-muted"], tokens[surface], 4.5);
    expectContrast(`gold accent on ${surface}`, tokens["--studio-accent"], tokens[surface], 4.5);
  }
  expectContrast("gold button label", tokens["--studio-accent-ink"], tokens["--studio-accent"], 4.5);
  expectContrast("gold hover button label", tokens["--studio-accent-ink"], tokens["--studio-brass-soft"], 4.5);
  expectContrast("control border on raised panel", tokens["--studio-control-line"], tokens["--studio-white"], 3);
});

test("dark tokens are applied across studio, workshop, business routes and Bridge", () => {
  assert.match(studio, /:root\s*\{\s*color-scheme:\s*dark;/);
  assert.match(layout, /colorScheme:\s*"dark"/);
  assert.match(layout, /themeColor:\s*"#090c12"/);
  assert.match(studio, /\.studio-page\s*\{\s*background:\s*var\(--studio-paper\)/);
  assert.match(workshop, /\.workshop\{color-scheme:dark;--cw-ink:#f3efe7/);
  assert.match(workshop, /background:#0e1119;color:var\(--cw-ink\)/);
  assert.match(bridge, /\.entry\{color-scheme:dark;/);
  assert.match(business, /\.business-header\s*,\s*\.business-header nav\s*\{\s*background: var\(--studio-dark\)/);
  expectContrast("workshop text", "#f3efe7", "#0e1119", 7);
  expectContrast("workshop secondary text", "#b9bac6", "#191e28", 4.5);
  expectContrast("Bridge primary CTA", "#141821", "#e5bf7c", 4.5);
});
