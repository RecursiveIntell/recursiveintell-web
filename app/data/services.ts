export type ServiceOffer = {
  number: string;
  name: string;
  kind: string;
  bestFit: string;
  inputs: string;
  deliverable: string;
  boundary: string;
  acceptance: string;
  subject: string;
};

export const serviceOffers: ServiceOffer[] = [
  {
    number: "01",
    name: "AI Workflow Map",
    kind: "Focused consulting",
    bestFit: "You know a process wastes attention, but the right automation boundary is still unclear.",
    inputs: "One repeated workflow, its users, current tools, representative inputs, and known exceptions.",
    deliverable: "A current-state map, automation candidates, authority boundaries, risk register, and smallest useful pilot recommendation.",
    boundary: "Analysis and design only. No production integration or guarantee of savings.",
    acceptance: "The map names owners, inputs, decisions, exceptions, proposed effects, and a falsifiable next gate.",
    subject: "AI Workflow Map",
  },
  {
    number: "02",
    name: "Custom Agent Pilot",
    kind: "Bounded implementation",
    bestFit: "One agent-assisted workflow has a clear owner and can be tested without reorganizing the whole business.",
    inputs: "The approved workflow map, sample tasks, authorized tools or data, and named approval points.",
    deliverable: "A working pilot, configuration, test fixtures, explicit failure behavior, operator walkthrough, and handoff notes.",
    boundary: "One agreed workflow and integration surface. External service fees and later expansion remain separate.",
    acceptance: "The pilot completes the agreed examples, refuses or escalates boundary cases, and leaves an inspectable execution record.",
    subject: "Custom Agent Pilot",
  },
  {
    number: "03",
    name: "Business Knowledge Build",
    kind: "Source-aware system",
    bestFit: "Useful answers are trapped across documents, notes, policies, or specialist knowledge that people repeatedly search for.",
    inputs: "An authorized source set, access rules, representative questions, update process, and escalation owner.",
    deliverable: "An indexed knowledge path, source-aware answer interface, update procedure, failure states, and evaluation set.",
    boundary: "The system surfaces evidence; it does not replace policy owners or guarantee factual correctness.",
    acceptance: "The agreed questions return relevant sources, disclose missing evidence, and preserve the defined access boundary.",
    subject: "Business Knowledge Build",
  },
  {
    number: "04",
    name: "Systems Consulting + Ongoing Care",
    kind: "Technical advisory or operations",
    bestFit: "You need architecture judgment, reliability work, local-first deployment, Hermes customization, or continued improvement after a pilot.",
    inputs: "The exact system boundary, current source or configuration, desired decision, and evidence required at the end.",
    deliverable: "A scoped review, implementation pass, reliability audit, or agreed maintenance cadence with written receipts and handoff.",
    boundary: "Not a penetration test, certification, compliance opinion, or unlimited support agreement.",
    acceptance: "The engagement closes its named decision or change with mapped checks, results, limitations, and remaining delta.",
    subject: "Systems Consulting and Ongoing Care",
  },
];

export const consultingAreas = [
  ["Agent runtime architecture", "Graph design, model and tool boundaries, memory routes, failure states, receipts, and operator control."],
  ["Hermes integration", "Skills, MCP servers, local memory, Rust-backed services, multi-agent workflows, and bounded performance work."],
  ["Local-first AI", "Deployment topology, data residency, provider boundaries, offline behavior, recovery, and explicit degraded modes."],
  ["Reliability + proof", "Hostile workflow review, replay cases, claim/evidence boundaries, acceptance tests, and release gates."],
] as const;

