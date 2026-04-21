"use client";

import { useState } from "react";
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

  return (
    <div className={cn("", className)}>
      <div
        role="tablist"
        className="flex items-center gap-1 border-b border-quicx-line"
      >
        {tabs.map((t) => {
          const isActive = t.id === active.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "relative -mb-px px-3.5 py-2 font-[family-name:var(--font-barlow-condensed)] text-[13px] font-semibold uppercase tracking-[0.18em] transition",
                isActive
                  ? "text-quicx-text"
                  : "text-quicx-dim hover:text-quicx-muted"
              )}
            >
              {t.label}
              {isActive && (
                <span className="absolute inset-x-2 -bottom-px h-[2px] bg-quicx-orange" />
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-4">{active.content}</div>
    </div>
  );
}
