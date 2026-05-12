import Link from "next/link";
import { RokoLogo, RokoSleep } from "@/components/Roko";

export function SiteFooter() {
  return (
    <footer className="dojo-footer wrap">
      <div className="sleep-spot"><RokoSleep width={180} /></div>
      <div>
        <div className="mark footer-mark">
          <div className="mark-glyph"><RokoLogo size={42} /></div>
          <div className="mark-words">
            <span className="a">recursive<i>intell</i><span className="dot" /></span>
            <span className="b">josh stevenson</span>
          </div>
        </div>
        <p className="colophon">Built for daily use. Published to share the work. Roko approves.</p>
      </div>
      <div>
        <h5>work</h5>
        <ul>
          <li><Link href="/#work">projects</Link></li>
          <li><Link href="/lab">lab</Link></li>
          <li><Link href="/gallery">gallery</Link></li>
          <li><Link href="/#stack">stack</Link></li>
        </ul>
      </div>
      <div>
        <h5>read</h5>
        <ul>
          <li><Link href="/writing">writing</Link></li>
          <li><Link href="/vault">vault</Link></li>
          <li><Link href="/buildlog">buildlog</Link></li>
          <li><Link href="/audit">audit log</Link></li>
        </ul>
      </div>
      <div>
        <h5>summon</h5>
        <ul>
          <li><a href="mailto:josh@recursiveintell.com">josh@recursiveintell.com</a></li>
          <li><a href="https://github.com/RecursiveIntell">github</a></li>
          <li><Link href="/feed.xml">rss</Link></li>
          <li><Link href="/private/login">private</Link></li>
        </ul>
      </div>
      <div className="copyline">
        <span>© 2026 josh stevenson · all katas reserved</span>
        <span>v2026.05.10 · 222d uptime · roko is napping</span>
      </div>
    </footer>
  );
}
