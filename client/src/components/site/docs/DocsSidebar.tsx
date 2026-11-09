"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
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
  isOpen,
  onClose,
}: {
  groups: DocsNavGroup[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith("/docs/")
    ? pathname.slice("/docs/".length).split("/")[0].split("#")[0]
    : groups[0]?.items[0]?.id ?? "";

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[90] bg-black/60 transition-opacity duration-300 lg:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        aria-label="Documentation"
        className={cn(
          "fixed bottom-0 left-0 top-14 z-[100] w-[272px] overflow-y-auto border-r border-quicx-line bg-quicx-bg pb-12 pt-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-7 flex items-center gap-2 px-5">
          <div className="min-w-0 flex-1">
            <DocsSearch groups={groups} onAfterNavigate={onClose} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-[3px] text-quicx-muted transition-colors hover:bg-white/[0.04] hover:text-quicx-text lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <ul className="space-y-7 px-3">
          {groups.map((g) => (
            <li key={g.label}>
              <h2 className="mb-2 px-3 caps-label text-quicx-dim">{g.label}</h2>
              <ul>
                {g.items.map((item) => {
                  const isActive = activeSlug === item.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/docs/${item.id}`}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-[3px] px-3 py-[7px] text-[14.5px] transition-colors",
                          isActive
                            ? "bg-quicx-bg-3 font-medium text-quicx-text"
                            : "text-quicx-muted hover:bg-white/[0.03] hover:text-quicx-text"
                        )}
                      >
                        {item.label}
                        {isActive && <span aria-hidden className="size-1.5 shrink-0 bg-quicx-orange" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mx-6 mt-10 border-t border-quicx-line pt-5 text-[13px] leading-relaxed text-quicx-dim">
          <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-quicx-text">
            <ArrowLeft aria-hidden className="size-3.5" />
            quicx.dev
          </Link>
        </div>
      </nav>
    </>
  );
}
