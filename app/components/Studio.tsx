import Link from "next/link";
import { careerWorkCases } from "../data/work";

export function StudioIntro({
  label,
  title,
  accent,
  body,
}: {
  label: string;
  title: string;
  accent: string;
  body: string;
}) {
  return (
    <section className="studio-intro studio-shell">
      <p className="studio-eyebrow">{label}</p>
      <div>
        <h1>
          {title}
          <br />
          <em>{accent}</em>
        </h1>
        <p>{body}</p>
      </div>
    </section>
  );
}

export function SystemGraphic({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`system-art ${compact ? "is-compact" : ""}`}
      aria-hidden="true"
    >
      <div className="art-coordinates">
        <span>RECURSIVE / 01</span>
        <span>SYSTEM STUDY</span>
      </div>
      <svg viewBox="0 0 560 510" fill="none">
        <defs>
          <linearGradient
            id={compact ? "ring-small" : "ring-large"}
            x1="80"
            y1="90"
            x2="480"
            y2="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e4edaa" />
            <stop offset=".48" stopColor="#778565" />
            <stop offset="1" stopColor="#283d32" />
          </linearGradient>
        </defs>
        <g stroke="#566250" strokeWidth=".65">
          <path d="M40 255H520M280 20V490" />
          <circle cx="280" cy="255" r="202" />
          <circle cx="280" cy="255" r="148" />
        </g>
        <g
          stroke={`url(#${compact ? "ring-small" : "ring-large"})`}
          strokeWidth="22"
        >
          <ellipse
            cx="280"
            cy="255"
            rx="172"
            ry="95"
            transform="rotate(-35 280 255)"
          />
          <ellipse
            cx="280"
            cy="255"
            rx="172"
            ry="95"
            transform="rotate(85 280 255)"
          />
          <ellipse
            cx="280"
            cy="255"
            rx="172"
            ry="95"
            transform="rotate(25 280 255)"
          />
        </g>
        <circle cx="280" cy="255" r="36" fill="#d9e6a1" />
        <path d="M270 255h20m-10-10v20" stroke="#213329" strokeWidth="2" />
        <circle cx="80" cy="255" r="4" fill="#ec9066" />
        <circle cx="480" cy="255" r="4" fill="#ec9066" />
      </svg>
      <div className="art-caption">
        <span>AGENTS</span>
        <span>MEMORY</span>
        <span>INFRASTRUCTURE</span>
      </div>
    </div>
  );
}

export function SelectedProjects({ all = false }: { all?: boolean }) {
  const cases = all ? careerWorkCases : careerWorkCases.slice(0, 3);
  return (
    <div className="studio-project-list">
      {cases.map((item, index) => (
        <article className="studio-project" key={item.number}>
          <div className="studio-project-number">
            0{index + 1}
            <span>/{all ? "05" : "03"}</span>
          </div>
          <div>
            <span className="studio-project-status">{item.maturity}</span>
            <h3>{item.title}</h3>
            <p>{item.problem}</p>
            <div className="studio-project-evidence">
              <strong>THE WORK</strong>
              <p>{item.built}</p>
            </div>
            <details>
              <summary>
                Evidence & current scope <span>+</span>
              </summary>
              <p>{item.evidence}</p>
              <p>{item.boundary}</p>
            </details>
          </div>
          <a
            className="studio-project-link"
            href={item.source}
            target={item.source.startsWith("http") ? "_blank" : undefined}
            rel={item.source.startsWith("http") ? "noreferrer" : undefined}
          >
            {item.sourceLabel}
            <span>↗</span>
          </a>
        </article>
      ))}
    </div>
  );
}

export function StudioCTA() {
  return (
    <section className="studio-cta studio-shell">
      <span className="studio-eyebrow">THE NEXT CONVERSATION</span>
      <div>
        <h2>
          Good systems start
          <br />
          with a <em>clear question.</em>
        </h2>
        <div>
          <p>
            Hiring for agent infrastructure? Working through a difficult system?
            Tell me what you’re trying to make work.
          </p>
          <Link className="studio-button primary" href="/contact">
            Start a conversation <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
