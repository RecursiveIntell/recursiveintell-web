import Link from "next/link";
import { StudioHeader, StudioFooter } from "./components/StudioChrome";
import { StudioIntro } from "./components/Studio";

export default function NotFound() {
  return (
    <main className="studio-page">
      <StudioHeader />
      <StudioIntro
        label="404 / PAGE NOT FOUND"
        title="A different path."
        accent="The same curiosity."
        body="This page is not here. Explore the selected work or return to the studio to find what you need."
      />
      <div className="studio-shell studio-section studio-actions">
        <Link className="studio-button primary" href="/">
          Return home →
        </Link>
        <Link className="studio-text-link" href="/work">
          Explore the work ↗
        </Link>
      </div>
      <StudioFooter />
    </main>
  );
}
