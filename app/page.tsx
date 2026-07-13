"use client";

import { useMemo, useState } from "react";
import {
  categories,
  featuredCount,
  projectCount,
  projects,
  recentAudit,
  stack,
} from "@/data/portfolio";
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
  const maxStack = Math.max(...stack.map((s) => s.n), 1);

  return (
    <div className="wrap">
      <section className="hero" aria-labelledby="home-hero-title">
        <div className="hero-text">
          <div className="eyebrow">
            <span className="num">01</span>
            <span className="bar" />
            <span>
              portfolio · v2026.07 · {featuredCount} featured · {projectCount} surfaces
            </span>
          </div>
          <h1 className="display" id="home-hero-title">
            A flight recorder
            <br />
            <span className="it">for agent work.</span>
            <br />
            Local. Receipt-backed. <span className="stamp">v2026.07</span>
          </h1>
          <p className="lede">
            <b>Josh Stevenson</b> builds local-first agent infrastructure: persistent memory,
            claim/evidence provenance, governed context, and published compression research — plus
            Gloss as the knowledge desktop app and ESP32-S3 as physical proof. Best bets are featured
            below; the rest of the stack stays listed as depth.
          </p>
          <div className="hero-cta">
            <a className="btn-primary" href="#work">
              see the best work <span>↯</span>
            </a>
            <a className="btn-ghost" href="mailto:josh@recursiveintell.com">
              josh@recursiveintell.com
            </a>
          </div>
          <div className="stamps" aria-label="Availability and focus areas">
            <span className="s hot">★ for hire</span>
            <span className="s">part-time + contract</span>
            <span className="s">utc-8</span>
            <span className="s">rust · mcp · sqlite</span>
            <span className="s">linux first</span>
          </div>
        </div>

        <div className="hero-mascot" aria-hidden="true">
          <div className="mascot-bg" />
          <span className="float-tag t1">{featuredCount} featured · ↯</span>
          <span className="float-tag t2">flight recorder</span>
          <span className="float-tag t3">local-first</span>
          <span className="float-tag t4">★ open for hire</span>
          <div className="mascot-circle">
            <div className="mascot-ring">
              <svg viewBox="0 0 400 400">
                <defs>
                  <path id="ringpath" d="M 200,200 m -180,0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0" />
                </defs>
                <text>
                  <textPath href="#ringpath" startOffset="0%">
                    recursiveintell · evidence · memory · turbo-quant · gloss · esp32 · receipts ·
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
        <span>
          <strong>{featuredCount}</strong>featured
        </span>
        <span className="sep">✦</span>
        <span>
          <strong>{projectCount}</strong>listed
        </span>
        <span className="sep">✦</span>
        <span>
          <strong>4</strong>lanes
        </span>
        <span className="sep">✦</span>
        <span>
          <strong>1</strong>edge sentinel
        </span>
        <span className="sep">✦</span>
        <span>
          <strong>0</strong>cloud required
        </span>
      </div>

      <div className="section-head" id="now">
        <h2>
          <span className="num">02 · NOW</span>What&apos;s on the <span className="ink-it">bench</span>
        </h2>
        <div className="rail" />
        <div className="aside">updated jul 11</div>
        <div className="peek">
          <RokoPeek width={88} />
        </div>
      </div>
      <div className="now-grid">
        <div className="now-cell">
          <h3>this week</h3>
          <div className="big">
            Package the <span className="it">agent evidence stack</span>
          </div>
          <div className="sub">
            One installable surface strangers can evaluate in under 15 minutes: ingest → source-backed
            recall → supersession → contradiction → proof packet. Powered by agent-memory-kits,
            semantic-memory, claim-ledger, and context-governor.
          </div>
        </div>
        <div className="now-cell">
          <h3>up next</h3>
          <ul>
            <li>
              <span className="label">
                Agent Memory Kits · 15-minute public demo + install doctor
              </span>
              <span className="when">p0</span>
            </li>
            <li>
              <span className="label">TurboQuant / PolyKV · external runtime integration path</span>
              <span className="when">research</span>
            </li>
            <li>
              <span className="label">ESP32-S3 · consolidate repos into one flagship demo</span>
              <span className="when">active</span>
            </li>
            <li>
              <span className="label">Gloss · evidence stack as visible application surface</span>
              <span className="when">showcase</span>
            </li>
          </ul>
        </div>
        <div className="now-cell">
          <h3>recently shipped</h3>
          <ul>
            {recentAudit.map((item) => (
              <li key={item.label}>
                <span className="label">{item.label}</span>
                <span className="when">
                  <span className={`cat ${item.cat}`}>{item.cat}</span>
                  {item.when}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-head" id="work">
        <h2><span className="num">03 · WORK</span>Selected <span className="ink-it">projects</span></h2>
        <div className="rail" />
        <div className="aside">{projects.length} current · stale work cut</div>
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
          <div className="aside">count = current surfaces using it</div>
        </div>
        <div className="stack-viz">
          {stack.map((item) => (
            <div className="stack-cell" key={item.name}>
              <div>
                <div className="n">{item.n}</div>
                <div className="lbl">{item.name}</div>
              </div>
              <div className="ctx">{item.ctx}</div>
              <div className="bar" style={{ width: `${(item.n / maxStack) * 100}%` }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
