"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TerminalLine =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string; className?: string }
  | { kind: "blank" }
  | { kind: "clear" };

type Props = {
  lines: TerminalLine[];
  active: boolean;
  /** ms between characters while typing input */
  typeSpeed?: number;
  /** ms before output appears after an input line finishes */
  outputDelay?: number;
  /** ms between output lines */
  lineDelay?: number;
  className?: string;
  prompt?: string;
};

/**
 * A simulated terminal that "types" an input command and streams output lines
 * whenever `active` flips to true. Restarts when `active` goes back to true.
 */
export function Terminal({
  lines,
  active,
  typeSpeed = 28,
  outputDelay = 220,
  lineDelay = 55,
  className,
  prompt = "user@host ~ $",
}: Props) {
  const [visible, setVisible] = useState<TerminalLine[]>([]);
  const [typingText, setTypingText] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    setTypingText("");

    // Sequential playback
    let cursor = 0;
    const playNext = () => {
      if (cursor >= lines.length) return;
      const line = lines[cursor];

      if (line.kind === "input") {
        setTypingText("");
        let i = 0;
        const typeChar = () => {
          i += 1;
          setTypingText(line.text.slice(0, i));
          if (i < line.text.length) {
            timers.current.push(setTimeout(typeChar, typeSpeed));
          } else {
            // commit the input line
            timers.current.push(
              setTimeout(() => {
                setVisible((prev) => [...prev, line]);
                setTypingText("");
                cursor += 1;
                playNext();
              }, outputDelay)
            );
          }
        };
        typeChar();
      } else if (line.kind === "clear") {
        timers.current.push(
          setTimeout(() => {
            setVisible([]);
            cursor += 1;
            playNext();
          }, 300)
        );
      } else {
        timers.current.push(
          setTimeout(() => {
            setVisible((prev) => [...prev, line]);
            cursor += 1;
            playNext();
          }, lineDelay)
        );
      }
    };

    playNext();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible, typingText]);

  const isTypingNow = typingText.length > 0;

  // Pre-calculate final lines to reserve exact height
  const lastClearIdx = (() => {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].kind === "clear") return i;
    }
    return -1;
  })();
  const finalLines = lastClearIdx >= 0 ? lines.slice(lastClearIdx + 1) : lines;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#061219] font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-relaxed text-quicx-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/[0.02] px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 text-[10.5px] tracking-wide text-quicx-dim">
          quicx — zsh
        </span>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        className="terminal-scroll relative flex-1 overflow-y-auto px-4 py-3"
      >
        {/* Invisible final state to set exact height container */}
        <div className="pointer-events-none invisible" aria-hidden="true">
          {finalLines.map((line, idx) => {
            if (line.kind === "input") {
              return (
                <div key={`inv-${idx}`} className="text-quicx-text">
                  <span className="text-quicx-dim">{prompt}</span>{" "}
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.kind === "blank") {
              return <div key={`inv-${idx}`}>&nbsp;</div>;
            }
            if (line.kind === "clear") return null;
            return (
              <div
                key={`inv-${idx}`}
                className={cn("whitespace-pre text-quicx-muted", line.className)}
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Absolute positioned typing state */}
        <div className="absolute inset-0 px-4 py-3">
          {visible.map((line, idx) => {
            if (line.kind === "input") {
              return (
                <div key={idx} className="text-quicx-text">
                  <span className="text-quicx-dim">{prompt}</span>{" "}
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.kind === "blank") {
              return <div key={idx}>&nbsp;</div>;
            }
            if (line.kind === "clear") return null;
            return (
              <div
                key={idx}
                className={cn("whitespace-pre text-quicx-muted", line.className)}
              >
                {line.text}
              </div>
            );
          })}

          {isTypingNow && (
            <div className="text-quicx-text">
              <span className="text-quicx-dim">{prompt}</span>{" "}
              <span>{typingText}</span>
              <span className="caret-blink ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] bg-quicx-orange-bright align-middle" />
            </div>
          )}

          {/* Trailing caret when idle but not done */}
          {active && !isTypingNow && visible.length < lines.length && (
            <div className="text-quicx-text">
              <span className="text-quicx-dim">{prompt}</span>{" "}
              <span className="caret-blink ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] bg-quicx-orange-bright align-middle" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
