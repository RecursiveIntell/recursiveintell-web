import type { ReactNode } from "react";
import styles from "./observatory.module.css";

export function ObservatoryHero({
  eyebrow,
  title,
  accent,
  lede,
  actions,
  panelLabel,
  panelState = "Public evidence",
  panelTitle,
  panelCopy,
  panelFoot = "RecursiveIntell / technical observatory",
}: {
  eyebrow: string;
  title: string;
  accent: string;
  lede: string;
  actions?: ReactNode;
  panelLabel: string;
  panelState?: string;
  panelTitle: ReactNode;
  panelCopy: ReactNode;
  panelFoot?: string;
}) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.wrap} ${styles.heroGrid}`}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.heroTitle}>{title} <span className={styles.accent}>{accent}</span></h1>
          <p className={styles.lede}>{lede}</p>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
        <aside className={styles.heroPanel}>
          <div className={styles.panelTop}><span>{panelLabel}</span><span>{panelState}</span></div>
          <h2 className={styles.panelTitle}>{panelTitle}</h2>
          <div className={styles.panelCopy}>{panelCopy}</div>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.panelFoot}><span>{panelFoot}</span><span>RI / 26</span></div>
        </aside>
      </div>
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  copy,
}: {
  label: string;
  title: ReactNode;
  copy: ReactNode;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div><span className={styles.overline}>{label}</span><h2>{title}</h2></div>
      <p>{copy}</p>
    </div>
  );
}

