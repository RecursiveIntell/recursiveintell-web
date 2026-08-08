export type WorkflowExample = {
  id: string;
  label: string;
  source: string;
  agent: string;
  approval: string;
  action: string;
  record: string;
  boundary: string;
};

export const serviceCategories = [
  {
    number: "01",
    title: "Custom Agents",
    body: "A focused assistant or operator built around one real job, with tools, limits, escalation, and ownership made explicit.",
  },
  {
    number: "02",
    title: "Workflow Automation",
    body: "Repeated follow-up, reporting, document, intake, or coordination work mapped before any part of it is automated.",
  },
  {
    number: "03",
    title: "Business Knowledge",
    body: "Source-aware answers across the documents, policies, notes, and operational context your team is allowed to use.",
  },
  {
    number: "04",
    title: "Tool + Data Integrations",
    body: "Carefully bounded connections between AI workflows and the software, files, APIs, or local systems you already depend on.",
  },
] as const;

export const processSteps = [
  ["01", "Map", "Name the repeated work, current owner, inputs, exceptions, and decision points."],
  ["02", "Build", "Implement the smallest useful system without hiding provider, data, or authority boundaries."],
  ["03", "Verify", "Test the agreed path, failures, approvals, and handoff against explicit acceptance conditions."],
  ["04", "Operate", "Document ownership and support the system only to the level the engagement actually requires."],
] as const;

export const workflows: WorkflowExample[] = [
  {
    id: "inquiry",
    label: "New inquiry follow-up",
    source: "Website form or shared inbox",
    agent: "Classify the request and draft the next response from approved business facts",
    approval: "A person reviews consequential or low-confidence replies",
    action: "Send through the existing email or CRM tool after approval",
    record: "Record the input, approval, action, and explicit failure state",
    boundary: "The example does not promise autonomous sales decisions or customer results.",
  },
  {
    id: "knowledge",
    label: "Business knowledge question",
    source: "An employee question plus authorized documents",
    agent: "Retrieve relevant sources and compose a bounded answer with citations",
    approval: "Escalate missing, conflicting, or sensitive information",
    action: "Return the answer in the team’s existing workspace",
    record: "Preserve source identity and whether retrieval degraded",
    boundary: "Retrieval supports a decision; it does not become policy or authority.",
  },
  {
    id: "report",
    label: "Repeated report or document",
    source: "Approved records, spreadsheet rows, or system exports",
    agent: "Apply a deterministic structure and flag missing or inconsistent inputs",
    approval: "An owner approves the final version before distribution",
    action: "Create the document in the required format and destination",
    record: "Record source version, generation state, and approval",
    boundary: "The workflow does not invent missing business facts.",
  },
  {
    id: "handoff",
    label: "Tool and data handoff",
    source: "A named event in one authorized system",
    agent: "Transform only the allowlisted fields for the receiving tool",
    approval: "Require review when the action changes money, access, or commitments",
    action: "Write through the receiving tool’s normal interface",
    record: "Record the attempted effect, response, and typed failure",
    boundary: "No hidden retry, permission widening, or silent data movement.",
  },
];

export const credibilitySignal = {
  date: "August 5, 2026",
  title: "Recognized in the Hermes community",
  body:
    "Teknium, creator of Hermes Agent, publicly highlighted Josh’s demonstration of a RecursiveIntell-enhanced Hermes setup.",
  boundary:
    "This is a public interaction around Josh’s engineering work, not a customer testimonial, partnership, or product endorsement.",
  href: "https://x.com/Teknium/status/2084892532392276364",
} as const;

