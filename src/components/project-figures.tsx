"use client";

import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "./motion";

/* Shared reveal: children stagger in once the figure scrolls into view. */
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};
const grow = (delay = 0): Variants => ({
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, delay, ease: EASE_OUT } },
});

const label = "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle";
const panel = "border border-line bg-bg p-4";

/* ------------------------------------------------------------------ */
/* Chicago: the real pipeline, with the real numbers from the analysis */
/* ------------------------------------------------------------------ */
export function ChicagoFigure() {
  return (
    <motion.figure
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className={panel}
    >
      <figcaption className="flex items-baseline justify-between">
        <span className={label}>pipeline</span>
        <span className="font-mono text-[11px] text-subtle">real numbers</span>
      </figcaption>

      <ol className="mt-4 space-y-5">
        <motion.li variants={item}>
          <Step n={1} value="315,000+" text="raw municipal inspection records" />
          {/* Thin segmented bar: the 16% caught as non-outcome rows is the point, so it carries the accent. */}
          <div
            role="img"
            aria-label="84% of rows kept, 16% non-outcome statuses filtered out"
            className="mt-2.5 flex h-2 gap-0.5"
          >
            <motion.span variants={grow(0.1)} style={{ originX: 0 }} className="h-full w-[84%] rounded-full bg-line-strong" title="84% kept" />
            <motion.span variants={grow(0.35)} style={{ originX: 0 }} className="h-full w-[16%] rounded-full bg-accent" title="16% non-outcome statuses" />
          </div>
          <p className="mt-2 flex items-center gap-2 text-[13px] text-muted">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            16% non-outcome statuses and 831 placeholder license numbers caught and filtered out
          </p>
        </motion.li>

        <motion.li variants={item}>
          <Step n={2} value="373,000" text="rows in the normalized violations table, joinable to violation codes" />
        </motion.li>

        <motion.li variants={item}>
          <Step n={3} value="87.4%" text="of failed establishments passed their next inspection, 14.4 days later on average" />
          {/* Meter: one ratio against 100%; the track is a lighter step of the same hue. */}
          <div
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={87.4}
            aria-label="Passed next inspection"
            title="87.4% passed their next inspection"
            className="mt-2.5 h-2 rounded-full bg-accent-soft"
          >
            <motion.span variants={grow(0.2)} style={{ originX: 0 }} className="block h-full w-[87.4%] rounded-full bg-accent" />
          </div>
          <p className="mt-2 text-[13px] text-muted">Recovery was flat across all three city risk tiers.</p>
        </motion.li>
      </ol>
    </motion.figure>
  );
}

function Step({ n, value, text }: { n: number; value: string; text: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[11px] text-subtle">{n}.</span>
      <p className="text-sm text-muted">
        <span className="mr-1.5 font-display text-lg font-semibold tabular-nums tracking-[-0.01em] text-fg">{value}</span>
        {text}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fluid: the two optimisations, illustrated (relative, not measured)   */
/* ------------------------------------------------------------------ */
export function FluidFigure() {
  return (
    <motion.figure
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className="grid gap-3 sm:grid-cols-2"
      aria-label="Illustration of Fluid's two optimisations: audio plays while still downloading, halving the wait; each sentence is translated once per language, not once per listener."
    >
      {/* Wait before hearing the translation: before vs after (relative). */}
      <motion.div variants={item} className={panel}>
        <p className={label}>time to first sound</p>
        <div className="mt-4 space-y-3.5">
          <Bar name="before" note="wait for the whole clip" width="100%" tone="muted" />
          <Bar name="after" note="play while it downloads" width="50%" tone="accent" />
        </div>
        <p className="mt-3 text-[13px] text-muted">
          The original caption also shows instantly, before the translation lands.
        </p>
      </motion.div>

      {/* Fan-out: one sentence, translated once per language. */}
      <motion.div variants={item} className={panel}>
        <p className={label}>translation calls</p>
        <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2.5 text-sm">
          <span className="col-span-2 mb-1 text-muted">1 sentence · 4 listeners · 2 languages</span>
          {[
            { lang: "es", people: 2 },
            { lang: "fr", people: 2 },
          ].map((row, i) => (
            <FanRow key={row.lang} lang={row.lang} people={row.people} delay={0.2 + i * 0.15} />
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted">
          <span className="font-medium text-fg">2 calls, not 4.</span> Cost scales with languages, not people.
        </p>
      </motion.div>
    </motion.figure>
  );
}

function Bar({ name, note, width, tone }: { name: string; note: string; width: string; tone: "muted" | "accent" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-fg">{name}</span>
        <span className="font-mono text-[11px] text-subtle">{note}</span>
      </div>
      <div className="mt-1.5 h-2">
        <motion.span
          variants={grow(tone === "accent" ? 0.35 : 0.1)}
          style={{ originX: 0, width }}
          className={`block h-full rounded-full ${tone === "accent" ? "bg-accent" : "bg-line-strong"}`}
        />
      </div>
    </div>
  );
}

function FanRow({ lang, people, delay }: { lang: string; people: number; delay: number }) {
  return (
    <>
      <motion.span
        variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { delay, duration: 0.4, ease: EASE_OUT } } }}
        className="grid h-7 min-w-10 place-items-center border border-accent px-2 font-mono text-[11px] text-accent"
        title={`One translation call for ${people} listeners`}
      >
        {lang}
      </motion.span>
      <span className="flex items-center gap-2">
        <motion.span
          aria-hidden="true"
          variants={grow(delay + 0.1)}
          style={{ originX: 0 }}
          className="h-px w-8 bg-line-strong"
        />
        {Array.from({ length: people }).map((_, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: delay + 0.25 + i * 0.08 } } }}
            className="size-2.5 rounded-full bg-fg/70"
          />
        ))}
        <span className="font-mono text-[11px] text-subtle">{people} listeners</span>
      </span>
    </>
  );
}
