"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocEntry = { id: string; label: string };

export function DocsTOC({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (entries.length === 0) {
      setActiveId("");
      return;
    }
    const els = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);

    const pick = () => {
      let current = "";
      for (const el of els) {
        if (el.getBoundingClientRect().top < 120) current = el.id;
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
    <div className="sticky top-[calc(52px+3.5rem)] max-h-[calc(100vh-120px)] overflow-y-auto">
      <span className="mb-3 block font-[family-name:var(--font-barlow-condensed)] text-[10px] uppercase tracking-[0.28em] text-quicx-dim opacity-70">
        On this page
      </span>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              onClick={(ev) => {
                ev.preventDefault();
                const el = document.getElementById(e.id);
                if (el) {
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 72,
                    behavior: "smooth",
                  });
                }
              }}
              className={cn(
                "block border-l-2 py-[5px] pl-3 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] leading-snug transition",
                activeId === e.id
                  ? "border-quicx-orange text-quicx-orange-bright"
                  : "border-quicx-line text-quicx-dim hover:text-quicx-muted"
              )}
            >
              {e.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
