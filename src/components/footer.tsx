"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { site } from "@/content/site";
import { Container } from "./ui";

function formatTime() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());
}

export function Footer() {
  // Time + year are filled in on the client so the static page stays cacheable.
  const [time, setTime] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(formatTime());
      setYear(new Date().getFullYear());
    };
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-4 py-8 font-mono text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year ?? ""} {site.name} · built with Next.js, hosted on Vercel
        </p>
        <div className="flex items-center gap-6">
          <p>
            {site.location}
            {time ? <span className="text-muted"> · {time}</span> : null}
          </p>
          <a href="#top" className="group inline-flex min-h-11 items-center gap-1.5 hover:text-fg">
            back to top
            <ArrowUp
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </Container>
    </footer>
  );
}
