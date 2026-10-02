// Public contribution and recognition facts have one owner across site routes.
// Evidence checked October 1, 2026. Social recognition is an observed public
// interaction; a merged upstream contribution has a separate GitHub record.
export const nvidiaContribution = {
  title: "NVIDIA PAIR open-source contributor",
  project: "NVIDIA Personal AI Router",
  date: "2026-09-23",
  dateLabel: "September 23, 2026",
  pullRequestNumber: 62,
  mergeCommit: "afdf9977c4c15029523aa4e1f965b2f8cc0e559c",
  pullRequest: "https://github.com/NVIDIA/Personal-AI-Router/pull/62",
  commit:
    "https://github.com/NVIDIA/Personal-AI-Router/commit/afdf9977c4c15029523aa4e1f965b2f8cc0e559c",
  summary:
    "My cluster-manager fix was accepted into NVIDIA’s Personal AI Router.  Trust-change notifications now follow successfully persisted endorsement changes, with regression coverage for duplicates and failed writes.",
  boundary:
    "An accepted open-source contribution to NVIDIA PAIR.  This does not imply employment, sponsorship, or a commercial partnership with NVIDIA.",
} as const;

export const achievements = [
  {
    id: "nvidia-pair",
    label: "ACCEPTED UPSTREAM CONTRIBUTION",
    date: nvidiaContribution.date,
    dateLabel: nvidiaContribution.dateLabel,
    mark: "NVIDIA / PAIR",
    title: nvidiaContribution.title,
    body: nvidiaContribution.summary,
    boundary: nvidiaContribution.boundary,
    links: [
      {
        label: "Read the merged contribution",
        href: nvidiaContribution.pullRequest,
      },
    ],
  },
  {
    id: "hermes-community",
    label: "COMMUNITY RECOGNITION",
    date: null,
    dateLabel: "2026 · Hermes / Ares",
    mark: "HERMES COMMUNITY",
    title: "Highlighted and reposted by Teknium",
    body: "Teknium, creator of Hermes Agent, highlighted my RecursiveIntell-enhanced Hermes demonstration and later reposted my work.  That work has grown into Ares, my downstream agent workbench.",
    boundary:
      "This is a public interaction around Josh’s engineering work, not a customer testimonial, partnership, or product endorsement.",
    links: [
      {
        label: "Original highlight",
        href: "https://x.com/Teknium/status/2084892532392276364",
      },
      {
        label: "Ares update",
        href: "https://x.com/RecursiveIntell/status/2103666075531374877",
      },
      { label: "Repost feed", href: "https://x.com/Teknium/reposts" },
    ],
  },
] as const;
