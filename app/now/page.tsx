import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

export default function NowPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Now"
        title="Current Focus"
        description="Short-form updates on what is shipping, researching, and refining right now."
      />
      <Container className="py-12">
        <div className="prose">
          <p>
            The primary focus right now is{" "}
            <Link href="/projects/palisade"><strong>Palisade</strong></Link>—a
            native Linux desktop GUI for managing nftables firewall rules
            directly, with no abstraction layers. Split-process architecture
            (Rust daemon + Tauri/React GUI), full safety pipeline, and firewalld
            compatibility shim.
          </p>
          <h2>Active tracks</h2>
          <ul>
            <li>
              <strong>Palisade</strong> — Polishing the rule editor and safety
              pipeline for v0.1.0 MVP release. Daemon fully functional, GUI
              views for rules, traffic, snapshots, and templates operational.
            </li>
            <li>
              Shipping a refined project showcase with richer narratives across
              22 active projects.
            </li>
            <li>Building a vault of prompts and tools that scale daily work.</li>
          </ul>
          <p>
            Want more detail? Browse the{" "}
            <Link href="/projects">Projects</Link>, the{" "}
            <Link href="/lab">Lab</Link>, or the latest{" "}
            <Link href="/writing">Writing</Link>.
          </p>
        </div>
      </Container>
    </div>
  );
}
