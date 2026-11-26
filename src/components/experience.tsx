"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { experience, type Experience as Item } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE_OUT, Reveal } from "./motion";
import { Container, SectionHeading, TechList } from "./ui";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  // The accent hairline grows as you scroll through the timeline.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="experience" label="Experience" meta={`${experience.length} roles`} title="Work so far." />
        </Reveal>

        <ol ref={listRef} className="relative">
          <span aria-hidden="true" className="absolute bottom-3 left-[4px] top-3 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-3 left-[4px] top-3 w-px origin-top bg-accent"
          />
          {experience.map((item, i) => (
            <TimelineItem key={item.company} item={item} last={i === experience.length - 1} />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function TimelineItem({ item, last }: { item: Item; last: boolean }) {
  return (
    <li className={cn("relative pl-9 sm:pl-12", last ? "pb-0" : "pb-14 sm:pb-16")}>
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-[0.55rem] size-[9px] bg-accent"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -35% 0px" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />

      <Reveal className="grid gap-x-10 gap-y-3 md:grid-cols-[11rem_1fr]">
        <div className="font-mono text-xs leading-6 text-subtle">
          <p className="text-muted">
            {item.start} – {item.end}
          </p>
          <p>{item.location}</p>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-fg">
              {item.company}
            </h3>
            {item.kind ? (
              <span
                className={cn(
                  "font-mono text-[11px] font-medium uppercase tracking-[0.14em]",
                  item.kind === "incoming" ? "text-accent" : "text-subtle",
                )}
              >
                {item.kind}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[15px] font-medium text-muted">{item.role}</p>

          {item.summary ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{item.summary}</p>
          ) : null}

          {item.bullets.length ? (
            <ul className="mt-4 max-w-3xl space-y-3">
              {item.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-line-strong" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {item.tags?.length ? <TechList items={item.tags} label="Technologies" className="mt-5" /> : null}
        </div>
      </Reveal>
    </li>
  );
}
