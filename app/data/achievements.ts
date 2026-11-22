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


export const nvidiaProxyContribution = {
  title: "NVIDIA PAIR: real-socket flush deadline regression",
  date: "2026-10-30",
  dateLabel: "October 30, 2026",
  pullRequestNumber: 139,
  mergeCommit: "19018b8f5978b7b8384eecb06e0628910055b6da",
  pullRequest: "https://github.com/NVIDIA/Personal-AI-Router/pull/139",
  review: "https://github.com/NVIDIA/Personal-AI-Router/pull/139#pullrequestreview-5716437521",
  summary:
    "My second NVIDIA PAIR contribution was merged: a real-socket proxy regression now reaches backpressure within its test budget. A reviewer reproduced the negative control by disabling the flush deadline.",
  boundary:
    "An accepted test-only upstream contribution, not a production proxy change, NVIDIA employment, sponsorship, or partnership.",
} as const;

export const turboQuantCoverage = {
  title: "TurboQuant Rust implementation cited in independent reporting",
  date: "2026-03-29",
  dateLabel: "March 29, 2026",
  article:
    "https://medium.com/@michael.hannecke/googles-turboquant-changes-the-economics-of-local-ai-inference-acce5839014d",
  repository: "https://github.com/RecursiveIntell/turbo-quant",
  summary:
    "Michael Hannecke's article about TurboQuant named RecursiveIntell among the community's Rust implementations of the research.",
  boundary:
    "An independent article mention, not a peer review or performance certification of this particular implementation. The author's general TurboQuant performance claims must not be attributed to RecursiveIntell's benchmarks.",
} as const;

export const turboQuantVideoCoverage = {
  title: "TurboQuant repository linked by Tonbi's AI Garage",
  date: "2026-03-30",
  dateLabel: "March 30, 2026",
  video: "https://www.youtube.com/watch?v=4S5NIE_294U",
  repository: "https://github.com/RecursiveIntell/turbo-quant",
  summary:
    "Tonbi's AI Garage listed RecursiveIntell/turbo-quant in the community implementation resources for its TurboQuant follow-up video.",
  boundary:
    "The video cites the repository as a community resource. Its experiments and performance results apply to Tonbi's implementation, not as third-party validation of RecursiveIntell's codecs.",
} as const;

export const hermesReviewEvidence = {
  title: "Hermes profile-isolation work examined in public review",
  date: "2026-09-10",
  dateLabel: "September 10, 2026",
  maintainerComment:
    "https://github.com/NousResearch/hermes-agent/pull/83007#issuecomment-5624529181",
  provenancePR: "https://github.com/NousResearch/hermes-agent/pull/91293",
  supersessionReview:
    "https://github.com/NousResearch/hermes-agent/pull/91293#pullrequestreview-5024436809",
  compositePR: "https://github.com/NousResearch/hermes-agent/pull/94878",
  pluginPR: "https://github.com/NousResearch/hermes-official-plugins/pull/362",
  summary:
    "Teknium identified #91293 as carrying forward remaining subprocess-isolation gaps; a separate detailed review selected #94878 as the composite integration candidate while preserving predecessor credit.",
  boundary:
    "Maintainer acknowledgment and review of historical commits are documented; neither core PR is merged, current-head acceptance and hosted validation remain outstanding, and the Singularity companion is still a dependent draft.",
} as const;

export const hermesDigestCoverage = {
  title: "Ares resource-use demonstration noted in Hermes community digest",
  date: "2026-08-05",
  dateLabel: "August 5, 2026",
  digest:
    "https://github.com/t1t4nium/hermes-agent-news-fr/blob/main/2026/2026-08-05-hermes-agent-news-digest-10.md",
  summary:
    "A French-language Hermes community digest named Josh Stevenson and RecursiveIntell while reporting his 16 GB multi-agent demonstration and Teknium's repost.",
  boundary:
    "Independent reporting of a user-published demonstration and community interaction, not an independently benchmarked resource-efficiency result or endorsement of all Ares capabilities.",
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
      {
        label: "NVIDIA release-note acknowledgment",
        href: "https://docs.nvidia.com/local-ai/nvpair/release-notes/",
      },
    ],
  },
  {
    id: "nvidia-pair-proxy",
    label: "SECOND ACCEPTED UPSTREAM CONTRIBUTION",
    date: nvidiaProxyContribution.date,
    dateLabel: nvidiaProxyContribution.dateLabel,
    mark: "NVIDIA / PAIR",
    title: nvidiaProxyContribution.title,
    body: nvidiaProxyContribution.summary,
    boundary: nvidiaProxyContribution.boundary,
    links: [
      { label: "Read the merged test fix", href: nvidiaProxyContribution.pullRequest },
      { label: "Read the independent reviewer reproduction", href: nvidiaProxyContribution.review },
    ],
  },
  {
    id: "hermes-architecture",
    label: "PUBLIC SECURITY ENGINEERING REVIEW",
    date: hermesReviewEvidence.date,
    dateLabel: hermesReviewEvidence.dateLabel,
    mark: "NOUS / HERMES",
    title: hermesReviewEvidence.title,
    body: hermesReviewEvidence.summary,
    boundary: hermesReviewEvidence.boundary,
    links: [
      { label: "Read Teknium's technical acknowledgment", href: hermesReviewEvidence.maintainerComment },
      { label: "Read the architecture/supersession review", href: hermesReviewEvidence.supersessionReview },
      { label: "Inspect the open composite", href: hermesReviewEvidence.compositePR },
    ],
  },
  {
    id: "turboquant-coverage",
    label: "INDEPENDENT TECHNICAL ARTICLE",
    date: turboQuantCoverage.date,
    dateLabel: turboQuantCoverage.dateLabel,
    mark: "TURBOQUANT / RUST",
    title: turboQuantCoverage.title,
    body: turboQuantCoverage.summary,
    boundary: turboQuantCoverage.boundary,
    links: [
      { label: "Read Michael Hannecke's article", href: turboQuantCoverage.article },
      { label: "Inspect the Rust implementation", href: turboQuantCoverage.repository },
    ],
  },
  {
    id: "turboquant-video",
    label: "THIRD-PARTY RESOURCE CITATION",
    date: turboQuantVideoCoverage.date,
    dateLabel: turboQuantVideoCoverage.dateLabel,
    mark: "TURBOQUANT / VIDEO",
    title: turboQuantVideoCoverage.title,
    body: turboQuantVideoCoverage.summary,
    boundary: turboQuantVideoCoverage.boundary,
    links: [
      { label: "Watch Tonbi's follow-up", href: turboQuantVideoCoverage.video },
      { label: "Inspect the linked repository", href: turboQuantVideoCoverage.repository },
    ],
  },
  {
    id: "hermes-digest",
    label: "INDEPENDENT COMMUNITY COVERAGE",
    date: hermesDigestCoverage.date,
    dateLabel: hermesDigestCoverage.dateLabel,
    mark: "HERMES COMMUNITY",
    title: hermesDigestCoverage.title,
    body: hermesDigestCoverage.summary,
    boundary: hermesDigestCoverage.boundary,
    links: [{ label: "Read the community digest", href: hermesDigestCoverage.digest }],
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
