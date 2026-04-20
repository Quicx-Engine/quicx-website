"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const frames = [
  { name: "MSG_SUBMIT", hex: "01", label: "producer → daemon", color: "#60a5fa" },
  { name: "MSG_OK", hex: "02", label: "acknowledgment", color: "#4ade80" },
  { name: "MSG_TASK", hex: "03", label: "task dispatch", color: "#f59e0b" },
  { name: "MSG_DONE", hex: "04", label: "completion", color: "#a78bfa" },
  { name: "MSG_STATS", hex: "05", label: "telemetry", color: "#9ca3af" },
];

export function ProtocolVisual({ active }: { active: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 1200);
    return () => clearInterval(id);
  }, [active]);

  const f = frames[i];

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* Frame bytes */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            binary frame · wire format
          </span>
          <span className="text-[10px] text-quicx-orange-bright">
            zero-copy
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          <div className="flex items-stretch gap-1.5 overflow-hidden">
            <ByteCell label="type" value={f.hex} highlight />
            <ByteCell label="ver" value="01" />
            <ByteCell label="len" value="00 10" span={2} />
            <ByteCell label="corr_id" value="A3 1F" span={2} />
            <ByteCell label="payload" value="··· 16 bytes ···" span={5} dim />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            opcodes
          </span>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-1 px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          {frames.map((frame, idx) => (
            <div
              key={frame.name}
              className={cn(
                "flex items-center gap-3 rounded px-2 py-1.5 transition-all duration-300",
                active && i === idx ? "bg-quicx-orange/10 scale-[1.02] border border-quicx-orange/20 shadow-[0_0_12px_rgba(255,87,0,0.15)]" : "border border-transparent opacity-60"
              )}
            >
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: frame.color }}
              />
              <span className="w-24 shrink-0 text-quicx-text">
                {frame.name}
              </span>
              <span className="text-quicx-dim">0x{frame.hex}</span>
              <span className="ml-auto text-quicx-dim">{frame.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ByteCell({
  label,
  value,
  span = 1,
  highlight,
  dim,
}: {
  label: string;
  value: string;
  span?: number;
  highlight?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded border px-2 py-1.5",
        highlight
          ? "border-quicx-orange/60 bg-quicx-orange/10 text-quicx-orange-bright"
          : dim
            ? "border-white/5 bg-white/[0.02] text-quicx-dim"
            : "border-white/10 bg-white/[0.03] text-quicx-text"
      )}
      style={{ minWidth: span * 28 }}
    >
      <span className="text-[9px] uppercase tracking-wider opacity-70">
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
