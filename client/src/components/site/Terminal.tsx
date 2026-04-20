"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TerminalLine =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string; className?: string }
  | { kind: "blank" };

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
  prompt = "~",
}: Props) {
  const [visible, setVisible] = useState<TerminalLine[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    if (!active) {
      const reset = setTimeout(() => {
        setVisible([]);
        setTypingIndex(0);
        setTypingText("");
      }, 0);
      return () => clearTimeout(reset);
    }

    // Sequential playback
    let cursor = 0;
    const playNext = () => {
      if (cursor >= lines.length) return;
      const line = lines[cursor];

      if (line.kind === "input") {
        setTypingIndex(cursor);
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
  }, [active]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible, typingText]);

  const isTypingNow =
    active && typingText.length > 0 && typingIndex === visible.length;

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
        className="terminal-scroll flex-1 overflow-y-auto px-4 py-3"
      >
        {visible.map((line, idx) => {
          if (line.kind === "input") {
            return (
              <div key={idx} className="text-quicx-text">
                <span className="text-quicx-orange-bright">❯</span>{" "}
                <span className="text-quicx-dim">{prompt}</span>{" "}
                <span>{line.text}</span>
              </div>
            );
          }
          if (line.kind === "blank") {
            return <div key={idx}>&nbsp;</div>;
          }
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
            <span className="text-quicx-orange-bright">❯</span>{" "}
            <span className="text-quicx-dim">{prompt}</span>{" "}
            <span>{typingText}</span>
            <span className="caret-blink ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] bg-quicx-orange-bright align-middle" />
          </div>
        )}

        {/* Trailing caret when idle but not done */}
        {active && !isTypingNow && visible.length < lines.length && (
          <div className="text-quicx-text">
            <span className="text-quicx-orange-bright">❯</span>{" "}
            <span className="text-quicx-dim">{prompt}</span>{" "}
            <span className="caret-blink ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] bg-quicx-orange-bright align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}
