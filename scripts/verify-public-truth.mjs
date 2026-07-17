import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const catalog = JSON.parse(await readFile(join(root, "app/data/library-catalog.json"), "utf8"));
const crates = JSON.parse(await readFile(join(root, "app/data/published-crates.json"), "utf8"));
const semantic = catalog.catalog.find((item) => item.package_name === "semantic-memory");
const published = crates.crates.find((item) => item.name === "semantic-memory");
const documentedExampleVersion = "0.5.10";
const documentedPinFiles = new Set(["app/install/InstallCockpit.tsx", "app/install/data.ts"]);

if (!semantic || !published) throw new Error("semantic-memory must exist in both public inventories");

const textFiles = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(?:ts|tsx|md)$/.test(entry.name)) textFiles.push(path);
  }
}
await walk(join(root, "app"));
textFiles.push(join(root, "README.md"));

const mismatches = [];
for (const path of textFiles) {
  const source = await readFile(path, "utf8");
  for (const match of source.matchAll(/semantic-memory(?:\s|&middot;|·|@|\/|\\|:|-){0,12}v?(\d+\.\d+\.\d+)/gi)) {
    const localPath = relative(root, path);
    const disclosedDocumentedPin = documentedPinFiles.has(localPath) && match[1] === documentedExampleVersion;
    if (match[1] !== published.version && !disclosedDocumentedPin) mismatches.push(`${localPath}: ${match[0]}`);
  }
}

if (mismatches.length) {
  throw new Error(`public semantic-memory version drift detected:\n${mismatches.join("\n")}`);
}

const installData = await readFile(join(root, "app/install/data.ts"), "utf8");
const installCockpit = await readFile(join(root, "app/install/InstallCockpit.tsx"), "utf8");
if (!installData.includes(`Version ${documentedExampleVersion} is the version documented`) ||
    !installData.includes(`registry snapshot also observes ${published.version}`) ||
    !installCockpit.includes(`Documented example: semantic-memory ${documentedExampleVersion} · registry snapshot: ${published.version}`)) {
  throw new Error("documented Rust example pin must remain explicitly distinguished from the current registry snapshot");
}

const ids = new Set();
for (const item of catalog.catalog) {
  if (ids.has(item.id)) throw new Error(`duplicate catalog id: ${item.id}`);
  ids.add(item.id);
}
if (catalog.catalog.length !== catalog.counts.total_catalog_entries) {
  throw new Error(`catalog count drift: records=${catalog.catalog.length} declared=${catalog.counts.total_catalog_entries}`);
}

console.log(`Public truth verified: ${catalog.catalog.length} unique packages; semantic-memory registry ${published.version}; documented example ${documentedExampleVersion}; audited workspace ${semantic.version}.`);
