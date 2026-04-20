"use client";

import { ReactNode, useState } from "react";
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

const statusOutput: TerminalLine[] = [
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
  { kind: "output", text: "      32B  [\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  1 / 2184" },
  { kind: "output", text: "      64B  [\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  0 / 3276" },
  { kind: "output", text: "     128B  [\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  0 / 1820" },
  { kind: "output", text: "     256B  [\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  0 /  770" },
  { kind: "output", text: "     512B  [\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  0 /  238" },
  { kind: "output", text: "    1024B  [\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  0 /   80" },
];

type FeatureTint = {
  /** linear gradient for the soft-light on the card */
  glow: string;
  /** stop color for a subtle top-right radial */
  radial: string;
  /** hex for the highlight accent */
  accent: string;
};

type Feature = {
  id: string;
  title: string;
  /** modal headline */
  modalTitle: string;
  shortSummary: string;
  description: string;
  bullets: string[];
  tint: FeatureTint;
  renderVisual: (active: boolean) => ReactNode;
  footnotes: { title: string; body: string }[];
};

const orangeTint: FeatureTint = {
  glow: "from-quicx-orange/25 via-quicx-orange/5 to-transparent",
  radial: "rgba(255,87,0,0.18)",
  accent: "#FF7A33",
};
const violetTint: FeatureTint = {
  glow: "from-[#a78bfa]/25 via-[#a78bfa]/5 to-transparent",
  radial: "rgba(167,139,250,0.18)",
  accent: "#a78bfa",
};
const tealTint: FeatureTint = {
  glow: "from-[#5eead4]/25 via-[#5eead4]/5 to-transparent",
  radial: "rgba(94,234,212,0.18)",
  accent: "#5eead4",
};
const amberTint: FeatureTint = {
  glow: "from-[#fbbf24]/25 via-[#fbbf24]/5 to-transparent",
  radial: "rgba(251,191,36,0.18)",
  accent: "#fbbf24",
};
const blueTint: FeatureTint = {
  glow: "from-[#60a5fa]/25 via-[#60a5fa]/5 to-transparent",
  radial: "rgba(96,165,250,0.18)",
  accent: "#60a5fa",
};
const roseTint: FeatureTint = {
  glow: "from-[#f472b6]/25 via-[#f472b6]/5 to-transparent",
  radial: "rgba(244,114,182,0.18)",
  accent: "#f472b6",
};

const features: Feature[] = [
  {
    id: "observability",
    title: "Observe the engine in real time",
    modalTitle: "Observe the engine in real time",
    shortSummary:
      "A first-class CLI gives you a deterministic view of every moving part — without touching runtime performance.",
    description:
      "The quicx CLI gives you a complete, deterministic view of the engine: PMAD slabs, worker states, queue depth, and task counts — read straight from the daemon over a side-channel that never competes with the hot path.",
    bullets: [
      "Per-size-class PMAD usage in real time",
      "Worker pool state — idle, busy, total",
      "Tasks submitted, completed, failed",
      "Live pool_size utilization, versus your configured ceiling",
    ],
    tint: orangeTint,
    renderVisual: (active) => (
      <div className="h-full p-5">
        <Terminal
          lines={statusOutput}
          active={active}
          typeSpeed={22}
          lineDelay={35}
        />
      </div>
    ),
    footnotes: [
      {
        title: "Zero-overhead introspection",
        body: "Monitoring runs out-of-band. It never blocks or slows down task processing.",
      },
      {
        title: "Human-readable output",
        body: "Clean text formatting — no log parsers, no JSON, no dashboards required.",
      },
      {
        title: "Built into the binary",
        body: "No sidecar, no agent, no separate monitoring stack to deploy.",
      },
    ],
  },
  {
    id: "configurability",
    title: "One TOML file. Zero guesswork.",
    modalTitle: "Configure memory exactly the way you want it",
    shortSummary:
      "Declare a pool size and a size-class mix. PMAD lays out memory exactly as you asked — no guesswork, no fragmentation.",
    description:
      "Quicx is built on PMAD, a custom deterministic slab allocator. You declare your memory ceiling and your size-class distribution in a single TOML file; PMAD carves up the pool at startup and hands out slots in O(1), every time.",
    bullets: [
      "Fixed pool_size cap, enforced from process start",
      "Tunable size classes (e.g. 32B, 64B, 128B, 256B, 512B, 1024B)",
      "Size-class percentages tuned to your payload shape",
      "O(1) allocation and free — no GC, no fragmentation",
    ],
    tint: violetTint,
    renderVisual: (active) => <ConfigVisual active={active} />,
    footnotes: [
      {
        title: "Deterministic layout",
        body: "Memory is carved up exactly as configured — same layout every time you boot.",
      },
      {
        title: "No fragmentation",
        body: "Known payload shapes map to the right size class; no wasted bytes.",
      },
      {
        title: "Tunable per workload",
        body: "Different configs for different services, all in a single TOML.",
      },
    ],
  },
  {
    id: "lightweight",
    title: "60 KB. Bounded memory.",
    modalTitle: "One binary. One memory budget. No surprises.",
    shortSummary:
      "A single ~60 KB static binary that never drifts past the memory budget you set. Drop it next to your backend — bounded by design.",
    description:
      "Quicx ships as a single ~60 KB static binary. There's no runtime, no JVM, no scheduler to tune. You set a pool_size and that is the memory ceiling — enforced by PMAD, not by hope.",
    bullets: [
      "Single static binary, no runtime dependencies",
      "Hard memory ceiling, enforced by the allocator",
      "Instant boot — no warmup, no profile-guided jitter",
      "Safe to co-locate on the same VM as your backend",
    ],
    tint: tealTint,
    renderVisual: (active) => <FootprintVisual active={active} />,
    footnotes: [
      {
        title: "No runtime dependencies",
        body: "Just a binary. No interpreter, no VM, no package manager.",
      },
      {
        title: "Bounded at all times",
        body: "Configured ceiling, enforced by the allocator — never swell.",
      },
      {
        title: "Co-locate safely",
        body: "Runs happily on the same VM as your backend without stealing memory.",
      },
    ],
  },
  {
    id: "performance",
    title: "0.181 ms. 21,000 tasks/s.",
    modalTitle: "Throughput without tail latency",
    shortSummary:
      "0.181 ms average latency, 21,000 tasks per second, sustained on a single node. No GC pauses, no allocator jitter.",
    description:
      "Deterministic memory layout means deterministic performance. The same task walks the same code path every time. No GC pauses, no arena resizes — just predictable hundreds-of-microseconds latency.",
    bullets: [
      "0.181 ms average end-to-end latency",
      "21,000 tasks per second, sustained",
      "No GC pauses or allocator jitter",
      "Predictable p99 under load",
    ],
    tint: amberTint,
    renderVisual: (active) => <PerformanceVisual active={active} />,
    footnotes: [
      {
        title: "Deterministic hot path",
        body: "Same allocation path every time. No branching for slow cases.",
      },
      {
        title: "Sustained, not peak",
        body: "Throughput holds steady — no warmup cliffs, no degradation curve.",
      },
      {
        title: "Written close to the metal",
        body: "Pure native code. No runtime overhead between your task and the CPU.",
      },
    ],
  },
  {
    id: "protocol",
    title: "Tight binary protocol.",
    modalTitle: "A binary wire, designed for the hot path",
    shortSummary:
      "Quicx speaks its own compact binary protocol — opcodes, lengths, and payloads moving at line rate. No JSON, no bloat.",
    description:
      "The Quicx protocol is a fixed-layout binary wire format with a small, versioned opcode surface. Producers, daemon, and workers all speak it directly — frames are read in-place without parsing overhead.",
    bullets: [
      "Fixed-layout frame: type, version, length, corr_id, payload",
      "Five opcodes cover the entire protocol surface",
      "Zero-copy reads — frames consumed straight from the buffer",
      "Versioned from v1, forward-compatible by design",
    ],
    tint: blueTint,
    renderVisual: (active) => <ProtocolVisual active={active} />,
    footnotes: [
      {
        title: "Zero-copy wire",
        body: "Frames are consumed directly from the network buffer.",
      },
      {
        title: "Minimal opcode surface",
        body: "Five opcodes — no JSON layer, no accidental polymorphism.",
      },
      {
        title: "Versioned",
        body: "A version byte in every frame — forward-compatible from day one.",
      },
    ],
  },
  {
    id: "setup",
    title: "Queueing in five minutes.",
    modalTitle: "From zero to a submitted task in five minutes",
    shortSummary:
      "Install the binary, drop in the Java client (quicx-client), and submit your first task — on Linux, macOS, or wherever your backend runs.",
    description:
      "Quicx was designed to disappear. A one-line install, a default-good quicx.toml, a Maven-published Java client, and a tiny API surface. From nothing to a submitted task in about five minutes.",
    bullets: [
      "One-line installer — no build toolchain required",
      "Generate a sensible default quicx.toml with quicx init",
      "Java client (quicx-client) is Maven/Gradle-ready",
      "Submit your first task in under five minutes",
    ],
    tint: roseTint,
    renderVisual: (active) => <SetupVisual active={active} />,
    footnotes: [
      {
        title: "One-line install",
        body: "curl | sh, or grab the prebuilt static binary — your call.",
      },
      {
        title: "Batteries-included client",
        body: "The Java client is published to Maven Central — just add the dep.",
      },
      {
        title: "Sensible defaults",
        body: "Start with the default config and tune only what you need later.",
      },
    ],
  },
];

export function FeatureCards() {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeFeature = features.find((f) => f.id === openId) ?? null;

  return (
    <section
      id="features"
      className="relative border-t border-quicx-line bg-quicx-bg"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quicx-orange/30 to-transparent" />
      <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {/* Section head */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-[family-name:var(--font-barlow-condensed)] text-sm uppercase tracking-[0.32em] text-quicx-orange-bright">
            What makes Quicx, Quicx
          </span>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-archivo)] text-4xl font-semibold leading-[1.05] text-quicx-text sm:text-5xl">
            Six opinions we made so you don&apos;t have to.
          </h2>
        </div>

        {/* Cards grid */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard
              key={f.id}
              feature={f}
              onOpen={() => setOpenId(f.id)}
            />
          ))}
        </div>
      </div>

      <FeatureModal
        feature={activeFeature}
        onClose={() => setOpenId(null)}
        onSwitch={(id) => setOpenId(id)}
      />
    </section>
  );
}

function FeatureCard({
  feature,
  onOpen,
}: {
  feature: Feature;
  onOpen: () => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={onOpen}
      className={cn(
        "group relative flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-quicx-line bg-quicx-bg-2 text-left",
        "transition-all duration-500 ease-out",
        "hover:border-white/15 hover:bg-quicx-bg-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quicx-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-quicx-bg"
      )}
    >
      {/* Card tint — subtle radial glow in top-right */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 85% 0%, ${feature.tint.radial}, transparent 60%)`,
        }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent via-[color:var(--tw-grad)]",
          feature.tint.glow
        )}
        style={{ ["--tw-grad" as string]: feature.tint.accent + "55" }}
        aria-hidden
      />

      {/* Header row: title + expand */}
      <div className="relative flex items-start justify-between gap-3 p-6">
        <h3 className="max-w-[14rem] text-[19px] font-semibold leading-snug text-quicx-text">
          {feature.title}
        </h3>

        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70",
            "transition-all duration-300",
            "group-hover:border-quicx-orange/50 group-hover:bg-quicx-orange/10 group-hover:text-quicx-orange-bright"
          )}
        >
          <ExpandIcon className="size-3.5" />
        </span>
      </div>

      {/* Visual */}
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
        <div className="relative h-full">{feature.renderVisual(active)}</div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-quicx-bg-2" />
      </div>
    </button>
  );
}

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
          "sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:border sm:border-quicx-line"
        )}
      >
        {feature && (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-quicx-line px-6 py-4 sm:px-10">
              <span className="font-[family-name:var(--font-barlow-condensed)] text-xs uppercase tracking-[0.3em] text-quicx-dim">
                Feature · {feature.id}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-quicx-line bg-white/[0.02] text-quicx-muted transition hover:border-white/20 hover:text-quicx-text"
              >
                <XIconSmall className="size-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <ModalBody feature={feature} />
              <MoreToDiscover
                currentId={feature.id}
                onSwitch={(id) => onSwitch(id)}
              />
            </div>
          </div>
        )}
        {/* Visually-hidden a11y surfaces */}
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
        {/* Left: copy */}
        <div>
          <h2 className="text-balance font-[family-name:var(--font-archivo)] text-3xl font-semibold leading-[1.1] text-quicx-text sm:text-4xl">
            {feature.modalTitle}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-quicx-muted">
            {feature.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-11 rounded-md bg-quicx-orange px-5 font-[family-name:var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wider text-white hover:bg-quicx-orange-bright"
            >
              Start with Quicx
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-md border-white/15 bg-transparent px-5 font-[family-name:var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wider text-quicx-text hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
            >
              See the Docs
            </Button>
          </div>
        </div>

        {/* Right: bullets */}
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

      {/* Visual showcase */}
      <div
        className="relative mt-12 h-[420px] overflow-hidden rounded-xl border border-quicx-line bg-quicx-bg-2"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${feature.tint.radial}, var(--quicx-bg-2) 70%)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
        <div className="relative h-full">{feature.renderVisual(true)}</div>
      </div>

      {/* Footnotes */}
      <div className="mt-10 grid grid-cols-1 gap-6 border-t border-quicx-line pt-10 sm:grid-cols-3">
        {feature.footnotes.map((f) => (
          <div key={f.title}>
            <div
              className="mb-3 inline-flex size-8 items-center justify-center rounded-md border"
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
              className="group relative h-56 overflow-hidden rounded-xl border border-quicx-line bg-quicx-bg-2 text-left transition-all hover:border-white/15 hover:bg-quicx-bg-3"
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

/* ─────────────────────── tiny inline icons ─────────────────────── */

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
