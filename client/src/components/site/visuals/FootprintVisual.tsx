"use client";

import { useEffect, useState } from "react";
import { CURRENT_VERSION } from "@/lib/version";
import { FOOTPRINT, MEMORY_RUN } from "@/lib/benchmarks";
import { cn } from "@/lib/utils";
import { Odometer, useStageReveal } from "../motion";
import { Panel } from "./Panel";

/**
 * Physical memory was sampled at three moments of one capacity run: idle, with
 * the queue full, and after the burst drained (median of 3 runs, macOS
 * phys_footprint). The line only joins those samples; v1.0.4, sampled the same
 * way, held 9,200 KB at all three. The sweep replays the run from left to right.
 */
const STAGES = [
  { label: "idle", kb: 1056 },
  { label: "queue full", kb: 9088 },
  { label: "after the burst", kb: 2080 },
] as const;
const V104_KB = 9200;
const AXIS_KB = 10 * 1024;
const PEAK_PCT = MEMORY_RUN.poolPeakPct;
const SWEEP_MS = 2600;
const xAt = (i: number) => (i / (STAGES.length - 1)) * 100;
const yAt = (kb: number) => (1 - kb / AXIS_KB) * 100;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function FootprintVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);
  // Progress through the run, 0 → 1.
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reveal !== "run") return;
    let raf = 0;
    const t0 = performance.now() + 450;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / SWEEP_MS));
      setProgress(easeInOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setProgress(0);
    };
  }, [reveal]);

  const p = reveal === "static" ? 1 : progress;

  return (
    <div
      data-reveal={reveal}
      className="grid h-full grid-rows-[auto_minmax(0,1fr)] divide-y divide-quicx-line"
    >
      <Panel title="quicx, single binary" meta={`v${CURRENT_VERSION}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
          <p className="flex items-baseline gap-2 font-mono">
            <Odometer
              value="54.9"
              delay={150}
              className="text-[46px] font-medium leading-none tracking-[-0.04em] text-quicx-text sm:text-[52px]"
            />
            <span className="text-[15px] text-quicx-orange-bright">KB</span>
          </p>
          <dl className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 font-mono text-[12px]">
            {FOOTPRINT.slice(1).map((f) => (
              <div key={f.label} className="contents">
                <dt className="text-quicx-dim">{f.label}</dt>
                <dd className="text-quicx-text">
                  {f.value} {f.note && <span className="text-quicx-dim">{f.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Panel>

      <Panel
        title="Memory across one burst"
        meta="measured at three points"
        className="h-full"
        bodyClassName="flex flex-col px-4 pb-4 pt-4 sm:px-6"
      >
        <figure className="flex min-h-0 flex-1 flex-col">
          <figcaption className="sr-only">
            Physical memory of the daemon: {MEMORY_RUN.idle} idle, {MEMORY_RUN.full} with the queue
            full, {MEMORY_RUN.afterBurst} after the burst drained. v1.0.4 held {MEMORY_RUN.v104} at all
            three points.
          </figcaption>

          <div aria-hidden className="mt-2 grid min-h-0 flex-1 grid-cols-[2.5rem_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-2">
            {/* y axis */}
            <div className="relative font-mono text-[11px] text-quicx-dim">
              <span className="absolute right-0 top-0 -translate-y-1/2">10 MB</span>
              <span className="absolute bottom-0 right-0 translate-y-1/2">0</span>
            </div>

            {/* plot */}
            <div className="relative border-b border-l border-quicx-line-strong">
              {/* v1.0.4: the whole pool from the start */}
              <span
                className="absolute left-0 right-0 border-t border-dashed border-quicx-body/50"
                style={{ top: `${yAt(V104_KB)}%` }}
              />
              <span
                className="absolute right-2 -translate-y-[calc(100%+4px)] whitespace-nowrap font-mono text-[11px] text-quicx-dim"
                style={{ top: `${yAt(V104_KB)}%` }}
              >
                v1.0.4 · {MEMORY_RUN.v104}
              </span>

              {/* v2: the three samples, joined; the sweep reveals them left to right */}
              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ clipPath: `inset(-10% ${(1 - p) * 100}% -10% -2%)` }}
              >
                <polyline
                  points={STAGES.map((st, i) => `${xAt(i)},${yAt(st.kb)}`).join(" ")}
                  fill="none"
                  stroke="var(--color-quicx-orange)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                />
              </svg>
              {STAGES.map((st, i) => (
                <span
                  key={st.label}
                  className={cn(
                    "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 border-2 border-quicx-orange transition-[opacity,transform] duration-300",
                    i === STAGES.length - 1 ? "bg-quicx-orange" : "bg-quicx-well",
                    p >= i / (STAGES.length - 1) - 0.001 ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                  style={{ left: `${xAt(i)}%`, top: `${yAt(st.kb)}%` }}
                />
              ))}
              {STAGES.map((st, i) => (
                <span
                  key={`${st.label}-v`}
                  className={cn(
                    "absolute whitespace-nowrap font-mono text-[11px] text-quicx-text transition-opacity duration-500",
                    i === 0 ? "left-2" : i === STAGES.length - 1 ? "right-2 text-right" : "-translate-x-1/2",
                    i === 1 ? "translate-y-3" : "-translate-y-[calc(100%+10px)]",
                    p >= i / (STAGES.length - 1) - 0.001 ? "opacity-100" : "opacity-0"
                  )}
                  style={{ top: `${yAt(st.kb)}%`, ...(i === 1 ? { left: `${xAt(i)}%` } : {}) }}
                >
                  {st.kb.toLocaleString("en-US")} KB
                </span>
              ))}
            </div>

            {/* x axis */}
            <span />
            <div className="relative h-5 font-mono text-[11px] text-quicx-dim">
              {STAGES.map((st, i) => (
                <span
                  key={st.label}
                  className={cn(
                    "absolute top-1.5 whitespace-nowrap",
                    i === 0 ? "left-0" : i === STAGES.length - 1 ? "right-0" : "-translate-x-1/2"
                  )}
                  style={i === 1 ? { left: `${xAt(i)}%` } : undefined}
                >
                  {st.label}
                </span>
              ))}
            </div>
          </div>
        </figure>

        <div className="mt-4 font-mono text-[12px]">
          <div className="flex justify-between gap-3">
            <span className="text-quicx-dim">peak use of the {MEMORY_RUN.poolSize} pool, under load</span>
            <span className="text-quicx-orange-bright">{PEAK_PCT} %</span>
          </div>
          <div aria-hidden className="relative mt-1.5 h-2 bg-white/[0.05]">
            <span
              className="grow-x absolute inset-y-0 left-0 bg-quicx-orange"
              style={{ width: `${PEAK_PCT}%`, "--d": "700ms" } as React.CSSProperties}
            />
            <span className="absolute -top-1 bottom-[-4px] right-0 w-px bg-quicx-text/60" />
          </div>
        </div>
      </Panel>
    </div>
  );
}
