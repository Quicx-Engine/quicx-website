import Image from "next/image";

/**
 * Stripe-style architecture diagram for Quicx.
 *
 *  Top row      : Producer A · Producer B · Stats Monitor · Java client · Your backend
 *  Middle row   : Binary Protocol        [  quicx daemon  ]        Worker Pool
 *  Left pillar  : PMAD Slab Allocator (satellite)
 *  Right pillar : CLI (satellite)
 *  Bottom row   : Worker 1 · Worker 2 · Worker N
 *
 *  All connections are dashed lines meeting the central "quicx" node.
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

function ArchitectureDiagram() {
  // Layout grid: 12 cols wide × 5 rows tall (1200 × 540)
  // Center of the diagram = (600, 270)
  const cx = 600;
  const cy = 270;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 1200 540"
        className="relative block h-auto w-full"
        role="img"
        aria-label="Quicx system architecture"
      >
        <defs>
          {/* Subtle radial for center tile */}
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5700" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FF5700" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FF5700" stopOpacity="0" />
          </radialGradient>

          {/* Orange outline glow */}
          <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─────────── Connection lines (beneath nodes) ─────────── */}
        {/* Top row to center */}
        <DashedLine from={{ x: 170, y: 80 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 380, y: 80 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 600, y: 80 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 820, y: 80 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 1030, y: 80 }} to={{ x: cx, y: cy }} />

        {/* Middle row */}
        <DashedLine from={{ x: 170, y: 270 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 1030, y: 270 }} to={{ x: cx, y: cy }} />

        {/* Bottom row */}
        <DashedLine from={{ x: 280, y: 460 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 600, y: 460 }} to={{ x: cx, y: cy }} />
        <DashedLine from={{ x: 920, y: 460 }} to={{ x: cx, y: cy }} />

        {/* ─────────── Center tile ─────────── */}
        <g>
          {/* Soft radial halo */}
          <circle cx={cx} cy={cy} r="160" fill="url(#center-grad)" />
          {/* The tile itself */}
          <g filter="url(#centerGlow)">
            <rect
              x={cx - 80}
              y={cy - 34}
              width="160"
              height="68"
              rx="14"
              fill="#FF5700"
              stroke="#FF7A33"
              strokeOpacity={0.65}
              strokeWidth={1.2}
            />
          </g>
          <text
            x={cx}
            y={cy + 7}
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="var(--font-archivo), sans-serif"
            fontSize="22"
            fontWeight="700"
            letterSpacing="0.5"
          >
            quicx
          </text>
          <text
            x={cx}
            y={cy + 55}
            textAnchor="middle"
            fill="#9aa3b2"
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="10"
            letterSpacing="2"
          >
            DAEMON
          </text>
        </g>

        {/* ─────────── Top row nodes ─────────── */}
        <NodeTile x={170} y={80} label="Producer A" />
        <NodeTile x={380} y={80} label="Producer B" />
        <NodeTile x={600} y={80} label="Stats Monitor" />
        <NodeTile x={820} y={80} label="Java Client" accent="#60a5fa" />
        <NodeTile x={1030} y={80} label="Your backend" />

        {/* ─────────── Middle row nodes ─────────── */}
        <NodeTile x={170} y={270} label="Binary Protocol" />
        <NodeTile x={1030} y={270} label="Worker Pool" accent="#5eead4" />

        {/* ─────────── Bottom row nodes ─────────── */}
        <NodeTile x={280} y={460} label="Worker 1" small />
        <NodeTile x={600} y={460} label="Worker 2" small />
        <NodeTile x={920} y={460} label="Worker N" small />

        {/* ─────────── Satellite: PMAD (offset cluster) ─────────── */}
        <g>
          <DashedLine
            from={{ x: 110, y: 440 }}
            to={{ x: cx, y: cy }}
            opacity={0.25}
          />
          <NodeTile
            x={110}
            y={440}
            label="PMAD Slab Allocator"
            accent="#a78bfa"
            small
          />
        </g>

        {/* Satellite: CLI */}
        <g>
          <DashedLine
            from={{ x: 1090, y: 440 }}
            to={{ x: cx, y: cy }}
            opacity={0.25}
          />
          <NodeTile
            x={1090}
            y={440}
            label="quicx CLI"
            accent="#f472b6"
            small
          />
        </g>
      </svg>

      {/* App marketplace-style strip below, tying in the brand logo */}
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

      {/* Footer: system built around Quicx */}
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

/* ─────────────────── building blocks ─────────────────── */

function NodeTile({
  x,
  y,
  label,
  accent = "#9aa3b2",
  small,
}: {
  x: number;
  y: number;
  label: string;
  accent?: string;
  small?: boolean;
}) {
  const w = Math.max(label.length * 7.5 + 36, small ? 110 : 130);
  const h = small ? 34 : 40;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill="#0f1f28"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />
      <circle cx={x - w / 2 + 14} cy={y} r={3.5} fill={accent} />
      <text
        x={x - w / 2 + 26}
        y={y + 4}
        fill="#e9edf3"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={small ? 12 : 13}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

function DashedLine({
  from,
  to,
  opacity = 0.35,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity?: number;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#ffffff"
      strokeOpacity={opacity}
      strokeWidth={1}
      strokeDasharray="3 5"
    />
  );
}
