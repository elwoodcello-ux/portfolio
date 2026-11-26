# Andrew Elwood · personal site

My portfolio: Next.js (App Router) + Tailwind CSS v4 + Motion + Lenis, deployed on Vercel.

## Editing the content

Almost everything you'd want to change lives in **one file**: [`src/content/site.ts`](src/content/site.ts).

| Want to change… | Edit |
| --- | --- |
| Bio, facts, skills | `about` |
| Jobs / internships | `experience` |
| Projects, stats, links | `projects` (add `links: [{ label: "Live site", href: "https://…" }]`) |
| The rotating hero line | `heroPhrases` |
| The NEXT / NOW / STUDYING strip | `heroMeta` |
| Email, LinkedIn, GitHub, "open to" line | `site` |
| Headshot | put `me.jpg` in `public/` and set `photo: "/me.jpg"` |
| Resume PDFs | replace the files in `public/resume/` (keep the same names) |

Push to `main` and Vercel redeploys automatically in about a minute.

## Running it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The page reloads as you edit.

## Design notes

- **Type:** Hubot Sans (display), Mona Sans (text), Martian Mono (labels). All open source, self-hosted from npm.
- **Colour:** one accent (muted brass, a quieter Pitt gold), hairline structure. Every text colour is checked with WCAG 2.1 and APCA; the numbers are in `src/app/globals.css`.
- **Motion:** smooth scrolling (Lenis) and scroll-linked effects (Motion). Everything turns off for visitors with "reduce motion" enabled.
- **Light / dark:** follows the visitor's system setting, with a toggle in the nav.

## Custom domain (later)

Buy a domain, then in Vercel: Project → Settings → Domains → Add. Share-preview and SEO URLs pick it up automatically.
