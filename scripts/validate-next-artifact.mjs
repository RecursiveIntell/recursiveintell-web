import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

await access(new URL("../.next/BUILD_ID", import.meta.url));
await access(new URL("../.next/server/app/index.html", import.meta.url));
await access(new URL("../.next/server/app/mnemes.html", import.meta.url));
await access(new URL("../.next/server/app/services.html", import.meta.url));

const manifest = JSON.parse(await readFile(new URL("../.next/server/app-paths-manifest.json", import.meta.url), "utf8"));
assert.equal(typeof manifest, "object");
assert.ok(manifest["/page"]);
assert.ok(manifest["/mnemes/page"]);
assert.ok(manifest["/services/page"]);

console.log("Validated canonical Next artifact: studio root, Mnemes, and services routes are present.");
