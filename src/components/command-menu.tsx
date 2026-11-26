"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy, CornerDownLeft, FileText, Mail, Moon, Search, Sun } from "lucide-react";
import { projects, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { EASE_OUT } from "./motion";
import { lockScroll, scrollToSection } from "./scroll-fx";
import { currentTheme, toggleTheme, type Theme } from "./theme-toggle";

/* ------------------------------------------------------------------ */
/* ⌘K / Ctrl+K command menu: copy email, open resumes and links,       */
/* jump to a section, switch theme. Fully keyboard driven.              */
/* ------------------------------------------------------------------ */

const OPEN_EVENT = "open-command-menu";

/** Opens the menu from anywhere (e.g. the nav button). */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** "⌘" on Apple devices, "Ctrl" elsewhere. Server render assumes ⌘ and corrects after hydration. */
export function useModKey() {
  return useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘" : "Ctrl "),
    () => "⌘",
  );
}

type Group = "Actions" | "Links" | "Go to";
type Item = {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  /** Return "stay" to keep the menu open briefly (e.g. to show "Copied"). */
  run: () => void | "stay";
};

const iconCls = "size-4";
const openTab = (href: string): void => {
  window.open(href, "_blank", "noopener");
};

function buildItems(theme: Theme, onCopied: () => void): Item[] {
  const projectLinks: Item[] = projects.flatMap((p) =>
    (p.links ?? []).map((l) => ({
      id: `link-${p.name}-${l.href}`,
      group: "Links" as const,
      label: p.name,
      hint: l.label,
      keywords: `${p.tagline} project`,
      icon: <ArrowUpRight className={iconCls} aria-hidden="true" />,
      run: () => openTab(l.href),
    })),
  );

  return [
    {
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      hint: site.email,
      keywords: "contact mail clipboard",
      icon: <Copy className={iconCls} aria-hidden="true" />,
      run: () => {
        navigator.clipboard?.writeText(site.email).catch(() => {});
        onCopied();
        return "stay";
      },
    },
    {
      id: "send-email",
      group: "Actions",
      label: "Send an email",
      keywords: "contact mail message",
      icon: <Mail className={iconCls} aria-hidden="true" />,
      run: () => {
        window.location.href = `mailto:${site.email}`;
      },
    },
    ...site.resumes.map((r) => ({
      id: `resume-${r.href}`,
      group: "Actions" as const,
      label: `Open ${r.label.toLowerCase()}`,
      hint: "PDF",
      keywords: "cv resume download pdf",
      icon: <FileText className={iconCls} aria-hidden="true" />,
      run: () => openTab(r.href),
    })),
    {
      id: "theme",
      group: "Actions",
      label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      keywords: "theme appearance dark light mode",
      icon: theme === "dark" ? <Sun className={iconCls} aria-hidden="true" /> : <Moon className={iconCls} aria-hidden="true" />,
      run: () => {
        toggleTheme();
      },
    },
    {
      id: "linkedin",
      group: "Links",
      label: "LinkedIn",
      hint: site.links.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      keywords: "social profile",
      icon: <LinkedInIcon className={iconCls} />,
      run: () => openTab(site.links.linkedin),
    },
    {
      id: "github",
      group: "Links",
      label: "GitHub",
      hint: site.links.github.replace(/^https?:\/\//, ""),
      keywords: "code repos social",
      icon: <GitHubIcon className={iconCls} />,
      run: () => openTab(site.links.github),
    },
    ...projectLinks,
    ...(["about", "experience", "projects", "contact"] as const).map((s) => ({
      id: `goto-${s}`,
      group: "Go to" as const,
      label: s[0].toUpperCase() + s.slice(1),
      keywords: "section jump scroll navigate",
      icon: <ArrowRight className={iconCls} aria-hidden="true" />,
      run: () => scrollToSection(s),
    })),
  ];
}

const GROUPS: Group[] = ["Actions", "Links", "Go to"];

/** Items that match, in the same order they are displayed (grouped). */
function filterItems(items: Item[], query: string) {
  return GROUPS.flatMap((g) => items.filter((i) => i.group === g && matches(i, query)));
}

/** Highlight the row whose name best matches what was typed ("contact" → Go to Contact). */
function bestIndex(results: Item[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  let best = 0;
  let bestScore = -1;
  results.forEach((item, i) => {
    const label = item.label.toLowerCase();
    const score = label === q ? 4 : label.startsWith(q) ? 3 : label.includes(q) ? 2 : (item.hint ?? "").toLowerCase().includes(q) ? 1 : 0;
    if (score > bestScore) {
      best = i;
      bestScore = score;
    }
  });
  return best;
}

function matches(item: Item, query: string) {
  const hay = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<Theme>("dark");
  const [copied, setCopied] = useState(false);
  // Where keyboard focus goes back to when the menu closes.
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);

  const show = useCallback(() => {
    setReturnTo(document.activeElement as HTMLElement | null);
    setTheme(currentTheme());
    setQuery("");
    setActive(0);
    setCopied(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnTo?.focus?.();
  }, [returnTo]);

  // ⌘K / Ctrl+K toggles; "/" opens when not typing somewhere else.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest?.("input, textarea, [contenteditable]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      } else if (e.key === "/" && !open && !typing) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, show, close]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  const items = useMemo(() => buildItems(theme, () => setCopied(true)), [theme]);
  const results = useMemo(() => filterItems(items, query), [items, query]);
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const activeItem = results[activeIndex];

  // Keep the highlighted row visible while arrowing through a long list.
  useEffect(() => {
    if (activeItem) document.getElementById(`cmdk-${activeItem.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeItem]);

  function runItem(item: Item | undefined) {
    if (!item) return;
    lockScroll(false); // release the page first so "Go to" can scroll it
    const result = item.run();
    if (result === "stay") setTimeout(close, 750);
    else close();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runItem(activeItem);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    }
  }


  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cmdk"
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="relative w-full max-w-xl bg-bg-elev shadow-[0_0_0_1px_var(--line-strong),0_16px_40px_-8px_rgb(0_0_0/0.35),0_4px_12px_-4px_rgb(0_0_0/0.25)]"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-subtle" aria-hidden="true" />
              <input
                autoFocus
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-autocomplete="list"
                aria-activedescendant={activeItem ? `cmdk-${activeItem.id}` : undefined}
                aria-label="Search commands"
                placeholder="Search or jump to…"
                value={query}
                onChange={(e) => {
                  const q = e.target.value;
                  setQuery(q);
                  setActive(bestIndex(filterItems(items, q), q));
                }}
                onKeyDown={onKeyDown}
                className="h-14 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-subtle"
              />
              <kbd className="font-mono text-[11px] text-subtle">esc</kbd>
            </div>

            <ul id="cmdk-list" role="listbox" aria-label="Commands" className="max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 ? (
                <li role="presentation" className="px-3 py-8 text-center text-sm text-subtle">
                  Nothing matches “{query}”. Try “resume”, “email” or “projects”.
                </li>
              ) : (
                GROUPS.map((g) => {
                  const inGroup = results.filter((r) => r.group === g);
                  if (!inGroup.length) return null;
                  return (
                    <li key={g} role="presentation">
                      <p className="px-3 pb-1.5 pt-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">{g}</p>
                      <ul role="presentation">
                        {inGroup.map((item) => {
                          const isActive = item === activeItem;
                          const showCopied = item.id === "copy-email" && copied;
                          return (
                            <li
                              key={item.id}
                              id={`cmdk-${item.id}`}
                              role="option"
                              aria-selected={isActive}
                              onMouseMove={() => setActive(results.indexOf(item))}
                              onClick={() => runItem(item)}
                              className={cn(
                                "relative flex min-h-11 cursor-pointer items-center gap-3 px-3 text-[15px] transition-colors duration-100",
                                isActive ? "bg-accent-soft text-fg" : "text-muted",
                              )}
                            >
                              {isActive ? <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 bg-accent" /> : null}
                              <span className="relative grid size-5 shrink-0 place-items-center text-subtle">
                                <AnimatePresence initial={false} mode="popLayout">
                                  <motion.span
                                    key={showCopied ? "check" : "icon"}
                                    className={cn("grid place-items-center", showCopied && "text-accent")}
                                    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                                  >
                                    {showCopied ? <Check className={iconCls} aria-hidden="true" /> : item.icon}
                                  </motion.span>
                                </AnimatePresence>
                              </span>
                              <span className="min-w-0 flex-1 truncate">{showCopied ? "Copied to clipboard" : item.label}</span>
                              {item.hint ? (
                                <span className="hidden truncate font-mono text-xs text-subtle sm:block">{item.hint}</span>
                              ) : null}
                              <CornerDownLeft
                                className={cn("size-3.5 shrink-0 text-subtle", isActive ? "opacity-100" : "opacity-0")}
                                aria-hidden="true"
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] text-subtle">
              <span>↑↓ move</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** The small "⌘K" button in the nav. */
export function CommandTrigger({ className }: { className?: string }) {
  const mod = useModKey();
  return (
    <button
      type="button"
      onClick={openCommandMenu}
      aria-label="Open command menu"
      aria-keyshortcuts="Meta+K Control+K"
      title="Search and shortcuts"
      className={cn(
        "inline-flex h-9 min-w-10 items-center justify-center gap-0.5 border border-line px-2 font-mono text-[11px] text-subtle transition-[color,border-color,scale] duration-150 hover:border-line-strong hover:text-fg active:scale-[0.96]",
        className,
      )}
    >
      {mod}K
    </button>
  );
}
