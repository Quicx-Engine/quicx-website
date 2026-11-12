"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "./visuals/Panel";

export type TerminalLine =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string; className?: string }
  | { kind: "blank" }
  | { kind: "clear" };

type Props = {
  lines: TerminalLine[];
  /** Leading lines that are already on screen and are not replayed. */
  instant?: number;
  /** ms between characters while typing input */
  typeSpeed?: number;
  /** ms before output appears after an input line finishes */
  outputDelay?: number;
  /** ms between output lines */
  lineDelay?: number;
  className?: string;
  prompt?: string;
};

function afterLastClear(lines: TerminalLine[]) {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].kind === "clear") return lines.slice(i + 1);
  }
  return lines;
}

/**
 * A simulated terminal that types each input line and streams its output.
 * Replays from `instant` whenever `lines` changes; under reduced motion it
 * shows the final screen at once.
 */
export function Terminal({
  lines,
  instant = 0,
  typeSpeed = 28,
  outputDelay = 220,
  lineDelay = 55,
  className,
  prompt = "user@host ~ $",
}: Props) {
  const [visible, setVisible] = useState<TerminalLine[]>(() => lines.slice(0, instant));
  const [typingText, setTypingText] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    clearTimers();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timers.current.push(
        setTimeout(() => {
          setVisible(afterLastClear(lines));
          setTypingText("");
        }, 0)
      );
      return clearTimers;
    }

    let cursor = instant;
    timers.current.push(
      setTimeout(() => {
        setVisible(lines.slice(0, instant));
        setTypingText("");
        playNext();
      }, 0)
    );

    function playNext() {
      if (cursor >= lines.length) return;
      const line = lines[cursor];

      if (line.kind === "input") {
        let i = 0;
        const typeChar = () => {
          i += 1;
          setTypingText(line.text.slice(0, i));
          if (i < line.text.length) {
            timers.current.push(setTimeout(typeChar, typeSpeed));
          } else {
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
        timers.current.push(setTimeout(typeChar, typeSpeed));
      } else if (line.kind === "clear") {
        timers.current.push(
          setTimeout(() => {
            setVisible([]);
            cursor += 1;
            playNext();
          }, 240)
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
    }

    return clearTimers;
  }, [lines, instant, typeSpeed, outputDelay, lineDelay]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible, typingText]);

  // Verbatim output keeps its columns, so on a narrow screen it scrolls
  // sideways; the right edge fades while there is more to the right.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sync = () =>
      el.toggleAttribute("data-more", el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [visible]);

  const done = visible.length > 0 && typingText === "" && visible.length >= afterLastClear(lines).length;

  return (
    <Panel title="zsh" className={cn("h-full", className)}>
      <div
        ref={scrollRef}
        className="terminal-scroll h-full overflow-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.65] text-quicx-muted"
      >
        {visible.map((line, idx) => {
          if (line.kind === "input") {
            return (
              <div key={idx} className="line-print whitespace-pre text-quicx-text">
                <span className="text-quicx-dim">{prompt}</span> {line.text}
              </div>
            );
          }
          if (line.kind === "blank") return <div key={idx}>&nbsp;</div>;
          if (line.kind === "clear") return null;
          return (
            <div key={idx} className={cn("line-print whitespace-pre", line.className)}>
              {line.text}
            </div>
          );
        })}

        {(typingText || done) && (
          <div className="whitespace-pre text-quicx-text">
            <span className="text-quicx-dim">{prompt}</span> {typingText}
            <span
              aria-hidden
              data-loop className="caret-blink ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[3px] bg-quicx-orange"
            />
          </div>
        )}
      </div>
    </Panel>
  );
}
