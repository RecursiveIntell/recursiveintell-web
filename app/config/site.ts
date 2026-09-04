export const site = {
  name: "RecursiveIntell",
  url: "https://recursiveintell.com",
  description:
    "Independent AI systems engineering by Josh Stevenson: agent runtimes, local memory, Rust infrastructure, and focused technical consulting.",
} as const;

export const contact = {
  name: "Josh Stevenson",
  role: "Founder / AI Systems Engineer",
  email: "j.stevenson.cs@gmail.com",
  phoneDisplay: "(256) 470-2816",
  phoneHref: "tel:+12564702816",
  textHref:
    "sms:+12564702816?&body=Hi%20Josh%2C%20I%20want%20to%20talk%20about%20a%20repeated%20task%20or%20AI%20system.",
  careerHref:
    "mailto:j.stevenson.cs@gmail.com?subject=Engineering%20role%20for%20Josh%20Stevenson",
  introHref:
    "mailto:j.stevenson.cs@gmail.com?subject=RecursiveIntell%20project%20inquiry&body=The%20task%20or%20system%3A%20%0AWho%20uses%20it%3A%20%0AWhat%20happens%20today%3A%20%0AWhat%20a%20useful%20result%20would%20look%20like%3A%20",
} as const;

export const businessNavigation = [
  { href: "/work", label: "Work" },
  { href: "/mnemes", label: "Systems" },
  { href: "/portfolio", label: "Library" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
] as const;
