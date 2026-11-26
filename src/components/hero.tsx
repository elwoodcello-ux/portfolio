"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { heroMeta, heroPhrases, site } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { RotatingPhrase } from "./rotating-phrase";
import { EASE_OUT } from "./motion";
import { Container } from "./ui";

const rise = {
  hidden: { y: "108%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1, delay: 0.08 + i * 0.09, ease: EASE_OUT } }),
};
const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: EASE_OUT } }),
};

export function Hero() {
  const words = site.name.split(" ");
  const resume = site.resumes[0];

  // As the hero scrolls away, the name narrows (Hubot Sans width axis), drifts up and dims.
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const wdth = useTransform(scrollYProgress, [0, 0.8], [115, 72]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const nameOpacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.12]);
  const lineY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fvs = useMotionTemplate`"wdth" ${wdth}`;
  const nameStyle = reduce ? undefined : { fontVariationSettings: fvs, y: nameY, opacity: nameOpacity };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-name"
      className="relative pb-20 pt-28 sm:pb-28 sm:pt-32"
    >
      <Container>
        <motion.div initial="hidden" animate="show" className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            {site.available ? (
              <motion.p variants={fade} custom={0} className="mb-7 flex items-center gap-2.5 font-mono text-xs text-subtle sm:mb-8">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {site.availability.toLowerCase()}
              </motion.p>
            ) : null}

            <motion.h1
              id="hero-name"
              style={nameStyle}
              className="font-display text-[clamp(4rem,13vw,9rem)] font-bold leading-[0.86] tracking-[-0.04em] text-fg [font-variation-settings:'wdth'_115]"
            >
              {words.map((word, i) => (
                <span key={word} className="block overflow-hidden pb-[0.06em]">
                  <motion.span variants={rise} custom={i} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={fade}
              custom={0.4}
              style={reduce ? undefined : { y: lineY }}
              className="mt-7 max-w-4xl text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium leading-[1.12] tracking-[-0.02em] text-fg sm:mt-10"
            >
              <span className="sr-only">
                Andrew builds software that freelancers pay for, that speaks in your own voice, that
                translates a live call, and that finds signal in 315,000 rows.
              </span>
              <span aria-hidden="true">Builds software</span>{" "}
              <span className="block text-muted">
                <RotatingPhrase phrases={heroPhrases} />
              </span>
            </motion.p>
          </div>

          {site.photo ? (
            // Small and above the name on phones; tall portrait beside it on desktop, with a gentle parallax.
            <motion.div variants={fade} custom={0.5} className="order-first lg:order-none">
              <motion.div style={reduce ? undefined : { y: photoY }}>
                <Image
                  src={site.photo}
                  alt={`Headshot of ${site.name}`}
                  width={960}
                  height={1200}
                  priority
                  sizes="(min-width: 1280px) 300px, (min-width: 1024px) 260px, 112px"
                  className="h-[140px] w-[112px] border border-line object-cover lg:h-[325px] lg:w-[260px] xl:h-[375px] xl:w-[300px]"
                />
              </motion.div>
            </motion.div>
          ) : null}
        </motion.div>

        <motion.dl
          initial="hidden"
          animate="show"
          variants={fade}
          custom={0.55}
          className="mt-12 grid border-y border-line sm:mt-14 sm:grid-cols-3"
        >
          {heroMeta.map((m, i) => (
            <div
              key={m.label}
              className={
                "py-5 sm:px-6 sm:first:pl-0 " +
                (i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : "")
              }
            >
              <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">{m.label}</dt>
              <dd className="mt-2 text-base font-medium text-fg">{m.value}</dd>
              <dd className="mt-0.5 font-mono text-xs text-subtle">{m.note}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fade}
          custom={0.7}
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <a
            href={resume.href}
            target="_blank"
            rel="noopener"
            className="group inline-flex min-h-11 items-center gap-2 bg-accent px-5 text-sm font-semibold text-accent-fg transition-opacity duration-150 hover:opacity-90"
          >
            View resume
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a href="#projects" className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg">
            <span className="link-underline">See my work</span>
            <ArrowDown
              className="size-4 text-subtle transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>
          <div className="flex items-center gap-1 sm:ml-auto">
            <IconLink href={site.links.github} label="GitHub">
              <GitHubIcon className="size-[18px]" />
            </IconLink>
            <IconLink href={site.links.linkedin} label="LinkedIn">
              <LinkedInIcon className="size-[18px]" />
            </IconLink>
            <IconLink href={`mailto:${site.email}`} label={`Email ${site.email}`}>
              <Mail className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            </IconLink>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="grid size-11 place-items-center text-subtle transition-colors duration-150 hover:text-fg"
    >
      {children}
    </a>
  );
}
