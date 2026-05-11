"use client";

import { cn } from "@/lib/utils";
import { DocsSearch } from "./DocsSearch";
import { X } from "lucide-react";

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
  isOpen,
  onClose,
}: {
  groups: DocsNavGroup[];
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  onNavigateTo: (sectionId: string, elementId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        aria-label="Documentation"
        className={cn(
          "fixed bottom-0 left-0 top-[52px] z-[100] w-[260px] overflow-y-auto border-r border-quicx-line bg-quicx-bg pb-12 pt-6 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-2 px-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rotate-45 bg-quicx-orange" />
              <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.3em] text-quicx-orange-bright">
                Documentation
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center text-quicx-muted transition hover:text-quicx-text lg:hidden"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
          </div>
          <DocsSearch
            groups={groups}
            onNavigateTo={(s, e) => {
              onNavigateTo(s, e);
              onClose();
            }}
          />
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
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
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
    </>
  );
}
