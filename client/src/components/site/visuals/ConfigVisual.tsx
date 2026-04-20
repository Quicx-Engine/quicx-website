"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Line = { k: string; v: string; comment?: string };

const sections: { title: string; lines: Line[] }[] = [
  {
    title: "[server]",
    lines: [{ k: "port", v: "16381" }],
  },
  {
    title: "[allocator]",
    lines: [
      { k: "pool_size", v: "10485760", comment: "# 10 MB, fully bounded" },
      { k: "class", v: "32, 5" },
      { k: "class", v: "64, 25" },
      { k: "class", v: "128, 30" },
      { k: "class", v: "256, 25" },
      { k: "class", v: "512, 10" },
      { k: "class", v: "1024, 5" },
    ],
  },
];

const classes = [
  { size: "32B", pct: 5 },
  { size: "64B", pct: 25 },
  { size: "128B", pct: 30 },
  { size: "256B", pct: 25 },
  { size: "512B", pct: 10 },
  { size: "1024B", pct: 5 },
];

export function ConfigVisual({ active }: { active: boolean }) {
  const [highlight, setHighlight] = useState<number>(-1);

  useEffect(() => {
    if (!active) {
      const reset = setTimeout(() => setHighlight(-1), 0);
      return () => clearTimeout(reset);
    }
    let i = 0;
    const id = setInterval(() => {
      setHighlight(i % classes.length);
      i += 1;
    }, 600);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="grid h-full grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {/* Config file */}
      <div className="relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] leading-relaxed shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            quicx.toml
          </span>
          <span className="text-[10px] text-quicx-dim">TOML</span>
        </div>
        <div className="flex-1 space-y-3 overflow-hidden px-4 py-3">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="text-quicx-orange-bright">{section.title}</div>
              {section.lines.map((l, i) => (
                <div key={i} className="flex flex-wrap gap-x-2">
                  <span className="text-quicx-text">{l.k}</span>
                  <span className="text-quicx-dim">=</span>
                  <span className="text-[#9ecbff]">{l.v}</span>
                  {l.comment && (
                    <span className="text-quicx-dim">{l.comment}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PMAD size classes visualization */}
      <div className="relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            PMAD · slab allocator
          </span>
          <span className="text-[10px] text-quicx-orange-bright">
            O(1) alloc
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          {classes.map((c, i) => (
            <div key={c.size} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-quicx-dim">{c.size}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    highlight === i
                      ? "bg-quicx-orange"
                      : "bg-quicx-orange/40"
                  )}
                  style={{ width: `${c.pct * 3}%` }}
                />
              </div>
              <span
                className={cn(
                  "w-10 shrink-0 text-right text-quicx-muted tabular-nums",
                  highlight === i && "text-quicx-orange-bright"
                )}
              >
                {c.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
