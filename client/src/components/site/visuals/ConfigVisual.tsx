"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStageReveal } from "../motion";
import { Panel } from "./Panel";

type Line = { k: string; v: string; comment?: string };

const sections: { title: string; lines: Line[] }[] = [
  {
    title: "[server]",
    lines: [{ k: "port", v: "16381" }],
  },
  {
    title: "[memory]",
    lines: [{ k: "pool_size", v: "8M", comment: "# the whole budget, never exceeded" }],
  },
  {
    title: "[allocator]",
    lines: [
      { k: "reserve", v: "on" },
      { k: "hardening", v: "on" },
      { k: "purge", v: "on" },
      { k: "fullest_first", v: "off" },
    ],
  },
];

/**
 * The measured capacity run: one daemon, the sizes sent one after another and
 * the queue drained in between. Each phase, the arriving size ends up with
 * nearly every page; after the drain the pages go back and the next size takes
 * them. Counts are tasks accepted before ERROR 0x01, identical on macOS and Linux.
 */
const phases = [
  { size: "100 B", tasks: "46,593", cell: 4 },
  { size: "900 B", tasks: "8,016", cell: 11 },
  { size: "40 B", tasks: "73,146", cell: 3 },
  { size: "300 B", tasks: "22,044", cell: 6 },
];

const PHASE_MS = 1700;

/** A grid of square slots: gaps painted in the well colour over a filled band. */
function slots(cell: number): React.CSSProperties {
  const gap = 2;
  const pitch = cell + gap;
  return {
    backgroundImage: `linear-gradient(90deg, var(--quicx-well) ${gap}px, transparent ${gap}px), linear-gradient(0deg, var(--quicx-well) ${gap}px, transparent ${gap}px)`,
    backgroundSize: `${pitch}px ${pitch}px`,
    backgroundPosition: `-${gap}px -${gap}px`,
  };
}

export function ConfigVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);
  // Which phase of the capacity run is filling the pool; -1 before the first.
  const [phaseRun, setPhase] = useState(-1);

  useEffect(() => {
    if (reveal !== "run") return;
    let i = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      setPhase(0);
      interval = window.setInterval(() => {
        i = (i + 1) % phases.length;
        setPhase(i);
      }, PHASE_MS);
    }, 500);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
      setPhase(-1);
    };
  }, [reveal]);

  const phase = reveal === "static" ? 0 : phaseRun;

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] divide-y divide-quicx-line sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:grid-rows-1 sm:divide-x sm:divide-y-0">
      <Panel title="quicx.conf" meta="optional, these are the defaults" className="min-h-0">
        <div className="h-full overflow-auto px-4 py-3 font-mono text-[12px] leading-[1.6] sm:px-5 sm:py-4 sm:text-[12.5px] sm:leading-[1.75]">
          {sections.map((section) => (
            <div key={section.title} className="mb-2 last:mb-0 sm:mb-3">
              <div className="text-quicx-text">{section.title}</div>
              {section.lines.map((l, i) => (
                <div key={i}>
                  {l.comment && <div className="text-quicx-dim">{l.comment}</div>}
                  <div
                    className={cn(
                      "-mx-2 rounded-[2px] px-2 transition-[background-color] duration-300",
                      l.k === "pool_size" && phase >= 0 && "bg-quicx-orange/[0.14]"
                    )}
                  >
                    <span className="text-quicx-muted">{l.k}</span>
                    <span className="text-quicx-dim"> = </span>
                    <span className="text-quicx-orange-bright">{l.v}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="8 MiB, page by page"
        meta={phase >= 0 ? `${phases[phase].size} tasks arriving` : "waiting for traffic"}
        className="min-h-0"
        bodyClassName="flex flex-col px-4 py-4 sm:px-5"
      >
        <div
          role="img"
          aria-label="One 8 MiB budget, four sizes sent one after another: the arriving size takes nearly every page each time — 46,593 tasks of 100 B, 8,016 of 900 B, 73,146 of 40 B and 22,044 of 300 B."
          className="flex min-h-0 flex-1 flex-col gap-[3px]"
        >
          {phases.map((p, i) => {
            const on = i === phase;
            return (
              <div
                key={p.size}
                className="grid min-h-0 grid-cols-[minmax(0,1fr)] items-center gap-3 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:grid-cols-[3.25rem_minmax(0,1fr)_3.75rem]"
                style={{ flex: `${on ? 12 : 1} 1 0px` }}
              >
                <span
                  className={cn(
                    "hidden text-right font-mono text-[11px] leading-none transition-colors duration-300 sm:block",
                    on ? "text-quicx-text" : "text-quicx-dim/70"
                  )}
                >
                  {p.size}
                </span>
                <span className="relative h-full min-h-[6px] overflow-hidden rounded-[1px]">
                  {/* pages this size does not hold: free, any size may take them */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[rgba(190,222,236,0.07)]"
                    style={slots(3)}
                  />
                  {/* this size's pages, carved into its own blocks */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 bg-quicx-orange transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    )}
                    style={{
                      ...slots(p.cell),
                      clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                    }}
                  />
                </span>
                <span
                  className={cn(
                    "hidden text-right font-mono text-[11px] leading-none transition-colors duration-300 sm:block",
                    on ? "text-quicx-orange-bright" : "text-quicx-dim/70"
                  )}
                >
                  {on ? p.tasks : "0"}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 flex justify-between gap-3 font-mono text-[11px] text-quicx-dim">
          <span>tasks that fit, measured</span>
          <span>pages follow the traffic</span>
        </p>
      </Panel>
    </div>
  );
}
