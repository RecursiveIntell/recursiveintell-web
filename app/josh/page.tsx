import type { Metadata } from "next";
import Link from "next/link";

const contact = {
  email: "josh@recursiveintell.com",
  phoneDisplay: "(256) 677-8909",
  phoneHref: "tel:+12566778909",
  introHref:
    "mailto:josh@recursiveintell.com?subject=I%20have%20a%20workflow%20to%20discuss&body=Hi%20Josh%2C%0A%0AThe%20task%20my%20business%20repeats%20is%3A%0A%0AThe%20tools%20or%20information%20involved%20are%3A%0A%0A",
};

const capabilities = [
  {
    number: "01",
    title: "Repeated work, handled better.",
    body: "Turn a clear, repeatable loop into a dependable workflow: intake, follow-up, paperwork, reminders, summaries, or internal handoffs.",
  },
  {
    number: "02",
    title: "Answers from your own information.",
    body: "Give your team a helpful assistant built around approved manuals, policies, services, notes, and procedures instead of a generic chat window.",
  },
  {
    number: "03",
    title: "Your tools, working together.",
    body: "Connect the systems your team already relies on, from inboxes and calendars to forms, spreadsheets, and line-of-business software.",
  },
  {
    number: "04",
    title: "People stay in charge.",
    body: "Important actions can be designed around human review, clear handoffs, source-aware answers, and an explicit answer when a system cannot complete something safely.",
  },
];

const businessContexts = [
  ["Service & appointment teams", "Missed inquiries, booking, customer follow-up, staff coordination."],
  ["Retail & hospitality", "Customer questions, recurring messages, inventory and operating checklists."],
  ["Trades & field work", "Quotes, job details, forms, status updates, repeat scheduling."],
  ["Offices & community organizations", "Documents, procedures, intake, reporting, and shared knowledge."],
];

const engagementSteps = [
  ["01", "Bring one loop.", "Tell me what happens over and over, where it gets stuck, and what a useful result would look like."],
  ["02", "Map the real work.", "I look at the people, tools, information, exceptions, and approval points before suggesting a system."],
  ["03", "Build the smallest useful version.", "We start with a named boundary, test it with the people who use it, then make the handoff clear."],
  ["04", "Keep control after launch.", "You get plain-language documentation, client-owned accounts, and optional care if you want ongoing help."],
];

const plans = [
  {
    name: "First Win",
    price: "$1,250",
    care: "$199/mo optional care",
    summary: "For one painful, repetitive task that needs a practical first system.",
    includes: [
      "One workflow map and fixed written scope",
      "One focused AI workflow or knowledge assistant",
      "One limited connection to the tools you already use",
      "Plain-language handoff and 30 days of launch care",
    ],
  },
  {
    name: "Focused Workflow",
    price: "$3,000",
    care: "$499/mo optional care",
    summary: "For an end-to-end team workflow where the handoffs and safeguards matter.",
    featured: true,
    includes: [
      "One end-to-end workflow with a clear owner",
      "Up to three scoped tool or data connections",
      "Human approval points and documented exceptions",
      "Team walkthrough, handoff, and 30 days of launch care",
    ],
  },
  {
    name: "Connected Operations",
    price: "$6,000+",
    care: "$999+/mo optional care",
    summary: "For several connected workflows, deeper integrations, or a system your team will keep improving.",
    includes: [
      "A phased implementation plan before the build",
      "Multiple named workflows and integration boundaries",
      "Shared knowledge, review, and operational visibility where useful",
      "Written operating handoff and an optional improvement cadence",
    ],
  },
];

export const metadata: Metadata = {
  title: { absolute: "Josh Stevenson | RecursiveIntell" },
  description:
    "Practical custom AI systems, workflow automation, business knowledge assistants, and tool integrations built around how your business already works.",
  keywords: ["custom AI systems", "workflow automation", "business knowledge", "tool integrations", "RecursiveIntell", "Josh Stevenson"],
  alternates: { canonical: "https://recursiveintell.com/josh" },
  openGraph: {
    title: "Josh Stevenson | RecursiveIntell",
    description: "Practical AI systems built around your business, your people, and your information.",
    url: "https://recursiveintell.com/josh",
    siteName: "RecursiveIntell",
    type: "website",
    images: [
      {
        url: "/josh-social.png",
        width: 1200,
        height: 630,
        alt: "RecursiveIntell business systems by Josh Stevenson",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Stevenson | RecursiveIntell",
    description: "Practical AI systems built around your business, your people, and your information.",
    images: ["/josh-social.png"],
  },
};

export default function JoshPage() {
  return (
    <main className="josh-page">
      <header className="josh-header">
        <div className="josh-shell josh-header-inner">
          <Link className="josh-wordmark" href="/" aria-label="RecursiveIntell home">
            <span>RECURSIVE</span><strong>INTELL</strong>
          </Link>
          <nav aria-label="Josh service page navigation">
            <a href="#how-it-helps">How it helps</a>
            <a href="#ways-to-start">Ways to start</a>
            <a href="#proof">The work behind it</a>
          </nav>
          <a className="josh-header-contact" href={contact.phoneHref}>{contact.phoneDisplay}</a>
        </div>
      </header>

      <section className="josh-hero">
        <div className="josh-hero-grid" aria-hidden="true" />
        <div className="josh-shell josh-hero-layout">
          <div className="josh-hero-copy">
            <p className="josh-kicker"><span>01</span> YOU FOUND THE CARD. NOW MAKE THE WORK EASIER.</p>
            <h1>AI that fits<br />the way your <em>business</em><br />already works.</h1>
            <p className="josh-hero-lede">
              Bring one task your team repeats: missed inquiries, manual follow-up, scattered paperwork, hard-to-find answers, or tools that refuse to cooperate. I map it, build the useful part, and leave you with a clear handoff.
            </p>
            <div className="josh-actions">
              <a className="josh-button josh-button-primary" href={contact.introHref}>Tell me what repeats <span>→</span></a>
              <a className="josh-button josh-button-quiet" href={contact.phoneHref}>Call Josh <span>↗</span></a>
            </div>
            <p className="josh-hero-note">Small first projects welcome. No pressure to buy a large system.</p>
          </div>

          <aside className="josh-signal-card" aria-label="Example workflow system">
            <header><i /> A SYSTEM WITH A CLEAR HANDOFF</header>
            <div className="josh-signal-flow">
              <div><span>01</span><b>What repeats</b><small>Calls · forms · email · paperwork</small></div>
              <i />
              <div><span>02</span><b>What helps</b><small>AI workflow · useful knowledge · connected tools</small></div>
              <i />
              <div><span>03</span><b>Who decides</b><small>Your team · review where it matters</small></div>
            </div>
            <footer><span>YOUR WORK</span><i /><span>YOUR CONTROL</span></footer>
          </aside>
        </div>
      </section>

      <section id="how-it-helps" className="josh-section josh-capabilities">
        <div className="josh-shell">
          <div className="josh-section-heading">
            <div>
              <p className="josh-index">02 / WHERE IT HELPS</p>
              <h2>Not a generic bot.<br /><em>A useful system.</em></h2>
            </div>
            <p>The goal is not to put AI everywhere. It is to remove friction from work that costs your team attention, time, or consistency.</p>
          </div>
          <div className="josh-capability-grid">
            {capabilities.map((capability) => (
              <article key={capability.number}>
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="josh-inclusion-section">
        <div className="josh-shell josh-inclusion-layout">
          <div>
            <p className="josh-index">03 / BUILT FOR THE WAY YOU WORK</p>
            <h2>You do not need a big team,<br />a big budget, or perfect software<br />to <em>start useful.</em></h2>
            <p>
              I work with businesses that run on a mixture of people, phone calls, paper, spreadsheets, and specialized software. We can start with one useful change, communicate in plain language, and make sure your team can actually use what gets built.
            </p>
          </div>
          <div className="josh-context-grid">
            {businessContexts.map(([title, body], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="josh-section josh-process-section">
        <div className="josh-shell">
          <div className="josh-section-heading">
            <div>
              <p className="josh-index">04 / HOW WE WORK</p>
              <h2>Start with the<br /><em>smallest useful win.</em></h2>
            </div>
            <p>No mysterious black box and no pressure to automate something that should stay human. Every build starts with the current workflow, not a template looking for a problem.</p>
          </div>
          <ol className="josh-process">
            {engagementSteps.map(([number, title, body]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ways-to-start" className="josh-pricing-section">
        <div className="josh-pricing-radiance" aria-hidden="true" />
        <div className="josh-shell">
          <div className="josh-pricing-head">
            <div>
              <p className="josh-index">05 / CLEAR STARTING POINTS</p>
              <h2>Choose the amount<br />of help you <em>actually need.</em></h2>
            </div>
            <p>These are starting prices, not mystery packages. Before a build, you receive a plain-language scope that says what is included, what is not, and who owns each part.</p>
          </div>
          <div className="josh-price-grid">
            {plans.map((plan) => (
              <article className={plan.featured ? "josh-price-card josh-price-featured" : "josh-price-card"} key={plan.name}>
                {plan.featured && <b className="josh-popular">A good place to start</b>}
                <p>{plan.name}</p>
                <strong>{plan.price}</strong>
                <small>{plan.care}</small>
                <h3>{plan.summary}</h3>
                <ul>{plan.includes.map((item) => <li key={item}>{item}</li>)}</ul>
                <a href={contact.introHref}>Ask about this start <span>→</span></a>
              </article>
            ))}
          </div>
          <div className="josh-pricing-notes">
            <div><b>Not ready to build?</b><p>A $250 workflow-map session is available on its own and is credited toward a build if we move forward.</p></div>
            <div><b>What care means</b><p>Optional monthly care covers agreed monitoring, small improvements, and support. No annual contract. You are not locked in.</p></div>
            <div><b>Clear boundaries</b><p>Third-party software, model/API, phone, hosting, and client-system fees are separate. New scope is approved in writing at $125/hr.</p></div>
          </div>
        </div>
      </section>

      <section id="proof" className="josh-proof-section">
        <div className="josh-shell josh-proof-layout">
          <div>
            <p className="josh-index">06 / THE WORK BEHIND THE WORK</p>
            <h2>Built by an engineer<br />who cares about what<br /><em>actually happens.</em></h2>
          </div>
          <div className="josh-proof-copy">
            <p>I&apos;m Josh Stevenson, an independent systems engineer and the founder of RecursiveIntell. The public work behind this page includes local AI memory, source-aware retrieval, controlled AI workflows, and operator-focused infrastructure.</p>
            <p>That does not mean every problem should be automated. It means the systems I build can be designed to show their sources, preserve important decisions, and make their limits visible instead of pretending to be infallible.</p>
            <div className="josh-proof-links">
              <Link href="/portfolio">Browse the public work <span>→</span></Link>
              <Link href="/proof">See the technical proof model <span>→</span></Link>
              <a href="https://github.com/RecursiveIntell" target="_blank" rel="noreferrer">Open GitHub <span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="josh-closing">
        <div className="josh-closing-lines" aria-hidden="true" />
        <div className="josh-shell josh-closing-layout">
          <div>
            <p className="josh-index">YOUR FIRST MOVE</p>
            <h2>Tell me the task<br />your business keeps<br /><em>doing by hand.</em></h2>
          </div>
          <div>
            <p>Send a sentence, call, or bring it up the next time you see me. We will figure out whether there is a useful first system to build.</p>
            <div className="josh-actions">
              <a className="josh-button josh-button-primary" href={contact.introHref}>Start the conversation <span>→</span></a>
              <a className="josh-button josh-button-light" href={`mailto:${contact.email}`}>{contact.email} <span>↗</span></a>
            </div>
            <a className="josh-phone" href={contact.phoneHref}>{contact.phoneDisplay}</a>
          </div>
        </div>
      </section>

      <footer className="josh-footer">
        <div className="josh-shell">
          <p><span>RECURSIVE</span> <strong>INTELL</strong></p>
          <small>JOSH STEVENSON · FOUNDER / AI SYSTEMS ENGINEER</small>
        </div>
      </footer>
    </main>
  );
}
