"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme-toggle";
import { EASE_OUT } from "./motion";

const sections = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "contact", label: "contact" },
];

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Nav() {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Thin accent line under the nav that tracks how far down the page you are.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  // Highlight the section currently in the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const resume = site.resumes[0];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <motion.span
        aria-hidden="true"
        style={{ scaleX: progress, originX: 0 }}
        className={cn(
          "absolute inset-x-0 -bottom-px h-px bg-accent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3 font-mono text-sm text-fg"
        >
          {site.available ? (
            <span className="relative flex size-2" title={site.availability}>
              <span className="absolute inset-0 rounded-full bg-accent opacity-0" />
              <span className="relative size-2 rounded-full bg-accent" />
              <span className="sr-only">{site.availability}.</span>
            </span>
          ) : null}
          <span className="link-underline">{site.shortName}</span>
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "relative px-3 py-2 font-mono text-sm transition-colors duration-200",
                    active === s.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === s.id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                    />
                  ) : null}
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={resume.href}
            target="_blank"
            rel="noopener"
            className="ml-3 inline-flex items-center gap-1.5 border border-accent px-3.5 py-2 font-mono text-xs text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-fg"
          >
            resume
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          <ThemeToggle className="ml-1" />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-accent-soft"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden md:hidden"
          >
            <ul className="px-5 pb-6 pt-2">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: EASE_OUT }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-4 font-display text-4xl font-semibold tracking-[-0.03em] text-fg"
                  >
                    {s.label}
                    <span aria-hidden="true" className="font-mono text-xs text-subtle">
                      #{s.id}
                    </span>
                  </a>
                </motion.li>
              ))}
              <li className="flex flex-wrap gap-3 pt-6">
                {site.resumes.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-accent px-4 font-mono text-sm text-accent"
                  >
                    {r.label.toLowerCase()}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ))}
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
