"use client";

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
 *
 * The replay is pure CSS (see .footprint-sweep in globals.css): the line is
 * uncovered by one clip-path animation and each sample appears as the sweep
 * reaches it, so React renders the chart once instead of once per frame.
 */
const STAGES = [
  { label: "idle", kb: 1056 },
  { label: "queue full", kb: 9088 },
  { label: "after the burst", short: "drained", kb: 2080 },
] as const;
const V104_KB = 9200;
const AXIS_KB = 10 * 1024;
const PEAK_PCT = MEMORY_RUN.poolPeakPct;
const SWEEP_DELAY_MS = 450;
const SWEEP_MS = 2600;
// The sweep eases in and out symmetrically, so it passes the middle sample at
// exactly half its duration: the samples land at 0, ½ and 1 of SWEEP_MS.
const reachedAt = (i: number) => SWEEP_DELAY_MS + (i / (STAGES.length - 1)) * SWEEP_MS;
const xAt = (i: number) => (i / (STAGES.length - 1)) * 100;
const yAt = (kb: number) => (1 - kb / AXIS_KB) * 100;

export function FootprintVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);

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
                className="footprint-sweep absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ "--d": `${SWEEP_DELAY_MS}ms`, "--dur": `${SWEEP_MS}ms` } as React.CSSProperties}
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
                    "footprint-point absolute size-2.5 -translate-x-1/2 -translate-y-1/2 border-2 border-quicx-orange",
                    i === STAGES.length - 1 ? "bg-quicx-orange" : "bg-quicx-well"
                  )}
                  style={{ left: `${xAt(i)}%`, top: `${yAt(st.kb)}%`, "--d": `${reachedAt(i)}ms` } as React.CSSProperties}
                />
              ))}
            </div>

            {/* x axis: each sample's name, and its reading once the line gets there */}
            <span />
            <div className="grid grid-cols-3 gap-2 pt-1.5 font-mono text-[11px] leading-tight">
              {STAGES.map((st, i) => (
                <div
                  key={st.label}
                  className={cn("min-w-0", i === 1 && "text-center", i === STAGES.length - 1 && "text-right")}
                >
                  <div className="text-quicx-dim">
                    {"short" in st ? (
                      <>
                        <span className="sm:hidden">{st.short}</span>
                        <span className="hidden sm:inline">{st.label}</span>
                      </>
                    ) : (
                      st.label
                    )}
                  </div>
                  <div
                    className="reveal-fade mt-1 tabular-nums text-quicx-text"
                    style={{ "--d": `${reachedAt(i) + 80}ms` } as React.CSSProperties}
                  >
                    {st.kb.toLocaleString("en-US")} KB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </figure>

        <div className="mt-4 font-mono text-[12px]">
          <div className="flex justify-between gap-3">
            <span className="text-quicx-dim">peak use of the {MEMORY_RUN.poolSize} pool, under load</span>
            <span className="shrink-0 whitespace-nowrap text-quicx-orange-bright">{PEAK_PCT} %</span>
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
