import { ArrowUpRight } from "lucide-react";
import { projects, site, type Project } from "@/content/site";
import { cn } from "@/lib/cn";
import { FlowDiagram } from "./flow-diagram";
import { GitHubIcon } from "./icons";
import { Reveal } from "./motion";
import { CountUp, ScrollWidth } from "./scroll-fx";
import { Container, SectionHeading, TechList } from "./ui";

export function Projects() {
  const ordered = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="projects" label="Projects" meta={`${projects.length} selected`} title="Things I've built." />
        </Reveal>

        <ol className="border-t border-line">
          {ordered.map((p) => (
            <li key={p.name} className="border-b border-line py-12 sm:py-16">
              <Reveal>
                <ProjectRow project={p} />
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-10">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener"
            className="group inline-flex min-h-11 items-center gap-2.5 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            <GitHubIcon className="size-4" />
            <span className="link-underline">more on github</span>
            <ArrowUpRight
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}

function ProjectRow({ project: p }: { project: Project }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Title column stays pinned while the details scroll past it (desktop). */}
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <p className="font-mono text-xs text-subtle">{p.context}</p>
        <ScrollWidth
          as="h3"
          from={72}
          to={112}
          className={cn(
            "mt-3 font-display font-semibold leading-[0.95] tracking-[-0.03em] text-fg",
            p.featured ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl",
          )}
        >
          {p.name}
        </ScrollWidth>
        <p className="mt-3 text-lg font-medium text-muted">{p.tagline}</p>
        {p.links?.length ? (
          <ul className="mt-4 flex flex-wrap gap-4">
            {p.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener" className="group inline-flex items-center gap-1 text-sm text-fg">
                  <span className="link-underline">{l.label}</span>
                  <ArrowUpRight className="size-3.5 text-accent" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="lg:col-span-7">
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted sm:text-base sm:leading-relaxed">{p.description}</p>

        <dl className={cn("mt-7 grid gap-6", p.stats.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
          {p.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end border-l border-line pl-4">
              <dt className="mt-1 font-mono text-[11px] leading-snug text-subtle">{s.label}</dt>
              <dd className="font-display text-2xl font-semibold tracking-[-0.02em] text-fg sm:text-3xl">
                <CountUp value={s.value} />
              </dd>
            </div>
          ))}
        </dl>

        <TechList items={p.tech} label="Built with" className="mt-7" />

        {p.featured ? (
          <div className="mt-10">
            <FlowDiagram />
          </div>
        ) : null}
      </div>
    </div>
  );
}
