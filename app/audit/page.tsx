import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { AuditTimeline } from "@/components/audit/AuditTimeline";
import { AuditSummaryBar } from "@/components/audit/AuditSummaryBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Log",
  description:
    "A transparent changelog of site updates, project milestones, and system changes across RecursiveIntell.",
};

export default function AuditPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Changelog"
        title="Audit Log"
        description="A transparent record of what shipped, changed, and evolved across this site and its systems."
      />
      <Container className="py-12">
        <AuditSummaryBar />
        <AuditTimeline />
      </Container>
    </div>
  );
}
