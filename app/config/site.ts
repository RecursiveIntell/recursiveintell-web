export const site = {
  name: "RecursiveIntell",
  url: "https://recursiveintell.com",
  description:
    "Custom AI systems, workflow automation, business knowledge, tool integrations, and evidence-led technical consulting by Josh Stevenson.",
} as const;

export const contact = {
  name: "Josh Stevenson",
  role: "Founder / AI Systems Engineer",
  email: "josh@recursiveintell.com",
  phoneDisplay: "(256) 677-8909",
  phoneHref: "tel:+12566778909",
  textHref:
    "sms:+12566778909?&body=Hi%20Josh%2C%20I%20want%20to%20talk%20about%20a%20repeated%20task%20or%20AI%20system.",
  introHref:
    "mailto:josh@recursiveintell.com?subject=RecursiveIntell%20project%20inquiry&body=The%20task%20or%20system%3A%20%0AWho%20uses%20it%3A%20%0AWhat%20happens%20today%3A%20%0AWhat%20a%20useful%20result%20would%20look%20like%3A%20",
} as const;

export const businessNavigation = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/josh", label: "Josh" },
  { href: "/mnemes", label: "Mnemes" },
] as const;
