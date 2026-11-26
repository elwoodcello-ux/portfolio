"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      className={cn(
        "grid size-11 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-fg",
        className,
      )}
    >
      {/* Icons swap with CSS so the server and client render the same markup. */}
      <Moon className="size-[18px] dark:hidden" strokeWidth={1.75} aria-hidden="true" />
      <Sun className="hidden size-[18px] dark:block" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
