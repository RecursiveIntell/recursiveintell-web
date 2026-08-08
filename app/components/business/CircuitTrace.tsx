export function CircuitTrace({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <svg
      className={`business-circuit-trace business-circuit-trace-${tone}`}
      viewBox="0 0 900 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M900 74H674L572 176v111l-96 96v166" />
        <path d="M900 184H742L654 272v92l-72 72v113" />
        <path d="M900 278H824l-92 92v179" />
        <path d="M900 390H814l-38 38v121" />
      </g>
      <g className="business-circuit-nodes">
        <circle cx="572" cy="176" r="7" />
        <circle cx="572" cy="287" r="7" />
        <circle cx="654" cy="272" r="7" />
        <circle cx="654" cy="364" r="7" />
        <circle cx="732" cy="370" r="7" />
        <circle cx="776" cy="428" r="7" />
      </g>
    </svg>
  );
}

