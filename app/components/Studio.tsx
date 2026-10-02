import Link from "next/link";
import Image from "next/image";
import { careerWorkCases, featuredWorkCases } from "../data/work";

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

export function ApertureArtwork() {
  return (
    <figure className="aperture-art" aria-hidden="true">
      <div className="aperture-grid" />
      <Image
        src="/brand/recursive-aperture-sculpture.png"
        alt=""
        fill
        sizes="(max-width: 600px) 90vw, (max-width: 1100px) 44vw, 560px"
        preload
      />
      <figcaption>
        <span>RECURSIVE APERTURE</span>
        <span>CONCEPT STUDY / 01</span>
      </figcaption>
    </figure>
  );
}

export function SystemGraphic({ compact = false }: { compact?: boolean }) {
  const id = compact ? "core-small" : "core-large";
  return (
    <div
      className={`system-art recursive-core ${compact ? "is-compact" : ""}`}
      aria-hidden="true"
    >
      <div className="art-coordinates">
        <span>RECURSIVEINTELL</span>
        <span>RECURSIVE SYSTEMS / STUDY 01</span>
      </div>
      <svg viewBox="0 0 560 520" fill="none">
        <defs>
          <linearGradient
            id={`${id}-edge`}
            x1="150"
            y1="140"
            x2="430"
            y2="410"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#efdefd" />
            <stop offset=".45" stopColor="#a981e4" />
            <stop offset="1" stopColor="#5a3a80" />
          </linearGradient>
          <linearGradient
            id={`${id}-face`}
            x1="180"
            y1="200"
            x2="390"
            y2="370"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ac79e0" stopOpacity=".28" />
            <stop offset="1" stopColor="#6c409b" stopOpacity=".05" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop stopColor="#aa71e0" stopOpacity=".32" />
            <stop offset="1" stopColor="#aa71e0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="280" cy="272" r="225" fill={`url(#${id}-glow)`} />
        <g stroke="#7d6399" strokeWidth=".7" opacity=".4">
          <path d="M44 405L280 270L516 405M44 135L280 270L516 135M280 20V500" />
          <path d="M280 69L458 172V378L280 481L102 378V172Z" />
          <path
            d="M280 94L437 185V365L280 456L123 365V185Z"
            strokeDasharray="2 6"
          />
          <ellipse cx="280" cy="275" rx="224" ry="130" />
          <path
            d="M39 274H74M486 274H522M280 32V56M280 486V505"
            stroke="#c8aedf"
          />
        </g>
        <g stroke="#85aeb9" strokeWidth="1" opacity=".8">
          <path d="M67 164H108L171 201M451 131V184L406 210M489 391H446L390 360M109 436V383L165 351" />
          <circle cx="67" cy="164" r="3" fill="#9cc7ce" />
          <circle cx="451" cy="131" r="3" fill="#9cc7ce" />
          <circle cx="489" cy="391" r="3" fill="#9cc7ce" />
          <circle cx="109" cy="436" r="3" fill="#9cc7ce" />
        </g>
        <path d="M280 147L390 210L280 274L170 210Z" fill={`url(#${id}-face)`} />
        <path
          d="M170 210L280 274V402L170 338Z"
          fill="#9060c0"
          fillOpacity=".12"
        />
        <path
          d="M280 274L390 210V338L280 402Z"
          fill="#b078e2"
          fillOpacity=".06"
        />
        <g stroke={`url(#${id}-edge)`} strokeWidth="1.7">
          <path d="M280 147L390 210V338L280 402L170 338V210Z" />
          <path d="M170 210L280 274L390 210M280 274V402" />
          {[0.76, 0.54, 0.33].map((scale) => (
            <g
              key={scale}
              transform={`translate(280 274) scale(${scale}) translate(-280 -274)`}
            >
              <path d="M280 147L390 210V338L280 402L170 338V210Z" />
              <path d="M170 210L280 274L390 210M280 274V402" />
            </g>
          ))}
        </g>
        <g stroke="#bca2d4" strokeWidth=".65" opacity=".6">
          <path d="M170 210L102 172M390 210L458 172M280 402V481M170 338L102 378M390 338L458 378M280 147V69" />
          <circle cx="280" cy="69" r="5" />
          <circle cx="102" cy="378" r="5" />
          <circle cx="458" cy="378" r="5" />
        </g>
        <g fill="#e2c891">
          <circle cx="280" cy="274" r="5" />
          <circle cx="280" cy="147" r="3" />
          <circle cx="170" cy="338" r="3" />
          <circle cx="390" cy="338" r="3" />
        </g>
      </svg>
      <div className="art-caption">
        <span>EXECUTION</span>
        <span>MEMORY</span>
        <span>PROVENANCE</span>
      </div>
    </div>
  );
}

export function SelectedProjects({ all = false }: { all?: boolean }) {
  const cases = all ? careerWorkCases : featuredWorkCases;
  const totalLabel = String(cases.length).padStart(2, "0");
  return (
    <div className={`studio-project-list${all ? "" : " is-featured"}`}>
      {cases.map((item, index) => (
        <article className="studio-project" key={item.number}>
          <div className="studio-project-number">
            {String(index + 1).padStart(2, "0")}
            <span>/{totalLabel}</span>
          </div>
          <div>
            <span className="studio-project-status">{item.maturity}</span>
            <h3>{item.title}</h3>
            <p>{all ? item.problem : item.summary}</p>
            {all && (
              <div className="studio-project-evidence">
                <strong>THE WORK</strong>
                <p>{item.built}</p>
              </div>
            )}
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
