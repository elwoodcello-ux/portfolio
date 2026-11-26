"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Step = { index: number; length: number; mode: "hold" | "deleting" | "typing" };

const HOLD_MS = 2800;
const DELETE_MS = 20;
const TYPE_MS = 44;

/**
 * Types and deletes each phrase in turn, ending on a blinking caret.
 * The first phrase is fully rendered on the server so there's no empty flash,
 * and the box is sized to the longest phrase so nothing below it jumps.
 */
export function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>({ index: 0, length: phrases[0].length, mode: "hold" });

  useEffect(() => {
    if (reduceMotion) return;
    const phrase = phrases[step.index];
    let delay = HOLD_MS;
    let next: Step = step;

    if (step.mode === "hold") {
      next = { ...step, mode: "deleting" };
    } else if (step.mode === "deleting") {
      delay = step.length === 0 ? 260 : DELETE_MS;
      next =
        step.length > 0
          ? { ...step, length: step.length - 1 }
          : { index: (step.index + 1) % phrases.length, length: 0, mode: "typing" };
    } else {
      delay = TYPE_MS + (phrase[step.length - 1] === " " ? 30 : 0);
      next =
        step.length < phrase.length
          ? { ...step, length: step.length + 1 }
          : { ...step, mode: "hold" };
    }

    const t = setTimeout(() => setStep(next), delay);
    return () => clearTimeout(t);
  }, [step, phrases, reduceMotion]);

  const visible = phrases[step.index].slice(0, step.length);

  return (
    <span className="grid" aria-hidden="true">
      {/* Invisible copies reserve the height of the longest phrase. */}
      {phrases.map((p) => (
        <span key={p} className="invisible col-start-1 row-start-1">
          {p}
          <Caret />
        </span>
      ))}
      <span className="col-start-1 row-start-1">
        {visible}
        <Caret />
      </span>
    </span>
  );
}

function Caret() {
  return (
    <span className="caret-blink ml-[0.08em] inline-block h-[0.9em] w-[0.09em] translate-y-[0.12em] bg-accent align-baseline" />
  );
}
