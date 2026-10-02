import { ImageResponse } from "next/og";
import brand from "./config/brand.json";
export const alt = "RecursiveIntell | Independent AI Systems Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#15121c",
        color: "#f6f5f2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg viewBox={brand.viewBox} width="48" height="53">
            {brand.frame.map((d) => (
              <path key={d} d={d} fill={brand.colors.paper} />
            ))}
            {brand.core.map((d) => (
              <path key={d} d={d} fill={brand.colors.purple} />
            ))}
          </svg>
          <span>RecursiveIntell</span>
        </div>
        <span style={{ color: "#ddcefa", fontSize: 18 }}>
          JOSH STEVENSON / SYSTEMS ENGINEER
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 78,
          lineHeight: 1.04,
          letterSpacing: "-4px",
        }}
      >
        <span>AI systems.</span>
        <span style={{ color: "#ddcefa" }}>Built to be understood.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 20,
          color: "#c8bdd3",
          letterSpacing: "3px",
          justifyContent: "space-between",
        }}
      >
        <span>AGENTS / MEMORY / INFRASTRUCTURE</span>
        <span style={{ letterSpacing: "0", color: "#ddcefa", fontSize: 18 }}>
          NVIDIA PAIR contributor
        </span>
      </div>
    </div>,
    size,
  );
}
