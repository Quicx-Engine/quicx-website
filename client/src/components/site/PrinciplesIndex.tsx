"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Feature } from "./featuresData";
import { VisualFor } from "./FeatureVisual";
import { useReducedMotion, useWideScreen } from "./motion";

/** How long the tour holds each principle on stage. */
const TOUR_MS = 9000;

const pad = (n: number) => String(n).padStart(2, "0");

// Literal class names so Tailwind can see them.
const ROW_START = [
  "lg:row-start-1",
  "lg:row-start-2",
  "lg:row-start-3",
  "lg:row-start-4",
  "lg:row-start-5",
  "lg:row-start-6",
];

/**
 * Six principles as a vertical index with one live stage. On wide screens the
 * index and the selected principle's argument sit on the left and the stage on
 * the right; on narrow screens CSS `order` drops the stage and argument
 * directly under the selected entry, so the same markup reads as an accordion.
 *
 * On wide screens the index plays itself as a tour, so a visitor who never
 * clicks still sees every stage: the selected entry's rule fills as a timer
 * and the next principle takes the stage when it is full. The tour waits while
 * the stage is off screen or a tab has keyboard focus, has a Pause control,
 * and ends for good the moment the visitor picks a principle or touches the
 * stage. Narrow screens get no tour (moving the accordion would shift the page
 * under the reader); a "Next" control and open markers on the other entries
 * show that there is more.
 */
export function PrinciplesIndex({ features }: { features: Feature[] }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [tourStopped, setTourStopped] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const reduced = useReducedMotion();
  const wide = useWideScreen();
  const touring = wide && !reduced && !tourStopped;
  const tourRunning = touring && !tourPaused && inView && !keyboardFocus;
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** The visitor chose: show it, and end the tour. */
  const select = (i: number, focus = false) => {
    const next = (i + features.length) % features.length;
    setTourStopped(true);
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
    return next;
  };

  /** The tour's own step; leaves the tour running. */
  const advance = () => setActive((a) => (a + 1) % features.length);

  /** "Next" from under the stage. On narrow screens the stage moves to the
      next entry, so bring that entry into view with it. */
  const selectNext = () => {
    const next = select(active + 1);
    if (!wide) {
      requestAnimationFrame(() =>
        tabRefs.current[next]?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" })
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      select(i + 1, true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      select(i - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(features.length - 1, true);
    }
  };

  const f = features[active];
  const nextFeature = features[(active + 1) % features.length];

  return (
    <div
      data-tour={tourRunning ? "running" : "paused"}
      style={{ "--dwell": `${TOUR_MS}ms` } as React.CSSProperties}
      className="mt-16 grid grid-cols-1 gap-x-14 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[repeat(6,auto)_1fr]">
      <div role="tablist" aria-orientation="vertical" aria-label="Principles" className="contents">
        {features.map((feature, i) => {
          const selected = i === active;
          return (
            <button
              key={feature.id}
              id={feature.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="principle-stage"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onFocus={(e) => setKeyboardFocus(e.currentTarget.matches(":focus-visible"))}
              onBlur={() => setKeyboardFocus(false)}
              style={{ order: i * 3 }}
              className={cn(
                "group relative scroll-mt-28 border-t py-5 text-left transition-colors lg:col-start-1 lg:!order-none",
                ROW_START[i],
                "border-quicx-line hover:border-quicx-line-strong"
              )}
            >
              {/* The selection rule draws across from the left; during the tour it
                  fills over the time the principle holds the stage. */}
              <span
                aria-hidden
                onAnimationEnd={(e) => {
                  if (e.animationName === "tour-fill" && selected && touring) advance();
                }}
                className={cn(
                  "absolute inset-x-0 -top-px h-px origin-left bg-quicx-orange",
                  selected && touring
                    ? "tour-fill"
                    : cn(
                        "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                        selected ? "scale-x-100" : "scale-x-0"
                      )
                )}
              />
              <span className="flex items-baseline justify-between gap-4">
                <span
                  className={cn(
                    "text-[19px] font-semibold leading-snug tracking-[-0.01em] transition-colors",
                    selected ? "text-quicx-text" : "text-quicx-muted group-hover:text-quicx-text"
                  )}
                >
                  {feature.title}
                </span>
                {/* Filled for the principle on stage; an open slot for the others. */}
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 translate-y-[-2px] border transition-colors",
                    selected
                      ? "border-quicx-orange bg-quicx-orange"
                      : "border-quicx-dim/70 bg-transparent group-hover:border-quicx-orange"
                  )}
                />
              </span>
              <span
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <span className="overflow-hidden">
                  <span className="block max-w-[46ch] pt-2.5 text-[15px] leading-[1.6] text-quicx-muted">
                    {feature.shortSummary}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* The live stage and its notes */}
      <div
        id="principle-stage"
        role="tabpanel"
        aria-labelledby={f.id}
        ref={stageRef}
        style={{ order: active * 3 + 1 }}
        className="mt-2 lg:col-start-2 lg:row-span-7 lg:row-start-1 lg:!order-none lg:mt-0"
      >
        <div
          onPointerDown={() => setTourStopped(true)}
          className="relative overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well"
        >
          <span key={`${f.id}-scan`} aria-hidden className="stage-scanline" />
          <div key={f.id} className="stage-in h-[500px] sm:h-[440px]">
            <VisualFor id={f.id} active={inView} />
          </div>
        </div>

        {/* Where you are, and the way on */}
        <div className="mt-3 flex min-h-8 items-center justify-between gap-4 font-mono text-[12px] text-quicx-dim">
          <div className="flex shrink-0 items-center gap-4">
            <span className="tabular-nums">
              <span className="text-quicx-text">{pad(active + 1)}</span> / {pad(features.length)}
            </span>
            {touring && (
              <button
                type="button"
                onClick={() => setTourPaused((p) => !p)}
                aria-pressed={tourPaused}
                className="-mx-1.5 inline-flex min-h-8 items-center gap-1.5 rounded-[2px] px-1.5 transition-colors hover:text-quicx-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-quicx-orange"
              >
                {tourPaused ? (
                  <Play aria-hidden className="size-3" />
                ) : (
                  <Pause aria-hidden className="size-3" />
                )}
                {tourPaused ? "Play the tour" : "Pause the tour"}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={selectNext}
            className="group -mx-1.5 inline-flex min-h-8 min-w-0 items-center gap-2 rounded-[2px] px-1.5 text-quicx-muted transition-colors hover:text-quicx-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-quicx-orange"
          >
            <span className="truncate">
              <span className="text-quicx-dim">Next</span>
              <span className="sm:hidden"> principle</span>
              <span className="hidden sm:inline"> · {nextFeature.title}</span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-3.5 shrink-0 text-quicx-orange transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>

        <dl key={`${f.id}-notes`} className="stage-notes mt-4 border-t border-quicx-line">
          {f.footnotes.map((n) => (
            <div
              key={n.title}
              className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-quicx-line py-3.5 sm:grid-cols-[13rem_minmax(0,1fr)]"
            >
              <dt className="text-[14px] font-semibold text-quicx-text">{n.title}</dt>
              <dd className="text-[14px] leading-[1.6] text-quicx-muted">{n.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The selected principle's argument, under the index on wide screens */}
      <div
        key={`${f.id}-copy`}
        style={{ order: active * 3 + 2 }}
        className="stage-notes mb-8 mt-8 lg:col-start-1 lg:row-start-7 lg:!order-none lg:mb-0 lg:mt-10"
      >
        {f.modalTitle !== f.title && (
          <h3 className="text-balance text-[22px] font-semibold leading-tight tracking-[-0.01em] text-quicx-text">
            {f.modalTitle}
          </h3>
        )}
        <p
          className={cn(
            "max-w-[52ch] text-[15px] leading-[1.65] text-quicx-muted",
            f.modalTitle !== f.title && "mt-3"
          )}
        >
          {f.description}
        </p>
        <ul className="mt-6 space-y-3">
          {f.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[14.5px] leading-[1.55] text-quicx-body">
              <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-quicx-orange" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
