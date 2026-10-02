import { achievements } from "../data/achievements";

export function Achievements() {
  return (
    <section
      className="studio-achievements studio-shell"
      aria-labelledby="achievements-title"
    >
      <div className="studio-section-heading">
        <div>
          <p className="studio-eyebrow">CONTRIBUTIONS & RECOGNITION</p>
          <h2 id="achievements-title">
            Work that reaches
            <br />
            <em>beyond the repository.</em>
          </h2>
        </div>
        <p>
          Accepted upstream code and public recognition from the agent
          community. Follow the original sources.
        </p>
      </div>
      <div className="achievement-grid">
        {achievements.map((item) => (
          <article className={`achievement-card ${item.id}`} key={item.id}>
            <div className="achievement-topline">
              <span className="achievement-mark">{item.mark}</span>
              {item.date ? (
                <time dateTime={item.date}>{item.dateLabel}</time>
              ) : (
                <span>{item.dateLabel}</span>
              )}
            </div>
            <p className="studio-eyebrow">{item.label}</p>
            <h3>{item.title}</h3>
            <p className="achievement-body">{item.body}</p>
            <div className="achievement-links">
              {item.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <details className="achievement-scope">
              <summary>
                About this recognition <span aria-hidden="true">+</span>
              </summary>
              <p>{item.boundary}</p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
