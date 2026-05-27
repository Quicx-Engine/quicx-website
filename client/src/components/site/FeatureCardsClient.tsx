"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Terminal, TerminalLine } from "./Terminal";
import { ConfigVisual } from "./visuals/ConfigVisual";
import { FootprintVisual } from "./visuals/FootprintVisual";
import { PerformanceVisual } from "./visuals/PerformanceVisual";
import { ProtocolVisual } from "./visuals/ProtocolVisual";
import { SetupVisual } from "./visuals/SetupVisual";
import { features, type Feature } from "./featuresData";

/* ───────────────── modal context ───────────────── */

const ModalContext = createContext<((id: string | null) => void) | null>(null);

export function FeatureCardsInteractive({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeFeature = features.find((f) => f.id === openId) ?? null;

  return (
    <ModalContext.Provider value={setOpenId}>
      {children}
      <FeatureModal
        feature={activeFeature}
        onClose={() => setOpenId(null)}
        onSwitch={(id) => setOpenId(id)}
      />
    </ModalContext.Provider>
  );
}

/* ───────────────── per-card client slot ───────────────── */

export function FeatureCardSlot({
  featureId,
  className,
  children,
}: {
  featureId: string;
  className?: string;
  children: ReactNode;
}) {
  const setOpenId = useContext(ModalContext);
  const [active, setActive] = useState(false);

  return (
    <button
      id={featureId}
      type="button"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => setOpenId?.(featureId)}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded border border-quicx-line bg-quicx-bg-2 text-left scroll-mt-24",
        "transition-all duration-500 ease-out",
        "hover:border-white/15 hover:bg-quicx-bg-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quicx-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-quicx-bg",
        className
      )}
    >
      {/* server-rendered chrome (title, expand icon, gradient overlays) */}
      {children}

      {/* Visual */}
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
        <div className="relative h-full">
          <VisualFor id={featureId} active={active} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-quicx-bg-2" />
      </div>
    </button>
  );
}

/* ───────────────── visual dispatch ───────────────── */

function VisualFor({
  id,
  active,
  expanded,
}: {
  id: string;
  active: boolean;
  expanded?: boolean;
}) {
  switch (id) {
    case "observability":
      return <TerminalShowcase active={active} />;
    case "configurability":
      return <ConfigVisual active={active} />;
    case "lightweight":
      return <FootprintVisual active={active} />;
    case "performance":
      return <PerformanceVisual active={active} />;
    case "protocol":
      return <ProtocolVisual active={active} expanded={expanded} />;
    case "setup":
      return <SetupVisual active={active} />;
    default:
      return null;
  }
}

/* ───────────────── terminal showcase ───────────────── */

const initialUsageSequence: TerminalLine[] = [
  { kind: "input", text: "quicx" },
  { kind: "output", text: "quicx v1.0.0 — lightweight task queue daemon" },
  { kind: "blank" },
  { kind: "output", text: "usage:" },
  { kind: "output", text: "  quicx start --config FILE" },
  { kind: "output", text: "  quicx stop" },
  { kind: "output", text: "  quicx status" },
  { kind: "output", text: "  quicx version" },
];

const usageSequence: TerminalLine[] = [
  { kind: "input", text: "clear" },
  { kind: "clear" },
  ...initialUsageSequence,
];

const statusSequence: TerminalLine[] = [
  { kind: "input", text: "clear" },
  { kind: "clear" },
  { kind: "input", text: "quicx status" },
  { kind: "blank" },
  { kind: "output", text: "  quicx v1.0.0", className: "text-quicx-text" },
  { kind: "output", text: "  ─────────────────────────────────────────", className: "text-quicx-dim" },
  { kind: "output", text: "  uptime     0h 0m 7s" },
  { kind: "blank" },
  { kind: "output", text: "  workers    idle: 0     busy: 0     total: 0" },
  { kind: "output", text: "  queue      waiting: 0" },
  { kind: "blank" },
  { kind: "output", text: "  tasks      submitted: 0" },
  { kind: "output", text: "             completed: 0" },
  { kind: "output", text: "             failed:    0" },
  { kind: "blank" },
  { kind: "output", text: "  memory     32 / 913408 bytes (0.0%)" },
  { kind: "blank" },
  { kind: "output", text: "  PMAD:", className: "text-quicx-orange-bright" },
  { kind: "output", text: "      32B  [░░░░░░░░░░░░░░░░░░░░]  1 / 2184" },
  { kind: "output", text: "      64B  [░░░░░░░░░░░░░░░░░░░░]  0 / 3276" },
  { kind: "output", text: "     128B  [░░░░░░░░░░░░░░░░░░░░]  0 / 1820" },
  { kind: "output", text: "     256B  [░░░░░░░░░░░░░░░░░░░░]  0 /  770" },
  { kind: "output", text: "     512B  [░░░░░░░░░░░░░░░░░░░░]  0 /  238" },
  { kind: "output", text: "    1024B  [░░░░░░░░░░░░░░░░░░░░]  0 /   80" },
];

function TerminalShowcase({ active }: { active: boolean }) {
  const [hasHovered, setHasHovered] = useState(false);

  useEffect(() => {
    if (active) setHasHovered(true);
  }, [active]);

  const currentLines = active
    ? statusSequence
    : hasHovered
      ? usageSequence
      : initialUsageSequence;

  return (
    <div className="h-full p-5">
      <Terminal
        lines={currentLines}
        active={true}
        typeSpeed={22}
        lineDelay={35}
      />
    </div>
  );
}

/* ───────────────── modal ───────────────── */

function FeatureModal({
  feature,
  onClose,
  onSwitch,
}: {
  feature: Feature | null;
  onClose: () => void;
  onSwitch: (id: string) => void;
}) {
  const open = feature !== null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "top-0 left-0 h-[100dvh] w-[100vw] max-w-none translate-x-0 translate-y-0",
          "gap-0 rounded-none border-0 bg-quicx-bg p-0 shadow-none",
          "sm:top-[50%] sm:left-[50%] sm:h-[min(92vh,900px)] sm:w-[min(92vw,1200px)] sm:max-w-[min(92vw,1200px)]",
          "sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded sm:border sm:border-quicx-line"
        )}
      >
        {feature && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-quicx-line px-6 py-4 sm:px-10">
              <span className="font-[family-name:var(--font-barlow-condensed)] text-xs uppercase tracking-[0.3em] text-quicx-dim">
                Feature · {feature.id}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-9 items-center justify-center rounded border border-quicx-line bg-white/[0.02] text-quicx-muted transition hover:border-white/20 hover:text-quicx-text"
              >
                <XIconSmall className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ModalBody feature={feature} />
              <MoreToDiscover
                currentId={feature.id}
                onSwitch={(id) => onSwitch(id)}
              />
            </div>
          </div>
        )}
        {feature && (
          <>
            <DialogTitle className="sr-only">{feature.modalTitle}</DialogTitle>
            <DialogDescription className="sr-only">
              {feature.shortSummary}
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ModalBody({ feature }: { feature: Feature }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-10 sm:px-10 sm:pt-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <h2 className="text-balance font-[family-name:var(--font-archivo)] text-3xl font-semibold leading-[1.1] text-quicx-text sm:text-4xl">
            {feature.modalTitle}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-quicx-muted">
            {feature.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/docs#quick-start">
              <Button
                size="lg"
                className="h-11 rounded bg-quicx-orange px-5 font-[family-name:var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wider text-white hover:bg-quicx-orange-bright"
              >
                Start with Quicx
              </Button>
            </a>
            <a href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded border-white/15 bg-transparent px-5 font-[family-name:var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wider text-quicx-text hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
              >
                See the Docs
              </Button>
            </a>
          </div>
        </div>

        <ul className="flex flex-col justify-center gap-3">
          {feature.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 text-[14.5px] leading-relaxed text-quicx-text"
            >
              <CheckDot accent={feature.tint.accent} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          "relative mt-12 overflow-hidden rounded border border-quicx-line bg-quicx-bg-2",
          feature.id === "observability" ? "min-h-[650px]" : ""
        )}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${feature.tint.radial}, var(--quicx-bg-2) 70%)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
        <div className="relative h-full">
          <VisualFor id={feature.id} active={true} expanded={true} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 border-t border-quicx-line pt-10 sm:grid-cols-3">
        {feature.footnotes.map((f) => (
          <div key={f.title}>
            <div
              className="mb-3 inline-flex size-8 items-center justify-center rounded border"
              style={{
                borderColor: feature.tint.accent + "55",
                background: feature.tint.accent + "12",
                color: feature.tint.accent,
              }}
            >
              <DotIcon className="size-3" />
            </div>
            <h4 className="font-[family-name:var(--font-archivo)] text-[15px] font-semibold text-quicx-text">
              {f.title}
            </h4>
            <p className="mt-2 text-[13.5px] leading-relaxed text-quicx-muted">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoreToDiscover({
  currentId,
  onSwitch,
}: {
  currentId: string;
  onSwitch: (id: string) => void;
}) {
  const related = features.filter((f) => f.id !== currentId).slice(0, 3);
  return (
    <section className="border-t border-quicx-line px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <h3 className="font-[family-name:var(--font-archivo)] text-2xl font-semibold text-quicx-text">
          More to discover
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {related.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onSwitch(f.id)}
              className="group relative h-56 overflow-hidden rounded border border-quicx-line bg-quicx-bg-2 text-left transition-all hover:border-white/15 hover:bg-quicx-bg-3"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 50% at 85% 0%, ${f.tint.radial}, transparent 60%)`,
                }}
              />
              <div className="relative flex h-full flex-col p-5">
                <h4 className="text-[16px] font-semibold text-quicx-text">
                  {f.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-[13px] text-quicx-muted">
                  {f.shortSummary}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 font-[family-name:var(--font-barlow-condensed)] text-[12px] uppercase tracking-wider text-quicx-orange-bright">
                  Open
                  <ExpandIcon className="size-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── icons ───────────────── */

function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 3h3v3" />
      <path d="M13 3l-5 5" />
      <path d="M6 13H3v-3" />
      <path d="M3 13l5-5" />
    </svg>
  );
}

function XIconSmall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

function CheckDot({ accent }: { accent: string }) {
  return (
    <span
      className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full"
      style={{
        background: accent + "22",
        border: `1px solid ${accent}55`,
        color: accent,
      }}
    >
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-2.5"
      >
        <path d="M2 6l2.5 2.5L10 3" />
      </svg>
    </span>
  );
}

function DotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" {...props}>
      <circle cx="6" cy="6" r="3" />
    </svg>
  );
}
