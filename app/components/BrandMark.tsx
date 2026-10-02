import brand from "../config/brand.json";

export function BrandMark() {
  return (
    <svg
      className="brand-mark"
      viewBox={brand.viewBox}
      fill="none"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {brand.frame.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="brand-core">
        {brand.core.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
