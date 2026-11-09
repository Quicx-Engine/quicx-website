"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DocsNavGroup } from "@/components/site/docs/DocsSidebar";

/** Previous / next page, in sidebar order, at the foot of every docs page. */
export function DocsPager({ groups }: { groups: DocsNavGroup[] }) {
  const pathname = usePathname();
  const slug = pathname?.split("/")[2] ?? "";
  const flat = groups.flatMap((g) => g.items.map((item) => ({ ...item, group: g.label })));
  const i = flat.findIndex((item) => item.id === slug);
  if (i === -1) return null;
  const prev = flat[i - 1];
  const next = flat[i + 1];

  return (
    <nav
      aria-label="Previous and next page"
      className="mt-16 grid grid-cols-1 gap-3 border-t border-quicx-line pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.id}`}
          className="group flex flex-col gap-1.5 rounded-[3px] border border-quicx-line px-5 py-4 transition-colors hover:border-quicx-line-strong hover:bg-white/[0.02]"
        >
          <span className="flex items-center gap-1.5 text-[13px] text-quicx-dim">
            <ArrowLeft aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="text-[16px] font-semibold text-quicx-text">{prev.label}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link
          href={`/docs/${next.id}`}
          className="group flex flex-col items-end gap-1.5 rounded-[3px] border border-quicx-line px-5 py-4 text-right transition-colors hover:border-quicx-line-strong hover:bg-white/[0.02]"
        >
          <span className="flex items-center gap-1.5 text-[13px] text-quicx-dim">
            Next
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-[16px] font-semibold text-quicx-text">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}
