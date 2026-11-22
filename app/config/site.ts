export const site = {
  name: "RecursiveIntell",
  url: "https://recursiveintell.com",
  description:
    "Independent AI systems engineering by Josh Stevenson, an open-source contributor to NVIDIA PAIR. Agent runtimes, durable memory, Rust infrastructure, and focused technical consulting.",
} as const;

// Single owner for every public website contact and mailto destination.
export const contactEmail = "josh@recursiveintell.com" as const;

export const contact = {
  name: "Josh Stevenson",
  role: "Founder / AI Systems Engineer",
  email: contactEmail,
  phoneDisplay: "(256) 470-2816",
  phoneHref: "tel:+12564702816",
  textHref:
    "sms:+12564702816?&body=Hi%20Josh%2C%20I%20want%20to%20talk%20about%20a%20repeated%20task%20or%20AI%20system.",
  careerHref:
    `mailto:${contactEmail}?subject=Engineering%20role%20for%20Josh%20Stevenson`,
  introHref:
    `mailto:${contactEmail}?subject=RecursiveIntell%20project%20inquiry&body=The%20task%20or%20system%3A%20%0AWho%20uses%20it%3A%20%0AWhat%20happens%20today%3A%20%0AWhat%20a%20useful%20result%20would%20look%20like%3A%20`,
} as const;

export const businessNavigation = [
  { href: "/work", label: "Work" },
  { href: "/systems", label: "Systems" },
  { href: "/portfolio", label: "Library" },
  { href: "/workshop", label: "Workshop" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
] as const;
