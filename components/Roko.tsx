import type { CSSProperties, ReactNode } from "react";

const colors = {
  hood: "var(--ninja-hood, #1a0a23)",
  skin: "var(--ninja-skin, #fde6d3)",
  band: "var(--ninja-band, #0d0512)",
  eyeW: "#ffffff",
  eyeB: "#0d0512",
  blush: "var(--ninja-blush, #ef7bb5)",
  body: "var(--ninja-body, #2a1130)",
  beltMain: "var(--hot, #e84aa1)",
  steel: "var(--ninja-steel, #c8c0d6)",
  scroll: "var(--ninja-scroll, #f5d6a3)",
  scrollBand: "var(--ninja-scrollBand, #8a3a5e)",
  shuriken: "var(--hot, #e84aa1)",
};

type EyeMode = "open" | "closed" | "wink" | "focus";

function NinjaHead({
  eyes = "open",
  tilt = 0,
  blush = true,
  hoodTail = "right",
}: {
  eyes?: EyeMode;
  tilt?: number;
  blush?: boolean;
  hoodTail?: "left" | "right";
}) {
  const eyeY = 56;
  const renderEyes = () => {
    if (eyes === "closed") {
      return (
        <g stroke={colors.eyeW} strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d={`M 36 ${eyeY} q 4 -3 8 0`} />
          <path d={`M 56 ${eyeY} q 4 -3 8 0`} />
        </g>
      );
    }
    if (eyes === "wink") {
      return (
        <g>
          <circle cx="40" cy={eyeY} r="3.4" fill={colors.eyeW} />
          <circle cx="41" cy={eyeY + 0.5} r="1.8" fill={colors.eyeB} />
          <path d={`M 56 ${eyeY} q 4 -3 8 0`} stroke={colors.eyeW} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      );
    }
    if (eyes === "focus") {
      return (
        <g fill={colors.eyeW}>
          <rect x="36.5" y={eyeY - 2} width="7" height="3.4" rx="1.6" />
          <rect x="56.5" y={eyeY - 2} width="7" height="3.4" rx="1.6" />
        </g>
      );
    }
    return (
      <g>
        <circle cx="40" cy={eyeY} r="3.6" fill={colors.eyeW} />
        <circle cx="60" cy={eyeY} r="3.6" fill={colors.eyeW} />
        <circle cx="41" cy={eyeY + 0.6} r="1.9" fill={colors.eyeB} />
        <circle cx="61" cy={eyeY + 0.6} r="1.9" fill={colors.eyeB} />
        <circle cx="42" cy={eyeY - 1} r="0.8" fill={colors.eyeW} />
        <circle cx="62" cy={eyeY - 1} r="0.8" fill={colors.eyeW} />
      </g>
    );
  };

  return (
    <g transform={`rotate(${tilt} 50 55)`}>
      {hoodTail === "right" && <path d="M 65 16 Q 82 8 86 22 Q 86 34 72 30 Z" fill={colors.hood} />}
      {hoodTail === "left" && <path d="M 35 16 Q 18 8 14 22 Q 14 34 28 30 Z" fill={colors.hood} />}
      <path d="M 18 52 Q 18 14 50 14 Q 82 14 82 52 L 82 80 Q 82 90 72 90 L 28 90 Q 18 90 18 80 Z" fill={colors.hood} />
      <ellipse cx="50" cy="58" rx="22" ry="20" fill={colors.skin} />
      <rect x="22" y="49" width="56" height="14" fill={colors.band} />
      <path d="M 22 51 L 8 56 L 12 62 L 22 60 Z" fill={colors.band} />
      {renderEyes()}
      {blush && eyes !== "focus" && (
        <g opacity="0.55">
          <ellipse cx="34" cy="71" rx="3.2" ry="1.8" fill={colors.blush} />
          <ellipse cx="66" cy="71" rx="3.2" ry="1.8" fill={colors.blush} />
        </g>
      )}
      {eyes !== "focus" && <path d="M 47 75 q 3 2 6 0" stroke={colors.band} strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      <path d="M 26 60 Q 50 50 74 60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
    </g>
  );
}

function Shuriken({
  x = 0,
  y = 0,
  r = 10,
  color,
  rotate = 0,
  spin = true,
}: {
  x?: number;
  y?: number;
  r?: number;
  color?: string;
  rotate?: number;
  spin?: boolean;
}) {
  const style: CSSProperties | undefined = spin
    ? { transformOrigin: "0px 0px", animation: "rokoSpin 1.4s linear infinite" }
    : undefined;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g style={style}>
        <path d={`M 0 ${-r} L ${r * 0.32} ${-r * 0.32} L ${r} 0 L ${r * 0.32} ${r * 0.32} L 0 ${r} L ${-r * 0.32} ${r * 0.32} L ${-r} 0 L ${-r * 0.32} ${-r * 0.32} Z`} fill={color || colors.shuriken} />
        <circle cx="0" cy="0" r={r * 0.18} fill={colors.band} />
      </g>
    </g>
  );
}

export function RokoLogo({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }} aria-hidden="true">
      <NinjaHead />
    </svg>
  );
}

export function RokoHero({ width = 320 }: { width?: number }) {
  return (
    <svg viewBox="0 0 240 280" width={width} height={(width * 280) / 240} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <Shuriken x={200} y={60} r={14} rotate={20} />
      <Shuriken x={220} y={110} r={9} rotate={40} color="var(--sakura, #ef7bb5)" />
      <Shuriken x={195} y={155} r={6} rotate={60} color="var(--hot-2, #9d5cf0)" />
      <g stroke="var(--sakura, #ef7bb5)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M 180 80 L 195 70" />
        <path d="M 178 110 L 198 105" />
        <path d="M 175 140 L 192 142" />
      </g>
      <path d="M 95 215 Q 78 240 92 268 L 110 268 Q 116 240 110 215 Z" fill={colors.body} />
      <ellipse cx="100" cy="270" rx="14" ry="5" fill={colors.band} />
      <path d="M 120 215 Q 145 222 160 200 L 150 188 Q 130 198 118 210 Z" fill={colors.body} />
      <ellipse cx="160" cy="200" rx="11" ry="5" fill={colors.band} transform="rotate(-25 160 200)" />
      <path d="M 80 150 Q 70 215 110 220 Q 150 218 145 150 Z" fill={colors.body} />
      <rect x="78" y="175" width="70" height="9" fill={colors.beltMain} />
      <rect x="78" y="184" width="70" height="2" fill={colors.band} opacity="0.4" />
      <rect x="78" y="172" width="10" height="15" rx="2" fill={colors.beltMain} />
      <rect x="74" y="180" width="6" height="14" rx="2" fill={colors.beltMain} transform="rotate(-15 77 187)" />
      <path d="M 80 158 Q 60 172 58 195 L 70 200 Q 78 180 92 168 Z" fill={colors.body} />
      <circle cx="62" cy="198" r="6" fill={colors.skin} />
      <path d="M 145 158 Q 170 150 188 138 L 184 124 Q 158 132 142 148 Z" fill={colors.body} />
      <circle cx="186" cy="130" r="7" fill={colors.skin} />
      <Shuriken x={190} y={125} r={11} rotate={15} spin={false} />
      <g transform="translate(60 50)">
        <svg viewBox="0 0 100 100" width="100" height="100" style={{ overflow: "visible" }}>
          <NinjaHead eyes="focus" tilt={-4} />
        </svg>
      </g>
      <path d="M 142 60 Q 168 50 175 70 Q 180 90 158 88 Z" fill={colors.hood} />
      <path d="M 158 88 Q 178 95 174 110" stroke={colors.hood} strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function RokoPeek({ width = 120, flip = false }: { width?: number; flip?: boolean }) {
  const transform = flip ? "scale(-1 1) translate(-100 0)" : "";
  return (
    <svg viewBox="0 0 100 100" width={width} height={width} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <g transform={transform}>
        <NinjaHead tilt={flip ? 8 : -8} hoodTail={flip ? "left" : "right"} />
        <path d="M 12 90 Q 10 80 22 78 L 30 78 L 32 92 Q 26 96 16 94 Z" fill={colors.body} />
        <circle cx="22" cy="86" r="5" fill={colors.skin} />
      </g>
    </svg>
  );
}

export function RokoCategory({ pose, width = 140 }: { pose: string; width?: number }) {
  const props: Record<string, ReactNode> = {
    shuriken: <Shuriken x={78} y={92} r={12} rotate={20} />,
    sword: (
      <g transform="translate(78 92) rotate(-30)">
        <rect x="-2" y="-32" width="4" height="34" fill={colors.steel} />
        <rect x="-3" y="0" width="6" height="3" fill="var(--hot, #e84aa1)" />
        <rect x="-3" y="3" width="6" height="10" fill={colors.hood} />
      </g>
    ),
    scroll: (
      <g transform="translate(74 90)">
        <rect x="-12" y="-4" width="28" height="14" rx="3" fill={colors.scroll} />
        <rect x="-15" y="-6" width="6" height="18" rx="2" fill={colors.scrollBand} />
        <rect x="13" y="-6" width="6" height="18" rx="2" fill={colors.scrollBand} />
        <line x1="-6" y1="0" x2="10" y2="0" stroke={colors.scrollBand} strokeWidth="1.2" />
        <line x1="-6" y1="4" x2="6" y2="4" stroke={colors.scrollBand} strokeWidth="1.2" />
      </g>
    ),
    brush: (
      <g transform="translate(76 92) rotate(-15)">
        <rect x="-2" y="-22" width="4" height="24" fill="#3a2418" />
        <path d="M -5 2 L 5 2 L 4 14 Q 0 18 -4 14 Z" fill="var(--hot-2, #9d5cf0)" />
        <circle cx="0" cy="16" r="2.5" fill="var(--hot, #e84aa1)" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 110" width={width} height={(width * 110) / 100} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <NinjaHead tilt={-2} />
      <path d="M 64 86 Q 76 86 82 92 L 78 100 Q 68 96 60 92 Z" fill={colors.body} />
      <circle cx="78" cy="92" r="5" fill={colors.skin} />
      {props[pose]}
    </svg>
  );
}

export function RokoSleep({ width = 160 }: { width?: number }) {
  return (
    <svg viewBox="0 0 220 110" width={width} height={(width * 110) / 220} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <g fill="var(--sakura, #ef7bb5)" fontFamily="var(--mono)" fontWeight="700">
        <text x="155" y="22" fontSize="14" opacity="0.4">z</text>
        <text x="170" y="36" fontSize="20" opacity="0.7">Z</text>
        <text x="195" y="58" fontSize="28">Z</text>
      </g>
      <ellipse cx="110" cy="92" rx="80" ry="14" fill={colors.band} opacity="0.25" />
      <path d="M 60 70 Q 50 95 70 100 L 150 100 Q 170 95 160 70 Z" fill={colors.body} />
      <rect x="80" y="80" width="60" height="8" fill={colors.beltMain} />
      <g transform="translate(20 22) scale(0.8)">
        <NinjaHead eyes="closed" hoodTail="left" tilt={-90} />
      </g>
    </svg>
  );
}
