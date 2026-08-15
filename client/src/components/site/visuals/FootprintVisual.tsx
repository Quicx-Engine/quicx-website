"use client";

import { CURRENT_VERSION } from "@/lib/version";
import { MEMORY_RUN } from "@/lib/benchmarks";

/**
 * The bars are deliberately identical: measured peak usage was a flat 10.7 % of
 * the default 8 MB pool, and RSS was the same at the end of the run as at idle.
 * A wobbling chart here would be a picture of something that did not happen.
 */
const PEAK_PCT = MEMORY_RUN.poolPeakPct;

export function FootprintVisual({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      {/* Binary download */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            quicx — single binary
          </span>
          <span className="text-[10px] text-quicx-orange-bright">v{CURRENT_VERSION}</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 -m-2 animate-pulse rounded-2xl bg-quicx-orange/10 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-quicx-orange/40 bg-gradient-to-br from-quicx-orange/20 to-transparent font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-quicx-orange-bright">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold leading-none">54</span>
                <span className="mt-1 text-[9px] tracking-wider">KB</span>
              </div>
            </div>
          </div>
          <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-quicx-dim">
            $ curl -fsSL quicx.dev/install.sh | sh
          </div>
          <div className="text-[11px] text-quicx-muted">
            54.4 KB at -O2. No runtime. No JVM. No dependencies.
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
          {/* Ceiling line */}
          <div className="relative">
            <div className="border-t border-dashed border-quicx-orange/50" />
            <div className="absolute right-0 -top-2 rounded bg-quicx-orange/15 px-1.5 py-0.5 text-[9px] text-quicx-orange-bright">
              ceiling · {MEMORY_RUN.poolSize}
            </div>
          </div>
          {/* Measured usage — flat, because it was flat */}
          <div className="flex h-20 items-end gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-quicx-orange shadow-[0_0_8px_rgba(255,87,0,0.4)]"
                style={{
                  height: active ? `${PEAK_PCT}%` : "0%",
                  opacity: 0.45 + (i / 24) * 0.55,
                  transition: "height 500ms ease-out",
                  transitionDelay: `${i * 20}ms`,
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[10.5px]">
            <span className="text-quicx-dim">peak over 443,912 tasks</span>
            <span className="tabular-nums text-quicx-text">
              {PEAK_PCT}% of pool
            </span>
          </div>
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="text-quicx-dim">RSS growth</span>
            <span className="tabular-nums text-quicx-orange-bright">
              {MEMORY_RUN.delta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
