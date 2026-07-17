import process from "node:process";

const base = new URL(process.argv[2] || "http://127.0.0.1:3000");
const sitemapResponse = await fetch(new URL("/sitemap.xml", base));
if (!sitemapResponse.ok) throw new Error(`sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const route = new URL(match[1]).pathname;
  return new URL(route, base).href;
});

const failures = [];
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const index = cursor++;
    const url = urls[index];
    try {
      const response = await fetch(url, { redirect: "manual" });
      const html = await response.text();
      if (response.status !== 200) failures.push(`${new URL(url).pathname}: status ${response.status}`);
      if (!/<h1(?:\s|>)/i.test(html)) failures.push(`${new URL(url).pathname}: missing h1`);
      if (!/<link[^>]+rel="canonical"/i.test(html)) failures.push(`${new URL(url).pathname}: missing canonical`);
      if (!/<meta[^>]+property="og:image"/i.test(html)) failures.push(`${new URL(url).pathname}: missing og:image`);
    } catch (error) {
      failures.push(`${new URL(url).pathname}: ${error instanceof Error ? error.message : "request failed"}`);
    }
  }
}

await Promise.all(Array.from({ length: 12 }, () => worker()));
if (failures.length) throw new Error(`route contract failures (${failures.length}):\n${failures.join("\n")}`);
console.log(`Route contracts verified: ${urls.length} sitemap pages returned 200 with one document heading, canonical metadata, and a social image.`);
