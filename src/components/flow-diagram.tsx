"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { EASE_OUT } from "./motion";

/**
 * An illustration of what FlowFrame does: a rough brief goes in,
 * phases with time estimates come out. Plays once when scrolled into view.
 * (Illustrative content, not a screenshot of the product.)
 */
const phases = [
  { name: "Discovery", deliverable: "moodboard + sitemap", days: "3d", start: 0, width: 24 },
  { name: "Design", deliverable: "homepage + menu page", days: "5d", start: 24, width: 36 },
  { name: "Build & launch", deliverable: "live site, handoff", days: "6d", start: 60, width: 40 },
];

export function FlowDiagram() {
  return (
    <motion.figure
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className="relative grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.3fr)] sm:items-center sm:gap-3"
      aria-label="Illustration: a freelancer's brief is turned into three phases with deliverables and time estimates."
    >
      {/* Brief */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } } }}
        className="border border-line bg-bg p-4"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">brief.txt</p>
        <p className="mt-2 text-base leading-snug text-fg">
          “Need a new site for my bakery before the spring menu launch. Budget is around $3k.”
        </p>
      </motion.div>

      {/* Connector */}
      <motion.div
        aria-hidden="true"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.4, duration: 0.4 } } }}
        className="relative mx-auto h-12 w-10 sm:h-10 sm:w-16"
      >
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line-strong sm:left-0 sm:top-1/2 sm:h-px sm:w-full sm:translate-x-0 sm:-translate-y-1/2" />
        <span className="absolute inset-0 grid place-items-center">
          <motion.span
            variants={{
              hidden: { scale: 0.5, opacity: 0 },
              show: { scale: 1, opacity: 1, transition: { delay: 0.6, duration: 0.5, ease: EASE_OUT } },
            }}
            className="grid size-9 place-items-center rounded-full border border-accent bg-bg-elev text-accent"
          >
            <Sparkles className="size-4" strokeWidth={1.75} />
          </motion.span>
        </span>
      </motion.div>

      {/* Workflow */}
      <div className="border border-line bg-bg p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">workflow</p>
          <motion.p
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.9 } } }}
            className="font-mono text-[11px] text-accent"
          >
            14 days · 3 phases
          </motion.p>
        </div>
        <ol className="mt-3 space-y-3">
          {phases.map((p, i) => (
            <motion.li
              key={p.name}
              variants={{
                hidden: { opacity: 0, x: -8 },
                show: { opacity: 1, x: 0, transition: { delay: 0.9 + i * 0.22, duration: 0.5, ease: EASE_OUT } },
              }}
            >
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-fg">
                  <span className="font-mono text-xs text-subtle">{i + 1}.</span> {p.name}
                </span>
                <span className="font-mono text-xs text-muted">{p.days}</span>
              </div>
              <p className="font-mono text-[11px] text-subtle">{p.deliverable}</p>
              <div className="relative mt-1.5 h-1.5 rounded-full bg-line">
                <motion.span
                  className="absolute inset-y-0 rounded-full bg-accent"
                  style={{ left: `${p.start}%`, width: `${p.width}%`, originX: 0 }}
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { delay: 1.1 + i * 0.22, duration: 0.7, ease: EASE_OUT } },
                  }}
                />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.figure>
  );
}
