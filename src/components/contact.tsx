import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { Reveal } from "./motion";
import { ScrollWidth } from "./scroll-fx";
import { Container, SectionHeading } from "./ui";

export function Contact() {
  const rows = [
    {
      label: "LinkedIn",
      detail: site.links.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      href: site.links.linkedin,
      icon: <LinkedInIcon className="size-5" />,
    },
    {
      label: "GitHub",
      detail: site.links.github.replace(/^https?:\/\//, ""),
      href: site.links.github,
      icon: <GitHubIcon className="size-5" />,
    },
    ...site.resumes.map((r) => ({
      label: r.label,
      detail: "PDF",
      href: r.href,
      icon: null,
    })),
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="pb-16 pt-16 sm:pb-24 sm:pt-20">
      <Container>
        <Reveal>
          <SectionHeading id="contact" label="Contact" />
        </Reveal>

        {/* Mirrors the hero: the letters widen as the section arrives. */}
        <ScrollWidth
          from={70}
          to={115}
          offset={["start end", "end 65%"]}
          className="mb-12 font-display text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-fg sm:mb-16"
        >
          Let&apos;s build something.
        </ScrollWidth>

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              {site.availability}. Email is the fastest way to reach me.
            </p>
            <div className="mt-8">
              <CopyEmail email={site.email} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="border-t border-line">
              {rows.map((r) => (
                <li key={r.href} className="border-b border-line">
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex min-h-16 items-center justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <span className="grid size-5 place-items-center text-subtle transition-colors group-hover:text-accent">
                        {r.icon ?? <span className="font-mono text-[11px]">pdf</span>}
                      </span>
                      <span className="text-lg text-fg">{r.label}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="hidden font-mono text-xs text-subtle sm:inline">{r.detail}</span>
                      <ArrowUpRight
                        className="size-5 text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
