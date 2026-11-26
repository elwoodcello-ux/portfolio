"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="group inline-flex min-h-12 items-center gap-2.5 bg-accent px-5 font-medium text-accent-fg transition-[opacity,scale] duration-150 hover:opacity-90 active:scale-[0.96]"
      >
        <Mail className="size-4" aria-hidden="true" />
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-12 items-center gap-2 border border-line-strong px-4 font-mono text-sm text-muted transition-[color,border-color,scale] duration-150 hover:border-fg hover:text-fg active:scale-[0.96]"
      >
        <span className="relative grid size-4 place-items-center">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={copied ? "check" : "copy"}
              className="grid place-items-center"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {copied ? <Check className="size-4 text-accent" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            </motion.span>
          </AnimatePresence>
        </span>
        {copied ? "copied" : "copy"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
