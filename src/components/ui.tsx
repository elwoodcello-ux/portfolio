import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GrowLine, RiseText } from "./scroll-fx";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

/** Mono label + hairline + optional count, then a large display headline. */
export function SectionHeading({
  id,
  label,
  meta,
  title,
}: {
  id: string;
  label: string;
  meta?: string;
  title?: string;
}) {
  return (
    <header className="mb-14 sm:mb-20">
      <div className="flex items-center gap-4">
        <h2
          id={`${id}-heading`}
          className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-subtle"
        >
          {label}
        </h2>
        <GrowLine className="h-px flex-1 bg-line" />
        {meta ? <span className="font-mono text-xs text-subtle">{meta}</span> : null}
      </div>
      {title ? (
        <p className="mt-7 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4.25rem)] font-semibold leading-[1] tracking-[-0.03em] text-fg">
          <RiseText text={title} />
        </p>
      ) : null}
    </header>
  );
}

/** A plain, slash-separated list of technologies. */
export function TechList({ items, label, className }: { items: string[]; label?: string; className?: string }) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-subtle", className)}>
      {items.map((t, i) => (
        <li key={t} className="flex gap-2">
          {t}
          {i < items.length - 1 ? (
            <span aria-hidden="true" className="text-line-strong">
              /
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
