import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="JSense / RecursiveIntell"
        description="Operating principles, tooling preferences, and the systems behind the work."
      />
      <Container className="py-12">
        <div className="prose">
          <p>
            I'm a builder of AI systems and pipelines, and an avid "vibe" coder
            and architect of agentic systems, including one designed to control
            an entire computer from browser to console (Linux-first). This site
            is both a public portfolio and a daily workbench where the latest
            experiments, systems, and shipping notes live.
          </p>
          <h2>Principles</h2>
          <ul>
            <li>Ship in reliable bursts and chunks.</li>
            <li>
              Prefer thinking systems that don't need hand holding once aligned
              and trained.
            </li>
            <li>
              Keep documentation through changelogs and frequent GitHub pushes.
            </li>
          </ul>
          <h2>Tooling</h2>
          <p>
            I work with C++, Rust, Python, Java, JavaScript, and TypeScript,
            alongside specialized libraries across ML and AI.
          </p>
        </div>
      </Container>
    </div>
  );
}
