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
 * the queue drained in between. Each phase the arriving size fills the same
 * 8 MiB, carved into its own block size (the texture), and after the drain the
 * pages go back for the next size. Counts are tasks accepted before ERROR 0x01,
 * identical on macOS and Linux.
 *
 * The fill is one layer revealed by clip-path: it fills from the left and
 * drains from the left too, oldest pages first, as a FIFO drains. Nothing is
 * laid out per frame and the block texture never stretches.
 */
const phases = [
  { size: "100 B", tasks: "46,593", cell: 4 },
  { size: "900 B", tasks: "8,016", cell: 11 },
  { size: "40 B", tasks: "73,146", cell: 3 },
  { size: "300 B", tasks: "22,044", cell: 6 },
];

const FILL_MS = 1100;
const HOLD_MS = 900;
const DRAIN_MS = 420;
const GAP_MS = 180;

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

type Step = "empty" | "fill" | "drain";

export function ConfigVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);
  // Which phase owns the pool, and whether it is filling or draining.
  const [phaseRun, setPhase] = useState(0);
  const [stepRun, setStep] = useState<Step>("empty");

  useEffect(() => {
    if (reveal !== "run") return;
    let i = 0;
    let t = 0;
    const fill = () => {
      setStep("fill");
      t = window.setTimeout(drain, FILL_MS + HOLD_MS);
    };
    const drain = () => {
      setStep("drain");
      t = window.setTimeout(() => {
        // reset off screen, swap the texture to the next size, then fill again
        i = (i + 1) % phases.length;
        setStep("empty");
        setPhase(i);
        t = window.setTimeout(fill, GAP_MS);
      }, DRAIN_MS);
    };
    t = window.setTimeout(fill, 450);
    return () => {
      window.clearTimeout(t);
      setPhase(0);
      setStep("empty");
    };
  }, [reveal]);

  // static: the first phase, finished
  const phase = reveal === "static" ? 0 : phaseRun;
  const step: Step = reveal === "static" ? "fill" : stepRun;
  const current = phases[phase];
  const filled = step === "fill";
  const waiting = phase === 0 && step === "empty" && reveal !== "static";

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] divide-y divide-quicx-line sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:grid-rows-1 sm:divide-x sm:divide-y-0">
      <Panel title="quicx.conf" meta="optional, defaults shown" className="min-h-0">
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
                      l.k === "pool_size" && filled && "bg-quicx-orange/[0.14]"
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
        meta={waiting ? "waiting for traffic" : step === "drain" ? "draining to workers" : `${current.size} tasks arriving`}
        className="min-h-0"
        bodyClassName="flex flex-col px-4 py-4 sm:px-5"
      >
        <div
          role="img"
          aria-label="One 8 MiB budget, four sizes sent one after another: each fills the same pool in its own block size: 46,593 tasks of 100 B, 8,016 of 900 B, 73,146 of 40 B and 22,044 of 300 B."
          className="flex min-h-0 flex-1 flex-col gap-3"
        >
          {/* the four phases, as a legend of what the pool held */}
          <dl className="grid grid-cols-4 gap-px font-mono text-[11px] leading-none sm:text-[11.5px]">
            {phases.map((p, i) => {
              const on = i === phase;
              return (
                <div key={p.size} className="min-w-0">
                  <dt className={cn("transition-colors duration-300", on ? "text-quicx-text" : "text-quicx-dim/70")}>
                    {p.size}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1.5 tabular-nums transition-colors duration-300",
                      on && filled ? "text-quicx-orange-bright" : "text-quicx-dim/70"
                    )}
                  >
                    {p.tasks}
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* the pool: one frame that never changes size */}
          <div className="relative min-h-[64px] flex-1 overflow-hidden rounded-[2px] border border-quicx-line-strong sm:min-h-[96px]">
            {/* free pages: mapped, owned by no size */}
            <span aria-hidden className="absolute inset-0 bg-[rgba(190,222,236,0.07)]" style={slots(3)} />
            {/* the arriving size's pages, carved into its own blocks */}
            <span
              aria-hidden
              className="config-fill absolute inset-0 bg-quicx-orange"
              data-step={step}
              style={
                {
                  ...slots(current.cell),
                  "--fill-ms": `${FILL_MS}ms`,
                  "--drain-ms": `${DRAIN_MS}ms`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
        <p className="mt-3 truncate font-mono text-[11px] text-quicx-dim">tasks that fit, measured</p>
      </Panel>
    </div>
  );
}
