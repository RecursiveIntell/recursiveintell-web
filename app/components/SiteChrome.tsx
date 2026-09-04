import { StudioHeader, StudioFooter } from "./StudioChrome";
export const Header = StudioHeader;
export const Footer = StudioFooter;

export function PageIntro({
  index,
  eyebrow,
  title,
  accent,
  body,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="page-intro-orbit">
        <i />
        <i />
        <i />
      </div>
      <div className="shell page-intro-grid">
        <div>
          <p className="eyebrow">
            <span>{index}</span>
            {eyebrow}
          </p>
          <h1>
            {title}
            <br />
            <em>{accent}</em>
          </h1>
        </div>
        <div className="page-intro-copy">
          <p>{body}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

export function StatusBadge({
  children,
  tone = "released",
}: {
  children: React.ReactNode;
  tone?: "released" | "development" | "observed" | "proposed";
}) {
  return (
    <span className={`status-badge status-${tone}`}>
      <i />
      {children}
    </span>
  );
}
