"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Install binary", cmd: "curl -fsSL quicx.dev/install | sh", time: "0:45" },
  { label: "Write config", cmd: "quicx init > quicx.conf", time: "1:20" },
  { label: "Start daemon", cmd: "quicx start", time: "1:35" },
  { label: "Add client", cmd: "mvn add dev.quicx:quicx-client", time: "3:20" },
  { label: "Submit task", cmd: "Quicx.submit(task).await();", time: "5:00" },
];

export function SetupVisual({ active }: { active: boolean }) {
  const [done, setDone] = useState<number>(-1);

  useEffect(() => {
    if (!active) {
      const reset = setTimeout(() => setDone(-1), 0);
      return () => clearTimeout(reset);
    }
    let i = 0;
    const start = setTimeout(() => setDone(-1), 0);
    const id = setInterval(() => {
      setDone(i);
      i += 1;
      if (i > steps.length) {
        i = 0;
        setDone(-1);
      }
    }, 800);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [active]);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <span className="text-[10px] tracking-wide text-quicx-dim">
            5-minute onboarding
          </span>
          <span className="text-[10px] text-quicx-orange-bright">
            Linux · macOS · Java client
          </span>
        </div>
        <div className="flex-1 px-4 py-3">
          <ol className="space-y-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
            {steps.map((s, i) => {
              const completed = done >= i;
              const current = done === i;
              return (
                <li key={s.label} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      completed
                        ? "border-quicx-orange/60 bg-quicx-orange/15 text-quicx-orange-bright shadow-[0_0_8px_rgba(255,87,0,0.3)] scale-[1.05]"
                        : "border-white/10 text-quicx-dim scale-95",
                      current && "shadow-[0_0_0_3px_rgba(255,87,0,0.2)]"
                    )}
                  >
                    {completed ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="size-3"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 10l4 4 8-8" />
                      </svg>
                    ) : (
                      <span className="text-[9px]">{i + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "text-[12px]",
                          completed ? "text-quicx-text" : "text-quicx-muted"
                        )}
                      >
                        {s.label}
                      </span>
                      <span className="text-[10px] tabular-nums text-quicx-dim">
                        {s.time}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-quicx-dim">
                      <span className="text-quicx-orange-bright">$</span>{" "}
                      {s.cmd}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
