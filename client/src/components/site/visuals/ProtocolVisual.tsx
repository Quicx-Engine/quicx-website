"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStageReveal } from "../motion";
import { Panel } from "./Panel";

/**
 * One task, traced across the wire exactly as the QXP Protocol page lays it
 * out: submit, ack, ready, dispatch, done, and done forwarded to the producer
 * (since v1.0.3). The frame panel shows the real bytes of each message for a
 * `send_email` task with id 0x0A42.
 */

const LANES = ["producer", "daemon", "worker"] as const;
const LANE_X = [1 / 6, 3 / 6, 5 / 6];

type Tone = "id" | "len" | "type" | "data";
type Field = { label: string; tone: Tone; bytes: number[] };
type Step = { name: string; type: number; from: number; to: number; fields: Field[]; note?: string };

const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0));
const TASK_ID: Field = { label: "task_id", tone: "id", bytes: [0x00, 0x00, 0x0a, 0x42] };
const TYPE = ascii("send_email");
const SUBMIT_FIELDS: Field[] = [
  { label: "type_len", tone: "len", bytes: [TYPE.length] },
  { label: "type", tone: "type", bytes: TYPE },
  { label: "data", tone: "data", bytes: ascii('{"id":42}') },
];

const TRACE: Step[] = [
  { name: "MSG_SUBMIT", type: 0x01, from: 0, to: 1, fields: SUBMIT_FIELDS },
  { name: "MSG_OK", type: 0x02, from: 1, to: 0, fields: [TASK_ID] },
  { name: "MSG_READY", type: 0x04, from: 2, to: 1, fields: [] },
  { name: "MSG_TASK", type: 0x07, from: 1, to: 2, fields: [TASK_ID, ...SUBMIT_FIELDS] },
  { name: "MSG_DONE", type: 0x05, from: 2, to: 1, fields: [TASK_ID] },
  { name: "MSG_DONE", type: 0x05, from: 1, to: 0, fields: [TASK_ID], note: "forwarded" },
];

const TONE: Record<Tone, string> = {
  id: "text-quicx-orange-bright",
  len: "text-quicx-text",
  type: "text-quicx-body",
  data: "text-quicx-muted",
};

const STEP_MS = 1150;
const HOLD_MS = 2400;

const hex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
const lengthBytes = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];

export function ProtocolVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);
  // Messages sent so far across every replay; -1 = nothing on the wire yet.
  const [sentRun, setSent] = useState(-1);

  useEffect(() => {
    if (reveal !== "run") return;
    let n = -1;
    let t = 0;
    const schedule = () => {
      const s = n < 0 ? -1 : n % TRACE.length;
      const wait = s === -1 ? 350 : s === TRACE.length - 1 ? HOLD_MS : STEP_MS;
      t = window.setTimeout(() => {
        n += 1;
        setSent(n);
        schedule();
      }, wait);
    };
    schedule();
    return () => {
      window.clearTimeout(t);
      setSent(-1);
    };
  }, [reveal]);

  const sent = reveal === "static" ? TRACE.length - 1 : sentRun;
  const step = sent < 0 ? -1 : sent % TRACE.length;
  const cycle = sent < 0 ? 0 : Math.floor(sent / TRACE.length);
  const animated = reveal === "run";
  const current = TRACE[Math.max(0, step)];
  const payload = current.fields.flatMap((f) => f.bytes.map((b) => ({ b, tone: f.tone })));

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] divide-y divide-quicx-line">
      <Panel title="frame on the wire" meta={step < 0 ? "idle" : current.name}>
        <div className="px-4 py-4 sm:px-5">
          <div className="flex items-stretch gap-1 font-mono">
            <ByteCell label="version" size="1 B" k={`v${cycle}`} animated={false}>
              01
            </ByteCell>
            <ByteCell label="type" size="1 B" k={`t${step}-${cycle}`} animated={animated} highlight>
              {step < 0 ? "··" : hex(current.type)}
            </ByteCell>
            <ByteCell label="length" size="4 B" k={`l${step}-${cycle}`} animated={animated} wide>
              {step < 0 ? "·· ·· ·· ··" : lengthBytes(payload.length).map(hex).join(" ")}
            </ByteCell>
            <div className="hidden min-w-0 flex-1 flex-col justify-center pl-3 text-[11px] leading-[1.5] text-quicx-dim sm:flex">
              <span>6-byte header, fixed</span>
              <span>
                then <span className="text-quicx-text">{step < 0 ? 0 : payload.length}</span> bytes
                of payload
              </span>
            </div>
          </div>

          <div className="mt-3 min-h-[3.25rem] rounded-[2px] border border-dashed border-quicx-line-strong px-3 py-2">
            {step < 0 || payload.length === 0 ? (
              <p className="font-mono text-[12px] leading-[1.6] text-quicx-dim">
                {step < 0 ? "waiting for the first frame" : "no payload: length is zero"}
              </p>
            ) : (
              <>
                <p
                  key={`${step}-${cycle}`}
                  className="flex flex-wrap gap-x-[0.45em] font-mono text-[12px] leading-[1.6]"
                >
                  {payload.map(({ b, tone }, i) => (
                    <span
                      key={i}
                      className={cn(TONE[tone], animated && "byte-in")}
                      style={{ animationDelay: `${i * 22}ms` }}
                    >
                      {hex(b)}
                    </span>
                  ))}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-3 font-mono text-[11px] text-quicx-dim">
                  {current.fields.map((f) => (
                    <span key={f.label} className="flex items-center gap-1.5">
                      <span aria-hidden className={cn("size-1.5 bg-current", TONE[f.tone])} />
                      {f.label}
                    </span>
                  ))}
                </p>
              </>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="one task, traced" meta="12 opcodes in all" className="min-h-0">
        <div className="relative flex h-full flex-col px-2 pb-3 pt-3 sm:px-4">
          {/* lifelines */}
          <div aria-hidden className="pointer-events-none absolute inset-x-2 bottom-3 top-10 sm:inset-x-4">
            {LANE_X.map((x) => (
              <span
                key={x}
                className="absolute inset-y-0 border-l border-dashed border-quicx-line-strong"
                style={{ left: `${x * 100}%` }}
              />
            ))}
          </div>

          <div className="relative h-7 font-mono text-[11px] uppercase tracking-[0.04em] sm:tracking-[0.06em]">
            {LANES.map((lane, i) => (
              <span
                key={lane}
                className={cn(
                  "absolute top-0 -translate-x-1/2 rounded-[2px] border bg-quicx-well px-1.5 py-0.5 transition-colors duration-300",
                  step >= 0 && (current.from === i || current.to === i)
                    ? "border-quicx-orange/70 text-quicx-text"
                    : "border-quicx-line-strong text-quicx-dim"
                )}
                style={{ left: `${LANE_X[i] * 100}%` }}
              >
                {lane}
              </span>
            ))}
          </div>

          <ol className="relative mt-3 flex flex-1 flex-col justify-around">
            {TRACE.map((m, i) => (
              <Message
                key={`${i}-${cycle}`}
                m={m}
                state={i < step ? "past" : i === step ? "current" : "future"}
                animated={animated}
              />
            ))}
          </ol>
        </div>
      </Panel>
    </div>
  );
}

function Message({
  m,
  state,
  animated,
}: {
  m: Step;
  state: "past" | "current" | "future";
  animated: boolean;
}) {
  const rightward = m.to > m.from;
  const lo = Math.min(m.from, m.to);
  const hi = Math.max(m.from, m.to);
  const live = state === "current";
  return (
    <li
      className={cn(
        "relative h-7 transition-opacity duration-300",
        state === "future" ? "opacity-0" : "opacity-100"
      )}
    >
      <span
        className="absolute inset-y-0"
        style={{ left: `${LANE_X[lo] * 100}%`, right: `${(1 - LANE_X[hi]) * 100}%` }}
      >
        <span
          className={cn(
            "absolute inset-x-0 top-0 truncate text-center font-mono text-[11px] leading-none transition-colors duration-300",
            live ? "text-quicx-orange-bright" : "text-quicx-muted"
          )}
        >
          {m.name}
          {m.note && <span className="hidden text-quicx-dim sm:inline"> · {m.note}</span>}
        </span>
        <span
          className={cn(
            "absolute inset-x-1.5 top-[18px] h-px transition-colors duration-300",
            live ? "text-quicx-orange" : "text-quicx-body/45",
            live && animated && (rightward ? "wire-lr" : "wire-rl")
          )}
        >
          <span className="absolute inset-0 bg-current" />
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 size-0 -translate-y-1/2 border-y-[4px] border-y-transparent",
              rightward ? "right-0 border-l-[6px] border-l-current" : "left-0 border-r-[6px] border-r-current"
            )}
          />
          {live && animated && (
            <span
              aria-hidden
              className={cn("absolute top-1/2 h-[3px] w-2.5 -translate-y-1/2 bg-[#ffd9c4]", rightward ? "pkt-lr" : "pkt-rl")}
            />
          )}
        </span>
      </span>
    </li>
  );
}

function ByteCell({
  label,
  size,
  k,
  animated,
  highlight,
  wide,
  children,
}: {
  label: string;
  size: string;
  k: string;
  animated: boolean;
  highlight?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-[58px] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[2px] border px-2 [perspective:200px]",
        wide ? "w-[7.25rem]" : "w-[3.75rem]",
        highlight
          ? "border-quicx-orange bg-quicx-orange/[0.1] text-quicx-orange-bright"
          : "border-quicx-line-strong text-quicx-text"
      )}
    >
      <span className="text-[11px] uppercase tracking-[0.04em] opacity-75">{label}</span>
      <span key={k} className={cn("text-[12px] font-medium", animated && "flip-in")}>
        {children}
      </span>
      <span className="text-[11px] opacity-60">{size}</span>
    </div>
  );
}
