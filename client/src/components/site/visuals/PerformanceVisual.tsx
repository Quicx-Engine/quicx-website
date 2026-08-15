"use client";

import { LATENCY_PERCENTILES, LATENCY_BY_LOAD } from "@/lib/benchmarks";

/**
 * Static by design. Every value here is a measured figure from bench/run.sh —
 * the only thing `active` drives is the reveal animation, never the numbers.
 */
const maxUs = Math.max(...LATENCY_PERCENTILES.map((p) => p.us));
const maxLoadUs = Math.max(...LATENCY_BY_LOAD.map((r) => r.p50us));

export function PerformanceVisual({ active }: { active: boolean }) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-4">
      {/* Latency */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            submit → done
          </span>
          <span className="text-[10px] text-quicx-orange-bright">measured</span>
        </div>
        <div className="flex flex-1 flex-col justify-between px-4 py-3">
          <div>
            <div className="flex items-baseline gap-1 font-[family-name:var(--font-jetbrains-mono)]">
              <span className="text-3xl font-semibold tabular-nums text-quicx-text">
                51
              </span>
              <span className="text-sm text-quicx-dim">µs</span>
            </div>
            <div className="mt-1 text-[10.5px] text-quicx-dim">
              p50 · open loop @ 40k/s offered
            </div>
          </div>

          <ul className="mt-3 space-y-2">
            {LATENCY_PERCENTILES.map((p, i) => (
              <li key={p.label} className="flex items-center gap-2">
                <span className="w-9 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-quicx-dim">
                  {p.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-quicx-orange to-quicx-orange-bright"
                    style={{
                      width: active ? `${(p.us / maxUs) * 100}%` : "0%",
                      transition: "width 600ms cubic-bezier(.2,.8,.2,1)",
                      transitionDelay: `${i * 70}ms`,
                    }}
                  />
                </span>
                <span className="w-11 shrink-0 text-right font-[family-name:var(--font-jetbrains-mono)] text-[10px] tabular-nums text-quicx-text">
                  {p.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Throughput */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            throughput
          </span>
          <span className="text-[10px] text-quicx-orange-bright">tasks/s</span>
        </div>
        <div className="flex flex-1 flex-col justify-between px-4 py-3">
          <div>
            <div className="flex items-baseline gap-1 font-[family-name:var(--font-jetbrains-mono)]">
              <span className="text-3xl font-semibold tabular-nums text-quicx-text">
                74,300
              </span>
            </div>
            <div className="mt-1 text-[10.5px] text-quicx-dim">
              end to end · single thread · 0 errors
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-2 text-[10px] text-quicx-dim">
              p50 vs offered load — flat
            </div>
            <ul className="space-y-2">
              {LATENCY_BY_LOAD.map((r, i) => (
                <li key={r.offered} className="flex items-center gap-2">
                  <span className="w-9 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-quicx-dim">
                    {r.offered}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-quicx-orange to-quicx-orange-bright"
                      style={{
                        width: active ? `${(r.p50us / maxLoadUs) * 100}%` : "0%",
                        transition: "width 600ms cubic-bezier(.2,.8,.2,1)",
                        transitionDelay: `${i * 70}ms`,
                      }}
                    />
                  </span>
                  <span className="w-11 shrink-0 text-right font-[family-name:var(--font-jetbrains-mono)] text-[10px] tabular-nums text-quicx-text">
                    {r.p50}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
