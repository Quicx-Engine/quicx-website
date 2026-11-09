"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocEntry = { id: string; label: string };

export function DocsTOC({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (entries.length === 0) return;
    const els = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);

    const pick = () => {
      let current = "";
      for (const el of els) {
        if (el.getBoundingClientRect().top < 140) current = el.id;
        else break;
      }
      setActiveId(current);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    return () => window.removeEventListener("scroll", pick);
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page" className="sticky top-[calc(3.5rem+2.5rem)] max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h2 className="mb-3 caps-label text-quicx-dim">On this page</h2>
      <ul className="border-l border-quicx-line">
        {entries.map((e) => {
          const isActive = activeId === e.id;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(ev) => {
                  ev.preventDefault();
                  const el = document.getElementById(e.id);
                  if (el) {
                    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    window.scrollTo({
                      top: el.getBoundingClientRect().top + window.scrollY - 88,
                      behavior: reduce ? "auto" : "smooth",
                    });
                    history.replaceState(null, "", `#${e.id}`);
                  }
                }}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-3.5 text-[13.5px] leading-snug transition-colors",
                  isActive
                    ? "border-quicx-orange text-quicx-text"
                    : "border-transparent text-quicx-dim hover:text-quicx-body"
                )}
              >
                {e.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
