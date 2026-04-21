"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type DocsNavGroup = {
  label: string;
  items: { id: string; label: string }[];
};

export function DocsSidebar({ groups }: { groups: DocsNavGroup[] }) {
  const [activeId, setActiveId] = useState<string>(groups[0]?.items[0]?.id);

  // Scroll-spy: highlight the section closest to the top of the viewport.
  useEffect(() => {
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (els.length === 0) return;

    const pickActive = () => {
      // Use the header offset (sticky header is 64px) + a little breathing room
      const threshold = 120;
      let current = els[0].id;
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) current = el.id;
        else break;
      }
      setActiveId(current);
    };

    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    return () => {
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, [groups]);

  return (
    <nav
      aria-label="Documentation"
      className="sticky top-24 hidden w-64 shrink-0 self-start lg:block"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="size-1.5 rotate-45 bg-quicx-orange" />
        <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.3em] text-quicx-orange-bright">
          Documentation
        </span>
      </div>

      <ul className="space-y-6 text-[13.5px]">
        {groups.map((g) => (
          <li key={g.label}>
            <h4 className="mb-2 font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.26em] text-quicx-dim">
              §&nbsp;{g.label}
            </h4>
            <ul className="space-y-0.5 border-l border-quicx-line">
              {g.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={cn(
                        "relative -ml-px block border-l px-3 py-1.5 transition",
                        isActive
                          ? "border-quicx-orange text-quicx-text"
                          : "border-transparent text-quicx-muted hover:border-white/20 hover:text-quicx-text"
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
