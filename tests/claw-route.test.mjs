import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const origin = "https://www.recursiveintell.com";
const entryUrl = new URL("/game/claw", origin);
const publicRoot = new URL("../public/", import.meta.url);

async function readPublic(url) {
  assert.equal(url.origin, origin, `${url.href} must stay on the website`);
  assert.ok(url.pathname.startsWith("/game/claw/"), `${url.href} must stay in the game directory`);
  const file = new URL(`.${url.pathname}`, publicRoot);
  assert.ok((await stat(file)).isFile(), `${url.href} must resolve to a regular file`);
  const buffer = await readFile(file);
  assert.ok(buffer.length > 0, `${url.href} must not be empty`);
  return buffer.toString("utf8");
}

test("the production Next manifest serves the exact game URL without redirecting or capturing assets", async () => {
  const manifest = JSON.parse(await readFile(new URL("../.next/routes-manifest.json", import.meta.url), "utf8"));
  const rewrites = Array.isArray(manifest.rewrites)
    ? manifest.rewrites
    : Object.values(manifest.rewrites).flat();
  const route = rewrites.find(({ source }) => source === "/game/claw");
  assert.ok(route, "Run npm run build first; the built manifest must contain the game rewrite");
  assert.equal(route.destination, "/game/claw/index.html");
  const match = new RegExp(route.regex);
  assert.ok(match.test(entryUrl.pathname));
  assert.ok(!match.test("/game/claw/main.js"));
  assert.ok(!match.test("/game/claw-other"));
  assert.ok(!manifest.redirects.some(({ regex }) => new RegExp(regex).test(entryUrl.pathname)), "The canonical URL must serve the game directly");
});

test("the no-trailing-slash document resolves the complete local module, image, texture, and font graph", async () => {
  const html = await readPublic(new URL("/game/claw/index.html", origin));
  const baseMatch = html.match(/<base\s+href=["']([^"']+)["']/i);
  assert.ok(baseMatch, "The exact /game/claw URL needs an explicit asset base");
  const base = new URL(baseMatch[1], entryUrl);
  assert.equal(base.href, `${origin}/game/claw/`);
  assert.ok(html.indexOf("<base ") < html.indexOf('rel="stylesheet"'));
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.recursiveintell\.com\/game\/claw">/);
  assert.doesNotMatch(html, /<iframe\b|http-equiv=["']refresh|chatgpt\.site/i);

  const queue = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["'][^>]*>/gi)]
    .filter(([tag]) => !/rel=["']canonical["']/i.test(tag))
    .map(([, reference]) => new URL(reference, base));
  const visited = new Set();
  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url.pathname)) continue;
    visited.add(url.pathname);
    const source = await readPublic(url);
    const refs = [];
    if (url.pathname.endsWith(".css")) {
      for (const match of source.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]+))\s*\)/g)) {
        const reference = match[1] ?? match[2] ?? match[3];
        if (!reference.startsWith("data:")) refs.push(reference);
      }
    }
    if (url.pathname.endsWith(".js")) {
      for (const match of source.matchAll(/(?:^|\n)\s*(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?["']([^"']+)["']/g)) refs.push(match[1]);
      for (const match of source.matchAll(/\bimport\(\s*["']([^"']+)["']/g)) refs.push(match[1]);
      for (const match of source.matchAll(/new URL\(["']([^"']+)["'],\s*import\.meta\.url\)/g)) refs.push(match[1]);
      // The renderer loads the two surface maps through a file-name table.
      // Follow that table using the actual new URL template, rather than only
      // checking that similarly named files happen to exist in public/.
      const template = source.match(/new URL\(`([^`]*)\$\{file\}([^`]*)`,\s*import\.meta\.url\)/);
      if (template) {
        const files = [...source.matchAll(/\[["'][^"']+["'],\s*["']([^"']+\.(?:png|jpe?g|webp))["']\]/g)];
        assert.ok(files.length > 0, "The renderer surface table must resolve to local image paths");
        for (const [, file] of files) refs.push(`${template[1]}${file}${template[2]}`);
      }
    }
    for (const reference of refs) queue.push(new URL(reference, url));
  }
  for (const name of [
    "main.js", "start-campaign.js", "game.js", "content.js", "talents.js", "ui.js", "audio.js", "renderer.js", "vendor/three.module.min.js",
    "style.css", "assets/fonts.css", "assets/icon.svg", "assets/title-art.png", "assets/skill-icons.png",
    "assets/stone-floor.png", "assets/aged-bronze.png",
    ...Array.from({ length: 7 }, (_, index) => `assets/font-${index}.ttf`),
  ]) assert.ok(visited.has(`/game/claw/${name}`), `${name} must be reachable from the game entry`);
  for (const license of ["vendor/THREE-LICENSE.txt", "assets/cormorantgaramond-OFL.txt", "assets/dmsans-OFL.txt"]) {
    await readPublic(new URL(license, base));
  }
});
