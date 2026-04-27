"use client";

import { cn } from "@/lib/utils";
import { DocsSearch } from "./DocsSearch";

export type TocEntry = { id: string; label: string };

export type DocsNavItem = {
  id: string;
  label: string;
  toc: TocEntry[];
};

export type DocsNavGroup = {
  label: string;
  items: DocsNavItem[];
};

export function DocsSidebar({
  groups,
  activeSectionId,
  onNavigate,
  onNavigateTo,
}: {
  groups: DocsNavGroup[];
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  onNavigateTo: (sectionId: string, elementId: string) => void;
}) {
  return (
    <nav
      aria-label="Documentation"
      className="fixed bottom-0 left-0 top-[52px] z-[100] w-[260px] overflow-y-auto border-r border-quicx-line bg-quicx-bg pb-12 pt-6"
    >
      <div className="mb-2 px-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="size-1.5 rotate-45 bg-quicx-orange" />
          <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.3em] text-quicx-orange-bright">
            Documentation
          </span>
        </div>
        <DocsSearch groups={groups} onNavigateTo={onNavigateTo} />
      </div>

      <ul className="space-y-5 px-3 text-[13.5px]">
        {groups.map((g) => (
          <li key={g.label}>
            <h4 className="mb-1.5 px-3 font-[family-name:var(--font-barlow-condensed)] text-[10px] uppercase tracking-[0.26em] text-quicx-dim">
              §&nbsp;{g.label}
            </h4>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left text-[13px] transition",
                        isActive
                          ? "border-quicx-orange bg-quicx-orange/[0.06] text-quicx-text"
                          : "border-transparent text-quicx-muted hover:bg-white/[0.03] hover:text-quicx-text"
                      )}
                    >
                      <span
                        className={cn(
                          "size-[5px] shrink-0 rounded-full",
                          isActive ? "bg-quicx-orange" : "bg-current opacity-40"
                        )}
                      />
                      {item.label}
                    </button>
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
