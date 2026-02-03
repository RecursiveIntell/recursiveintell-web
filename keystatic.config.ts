import { config, fields, collection } from "@keystatic/core";

// Base fields shared by all content types
const baseFields = {
  title: fields.slug({
    name: {
      label: "Title",
      validation: { isRequired: true },
    },
  }),
  date: fields.date({
    label: "Date",
    validation: { isRequired: true },
  }),
  summary: fields.text({
    label: "Summary",
    multiline: true,
    validation: { isRequired: true },
  }),
  tags: fields.array(fields.text({ label: "Tag" }), {
    label: "Tags",
    itemLabel: (props) => props.value || "New tag",
  }),
  featured: fields.checkbox({
    label: "Featured",
    defaultValue: false,
  }),
  links: fields.array(
    fields.object({
      label: fields.text({ label: "Label" }),
      url: fields.url({ label: "URL" }),
    }),
    {
      label: "Links",
      itemLabel: (props) => props.fields.label.value || "New link",
    }
  ),
  images: fields.array(fields.text({ label: "Image Path" }), {
    label: "Images",
    itemLabel: (props) => props.value || "New image",
  }),
};

// Case study fields for projects and lab
const caseStudyFields = {
  problem: fields.text({
    label: "Problem",
    multiline: true,
    description: "What problem does this solve?",
  }),
  solution: fields.text({
    label: "Solution",
    multiline: true,
    description: "How does this solve the problem?",
  }),
  results: fields.array(fields.text({ label: "Result" }), {
    label: "Results",
    description: "Key outcomes and achievements",
    itemLabel: (props) => props.value || "New result",
  }),
  role: fields.text({
    label: "Role",
    multiline: true,
    description: "Your role in the project",
  }),
  metrics: fields.array(
    fields.object({
      label: fields.text({ label: "Metric Label" }),
      value: fields.text({ label: "Metric Value" }),
    }),
    {
      label: "Metrics",
      description: "Quantifiable metrics (e.g., 50% faster)",
      itemLabel: (props) =>
        props.fields.label.value
          ? `${props.fields.label.value}: ${props.fields.value.value}`
          : "New metric",
    }
  ),
};

// Status field for projects and lab
const statusField = fields.select({
  label: "Status",
  options: [
    { label: "Active", value: "active" },
    { label: "Shipping", value: "shipping" },
    { label: "Paused", value: "paused" },
    { label: "Archived", value: "archived" },
  ],
  defaultValue: "active",
});

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*",
      format: { contentField: "content" },
      schema: {
        ...baseFields,
        status: statusField,
        ...caseStudyFields,
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
    lab: collection({
      label: "Lab",
      slugField: "title",
      path: "content/lab/*",
      format: { contentField: "content" },
      schema: {
        ...baseFields,
        status: statusField,
        ...caseStudyFields,
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
    writing: collection({
      label: "Writing",
      slugField: "title",
      path: "content/writing/*",
      format: { contentField: "content" },
      schema: {
        ...baseFields,
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
    "vault-prompts": collection({
      label: "Vault: Prompts",
      slugField: "title",
      path: "content/vault/prompts/*",
      format: { contentField: "content" },
      schema: {
        ...baseFields,
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
    "vault-tools": collection({
      label: "Vault: Tools",
      slugField: "title",
      path: "content/vault/tools/*",
      format: { contentField: "content" },
      schema: {
        ...baseFields,
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
    "vault-downloads": collection({
      label: "Vault: Downloads",
      slugField: "title",
      path: "content/vault/downloads/*",
      format: { contentField: "content" },
      schema: {
        ...baseFields,
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
  },
});
