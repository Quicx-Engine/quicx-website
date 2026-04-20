"use client";

import { useEffect, useState } from "react";

export function PerformanceVisual({ active }: { active: boolean }) {
  const [latency, setLatency] = useState(0.181);
  const [throughput, setThroughput] = useState(21000);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setLatency(+(0.17 + Math.random() * 0.04).toFixed(3));
      setThroughput(20400 + Math.round(Math.random() * 1200));
    }, 900);
    return () => clearInterval(id);
  }, [active]);

  // Data points for sparkline
  const points = Array.from({ length: 40 }, (_, i) => {
    const y = 28 + Math.sin(i * 0.45) * 6 + (active ? Math.sin(i + latency * 50) * 4 : 0);
    return { x: (i / 39) * 100, y };
  });
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${path} L 100 60 L 0 60 Z`;

  return (
    <div className="grid h-full grid-cols-2 gap-3 p-4">
      {/* Latency */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            avg latency
          </span>
          <span className="text-[10px] text-quicx-orange-bright">live</span>
        </div>
        <div className="flex flex-1 flex-col justify-between px-4 py-3">
          <div>
            <div className="flex items-baseline gap-1 font-[family-name:var(--font-jetbrains-mono)]">
              <span className="text-3xl font-semibold tabular-nums text-quicx-text">
                {latency.toFixed(3)}
              </span>
              <span className="text-sm text-quicx-dim">ms</span>
            </div>
            <div className="mt-1 text-[10.5px] text-quicx-dim">
              p99 · inside PMAD arena
            </div>
          </div>
          <svg viewBox="0 0 100 60" className="mt-2 h-14 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad-lat" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FF5700" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF5700" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#grad-lat)" />
            <path
              d={path}
              fill="none"
              stroke="#FF7A33"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
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
                {throughput.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 text-[10.5px] text-quicx-dim">
              sustained · single node
            </div>
          </div>

          <div className="mt-2 flex items-end gap-1 h-14">
            {Array.from({ length: 20 }).map((_, i) => {
              const base = 35 + Math.sin(i * 0.7 + throughput * 0.0002) * 15;
              const h = Math.min(Math.max(base, 15), 95);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-quicx-orange/60 to-quicx-orange-bright"
                  style={{
                    height: `${h}%`,
                    transition: "height 700ms cubic-bezier(.2,.8,.2,1)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
