import { StudioHeader, StudioFooter } from "../StudioChrome";
import { CircuitTrace } from "./CircuitTrace";
export const BusinessHeader = StudioHeader;
export const BusinessFooter = StudioFooter;

export function BusinessPageIntro({
  index,
  eyebrow,
  title,
  accent,
  body,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
}) {
  return (
    <section className="business-page-intro">
      <CircuitTrace />
      <div className="business-shell business-page-intro-grid">
        <div>
          <p className="business-kicker">
            <span>{index}</span>
            {eyebrow}
          </p>
          <h1>
            {title}
            <br />
            <em>{accent}</em>
          </h1>
        </div>
        <p>{body}</p>
      </div>
    </section>
  );
}
