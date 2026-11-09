"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStageReveal } from "../motion";
import { Panel } from "./Panel";

// Every command here matches the Quick Start and CLI reference.
const steps = [
  { label: "Install the binary", cmd: "curl -fsSL https://quicx.dev/install.sh | sh" },
  { label: "Start the daemon", cmd: "quicx start --config quicx.conf" },
  { label: "Add the Java client", cmd: "dev.quicx:quicx-client:2.0.0" },
  { label: "Submit a task", cmd: 'client.submit("send_email", payload)' },
  { label: "Run a worker", cmd: 'worker.handle("send_email", …).start()' },
];

const CHAR_MS = 17;
const SETTLE_MS = 380;
const HOLD_MS = 2800;

type Pos = { step: number; chars: number };
const DONE: Pos = { step: steps.length, chars: 0 };

export function SetupVisual({ active }: { active: boolean }) {
  const reveal = useStageReveal(active);
  const [run, setRun] = useState<Pos>({ step: -1, chars: 0 });

  useEffect(() => {
    if (reveal !== "run") return;
    let t = 0;
    let step = 0;
    let chars = 0;
    const tick = () => {
      if (step >= steps.length) {
        // Hold the finished checklist, then start over.
        t = window.setTimeout(() => {
          step = 0;
          chars = 0;
          setRun({ step, chars });
          t = window.setTimeout(tick, 400);
        }, HOLD_MS);
        return;
      }
      const len = steps[step].cmd.length;
      if (chars < len) {
        chars = Math.min(len, chars + 2);
        setRun({ step, chars });
        t = window.setTimeout(tick, CHAR_MS * 2);
      } else {
        step += 1;
        chars = 0;
        setRun({ step, chars });
        t = window.setTimeout(tick, SETTLE_MS);
      }
    };
    t = window.setTimeout(() => {
      setRun({ step: 0, chars: 0 });
      tick();
    }, 350);
    return () => {
      window.clearTimeout(t);
      setRun({ step: -1, chars: 0 });
    };
  }, [reveal]);

  const pos = reveal === "static" ? DONE : run;
  const animated = reveal === "run";
  const fill = Math.max(0, Math.min(1, pos.step / (steps.length - 1)));

  return (
    <Panel
      title="quick start"
      meta="Linux · macOS · Java 11+"
      className="h-full"
      bodyClassName="flex flex-col justify-center px-4 py-4 sm:px-6"
    >
      <ol className="relative">
        {/* progress rail between the step markers */}
        <span
          aria-hidden
          className="absolute left-3 top-[calc(0.875rem+12px)] bottom-[calc(0.875rem+12px)] w-px -translate-x-1/2 bg-quicx-line-strong"
        >
          <span
            className="absolute inset-0 origin-top bg-quicx-orange transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `scaleY(${fill})` }}
          />
        </span>

        {steps.map((s, i) => {
          const done = i < pos.step;
          const typing = i === pos.step;
          const typed = done ? s.cmd.length : typing ? pos.chars : 0;
          return (
            <li key={s.label} className="relative flex items-start gap-4 py-3.5">
              <span
                aria-hidden
                className={cn(
                  "relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[2px] border font-mono text-[11px] transition-colors duration-300",
                  done
                    ? "border-quicx-orange bg-quicx-orange text-quicx-on-orange"
                    : typing
                      ? "border-quicx-orange bg-quicx-well text-quicx-orange-bright"
                      : "border-quicx-line-strong bg-quicx-well text-quicx-dim"
                )}
              >
                {done ? (
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                    <path
                      d="M3 8.5 6.5 12 13 4.5"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="square"
                      className={animated ? "draw" : undefined}
                      style={{ "--len": 17, "--dur": "320ms" } as React.CSSProperties}
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-[14px] font-medium transition-colors duration-300",
                    done || typing ? "text-quicx-text" : "text-quicx-muted"
                  )}
                >
                  {s.label}
                </span>
                <span className="mt-1 block truncate font-mono text-[12px]">
                  <span className={done ? "text-quicx-body" : "text-quicx-orange-bright"}>
                    {s.cmd.slice(0, typed)}
                  </span>
                  {/* block cursor over the next character */}
                  {typing && (
                    <span className="bg-quicx-orange text-quicx-on-orange">
                      {s.cmd.charAt(typed) || "\u00a0"}
                    </span>
                  )}
                  <span className="text-quicx-dim/60">{s.cmd.slice(typing ? typed + 1 : typed)}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
