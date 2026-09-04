import { pageMetadata } from "../../lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BusinessFooter,
  BusinessHeader,
  BusinessPageIntro,
} from "../../components/business/BusinessChrome";
import { contact } from "../../config/site";

const revision = "bae48e0afa7fe2183b6acf13b851b280805d63bf";
const source = `https://github.com/RecursiveIntell/Ares/blob/${revision}`;

export const metadata: Metadata = pageMetadata("/work/ares-approval-case", {
  title: "Ares Approval Outcomes | Josh Stevenson",
  description:
    "A bounded Python agent-runtime case study: pairing consumed permissions with effect outcomes, including dispatch ambiguity and receipt failure.",
  alternates: { canonical: "/work/ares-approval-case" },
});

export default function AresApprovalCase() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro
        index="CASE / 02"
        eyebrow="PYTHON / AGENT RUNTIME / FAILURE HANDLING"
        title="Permission to act needs"
        accent="an outcome you can inspect."
        body="In Ares, my independent Hermes downstream, I connected consumed per-call permits to the resulting tool outcome. The interesting part is what the runtime reports when execution or evidence recording fails."
      />
      <section className="business-section">
        <div className="business-shell work-case-list">
          <article className="work-case">
            <div>
              <span>THE CHANGE</span>
              <h2>Keep the permit and its outcome together.</h2>
            </div>
            <dl>
              <div>
                <dt>Problem</dt>
                <dd>
                  A preflight approval says a call may proceed. It does not tell
                  the operator whether dispatch returned, raised after a
                  possible side effect, or succeeded while receipt recording
                  failed.
                </dd>
              </div>
              <div>
                <dt>Implementation</dt>
                <dd>
                  The dispatcher retains the settlement adapter returned by the
                  consume-time boundary. After dispatch, it records the
                  canonical permit reference, preflight receipt, outcome state,
                  elapsed duration, and error type through that same adapter.
                </dd>
              </div>
              <div>
                <dt>Design choice</dt>
                <dd>
                  Reusing the consume-time owner preserves the relationship
                  between authorization and outcome. Looking up a new adapter
                  afterward could separate the effect from the authority that
                  admitted it.
                </dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>
                  PR #28 was merged in RecursiveIntell/Ares. This is a
                  downstream change, not an upstream Hermes merge. The case
                  concerns this historical revision and the declared regression
                  paths.
                </dd>
              </div>
            </dl>
            <a
              href="https://github.com/RecursiveIntell/Ares/pull/28"
              target="_blank"
              rel="noreferrer"
            >
              Inspect merged Ares PR #28 ↗
            </a>
          </article>
          <article className="work-case">
            <div>
              <span>FAILURE BEHAVIOR</span>
              <h2>Do not collapse uncertainty into success.</h2>
            </div>
            <dl>
              <div>
                <dt>Dispatch returns</dt>
                <dd>
                  A normal result records an ok outcome. A returned tool error
                  records an error outcome with tool_error classification.
                </dd>
              </div>
              <div>
                <dt>Dispatch raises</dt>
                <dd>
                  The outcome is ambiguous. An exception alone does not prove
                  that no side effect occurred, so it is unsafe to interpret it
                  as an automatic retry signal.
                </dd>
              </div>
              <div>
                <dt>Receipt fails</dt>
                <dd>
                  The caller receives ARES_EFFECT_RECEIPT_FAILED instead of a
                  success result. This exposes missing evidence; it does not
                  undo a side effect that already happened.
                </dd>
              </div>
              <div>
                <dt>Permission denied</dt>
                <dd>
                  The denied call does not dispatch or record an outcome for an
                  unconsumed permit.
                </dd>
              </div>
            </dl>
            <a
              href={`${source}/tests/test_model_tools.py`}
              target="_blank"
              rel="noreferrer"
            >
              Inspect the regression scenarios ↗
            </a>
          </article>
          <article className="work-case">
            <div>
              <span>REPRODUCIBLE INSPECTION</span>
              <h2>Read the implementation beside its tests.</h2>
            </div>
            <dl>
              <div>
                <dt>Revision</dt>
                <dd>
                  <code>{revision}</code>
                </dd>
              </div>
              <div>
                <dt>Setup</dt>
                <dd>
                  Check out this revision of RecursiveIntell/Ares, then run{" "}
                  <code>uv sync --frozen --extra dev</code> with a supported
                  Python interpreter.
                </dd>
              </div>
              <div>
                <dt>Test command</dt>
                <dd>
                  <code>
                    scripts/run_tests.sh tests/test_model_tools.py
                    tests/test_ares_collaboration.py
                  </code>
                  . The repository wrapper isolates test files and strips
                  credential variables.
                </dd>
              </div>
              <div>
                <dt>Evidence boundary</dt>
                <dd>
                  The dispatch regression tests use test doubles. They
                  demonstrate the declared branches in the Python runtime; they
                  do not establish live daemon durability, real external side
                  effects, production adoption, or complete security.
                </dd>
              </div>
              <div>
                <dt>Next proof gate</dt>
                <dd>
                  A real adapter integration run should capture a consumed
                  permit and persisted outcome, then exercise receipt transport
                  loss and restart recovery. That is a separate validation step.
                </dd>
              </div>
            </dl>
            <div className="business-text-links">
              <a
                href={`${source}/model_tools.py`}
                target="_blank"
                rel="noreferrer"
              >
                Read dispatcher source ↗
              </a>
              <a
                href={`${source}/ares_runtime/collaboration.py`}
                target="_blank"
                rel="noreferrer"
              >
                Read collaboration adapter ↗
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
              href="/josh"
            >
              Back to Josh
            </Link>
          </div>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}
