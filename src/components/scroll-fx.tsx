"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EASE_OUT } from "./motion";

/* ------------------------------------------------------------------ */
/* Smooth, slightly weighted scrolling. Off for reduced-motion users   */
/* (Lenis honours prefers-reduced-motion) and native on touch screens. */
/* ------------------------------------------------------------------ */
let lenisInstance: Lenis | null = null;

/** Smoothly scroll to a section by id (used by the command menu). Falls back to native scrolling. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: -72, force: true });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Freeze page scrolling while an overlay (the command menu) is open. */
export function lockScroll(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      autoRaf: true,
      anchors: { offset: -72 },
      stopInertiaOnNavigate: true,
    });
    lenisInstance = lenis;
    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return null;
}

/* ------------------------------------------------------------------ */
/* Headings whose letterforms widen as they scroll into view.          */
/* The width axis of Hubot Sans is the site's motion signature.        */
/* ------------------------------------------------------------------ */
const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

export function ScrollWidth({
  as = "p",
  from = 75,
  to = 115,
  offset = ["start end", "center 55%"],
  className,
  id,
  children,
}: {
  as?: keyof typeof tags;
  from?: number;
  to?: number;
  offset?: NonNullable<Parameters<typeof useScroll>[0]>["offset"];
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const wdth = useTransform(scrollYProgress, [0, 1], [from, to]);
  const fvs = useMotionTemplate`"wdth" ${wdth}`;
  const Tag = tags[as];
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={reduce ? { fontVariationSettings: `"wdth" ${to}` } : { fontVariationSettings: fvs }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* A paragraph that lights up word by word as you read down the page.  */
/* Wrap a phrase in [[double brackets]] to emphasise it.               */
/* ------------------------------------------------------------------ */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 52%"] });

  // Tokenise into words, remembering which ones sit inside [[ ]].
  const words: { w: string; em: boolean }[] = [];
  let em = false;
  for (const raw of text.split(" ")) {
    let w = raw;
    const opens = w.startsWith("[[");
    if (opens) {
      em = true;
      w = w.slice(2);
    }
    const closes = w.includes("]]");
    w = w.replace("]]", "");
    words.push({ w, em });
    if (closes) em = false;
  }

  return (
    <p ref={ref} className={className}>
      {words.map(({ w, em }, i) => (
        <Fragment key={i}>
          <Word
            progress={scrollYProgress}
            range={[i / words.length, Math.min(1, (i + 2) / words.length)]}
            static={!!reduce}
            className={em ? "text-accent" : undefined}
          >
            {w}
          </Word>{" "}
        </Fragment>
      ))}
    </p>
  );
}

function Word({
  progress,
  range,
  static: isStatic,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  static: boolean;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span className={className} style={{ opacity: isStatic ? 1 : opacity }}>
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Headline words rise out of a mask when the heading enters view.     */
/* ------------------------------------------------------------------ */
export function RiseText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-top">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "105%" },
                  show: { y: "0%", transition: { duration: 0.9, delay: i * 0.06, ease: EASE_OUT } },
                }}
              >
                {w}
              </motion.span>
            </span>{" "}
          </Fragment>
        ))}
      </span>
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Hairline that draws itself across when it enters view.              */
/* ------------------------------------------------------------------ */
export function GrowLine({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={{ originX: 0 }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: EASE_OUT }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Numbers that count up once when they scroll into view.              */
/* "315k+" → 0…315 + "k+", "87.4%" → 0.0…87.4 + "%". Small numbers and */
/* non-numeric values ("Pro tier") are shown as-is.                    */
/* ------------------------------------------------------------------ */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : NaN;
  const decimals = match?.[2].split(".")[1]?.length ?? 0;
  const animatable = match && target >= 10 && !reduce;
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!animatable || !inView || !match) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(`${match[1]}${v.toFixed(decimals)}${match[3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, animatable]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
