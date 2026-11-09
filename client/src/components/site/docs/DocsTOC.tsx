"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TocEntry = { id: string; label: string };

export function DocsTOC({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  // One orange marker that travels down the rail with the reader.
  const [marker, setMarker] = useState<{ y: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) {
      setMarker(null);
      return;
    }
    const link = list.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`);
    if (link) setMarker({ y: link.offsetTop, h: link.offsetHeight });
  }, [activeId, entries]);

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
      <ul ref={listRef} className="relative border-l border-quicx-line">
        {marker && (
          <span
            aria-hidden
            className="toc-marker pointer-events-none absolute -left-px top-0 h-px w-px origin-top bg-quicx-orange"
            style={{ transform: `translateY(${marker.y}px) scaleY(${marker.h})` }}
          />
        )}
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
                  "-ml-px block border-l border-transparent py-1.5 pl-3.5 text-[13.5px] leading-snug transition-colors duration-200",
                  isActive ? "text-quicx-text" : "text-quicx-dim hover:text-quicx-body"
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
