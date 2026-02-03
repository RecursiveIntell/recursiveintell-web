import { getAllContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recursiveintell.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [projects, lab, writing] = await Promise.all([
    getAllContent("projects"),
    getAllContent("lab"),
    getAllContent("writing"),
  ]);

  const allItems = [
    ...projects.map((p) => ({ ...p, type: "projects" as const })),
    ...lab.map((l) => ({ ...l, type: "lab" as const })),
    ...writing.map((w) => ({ ...w, type: "writing" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = allItems.slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>JSense / RecursiveIntell</title>
    <link>${siteUrl}</link>
    <description>Portfolio, lab notes, writing, and vault for JSense / RecursiveIntell. AI systems, infrastructure, and creative technology.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${siteUrl}/${item.type}/${item.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${item.type}/${item.slug}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary)}</description>
      <category>${item.type}</category>
      ${item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
