import { ImageResponse } from "next/og";

export const runtime = "edge";

const palette: Record<string, string> = {
  cyan: "#38c8ff",
  amber: "#f0a23b",
  violet: "#a78bfa",
  pink: "#e657a7",
  green: "#8fdd83",
};

function clean(value: string | null, fallback: string, limit: number) {
  return (value || fallback).replace(/[<>]/g, "").slice(0, limit);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get("title"), "Agent memory that can show its work.", 96);
  const kicker = clean(searchParams.get("kicker"), "RECURSIVEINTELL / WITNESS PLANE", 58);
  const detail = clean(searchParams.get("detail"), "Local-first · temporal · inspectable", 86);
  const accent = palette[searchParams.get("accent") || "cyan"] || palette.cyan;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#020b14", color: "#f4eee5", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", opacity: .28, backgroundImage: "linear-gradient(rgba(113,163,188,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(113,163,188,.25) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div style={{ position: "absolute", width: 520, height: 520, right: -80, top: -130, display: "flex", border: `1px solid ${accent}`, borderRadius: 999, opacity: .42 }} />
      <div style={{ position: "absolute", width: 340, height: 340, right: 10, top: -40, display: "flex", border: "1px solid #315065", borderRadius: 999 }} />
      <div style={{ position: "absolute", right: 150, top: 100, width: 54, height: 54, display: "flex", background: accent, transform: "rotate(45deg)" }} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 76px" }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 24, letterSpacing: 5, color: accent, fontWeight: 700 }}>{kicker}</div>
        <div style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: title.length > 62 ? 66 : 78, lineHeight: .98, letterSpacing: -4, fontWeight: 750 }}>{title}</div>
          <div style={{ width: 190, height: 5, display: "flex", background: accent }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "#a7b0b2", fontSize: 24 }}>
          <span>{detail}</span>
          <span style={{ color: "#f4eee5", fontWeight: 700 }}>recursiveintell.com</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    },
  );
}
