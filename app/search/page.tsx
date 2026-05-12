import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search projects, lab notes, writing, and vault resources.",
};

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Index"
        title="Search"
        description="Find projects, notes, prompts, tools, and downloads by keyword, tag, type, or status."
      />
      <Container className="py-12">
        <SearchClient />
      </Container>
    </div>
  );
}
