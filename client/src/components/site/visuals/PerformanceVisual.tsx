"use client";

import { HEADLINE, LATENCY_PERCENTILES, LATENCY_BY_MACHINE } from "@/lib/benchmarks";
import { Odometer, useStageReveal } from "../motion";
import { Panel } from "./Panel";

/**
 * Every value here is a measured figure from bench/run.sh (median of 5 runs). The reveal only
 * replays how they are drawn: digits roll into place, bars grow from zero on a
 * shared 0–200 µs axis.
 */
const AXIS_MAX_US = 200;
const AXIS_TICKS = [0, 100, 200];
const ROW = "grid grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] items-center gap-3";

function Bar({ us, delay }: { us: number; delay: number }) {
  return (
    <span className="relative h-2 bg-white/[0.05]">
      <span
        className="grow-x absolute inset-y-0 left-0 bg-quicx-orange"
        style={{ width: `${(us / AXIS_MAX_US) * 100}%`, "--d": `${delay}ms` } as React.CSSProperties}
      />
    </span>
  );
}

function Axis() {
  return (
    <div aria-hidden className={`${ROW} mt-2 font-mono text-[11px] text-quicx-dim`}>
      <span />
      <span className="relative h-4 border-t border-quicx-line-strong">
        {AXIS_TICKS.map((t) => (
          <span
            key={t}
            className="absolute top-0 pt-1 first:translate-x-0 last:-translate-x-full"
            style={{ left: `${(t / AXIS_MAX_US) * 100}%` }}
          >
            {t}
          </span>
        ))}
      </span>
      <span className="pt-1 text-right">µs</span>
    </div>
  );
}

export function PerformanceVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);

  return (
    <div
      data-reveal={reveal}
      className="grid h-full grid-cols-1 divide-y divide-quicx-line sm:grid-cols-2 sm:divide-x sm:divide-y-0"
    >
      <Panel title="submit → done" meta="measured" bodyClassName="flex h-full flex-col px-4 py-4 sm:px-5 sm:py-5">
        <p className="flex items-baseline gap-1.5 font-mono">
          <Odometer
            value={HEADLINE.latencyUs}
            delay={100}
            className="text-[40px] font-medium leading-none tracking-[-0.04em] text-quicx-text sm:text-[44px]"
          />
          <span className="text-[14px] text-quicx-orange-bright">µs</span>
        </p>
        <p className="mt-2 text-[12.5px] text-quicx-dim">p50, open loop at 40k/s offered</p>
        <ul className="mt-auto space-y-2.5 pt-4 sm:space-y-3 sm:pt-6">
          {LATENCY_PERCENTILES.map((p, i) => (
            <li key={p.label} className={`${ROW} font-mono text-[12px]`}>
              <span className="text-quicx-dim">{p.label}</span>
              <Bar us={p.us} delay={350 + i * 110} />
              <span
                className="reveal-fade text-right text-quicx-text"
                style={{ "--d": `${700 + i * 110}ms` } as React.CSSProperties}
              >
                {p.value}
              </span>
            </li>
          ))}
        </ul>
        <Axis />
      </Panel>

      <Panel title="throughput" meta="tasks/s" bodyClassName="flex h-full flex-col px-4 py-4 sm:px-5 sm:py-5">
        <Odometer
          value={HEADLINE.throughput}
          delay={180}
          className="font-mono text-[40px] font-medium leading-none tracking-[-0.04em] text-quicx-text sm:text-[44px]"
        />
        <p className="mt-2 text-[12.5px] text-quicx-dim">end to end, single thread, 0 errors, Apple M4 Pro</p>
        <div className="mt-auto pt-4 sm:pt-6">
          <p className="mb-3 text-[12.5px] text-quicx-dim">
            p50 on a <span className="text-quicx-text">2024 Mac</span> and a{" "}
            <span className="text-quicx-text">2011 Linux PC</span>
          </p>
          <ul className="space-y-2.5 sm:space-y-3">
            {LATENCY_BY_MACHINE.map((r, i) => (
              <li key={r.machine} className={`${ROW} font-mono text-[12px]`}>
                <span className="text-quicx-dim">{r.short}</span>
                <Bar us={r.p50us} delay={500 + i * 110} />
                <span
                  className="reveal-fade text-right text-quicx-text"
                  style={{ "--d": `${850 + i * 90}ms` } as React.CSSProperties}
                >
                  {r.p50}
                </span>
              </li>
            ))}
          </ul>
          <Axis />
        </div>
      </Panel>
    </div>
  );
}
