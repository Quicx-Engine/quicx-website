"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Frame = {
  name: string;
  hex: string;
  label: string;
  color: string;
  payload: string;
  payloadBytes: number; // sample byte-count for the visual
};

const frames: Frame[] = [
  {
    name: "MSG_SUBMIT",
    hex: "01",
    label: "producer → daemon",
    color: "#60a5fa",
    payload: "[type_len:1][type:N][data:…]",
    payloadBytes: 28,
  },
  {
    name: "MSG_OK",
    hex: "02",
    label: "daemon acknowledges",
    color: "#4ade80",
    payload: "[task_id:4]",
    payloadBytes: 4,
  },
  {
    name: "MSG_ERROR",
    hex: "03",
    label: "daemon rejects",
    color: "#f87171",
    payload: "[code:1][message:…]",
    payloadBytes: 14,
  },
  {
    name: "MSG_READY",
    hex: "04",
    label: "worker ready",
    color: "#5eead4",
    payload: "(empty)",
    payloadBytes: 0,
  },
  {
    name: "MSG_DONE",
    hex: "05",
    label: "worker finished",
    color: "#a78bfa",
    payload: "[task_id:4]",
    payloadBytes: 4,
  },
  {
    name: "MSG_FAILED",
    hex: "06",
    label: "worker failed",
    color: "#fb7185",
    payload: "[task_id:4][reason:…]",
    payloadBytes: 18,
  },
  {
    name: "MSG_TASK",
    hex: "07",
    label: "daemon → worker",
    color: "#f59e0b",
    payload: "[task_id:4][type_len:1][type:N][data:…]",
    payloadBytes: 32,
  },
  {
    name: "MSG_WAIT",
    hex: "08",
    label: "no tasks",
    color: "#94a3b8",
    payload: "(empty)",
    payloadBytes: 0,
  },
  {
    name: "MSG_HEARTBEAT",
    hex: "09",
    label: "liveness probe",
    color: "#fbbf24",
    payload: "(empty)",
    payloadBytes: 0,
  },
  {
    name: "MSG_PONG",
    hex: "0A",
    label: "heartbeat reply",
    color: "#fcd34d",
    payload: "(empty)",
    payloadBytes: 0,
  },
  {
    name: "MSG_STATS",
    hex: "0B",
    label: "stats request",
    color: "#9ca3af",
    payload: "(empty)",
    payloadBytes: 0,
  },
  {
    name: "MSG_STATS_RESPONSE",
    hex: "0C",
    label: "stats reply",
    color: "#d4d4d8",
    payload: "[stats:…]",
    payloadBytes: 40,
  },
];

type LogEntry = {
  id: number;
  frame: Frame;
};

// How many log rows fit in the card's opcode panel
const VISIBLE_MAX = 5;
// Per-row geometry — must match LogRow's rendered height exactly
const SLOT_H = 30;
const SLOT_GAP = 4;
const SLOT_OFFSET = SLOT_H + SLOT_GAP;
// Animation timing
const SHIFT_MS = 520;
const TICK_MS = 1400;

function formatLen(len: number) {
  return [
    ((len >>> 24) & 0xff).toString(16).padStart(2, "0"),
    ((len >>> 16) & 0xff).toString(16).padStart(2, "0"),
    ((len >>> 8) & 0xff).toString(16).padStart(2, "0"),
    (len & 0xff).toString(16).padStart(2, "0"),
  ]
    .join(" ")
    .toUpperCase();
}

export function ProtocolVisual({
  active,
  expanded,
}: {
  active: boolean;
  expanded?: boolean;
}) {
  if (expanded) {
    return <ProtocolVisualExpanded active={active} />;
  }
  return <ProtocolVisualCard active={active} />;
}

/* ─────────── Card view: animated opcode log ─────────── */

function ProtocolVisualCard({ active }: { active: boolean }) {
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    const seed: LogEntry[] = [];
    let tempId = 0;
    let tempIdx = 0;
    for (let k = 0; k < VISIBLE_MAX; k++) {
      const frame = frames[tempIdx % frames.length];
      tempIdx += 1;
      seed.unshift({ id: ++tempId, frame });
    }
    return seed;
  });
  const [animState, setAnimState] = useState<"idle" | "primed" | "shifting">("idle");
  const idRef = useRef(VISIBLE_MAX);
  const frameIdxRef = useRef(VISIBLE_MAX);

  useEffect(() => {
    if (!active) return;

    let shiftTimeoutId: number;
    let pruneTimeoutId: number;

    const tick = () => {
      const frame = frames[frameIdxRef.current % frames.length];
      frameIdxRef.current += 1;
      const newId = ++idRef.current;

      // Transition 1: Primed
      setAnimState("primed");
      setEntries((prev) => [{ id: newId, frame }, ...prev].slice(0, VISIBLE_MAX + 1));

      // Transition 2: Shifting
      shiftTimeoutId = window.setTimeout(() => {
        setAnimState("shifting");
      }, 30);

      // Transition 3: Idle + Prune
      pruneTimeoutId = window.setTimeout(() => {
        setAnimState("idle");
        setEntries((curr) => curr.slice(0, VISIBLE_MAX));
      }, SHIFT_MS + 30);
    };

    // Delay the first tick slightly so it doesn't instantly shift on hover
    const initialId = window.setTimeout(tick, TICK_MS / 2);
    const intervalId = window.setInterval(tick, TICK_MS);
    return () => {
      window.clearTimeout(initialId);
      window.clearTimeout(shiftTimeoutId);
      window.clearTimeout(pruneTimeoutId);
      window.clearInterval(intervalId);
      setAnimState("idle");
      setEntries((curr) => curr.slice(0, VISIBLE_MAX));
    };
  }, [active]);

  const headFrame = entries[0]?.frame ?? frames[0];
  const len = headFrame.payloadBytes;

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* Frame bytes */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            binary frame · 6-byte header + payload
          </span>
          <span className="text-[10px] text-quicx-orange-bright">
            zero-copy
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-4 py-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          <div className="flex items-stretch gap-1.5">
            <ByteCell label="version" value="01" sublabel="1 B" />
            <ByteCell
              label="type"
              value={headFrame.hex}
              sublabel="1 B"
              highlight
            />
            <ByteCell
              label="length"
              value={formatLen(len)}
              sublabel="4 B"
              span={3}
            />
            <ByteCell
              label="payload"
              value={headFrame.payload}
              sublabel={len === 0 ? "0 B" : `${len} B`}
              span={6}
              dim
              grow
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-quicx-dim">
            <span>total header = 6 bytes fixed</span>
            <span>total message = 6 + length bytes</span>
          </div>
        </div>
      </div>

      {/* Animated opcode log — fills remaining card space (byte frame above
          has a locked height so this area is constant too) */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            wire log · live
          </span>
          <span className="text-[10px] text-quicx-dim">
            {frames.length} opcodes total
          </span>
        </div>
        {/* overflow-hidden with a fixed height ensures enter/exit animations 
            never leak height out to the outer layout */}
        <div className="relative h-[182px] shrink-0 overflow-hidden px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          <div 
            className={cn("flex flex-col gap-1 w-full", `protocol-log-${animState}`)}
            style={{ "--log-shift": `-${SLOT_OFFSET}px` } as React.CSSProperties}
          >
            {entries.map((e, idx) => (
              <div key={e.id}>
                <LogRow frame={e.frame} active={idx === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogRow({ frame, active }: { frame: Frame; active: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[30px] items-center gap-3 rounded border px-2 transition-all duration-300",
        active
          ? "border-quicx-orange/50 bg-quicx-orange/15 text-quicx-text shadow-[0_0_14px_rgba(255,87,0,0.22)]"
          : "border-white/5 bg-white/[0.02] text-quicx-text opacity-55"
      )}
    >
      <span
        className={cn(
          "inline-block size-1.5 rounded-full transition-shadow",
          active && "shadow-[0_0_6px_currentColor]"
        )}
        style={{ background: frame.color, color: frame.color }}
      />
      <span className="w-40 shrink-0 truncate">{frame.name}</span>
      <span className="text-quicx-dim">0x{frame.hex}</span>
      <span className="ml-auto truncate text-quicx-dim">{frame.label}</span>
    </div>
  );
}

/* ─────────── Expanded (modal) view: full opcode table ─────────── */

function ProtocolVisualExpanded({ active }: { active: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 1200);
    return () => clearInterval(id);
  }, [active]);

  const f = frames[i];
  const len = f.payloadBytes;

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* Frame bytes */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            binary frame · 6-byte header + payload
          </span>
          <span className="text-[10px] text-quicx-orange-bright">
            zero-copy
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-4 py-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          <div className="flex items-stretch gap-1.5">
            <ByteCell label="version" value="01" sublabel="1 B" />
            <ByteCell label="type" value={f.hex} sublabel="1 B" highlight />
            <ByteCell
              label="length"
              value={formatLen(len)}
              sublabel="4 B"
              span={3}
            />
            <ByteCell
              label="payload"
              value={f.payload}
              sublabel={len === 0 ? "0 B" : `${len} B`}
              span={6}
              dim
              grow
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-quicx-dim">
            <span>total header = 6 bytes fixed</span>
            <span>total message = 6 + length bytes</span>
          </div>
        </div>
      </div>

      {/* Legend — full list */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            opcodes · {frames.length} message types
          </span>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-1 px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          {frames.map((frame, idx) => (
            <div
              key={frame.name}
              className={cn(
                "flex items-center gap-3 rounded px-2 py-1.5 transition-all duration-300",
                active && i === idx
                  ? "scale-[1.02] border border-quicx-orange/20 bg-quicx-orange/10 shadow-[0_0_12px_rgba(255,87,0,0.15)]"
                  : "border border-transparent opacity-60"
              )}
            >
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: frame.color }}
              />
              <span className="w-40 shrink-0 text-quicx-text">
                {frame.name}
              </span>
              <span className="text-quicx-dim">0x{frame.hex}</span>
              <span className="ml-auto truncate text-quicx-dim">
                {frame.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── shared byte cell ─────────── */

function ByteCell({
  label,
  value,
  sublabel,
  span = 1,
  highlight,
  dim,
  grow,
}: {
  label: string;
  value: string;
  sublabel?: string;
  span?: number;
  highlight?: boolean;
  dim?: boolean;
  grow?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[60px] flex-col items-center justify-center overflow-hidden rounded border px-2 py-1",
        grow && "min-w-0 flex-1",
        highlight
          ? "border-quicx-orange/60 bg-quicx-orange/10 text-quicx-orange-bright"
          : dim
            ? "border-white/5 bg-white/[0.02] text-quicx-dim"
            : "border-white/10 bg-white/[0.03] text-quicx-text"
      )}
      style={{ minWidth: grow ? 0 : span * 28 }}
    >
      <span className="block w-full truncate text-center text-[9px] uppercase leading-tight tracking-wider opacity-70">
        {label}
      </span>
      <span className="block w-full truncate text-center font-semibold leading-tight">
        {value}
      </span>
      {sublabel && (
        <span className="block w-full truncate text-center text-[8.5px] uppercase leading-tight tracking-wider opacity-50">
          {sublabel}
        </span>
      )}
    </div>
  );
}
