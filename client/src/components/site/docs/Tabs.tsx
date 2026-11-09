"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export function Tabs({
  tabs,
  defaultId,
  className,
}: {
  tabs: Tab[];
  defaultId?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, delta: number) => {
    const next = (from + delta + tabs.length) % tabs.length;
    setActiveId(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" className="flex items-center gap-5 border-b border-quicx-line">
        {tabs.map((t, i) => {
          const isActive = t.id === active.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${base}-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${base}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(t.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") move(i, 1);
                if (e.key === "ArrowLeft") move(i, -1);
              }}
              className={cn(
                "relative -mb-px border-b-2 pb-2.5 pt-1 text-[14px] font-medium transition-colors",
                isActive
                  ? "border-quicx-orange text-quicx-text"
                  : "border-transparent text-quicx-dim hover:text-quicx-body"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active.id}`}
        className="pt-4"
      >
        {active.content}
      </div>
    </div>
  );
}
