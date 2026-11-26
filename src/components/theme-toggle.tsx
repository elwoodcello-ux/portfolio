"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export type Theme = "light" | "dark";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Flip light/dark and remember the choice. Returns the new theme. */
export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode: the toggle still works for this visit */
  }
  return next;
}

// Icon cross-fade: both icons stay in the DOM and swap with opacity, scale and blur.
const iconBase =
  "absolute size-[18px] transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
const iconShown = "opacity-100 scale-100 blur-0";
const iconHidden = "opacity-0 scale-[0.25] blur-[4px]";

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between light and dark mode"
      className={cn(
        "relative grid size-11 place-items-center rounded-full text-muted transition-[color,background-color,scale] duration-200 hover:bg-accent-soft hover:text-fg active:scale-[0.96]",
        className,
      )}
    >
      {/* Swapped with CSS so the server and client render the same markup. */}
      <Moon className={cn(iconBase, iconShown, "dark:opacity-0 dark:scale-[0.25] dark:blur-[4px]")} strokeWidth={1.75} aria-hidden="true" />
      <Sun className={cn(iconBase, iconHidden, "dark:opacity-100 dark:scale-100 dark:blur-0")} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
