import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";

export default function NowPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Now"
        title="Current Focus"
        description="Short-form updates on the Rust runtime, evidence, and claim-hygiene work in motion right now."
      />
      <Container className="py-12">
        <div className="prose">
          <p>
            The primary focus right now is the Rust evidence-runtime stack:
            hardening <Link href="/projects/recall"><strong>Recall</strong></Link>,
            proving <Link href="/projects/gloss"><strong>Gloss</strong></Link>{" "}
            chat runtime behavior, and connecting{" "}
            <Link href="/projects/claimledger"><strong>ClaimLedger</strong></Link>{" "}
            to Gloss as a claim/evidence compiler.
          </p>
          <h2>Active tracks</h2>
          <ul>
            <li>
              <strong>Recall</strong> - enforcing daemon-owned authority,
              runtime truth, receipts, doctor reports, and repair packet
              generation.
            </li>
            <li>
              <strong>Gloss</strong> - proving desktop chat produces visible
              tokens, visible errors, or durable attempt traces for every
              prompt.
            </li>
            <li>
              <strong>ClaimLedger</strong> - turning raw claim compilation into
              source-spanned bundles, support judgments, contradiction records,
              review queues, and testimony exports for Gloss.
            </li>
            <li>
              <strong>Libraries</strong> - keeping canonical Rust crates,
              satellite utilities, and quantization research separated by
              explicit support boundaries.
            </li>
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
