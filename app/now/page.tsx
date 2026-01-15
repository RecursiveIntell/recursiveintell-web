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
            The focus this season is on tightening feedback loops: faster
            experiments, clearer metrics, and a sharper content cadence.
          </p>
          <h2>Active tracks</h2>
          <ul>
            <li>Shipping a refined project showcase with richer narratives.</li>
            <li>Documenting lab experiments for faster reuse and sharing.</li>
            <li>Building a vault of prompts and tools that scale daily work.</li>
          </ul>
          <p>
            Want more detail? Browse the <Link href="/lab">Lab</Link> or the
            latest <Link href="/writing">Writing</Link>.
          </p>
        </div>
      </Container>
    </div>
  );
}
