import { pageMetadata } from "../../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BusinessFooter,
  BusinessHeader,
  BusinessPageIntro,
} from "../../components/business/BusinessChrome";
import { contact } from "../../config/site";

const aresRuntimeMerge = "94ae3cdf937af619f2dc6e28ca3e724b9694ec9d";
const aresSetupRepair = "031e86547c24beef45436efe57dae9ce94c24b97";
const recursiveAgentMerge = "d2ae1444ae8fad98af6025123b585daf0c4b609b";

export const metadata: Metadata = pageMetadata("/work/ares-runtime-case", {
  title: "Ares + Recursive Agent Unified Runtime | Josh Stevenson",
  description:
    "A revision-bound case study of governed context materialization, managed physical admission, provider egress, receipts, and staged runtime recovery across Ares and Recursive Agent.",
  alternates: { canonical: "/work/ares-runtime-case" },
});

export default function AresRuntimeCase() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro
        index="CASE / CURRENT"
        eyebrow="PYTHON + RUST / AGENT RUNTIME / EXECUTION INTEGRITY"
        title="Keep the execution path"
        accent="bound from context to outcome."
        body="On September 6, 2026, Ares and Recursive Agent merged complementary runtime paths that keep context materialization, policy, physical admission, provider egress, and execution evidence distinct instead of collapsing them into one authority owner."
      />
      <section className="business-section">
        <div className="business-shell work-case-list">
          <article className="work-case">
            <div>
              <span>THE ARCHITECTURE</span>
              <h2>One execution path. Several explicit owners.</h2>
            </div>
            <dl>
              <div>
                <dt>Ares owns</dt>
                <dd>
                  Governed final context materialization, staged runtime release
                  construction, local runtime selection, and bounded projections
                  from policy, memory, and graph-obligation owners.
                </dd>
              </div>
              <div>
                <dt>Recursive Agent owns</dt>
                <dd>
                  Managed physical admission, cumulative budgets, queue/lane
                  accounting, cancellation fencing, native provider-egress
                  bindings, receipt chains, and typed submit/status/verify paths.
                </dd>
              </div>
              <div>
                <dt>What stays external</dt>
                <dd>
                  Policy basis, semantic-memory authority, and Agent Graph
                  obligation semantics remain owned by their declared systems.
                  Ares carries bounded evidence and references; it does not mint
                  their authority.
                </dd>
              </div>
              <div>
                <dt>Why this matters</dt>
                <dd>
                  A model call can be tied to the exact rendered request,
                  source revision, context digest, policy basis, graph obligation,
                  route class, provider identity, model, token budget, and expiry
                  without using those bindings as a substitute for authorization.
                </dd>
              </div>
            </dl>
            <div className="business-text-links">
              <a
                href="https://github.com/RecursiveIntell/Ares/pull/31"
                target="_blank"
                rel="noreferrer"
              >
                Inspect merged Ares PR #31 ↗
              </a>
              <a
                href="https://github.com/RecursiveIntell/recursive-agent/pull/5"
                target="_blank"
                rel="noreferrer"
              >
                Inspect merged Recursive Agent PR #5 ↗
              </a>
            </div>
          </article>

          <article className="work-case">
            <div>
              <span>VERIFICATION</span>
              <h2>Report the checks and the gaps separately.</h2>
            </div>
            <dl>
              <div>
                <dt>Ares PR #31</dt>
                <dd>
                  The merge reports 126 focused integration tests passing,
                  Ruff check and format passing, and shell syntax validation.
                  Full pytest collection was attempted on candidate and exact
                  baseline; both stopped on the same 30 missing optional-extra
                  collection errors, with no candidate-only collection errors.
                </dd>
              </div>
              <div>
                <dt>Recursive Agent PR #5</dt>
                <dd>
                  The merge reports passing <code>cargo check --workspace</code>,
                  <code>cargo test --workspace</code>, formatting, and Clippy
                  with warnings denied.
                </dd>
              </div>
              <div>
                <dt>Post-merge Ares repair</dt>
                <dd>
                  The first managed activation attempt exposed an editable-install
                  path bug after the staging directory moved to its final release
                  location. PR #32 repaired that boundary and reports 46 focused
                  runtime tests, 138 runtime/distribution tests, formatting and
                  lint checks, plus an isolated managed setup whose selected
                  runtime reported the repaired revision active.
                </dd>
              </div>
              <div>
                <dt>Historical evidence</dt>
                <dd>
                  The earlier Ares approvals case remains published separately.
                  It is a dated proof artifact for permit-to-outcome settlement,
                  not the current description of the whole runtime.
                </dd>
              </div>
            </dl>
            <div className="business-text-links">
              <a
                href="https://github.com/RecursiveIntell/Ares/pull/32"
                target="_blank"
                rel="noreferrer"
              >
                Inspect merged Ares PR #32 ↗
              </a>
              <Link href="/work/ares-approval-case">
                Read the historical approval case ↗
              </Link>
            </div>
          </article>

          <article className="work-case">
            <div>
              <span>REVISION BOUNDARY</span>
              <h2>Source merged is not the same as production activated.</h2>
            </div>
            <dl>
              <div>
                <dt>Ares unified-runtime merge</dt>
                <dd><code>{aresRuntimeMerge}</code></dd>
              </div>
              <div>
                <dt>Recursive Agent merge</dt>
                <dd><code>{recursiveAgentMerge}</code></dd>
              </div>
              <div>
                <dt>Ares setup repair merge</dt>
                <dd><code>{aresSetupRepair}</code></dd>
              </div>
              <div>
                <dt>Current boundary</dt>
                <dd>
                  These merges establish public source and the reported validation
                  scope. They do not establish live-provider quality, production
                  readiness, or a fully completed activation across the live Ares
                  gateway, Desktop, MCP integrations, and rollback path.
                </dd>
              </div>
              <div>
                <dt>Next proof gate</dt>
                <dd>
                  A clean managed activation should bind the exact merged source
                  into the selected runtime, read the pointer back, verify
                  gateway/Desktop/MCP coherence, exercise a governed provider path,
                  and prove rollback without silently widening authority.
                </dd>
              </div>
            </dl>
            <div className="business-text-links">
              <a
                href={`https://github.com/RecursiveIntell/Ares/commit/${aresSetupRepair}`}
                target="_blank"
                rel="noreferrer"
              >
                Inspect current Ares merge head ↗
              </a>
              <a
                href={`https://github.com/RecursiveIntell/recursive-agent/commit/${recursiveAgentMerge}`}
                target="_blank"
                rel="noreferrer"
              >
                Inspect Recursive Agent merge ↗
              </a>
            </div>
          </article>

          <div className="business-actions">
            <a
              className="business-button business-button-primary"
              href={contact.careerHref}
            >
              Discuss an engineering role →
            </a>
            <Link
              className="business-button business-button-secondary"
              href="/work"
            >
              Back to selected work
            </Link>
          </div>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}
