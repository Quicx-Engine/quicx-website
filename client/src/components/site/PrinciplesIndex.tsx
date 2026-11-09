"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Feature } from "./featuresData";
import { VisualFor } from "./FeatureVisual";

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
 */
export function PrinciplesIndex({ features }: { features: Feature[] }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
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

  const select = (i: number, focus = false) => {
    const next = (i + features.length) % features.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
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

  return (
    <div className="mt-16 grid grid-cols-1 gap-x-14 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[repeat(6,auto)_1fr]">
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
              style={{ order: i * 3 }}
              className={cn(
                "group relative scroll-mt-28 border-t py-5 text-left transition-colors lg:col-start-1 lg:!order-none",
                ROW_START[i],
                "border-quicx-line hover:border-quicx-line-strong"
              )}
            >
              {/* The selection rule draws across from the left. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -top-px h-px origin-left bg-quicx-orange transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                  selected ? "scale-x-100" : "scale-x-0"
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
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 translate-y-[-2px] transition-colors",
                    selected ? "bg-quicx-orange" : "bg-transparent"
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
        <div className="relative overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well">
          <span key={`${f.id}-scan`} aria-hidden className="stage-scanline" />
          <div key={f.id} className="stage-in h-[500px] sm:h-[440px]">
            <VisualFor id={f.id} active={inView} />
          </div>
        </div>

        <dl key={`${f.id}-notes`} className="stage-notes mt-6 border-t border-quicx-line">
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
