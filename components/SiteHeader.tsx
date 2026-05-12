import Link from "next/link";
import { RokoLogo } from "@/components/Roko";

const navItems = [
  { label: "work", href: "/projects" },
  { label: "lab", href: "/lab" },
  { label: "writing", href: "/writing" },
  { label: "vault", href: "/vault" },
  { label: "gallery", href: "/gallery" },
  { label: "buildlog", href: "/buildlog" },
  { label: "now", href: "/now" },
  { label: "search", href: "/search" },
  { label: "about", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="site-mast">
      <div className="wrap">
        <div className="masthead">
          <Link className="mark" href="/">
            <div className="mark-glyph"><RokoLogo size={42} /></div>
            <div className="mark-words">
              <span className="a">recursive<i>intell</i><span className="dot" /></span>
              <span className="b">josh stevenson · the dojo</span>
            </div>
          </Link>
          <nav className="primary" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <span className="nav-piece" key={item.href}>
                <Link className={index === 0 ? "on" : ""} href={item.href}>{item.label}</Link>
                {index < navItems.length - 1 && <span className="sep">·</span>}
              </span>
            ))}
          </nav>
          <div className="mast-right">
            <span className="pulse"><span className="dot" />online · shipping daily</span>
            <a className="cta-mail" href="mailto:josh@recursiveintell.com">
              summon roko <span>↯</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
