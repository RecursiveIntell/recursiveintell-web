"use client";

import { useMemo, useState } from "react";
import { categories, projects, recentAudit, stack } from "@/data/portfolio";
import { RokoCategory, RokoHero, RokoPeek } from "@/components/Roko";

type CategoryFilter = "all" | (typeof categories)[number]["id"];
type ViewMode = "list" | "grid";

export default function Home() {
  const [activeCat, setActiveCat] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    categories.forEach((cat) => {
      counts[cat.id] = projects.filter((project) => project.cat === cat.id).length;
    });
    return counts;
  }, []);

  const visibleCats = activeCat === "all" ? categories : categories.filter((cat) => cat.id === activeCat);

  return (
    <div className="wrap">
      <section className="hero" aria-labelledby="home-hero-title">
        <div className="hero-text">
          <div className="eyebrow">
            <span className="num">01</span>
            <span className="bar" />
            <span>portfolio · v2026.05 · 12 ronin</span>
          </div>
          <h1 className="display" id="home-hero-title">
            Quiet machines.
            <br />
            <span className="it">Loud results.</span>
            <br />
            Always shipping. <span className="stamp">v2026.05</span>
          </h1>
          <p className="lede">
            <b>Josh Stevenson</b> - independent systems engineer. Twelve serious projects across multi-agent orchestration, security tooling, and local-first AI. Daemons that run for months. GUIs people use every day. The boring scaffolding nobody else wants to write.
          </p>
          <div className="hero-cta">
            <a className="btn-primary" href="#work">
              enter the dojo <span>↯</span>
            </a>
            <a className="btn-ghost" href="mailto:josh@recursiveintell.com">
              josh@recursiveintell.com
            </a>
          </div>
          <div className="stamps" aria-label="Availability and focus areas">
            <span className="s hot">★ for hire</span>
            <span className="s">part-time + contract</span>
            <span className="s">utc-8</span>
            <span className="s">rust · python · ts</span>
            <span className="s">linux first</span>
          </div>
        </div>

        <div className="hero-mascot" aria-hidden="true">
          <div className="mascot-bg" />
          <span className="float-tag t1">shipped 12 · ↯</span>
          <span className="float-tag t2">no abandoned</span>
          <span className="float-tag t3">222d uptime</span>
          <span className="float-tag t4">★ open for hire</span>
          <div className="mascot-circle">
            <div className="mascot-ring">
              <svg viewBox="0 0 400 400">
                <defs>
                  <path id="ringpath" d="M 200,200 m -180,0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0" />
                </defs>
                <text>
                  <textPath href="#ringpath" startOffset="0%">
                    recursiveintell · the dojo · ✦ · shipping in shadows · agents · security · local AI · ✺ · ronin since 2024 ·
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="mascot-roko">
              <RokoHero width={300} />
            </div>
          </div>
        </div>
      </section>

      <div className="marks-strip">
        <span><strong>12</strong>shipped</span>
        <span className="sep">✦</span>
        <span><strong>4</strong>schools</span>
        <span className="sep">✦</span>
        <span><strong>3</strong>primary weapons</span>
        <span className="sep">✦</span>
        <span><strong>4</strong>in flight</span>
        <span className="sep">✦</span>
        <span><strong>0</strong>abandoned</span>
      </div>

      <div className="section-head" id="now">
        <h2><span className="num">02 · NOW</span>What&apos;s on the <span className="ink-it">bench</span></h2>
        <div className="rail" />
        <div className="aside">updated may 10</div>
        <div className="peek"><RokoPeek width={88} /></div>
      </div>
      <div className="now-grid">
        <div className="now-cell">
          <h3>this week</h3>
          <div className="big">Ship <span className="it">Palisade</span> v0.4</div>
          <div className="sub">Two-PID split for the firewall daemon is landed. Writing migration notes and a screencast.</div>
        </div>
        <div className="now-cell">
          <h3>up next</h3>
          <ul>
            <li><span className="label">Gloss · multi-corpus search</span><span className="when">~2w</span></li>
            <li><span className="label">VisionForge · stage 6</span><span className="when">~3w</span></li>
            <li><span className="label">Director · queue UI</span><span className="when">drafting</span></li>
            <li><span className="label">Sortarr · anime calendar</span><span className="when">sketched</span></li>
          </ul>
        </div>
        <div className="now-cell">
          <h3>recently shipped</h3>
          <ul>
            {recentAudit.map((item) => (
              <li key={item.label}>
                <span className="label">{item.label}</span>
                <span className="when"><span className={`cat ${item.cat}`}>{item.cat}</span>{item.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-head" id="work">
        <h2><span className="num">03 · WORK</span>Selected <span className="ink-it">projects</span></h2>
        <div className="rail" />
        <div className="aside">{projects.length} curated · 19 cut</div>
        <div className="peek peek-work"><RokoPeek width={80} flip /></div>
      </div>

      <div className="filter-bar">
        <div className="filter-chips">
          <button className={`chip ${activeCat === "all" ? "on" : ""}`} onClick={() => setActiveCat("all")} type="button">
            all<span className="n">{catCounts.all}</span>
          </button>
          {categories.map((cat) => (
            <button key={cat.id} className={`chip ${activeCat === cat.id ? "on" : ""}`} onClick={() => setActiveCat(cat.id)} type="button">
              <span>{cat.glyph}</span>{cat.name.split(" & ")[0].toLowerCase()}<span className="n">{catCounts[cat.id]}</span>
            </button>
          ))}
        </div>
        <div className="view-toggle" aria-label="Project view">
          <button className={viewMode === "list" ? "on" : ""} onClick={() => setViewMode("list")} type="button">scroll</button>
          <button className={viewMode === "grid" ? "on" : ""} onClick={() => setViewMode("grid")} type="button">grid</button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid-mode" : ""}>
        {visibleCats.map((cat, catIndex) => {
          const items = projects.filter((project) => project.cat === cat.id);
          return (
            <div className="cat-band" key={cat.id}>
              <div className="label">
                <div className="roko"><RokoCategory pose={cat.pose} width={120} /></div>
                <div>
                  <div className="name">{cat.name}</div>
                  <div className="meta">
                    <span>{String(catIndex + 1).padStart(2, "0")}</span>·
                    <span>{items.length} projects</span>·
                    <span className="tag">#{cat.tag}</span>
                  </div>
                </div>
                <div className="desc">{cat.desc}</div>
              </div>
              <div className="items">
                {items.map((project, index) => (
                  <a className="pj" href={`/projects/${project.slug}`} key={project.id}>
                    <span className="idx">{String(index + 1).padStart(2, "0")}</span>
                    <div className="body">
                      <h4>
                        {project.featured && <span className="star">✦</span>}
                        {project.name}
                        <span className={`status ${project.status}`}>{project.status}</span>
                      </h4>
                      <p>{project.blurb}</p>
                    </div>
                    <div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                    <div className="when">{project.date}<span className="arrow">→</span></div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <section className="stack-section" id="stack">
        <div className="section-head stack-head">
          <h2><span className="num">04 · STACK</span>The <span className="ink-it">kit</span>, in use</h2>
          <div className="rail" />
          <div className="aside">count = projects shipping it</div>
        </div>
        <div className="stack-viz">
          {stack.map((item) => (
            <div className="stack-cell" key={item.name}>
              <div>
                <div className="n">{item.n}</div>
                <div className="lbl">{item.name}</div>
              </div>
              <div className="ctx">{item.ctx}</div>
              <div className="bar" style={{ width: `${(item.n / 8) * 100}%` }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
