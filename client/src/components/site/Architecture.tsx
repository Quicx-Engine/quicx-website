import Image from "next/image";

/**
 * Stripe-style architecture diagram for Quicx.
 *
 *  Layout pattern (mirrors the Stripe "one hub, everything around it" diagram):
 *
 *  ┌ Top row (external producers) ───────────────────────────────────────┐
 *  │ Producer A · Producer B · Stats Monitor · Java Client · Legacy API  │
 *  └─────────────┬──────────────────────────┬────────────────────────────┘
 *                │  Binary Protocol         │  Connection Router
 *                ▼                          ▼
 *  ┌── Slab cluster ──┐     ┌────────────┐     ┌── Worker Pool ──┐
 *  │  mem blocks      │──── │   quicx    │ ────│  Worker logo    │
 *  │  (logos grid)    │PMAD │   daemon   │ MSG │  (Azure-style)  │
 *  └──────────────────┘     └─────┬──────┘     └─────────────────┘
 *                                 │  Dispatcher
 *                                 ▼
 *                        Worker 1 · Worker 2 · Worker N
 *
 *  Connections are all L-shaped dotted purple lines, with message-type
 *  labels (MSG_SUBMIT, MSG_TASK, MSG_DONE, MSG_STATS) overlaid on key edges.
 */
export function Architecture() {
  return (
    <section
      id="architecture"
      className="relative overflow-hidden border-t border-quicx-line bg-[#081419]"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,87,0,0.07),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-[family-name:var(--font-barlow-condensed)] text-sm uppercase tracking-[0.32em] text-quicx-orange-bright">
            Under the hood
          </span>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-archivo)] text-4xl font-semibold leading-[1.05] text-quicx-text sm:text-5xl">
            A single daemon, every piece in its place.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-quicx-muted">
            Producers submit tasks over a compact binary protocol. The Quicx
            daemon routes, queues and dispatches work to a fixed pool of
            workers — all backed by PMAD, our deterministic slab allocator.
          </p>
        </div>

        {/* Diagram */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22] p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
          <ArchitectureDiagram />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Diagram constants ─────────────────── */

// Canvas
const W = 1600;
const H = 900;

// Central daemon tile
const CX = 800;
const CY = 450;
const TILE_W = 150;
const TILE_H = 150;

// Colors (Stripe-style palette mapped onto Quicx brand)
const LINE = "rgba(155, 135, 255, 0.45)"; // soft purple dotted lines
const LINE_SOFT = "rgba(155, 135, 255, 0.22)";
const PILL_FILL_SOFT = "#3730A3";
const PILL_BORDER = "rgba(255,255,255,0.14)";

/* ─────────────────── Main diagram ─────────────────── */

function ArchitectureDiagram() {
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label="Quicx system architecture"
      >
        <defs>
          {/* Halo behind center tile */}
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5700" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FF5700" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FF5700" stopOpacity="0" />
          </radialGradient>

          {/* Soft glow filter for center tile */}
          <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle inner gradient for peripheral pills */}
          <linearGradient id="pill-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B52E5" />
            <stop offset="100%" stopColor="#3E36B8" />
          </linearGradient>
        </defs>

        {/* ──────── Connection lines (drawn beneath nodes) ──────── */}

        {/* Top producers → Binary Protocol intermediary */}
        <LPath from={{ x: 260, y: 90 }} to={{ x: 520, y: 240 }} />
        <LPath from={{ x: 520, y: 90 }} to={{ x: 520, y: 240 }} />
        {/* Binary Protocol → center */}
        <LPath from={{ x: 520, y: 240 }} to={{ x: CX, y: CY }} />

        {/* Top right producers → Connection Router intermediary */}
        <LPath from={{ x: 1080, y: 90 }} to={{ x: 1080, y: 240 }} />
        <LPath from={{ x: 1340, y: 90 }} to={{ x: 1080, y: 240 }} />
        {/* Connection Router → center */}
        <LPath from={{ x: 1080, y: 240 }} to={{ x: CX, y: CY }} />

        {/* Left: slab cluster → PMAD label → center (horizontal) */}
        <line
          x1={320}
          y1={CY}
          x2={500}
          y2={CY}
          stroke={LINE}
          strokeWidth={1.2}
          strokeDasharray="3 5"
        />
        <line
          x1={640}
          y1={CY}
          x2={CX - TILE_W / 2}
          y2={CY}
          stroke={LINE}
          strokeWidth={1.2}
          strokeDasharray="3 5"
        />

        {/* Right: center → Task Pipeline → worker logo (horizontal) */}
        <line
          x1={CX + TILE_W / 2}
          y1={CY}
          x2={1060}
          y2={CY}
          stroke={LINE}
          strokeWidth={1.2}
          strokeDasharray="3 5"
        />
        <line
          x1={1200}
          y1={CY}
          x2={1440}
          y2={CY}
          stroke={LINE}
          strokeWidth={1.2}
          strokeDasharray="3 5"
        />

        {/* Center → Dispatcher (bottom) */}
        <LPath from={{ x: CX, y: CY }} to={{ x: CX, y: 640 }} />

        {/* Dispatcher → workers (branching) */}
        <LPath from={{ x: CX, y: 640 }} to={{ x: 620, y: 800 }} />
        <LPath from={{ x: CX, y: 640 }} to={{ x: 800, y: 800 }} />
        <LPath from={{ x: CX, y: 640 }} to={{ x: 980, y: 800 }} />

        {/* Message-type labels along key edges */}
        <EdgeLabel x={410} y={180} text="MSG_SUBMIT" />
        <EdgeLabel x={1200} y={180} text="MSG_STATS" />
        <EdgeLabel x={460} y={CY - 14} text="O(1) alloc / free" />
        <EdgeLabel x={1320} y={CY - 14} text="MSG_TASK" />
        <EdgeLabel x={CX + 60} y={560} text="MSG_DONE" />

        {/* ──────── Top row: producers / external systems ──────── */}
        <Pill x={260} y={90} label="Producer A" />
        <Pill x={520} y={90} label="Producer B" />
        {/* decorative empty slot to mimic Stripe's "skipped" cell */}
        <EmptySlot x={800} y={90} />
        <Pill x={1080} y={90} label="Stats Monitor" />
        <Pill x={1340} y={90} label="Java Client" />

        {/* ──────── Intermediary capability pills ──────── */}
        <Pill x={520} y={240} label="Binary Protocol" />
        <Pill x={1080} y={240} label="Connection Router" />

        {/* ──────── Left: PMAD slab cluster (like Stripe app logos) ──────── */}
        <SlabCluster cx={180} cy={CY} />
        <Pill x={570} y={CY} label="PMAD Slabs" external />

        {/* ──────── Right: task pipeline + worker pool logo ──────── */}
        <Pill x={1130} y={CY} label="Task Queue" />
        <WorkerLogo cx={1480} cy={CY} />

        {/* ──────── Center tile (quicx daemon) ──────── */}
        <g>
          <circle cx={CX} cy={CY} r={180} fill="url(#center-grad)" />
          <g filter="url(#centerGlow)">
            <rect
              x={CX - TILE_W / 2}
              y={CY - TILE_H / 2}
              width={TILE_W}
              height={TILE_H}
              rx={22}
              fill="#FF5700"
              stroke="#FF7A33"
              strokeOpacity={0.7}
              strokeWidth={1.4}
            />
          </g>
          <text
            x={CX}
            y={CY - 2}
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="var(--font-archivo), sans-serif"
            fontSize={28}
            fontWeight={700}
            letterSpacing={0.5}
          >
            quicx
          </text>
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            fill="rgba(255,255,255,0.82)"
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize={11}
            letterSpacing={3}
          >
            DAEMON
          </text>
        </g>

        {/* ──────── Bottom: Dispatcher → workers ──────── */}
        <Pill x={CX} y={640} label="Dispatcher" />
        <Pill x={620} y={800} label="Worker 1" small />
        <Pill x={800} y={800} label="Worker 2" small />
        <Pill x={980} y={800} label="Worker N" small />
      </svg>

      {/* Stat strip */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {[
          { k: "Binary", v: "~60 KB" },
          { k: "Latency", v: "0.181 ms" },
          { k: "Throughput", v: "21,000 /s" },
          { k: "Protocol", v: "5 opcodes" },
          { k: "Memory", v: "Bounded" },
          { k: "Setup", v: "5 minutes" },
        ].map((s) => (
          <div
            key={s.k}
            className="flex items-center justify-between rounded-xl border border-quicx-line bg-white/[0.015] px-4 py-3"
          >
            <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.22em] text-quicx-dim">
              {s.k}
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-quicx-text">
              {s.v}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center justify-center gap-3 text-[12px] text-quicx-dim">
        <Image
          src="/quicx-logo.svg"
          alt="Quicx"
          width={80}
          height={20}
          className="h-5 w-auto opacity-70"
        />
        <span className="font-[family-name:var(--font-barlow-condensed)] uppercase tracking-[0.3em]">
          One daemon · zero moving parts
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── Building blocks ─────────────────── */

/** Stripe-style indigo pill. */
function Pill({
  x,
  y,
  label,
  small,
  external,
}: {
  x: number;
  y: number;
  label: string;
  small?: boolean;
  external?: boolean;
}) {
  const padX = 22;
  const charW = small ? 7.2 : 8;
  const extra = external ? 18 : 0;
  const w = Math.max(label.length * charW + padX * 2 + extra, small ? 130 : 160);
  const h = small ? 40 : 48;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={10}
        fill="url(#pill-grad)"
        stroke={PILL_BORDER}
        strokeWidth={1}
      />
      <text
        x={x - (external ? 8 : 0)}
        y={y + (small ? 4 : 5)}
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={small ? 13 : 15}
        fontWeight={500}
      >
        {label}
      </text>
      {external && (
        <g
          transform={`translate(${x + (label.length * charW) / 2 + 4}, ${y - 7})`}
        >
          <path
            d="M0 0 h10 v10 M10 0 L0 10"
            stroke="#ffffff"
            strokeOpacity={0.85}
            strokeWidth={1.4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

/** Dashed placeholder pill (Stripe uses these as visual rhythm). */
function EmptySlot({ x, y }: { x: number; y: number }) {
  const w = 140;
  const h = 48;
  return (
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx={10}
      fill="transparent"
      stroke={PILL_FILL_SOFT}
      strokeOpacity={0.55}
      strokeDasharray="4 5"
      strokeWidth={1}
    />
  );
}

/** Small floating label along a connection line. */
function EdgeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 6.8 + 16;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 11}
        width={w}
        height={22}
        rx={6}
        fill="#0f1f28"
        stroke={LINE_SOFT}
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill="#cbd1dc"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize={10}
        letterSpacing={0.6}
      >
        {text}
      </text>
    </g>
  );
}

/** Grid of small square "logo" tiles — mimics Stripe's app-marketplace cluster. */
function SlabCluster({ cx, cy }: { cx: number; cy: number }) {
  const size = 54;
  const gap = 8;
  const cols = 3;
  const rows = 2;
  const gridW = cols * size + (cols - 1) * gap;
  const gridH = rows * size + (rows - 1) * gap;
  const x0 = cx - gridW / 2;
  const y0 = cy - gridH / 2;

  // Which cells are "filled" vs "empty" (Stripe leaves one cell blank)
  const filled: boolean[] = [true, true, true, false, true, true];

  return (
    <g>
      {/* Surrounding dashed bounding box like the Stripe diagram */}
      <rect
        x={x0 - 14}
        y={y0 - 14}
        width={gridW + 28}
        height={gridH + 28}
        rx={14}
        fill="transparent"
        stroke={PILL_FILL_SOFT}
        strokeOpacity={0.55}
        strokeDasharray="4 5"
        strokeWidth={1}
      />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const i = r * cols + c;
          const x = x0 + c * (size + gap);
          const y = y0 + r * (size + gap);
          if (!filled[i]) {
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={size}
                height={size}
                rx={10}
                fill="transparent"
                stroke={PILL_FILL_SOFT}
                strokeOpacity={0.55}
                strokeDasharray="3 4"
                strokeWidth={1}
              />
            );
          }
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                rx={10}
                fill="#0f1f28"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              {/* stylised "slab" bars inside each cell */}
              <rect
                x={x + 10}
                y={y + 14}
                width={size - 20}
                height={4}
                rx={2}
                fill="#FF5700"
                fillOpacity={0.75}
              />
              <rect
                x={x + 10}
                y={y + 24}
                width={size - 26}
                height={4}
                rx={2}
                fill="#9aa3b2"
                fillOpacity={0.55}
              />
              <rect
                x={x + 10}
                y={y + 34}
                width={size - 18}
                height={4}
                rx={2}
                fill="#9aa3b2"
                fillOpacity={0.35}
              />
            </g>
          );
        })
      )}
    </g>
  );
}

/** Right-hand "worker pool" logo tile — Stripe places the Azure logo here. */
function WorkerLogo({ cx, cy }: { cx: number; cy: number }) {
  const size = 72;
  return (
    <g>
      <rect
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        rx={12}
        fill="#0f1f28"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />
      {/* 3 stacked worker "cores" */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${cx - 18}, ${cy - 22 + i * 16})`}>
          <rect
            x={0}
            y={0}
            width={36}
            height={10}
            rx={2}
            fill="#4F46E5"
            fillOpacity={0.85}
          />
          <rect
            x={-3}
            y={2}
            width={3}
            height={2}
            fill="#4F46E5"
            fillOpacity={0.85}
          />
          <rect
            x={36}
            y={2}
            width={3}
            height={2}
            fill="#4F46E5"
            fillOpacity={0.85}
          />
          <rect
            x={-3}
            y={6}
            width={3}
            height={2}
            fill="#4F46E5"
            fillOpacity={0.85}
          />
          <rect
            x={36}
            y={6}
            width={3}
            height={2}
            fill="#4F46E5"
            fillOpacity={0.85}
          />
        </g>
      ))}
    </g>
  );
}

/** Right-angle ("L") dotted connector between two points.
 *  Uses a horizontal-then-vertical path with a small corner radius.
 */
function LPath({
  from,
  to,
  opacity = 1,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity?: number;
}) {
  // Choose a bend point so the line drops/rises vertically first,
  // then runs horizontally toward the target (Stripe uses this shape).
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  let d: string;
  if (Math.abs(dy) < 2) {
    d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else if (Math.abs(dx) < 2) {
    d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else {
    // Descend most of the way, then corner over horizontally.
    const r = 10;
    const vertEnd = to.y - Math.sign(dy) * 0;
    const hSign = Math.sign(dx);
    const vSign = Math.sign(dy);
    d =
      `M ${from.x} ${from.y} ` +
      `L ${from.x} ${vertEnd - vSign * r} ` +
      `Q ${from.x} ${vertEnd} ${from.x + hSign * r} ${vertEnd} ` +
      `L ${to.x} ${to.y}`;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={LINE}
      strokeOpacity={opacity}
      strokeWidth={1.2}
      strokeDasharray="3 5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
