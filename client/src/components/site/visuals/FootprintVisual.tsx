"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FootprintVisual({ active }: { active: boolean }) {
  const [used, setUsed] = useState(0);

  useEffect(() => {
    if (!active) {
      // Reset on next tick to avoid synchronous setState in effect body.
      const reset = setTimeout(() => setUsed(0), 0);
      return () => clearTimeout(reset);
    }
    const targets = [12, 34, 58, 41, 67, 52, 73, 48];
    let i = 0;
    const id = setInterval(() => {
      setUsed(targets[i % targets.length]);
      i += 1;
    }, 700);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      {/* Binary download */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            quicx — single binary
          </span>
          <span className="text-[10px] text-quicx-orange-bright">v1.0.0</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 -m-2 animate-pulse rounded-2xl bg-quicx-orange/10 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-quicx-orange/40 bg-gradient-to-br from-quicx-orange/20 to-transparent font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-quicx-orange-bright">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold leading-none">63</span>
                <span className="mt-1 text-[9px] tracking-wider">KB</span>
              </div>
            </div>
          </div>
          <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-quicx-dim">
            $ curl -fsSL quicx.dev/install | sh
          </div>
          <div className="text-[11px] text-quicx-muted">
            One binary. No runtime. No JVM. No surprises.
          </div>
        </div>
      </div>

      {/* RAM ceiling */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            runtime memory — pool_size
          </span>
          <span className="text-[10px] text-quicx-orange-bright">
            bounded
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          {/* Memory ceiling chart */}
          <div className="flex items-end gap-1 h-20">
            {Array.from({ length: 24 }).map((_, i) => {
              const h =
                20 + Math.sin(i * 0.6 + used * 0.05) * 12 + (used % 30);
              const clamped = Math.min(h, 85);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-quicx-orange shadow-[0_0_8px_rgba(255,87,0,0.4)]"
                  style={{
                    height: active ? `${clamped}%` : "0%",
                    opacity: 0.45 + (i / 24) * 0.55,
                    transition: "height 500ms ease-out",
                    transitionDelay: `${i * 20}ms`
                  }}
                />
              );
            })}
          </div>
          {/* Ceiling line */}
          <div className="relative">
            <div className="border-t border-dashed border-quicx-orange/50" />
            <div className="absolute right-0 -top-2 rounded bg-quicx-orange/15 px-1.5 py-0.5 text-[9px] text-quicx-orange-bright">
              ceiling · 10 MB
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10.5px]">
            <span className="text-quicx-dim">current</span>
            <span
              className={cn(
                "tabular-nums text-quicx-text transition-colors",
                used > 60 && "text-quicx-orange-bright"
              )}
            >
              {used}% of pool
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
