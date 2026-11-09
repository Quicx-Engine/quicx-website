"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
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
  // The orange underline is one element that slides to the selected tab, so the
  // eye follows the change instead of seeing one line vanish and another appear.
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active.id));

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[activeIndex];
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [activeIndex, tabs.length]);

  const move = (from: number, delta: number) => {
    const next = (from + delta + tabs.length) % tabs.length;
    setActiveId(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" className="relative flex items-center gap-5 border-b border-quicx-line">
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
                "relative -mb-px border-b-2 pb-2.5 pt-1 text-[14px] font-medium transition-colors duration-200",
                isActive
                  ? bar
                    ? "border-transparent text-quicx-text"
                    : "border-quicx-orange text-quicx-text"
                  : "border-transparent text-quicx-dim hover:text-quicx-body"
              )}
            >
              {t.label}
            </button>
          );
        })}
        {bar && (
          <span
            aria-hidden
            className="tab-indicator pointer-events-none absolute -bottom-px left-0 h-0.5 w-px origin-left bg-quicx-orange"
            style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w})` }}
          />
        )}
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active.id}`}
        className="pt-4"
      >
        <div key={active.id} className="tab-panel-in">
          {active.content}
        </div>
      </div>
    </div>
  );
}
