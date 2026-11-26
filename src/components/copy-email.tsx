"use client";

import { useState } from "react";
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
        className="group inline-flex min-h-12 items-center gap-2.5 bg-accent px-5 font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Mail className="size-4" aria-hidden="true" />
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-12 items-center gap-2 border border-line-strong px-4 font-mono text-sm text-muted transition-colors duration-200 hover:border-fg hover:text-fg"
      >
        {copied ? (
          <Check className="size-4 text-accent" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {copied ? "copied" : "copy"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
