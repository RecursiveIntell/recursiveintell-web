import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredRoutes = [
  "app/projects/page.tsx",
  "app/lab/page.tsx",
  "app/writing/page.tsx",
  "app/vault/page.tsx",
  "app/gallery/page.tsx",
  "app/buildlog/page.tsx",
  "app/now/page.tsx",
  "app/about/page.tsx",
  "app/private/login/page.tsx",
];

for (const route of requiredRoutes) {
  assert.equal(existsSync(path.join(root, route)), true, `${route} should exist`);
}

const searchIndexPath = path.join(root, "public", "data", "search-index.json");
const tagMapPath = path.join(root, "public", "data", "tag-map.json");
const galleryPath = path.join(root, "public", "data", "gallery.json");
const buildlogPath = path.join(root, "public", "data", "buildlog.json");

const searchIndex = JSON.parse(readFileSync(searchIndexPath, "utf8")) as unknown[];
const tagMap = JSON.parse(readFileSync(tagMapPath, "utf8")) as Record<string, unknown>;
const gallery = JSON.parse(readFileSync(galleryPath, "utf8")) as unknown[];
const buildlog = JSON.parse(readFileSync(buildlogPath, "utf8")) as unknown[];

assert.ok(searchIndex.length > 0, "search index should have content entries");
assert.ok(Object.keys(tagMap).length > 0, "tag map should have tags");
assert.ok(Array.isArray(gallery), "gallery manifest should be an array");
assert.ok(Array.isArray(buildlog), "buildlog should be an array");

const envExample = readFileSync(path.join(root, ".env.example"), "utf8");
assert.match(envExample, /PRIVATE_ACCESS_PASSWORD/, "env example should document private mode");
assert.match(envExample, /BLOB_READ_WRITE_TOKEN/, "env example should document gallery storage");
