import crateData from "../data/published-crates.json";

export const dynamic = "force-static";

function xml(value: string | number | boolean) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = [...crateData.crates]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 30)
    .map((item) => `
    <item>
      <title>${xml(`${item.name} v${item.version}`)}</title>
      <link>${xml(item.crates_io_url)}</link>
      <guid isPermaLink="false">${xml(`recursiveintell:crate:${item.name}:${item.version}:${item.updated_at}`)}</guid>
      <pubDate>${new Date(item.updated_at).toUTCString()}</pubDate>
      <category>crates.io release record</category>
      <description>${xml(`${item.description || "No public crate description."} Registry record updated ${item.updated_at}. This item comes from a point-in-time RecursiveIntell owner snapshot observed ${crateData.observed_at}; it is not a live status or editorial compatibility claim.`)}</description>
    </item>`)
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RecursiveIntell Public Release Signal</title>
    <link>https://recursiveintell.com/changelog</link>
    <atom:link href="https://recursiveintell.com/feed.xml" rel="self" type="application/rss+xml" />
    <description>Public crate updates from the audited RecursiveIntell crates.io owner snapshot. Snapshot timestamps are kept distinct from live state.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(crateData.observed_at).toUTCString()}</lastBuildDate>
    <generator>RecursiveIntell snapshot feed</generator>
    <ttl>60</ttl>${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

