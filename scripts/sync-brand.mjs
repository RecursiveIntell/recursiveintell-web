import { readFile, writeFile } from "node:fs/promises";

// The same geometry powers the inline mark, downloadable SVGs, favicon, and OG.
const root = new URL("../", import.meta.url);
const brand = JSON.parse(
  await readFile(new URL("app/config/brand.json", root), "utf8"),
);
const paths = (items, color) =>
  `<g fill="${color}">${items.map((d) => `<path d="${d}"/>`).join("")}</g>`;
const geometry = (frame) =>
  paths(brand.frame, frame) + paths(brand.core, brand.colors.purple);
for (const [name, frame] of [
  ["recursiveintell-mark", brand.colors.ink],
  ["recursiveintell-mark-light", brand.colors.paper],
]) {
  await writeFile(
    new URL(`public/brand/${name}.svg`, root),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${brand.viewBox}" role="img" aria-label="RecursiveIntell"><title>RecursiveIntell / Recursive Cube</title>${geometry(frame)}</svg>\n`,
  );
}
await writeFile(
  new URL("public/favicon.svg", root),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="18" fill="${brand.colors.dark}"/><g transform="translate(8 4)">${geometry(brand.colors.paper)}</g></svg>\n`,
);
