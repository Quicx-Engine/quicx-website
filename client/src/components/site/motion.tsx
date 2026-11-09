"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal states, read by the CSS in globals.css through `data-reveal`:
 *
 *   static  the finished picture, exactly as server-rendered (no motion)
 *   armed   reset to the start of the sequence, waiting to be seen
 *   run     playing the sequence through to the finished picture
 *
 * Markup always ships the finished figures. Only once the page is interactive
 * does anything off screen get armed, so a page without scripts, or with
 * reduced motion, never shows zeros.
 */
export type RevealState = "static" | "armed" | "run";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * True on the server and during hydration, so the first render always matches
 * the static markup; after that, the visitor's real preference.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => true
  );
}

/**
 * One-shot reveal driven by the element's own visibility. Anything below the
 * fold once the page is live is armed, and runs the first time it is seen.
 */
export function useReveal<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          setState((s) => (s === "static" ? "armed" : s));
        } else if (e.intersectionRatio >= threshold) {
          setState((s) => (s === "armed" ? "run" : s));
        }
      },
      { threshold: [0, threshold] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, state] as const;
}

/**
 * Reveal driven by a parent's notion of "on stage": armed while off stage,
 * running while on it, so the sequence replays each time the stage returns.
 */
export function useStageReveal(active: boolean): RevealState {
  const reduced = useReducedMotion();
  if (reduced) return "static";
  return active ? "run" : "armed";
}

/** Wrapper that carries a reveal state for everything inside it. */
export function Reveal({
  as: Tag = "div",
  className,
  threshold,
  children,
}: {
  as?: "div" | "section" | "figure" | "dl" | "ol";
  className?: string;
  threshold?: number;
  children: React.ReactNode;
}) {
  const [ref, state] = useReveal<HTMLElement>(threshold);
  return (
    <Tag ref={ref as React.Ref<never>} data-reveal={state} className={className}>
      {children}
    </Tag>
  );
}

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * A figure whose digits roll into place, each column a full turn past its
 * value. The final value is in the markup (and read out once to assistive
 * tech); the roll only plays inside a running reveal or a `.odo-run` parent.
 */
export function Odometer({
  value,
  delay = 0,
  className,
}: {
  value: string;
  delay?: number;
  className?: string;
}) {
  let k = 0;
  return (
    <span className={cn("odo", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {Array.from(value).map((ch, i) => {
          if (ch < "0" || ch > "9") return <span key={i}>{ch}</span>;
          const n = Number(ch);
          const idx = k++;
          return (
            <span key={i} className="odo-digit">
              <span
                className="odo-col"
                style={
                  {
                    transform: `translateY(-${10 + n}em)`,
                    "--i": idx,
                    "--d": `${delay}ms`,
                  } as React.CSSProperties
                }
              >
                {DIGITS.map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/**
 * Pauses every decorative loop (`data-loop`) while it is off screen, so a
 * blinking caret or a pulsing status dot costs nothing once scrolled past.
 * Mounted once in the root layout; picks up loops that mount later too.
 */
export function MotionGovernor() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-paused", !e.isIntersecting);
      },
      { rootMargin: "64px 0px" }
    );
    const seen = new WeakSet<Element>();
    const watch = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    };
    const scan = (root: Element | Document) => {
      if (root instanceof Element && root.hasAttribute("data-loop")) watch(root);
      root.querySelectorAll("[data-loop]").forEach(watch);
    };
    scan(document);
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE) scan(n as Element);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
