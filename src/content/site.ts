/**
 * Everything on the site lives in this file.
 * Edit the text here and the page updates. No need to touch the components.
 */

export const site = {
  name: "Andrew Elwood",
  shortName: "andrew elwood",
  // Used for metadata, the OG image and the footer.
  role: "CS @ Pitt · Founder of FlowFrame",
  description:
    "Andrew Elwood is a computer science student at the University of Pittsburgh and the founder of FlowFrame, an AI web app for freelancers. Incoming software engineering intern at PNC.",
  location: "Pittsburgh, PA",
  timezone: "America/New_York",
  email: "ane154@pitt.edu",

  // Shows the green "available" dot in the nav. Set to false when you're not looking.
  available: true,
  availability: "Open to software engineering & product internships",

  // Optional headshot: drop a file in /public (e.g. /public/me.jpg) and set photo: "/me.jpg"
  photo: null as string | null,

  links: {
    github: "https://github.com/elwoodcello-ux",
    linkedin: "https://www.linkedin.com/in/andrewelwood",
  },

  resumes: [
    { label: "Engineering resume", href: "/resume/Andrew_Elwood_Resume.pdf" },
    { label: "Product resume", href: "/resume/Andrew_Elwood_Resume_PM.pdf" },
  ],
} as const;

/** The italic line in the hero cycles through these. Each one maps to real work below. */
export const heroPhrases = [
  "that freelancers pay for.",
  "that speaks in your own voice.",
  "that translates a live call.",
  "that finds signal in 315,000 rows.",
];

export const heroMeta = [
  { label: "next", value: "SWE intern @ PNC", note: "summer 2027" },
  { label: "now", value: "founder @ FlowFrame", note: "since dec 2025" },
  { label: "studying", value: "CS + econ @ Pitt", note: "class of 2029" },
];

export const about = {
  // Wrap a phrase in [[double brackets]] to highlight it.
  paragraphs: [
    "I'm a computer science student at the University of Pittsburgh, minoring in economics. The part of software I like most is where a messy input (a freelancer's rough brief, a conversation in two languages, [[315,000]] city inspection records) turns into something people can actually use.",
    "In December 2025 I started [[FlowFrame]], an AI web app that turns a project brief into a client-ready visual workflow in under a minute. I built and run the whole stack myself, from the FastAPI backend to Stripe billing, and it now has a paid Pro tier. In summer 2027 I'm joining [[PNC]] as a software engineering intern.",
  ],
  facts: [
    { k: "school", v: "University of Pittsburgh" },
    { k: "degree", v: "B.S. Computer Science, minor in Economics" },
    { k: "graduating", v: "May 2029" },
    { k: "gpa", v: "4.0 / 4.0" },
    { k: "based in", v: "Pittsburgh, PA" },
  ],
  skills: [
    {
      group: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "R", "HTML/CSS"],
    },
    {
      group: "Frameworks",
      items: ["React", "Next.js", "Node.js", "FastAPI", "Vite", "Socket.IO", "WebRTC"],
    },
    { group: "Data", items: ["PostgreSQL", "SQLite", "Pandas", "NumPy", "Matplotlib"] },
    {
      group: "Tools & APIs",
      items: ["Git/GitHub", "Render", "Stripe", "Google Gemini", "ElevenLabs", "Claude Code"],
    },
  ],
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  kind?: "incoming" | "leadership";
  href?: string;
  summary?: string;
  bullets: string[];
  tags?: string[];
};

export const experience: Experience[] = [
  {
    company: "PNC Financial Services Group",
    role: "Software Engineering Intern",
    start: "Jun 2027",
    end: "Aug 2027",
    location: "Pittsburgh, PA",
    kind: "incoming",
    summary: "Joining PNC's software engineering internship program in summer 2027.",
    bullets: [],
  },
  {
    company: "FlowFrame LLC",
    role: "Founder",
    start: "Dec 2025",
    end: "Present",
    location: "Pittsburgh, PA",
    bullets: [
      "Took FlowFrame from concept to a live product with a paid Pro tier as sole founder and developer: an AI web app that turns a freelancer's project brief into a client-ready visual workflow in under a minute.",
      "Built and deployed the full stack solo: FastAPI and PostgreSQL on Render, Google Gemini for workflow generation, Stripe subscription billing, Resend email, and Google and Microsoft Calendar sync.",
      "Designing an AI agent that turns a client's inquiry email into a priced proposal: it asks the freelancer about missing details, drafts scope and timeline, and publishes a link the client can accept.",
    ],
    tags: ["FastAPI", "PostgreSQL", "Gemini", "Stripe", "Render"],
  },
  {
    company: "Solismatica LLC",
    role: "AI Development Intern",
    start: "Apr 2025",
    end: "Oct 2025",
    location: "Remote",
    bullets: [
      "Worked with the lead developer on VoiceBox, an assistive React app that lets a participant with limited speech type or handwrite messages and hear them in their own cloned voice.",
      "Helped design three serverless functions (PIN login, ElevenLabs text-to-speech, saved phrases) over Postgres with row-level security, keeping the database and API key off the client.",
      "Researched the speech data needed for a usable cloned voice, documented the ethical risks of voice cloning, and wrote a letter of support for a $100,000 grant to fund district-wide AI clubs.",
    ],
    tags: ["React", "Vite", "Postgres", "ElevenLabs"],
  },
];

export type Project = {
  name: string;
  tagline: string;
  context: string;
  description: string;
  stats: { value: string; label: string }[];
  tech: string[];
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "FlowFrame",
    tagline: "Project briefs → client-ready workflows",
    context: "Founder · solo build · Dec 2025 to now",
    description:
      "An AI web app for freelancers. Paste a project brief and FlowFrame breaks it into phases, deliverables and time estimates as a shareable visual workflow. It's built around three pain points: underestimated timelines, unclear structure and undefined financial scope.",
    stats: [
      { value: "< 1 min", label: "brief to workflow" },
      { value: "Pro tier", label: "live, paid subscriptions" },
      { value: "1 person", label: "design, build, deploy" },
    ],
    tech: ["FastAPI", "PostgreSQL", "Gemini", "Stripe", "Resend", "Render"],
    // Add your live link / repo here, e.g. { label: "Live site", href: "https://..." }
    links: [],
    featured: true,
  },
  {
    name: "Fluid",
    tagline: "One call, many languages",
    context: "SteelHacks · team of 4 · 24 hours",
    description:
      "A live calling app that lets a group hold one conversation across languages, streaming speech through ElevenLabs speech-to-text, translation and text-to-speech over WebSockets.",
    stats: [
      { value: "−50%", label: "speak-to-hear delay" },
      { value: "2 calls, not 4", label: "translations per sentence" },
    ],
    tech: ["TypeScript", "Next.js", "ElevenLabs", "WebRTC", "Socket.IO"],
    links: [],
  },
  {
    name: "Chicago Food Inspections",
    tagline: "What happens after a restaurant fails?",
    context: "Data analysis · Python + SQL",
    description:
      "A reproducible pipeline over 315,000+ municipal inspection records that parses a free-text violation field into a normalized table, then uses SQL window functions to measure post-failure compliance.",
    stats: [
      { value: "315k+", label: "records cleaned" },
      { value: "87.4%", label: "passed re-inspection, avg 14.4 days" },
    ],
    tech: ["Python", "SQLite", "Pandas", "SQL"],
    links: [],
  },
];
