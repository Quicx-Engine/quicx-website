import Image from "next/image";

/**
 * Stripe-style architecture diagram for Quicx — accurate to the internal
 * daemon topology.
 *
 *   ┌─ PMAD ─┐                    (satellite, top-left)
 *   │ slabs  │─── O(1) alloc/free ────────────────────────┐
 *   └────────┘                                            ▼
 *   ┌ PRODUCERS ┐   MSG_SUBMIT   ┌──── QUICX DAEMON ────┐   MSG_TASK   ┌ WORKERS ┐
 *   │ Stats Mon │ ─────────────▶ │ Conn. Router         │ ───────────▶ │ Worker 1│
 *   │ Producer B│                │   │                  │              │ Worker 2│
 *   │ Producer A│ ◀───────────── │   ▼  Task Queue      │ ◀─────────── │ Worker N│
 *   └───────────┘    MSG_OK      │      ▼  Dispatcher   │   MSG_DONE   └─────────┘
 *                                │      ▼  Worker Pool  │
 *                                └──────────────────────┘
 *
 *   Stats flow:  Stats Monitor ── MSG_STATS / MSG_WAIT ──▶ Conn. Router
 */
export function Architecture() {
  return (
    <section
      id="architecture"
      className="relative overflow-hidden border-t border-quicx-line bg-[#081419]"
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,87,0,0.07),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
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

        <div className="relative mt-16 overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22] p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
          <ArchitectureDiagram />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Design tokens ─────────────────── */

// Canvas
const W = 1600;
const H = 980;

// Quicx brand
const ORANGE = "#FF5700";
const ORANGE_BRIGHT = "#FF7A33";

// Surface
const TILE_BG = "#0F1F28";
const TILE_BORDER = "rgba(255,255,255,0.10)";

// Message-type colors (from the legend in the source diagram),
// tuned to the Quicx palette so they harmonise with the orange daemon.
const MSG = {
  SUBMIT: "#5EB0FF", // blue — producer → daemon
  OK: "#34D399", // green — acknowledgment
  TASK: ORANGE_BRIGHT, // orange — task dispatch (brand!)
  DONE: "#D4A5FF", // purple — MSG_DONE / memory alloc
  STATS: "#9AA3B2", // gray — MSG_STATS / MSG_WAIT
};

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
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.25" />
            <stop offset="60%" stopColor={ORANGE} stopOpacity="0.06" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>

          {/* Arrowhead markers, one per message color. */}
          {Object.entries(MSG).map(([key, color]) => (
            <marker
              key={key}
              id={`arrow-${key}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* ════════════════════════════════════════════════════════
             1. PMAD Slab Allocator — satellite, top-left
            ════════════════════════════════════════════════════════ */}
        <g>
          {/* dashed surrounding box */}
          <rect
            x={70}
            y={70}
            width={340}
            height={210}
            rx={14}
            fill="transparent"
            stroke={MSG.DONE}
            strokeOpacity={0.55}
            strokeDasharray="5 6"
          />
          <ClusterLabel
            x={100}
            y={92}
            text="PMAD SLAB ALLOCATOR"
            color={MSG.DONE}
          />
          <SlabGrid cx={240} cy={185} />
        </g>

        {/* PMAD → daemon: horizontal then down */}
        <PathEdge
          d={`M 410 175
              L 650 175
              L 650 290`}
          color={MSG.DONE}
          arrow="DONE"
        />
        <EdgeLabel x={540} y={160} text="O(1) alloc / free" color={MSG.DONE} />

        {/* ════════════════════════════════════════════════════════
             2. PRODUCERS cluster — left side
            ════════════════════════════════════════════════════════ */}
        <g>
          <rect
            x={70}
            y={360}
            width={340}
            height={500}
            rx={16}
            fill="transparent"
            stroke={MSG.SUBMIT}
            strokeOpacity={0.6}
            strokeDasharray="5 6"
          />
          <ClusterLabel x={100} y={385} text="PRODUCERS" color={MSG.SUBMIT} />

          {/* Stats monitor — icon on top */}
          <IconTile x={240} y={470} label="Stats Monitor" variant="stats" />
          {/* Two producers below */}
          <IconTile x={240} y={620} label="Producer B" variant="producer" />
          <IconTile x={240} y={770} label="Producer A" variant="producer" />
        </g>

        {/* ════════════════════════════════════════════════════════
             3. QUICX DAEMON — center
            ════════════════════════════════════════════════════════ */}
        <g>
          {/* Halo */}
          <circle cx={870} cy={600} r={320} fill="url(#center-grad)" />
          {/* Container */}
          <rect
            x={520}
            y={290}
            width={700}
            height={550}
            rx={18}
            fill="rgba(255,87,0,0.04)"
            stroke={ORANGE}
            strokeOpacity={0.55}
            strokeDasharray="5 6"
          />
          <ClusterLabel
            x={550}
            y={315}
            text="QUICX DAEMON"
            color={ORANGE_BRIGHT}
            accent
          />

          {/* Connection Router — entry on left inside daemon */}
          <Pill x={640} y={620} label="Connection Router" />

          {/* Processing sub-group */}
          <g>
            <rect
              x={800}
              y={420}
              width={260}
              height={310}
              rx={14}
              fill="rgba(255,255,255,0.02)"
              stroke={TILE_BORDER}
            />
            <ClusterLabel
              x={820}
              y={445}
              text="PROCESSING"
              color="#9AA3B2"
              size={11}
            />
            <Pill x={930} y={510} label="Task Queue" small />
            <Pill x={930} y={600} label="Dispatcher" small />
            {/* internal flow: queue → dispatcher */}
            <PathEdge
              d={`M 930 530 L 930 580`}
              color={ORANGE_BRIGHT}
              arrow="TASK"
            />
          </g>

          {/* Worker Pool — exit on right inside daemon */}
          <Pill x={1130} y={620} label="Worker Pool" />

          {/* Internal flows: Router → Task Queue; Dispatcher → Worker Pool */}
          <PathEdge
            d={`M 710 620 L 760 620 L 760 510 L 862 510`}
            color={ORANGE_BRIGHT}
            arrow="TASK"
          />
          <PathEdge
            d={`M 998 600 L 1040 600 L 1040 620 L 1068 620`}
            color={ORANGE_BRIGHT}
            arrow="TASK"
          />
        </g>

        {/* ════════════════════════════════════════════════════════
             4. WORKERS cluster — right side
            ════════════════════════════════════════════════════════ */}
        <g>
          <rect
            x={1320}
            y={360}
            width={210}
            height={500}
            rx={16}
            fill="transparent"
            stroke="#34D399"
            strokeOpacity={0.55}
            strokeDasharray="5 6"
          />
          <ClusterLabel x={1348} y={385} text="WORKERS" color="#34D399" />

          <WorkerTile x={1425} y={470} label="Worker 1" />
          <WorkerTile x={1425} y={600} label="Worker 2" />
          <WorkerTile x={1425} y={730} label="Worker N" />
        </g>

        {/* ════════════════════════════════════════════════════════
             5. Inter-cluster message flows
            ════════════════════════════════════════════════════════ */}

        {/* MSG_STATS : Stats Monitor → Connection Router */}
        <PathEdge
          d={`M 307 470 L 470 470 L 470 600 L 571 600`}
          color={MSG.STATS}
          arrow="STATS"
        />
        <EdgeLabel x={388} y={455} text="MSG_STATS" color={MSG.STATS} />

        {/* MSG_SUBMIT : Producer B → Connection Router */}
        <PathEdge
          d={`M 307 620 L 571 620`}
          color={MSG.SUBMIT}
          arrow="SUBMIT"
        />
        <EdgeLabel x={440} y={605} text="MSG_SUBMIT" color={MSG.SUBMIT} />

        {/* MSG_SUBMIT : Producer A → Connection Router */}
        <PathEdge
          d={`M 307 770 L 470 770 L 470 640 L 571 640`}
          color={MSG.SUBMIT}
          arrow="SUBMIT"
        />

        {/* MSG_OK : Connection Router → Producers (back) */}
        <PathEdge
          d={`M 571 660 L 450 660 L 450 830 L 307 830`}
          color={MSG.OK}
          arrow="OK"
        />
        <EdgeLabel x={385} y={845} text="MSG_OK" color={MSG.OK} />

        {/* MSG_TASK : Worker Pool → Workers */}
        <PathEdge
          d={`M 1192 600 L 1270 600 L 1270 470 L 1358 470`}
          color={MSG.TASK}
          arrow="TASK"
        />
        <PathEdge
          d={`M 1192 620 L 1358 620`}
          color={MSG.TASK}
          arrow="TASK"
        />
        <PathEdge
          d={`M 1192 640 L 1270 640 L 1270 730 L 1358 730`}
          color={MSG.TASK}
          arrow="TASK"
        />
        <EdgeLabel x={1275} y={545} text="MSG_TASK" color={MSG.TASK} />

        {/* MSG_DONE : Workers → Worker Pool */}
        <PathEdge
          d={`M 1492 490 L 1570 490 L 1570 580 L 1192 580`}
          color={MSG.DONE}
          arrow="DONE"
          opacity={0.85}
        />
        <EdgeLabel x={1415} y={570} text="MSG_DONE" color={MSG.DONE} />

        {/* ════════════════════════════════════════════════════════
             6. Legend — bottom right, mirrors source diagram
            ════════════════════════════════════════════════════════ */}
        <Legend x={W - 300} y={90} />
      </svg>


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

/** Uppercase cluster-title label (sits on top-left of a dashed container). */
function ClusterLabel({
  x,
  y,
  text,
  color,
  accent,
  size = 12,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  accent?: boolean;
  size?: number;
}) {
  return (
    <g>
      <rect
        x={x - 8}
        y={y - 13}
        width={text.length * (size * 0.65) + 32}
        height={22}
        rx={6}
        fill="#0a1a22"
        stroke={color}
        strokeOpacity={accent ? 0.6 : 0.4}
        strokeWidth={1}
      />
      <circle cx={x + 4} cy={y - 2} r={4} fill={color} />
      <text
        x={x + 14}
        y={y + 3}
        fill={color}
        fontFamily="var(--font-barlow-condensed), sans-serif"
        fontSize={size}
        fontWeight={600}
        letterSpacing={2}
      >
        {text}
      </text>
    </g>
  );
}

/** Small label floating on an edge — matches the legend color. */
function EdgeLabel({
  x,
  y,
  text,
  color = "#cbd1dc",
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
}) {
  const w = text.length * 6.8 + 16;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 11}
        width={w}
        height={22}
        rx={6}
        fill="#0a1a22"
        stroke={color}
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill={color}
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize={10}
        letterSpacing={0.6}
      >
        {text}
      </text>
    </g>
  );
}

/** Generic rounded pill used for internal daemon components. */
function Pill({
  x,
  y,
  label,
  small,
}: {
  x: number;
  y: number;
  label: string;
  small?: boolean;
}) {
  const padX = 22;
  const charW = small ? 7.2 : 8;
  const w = Math.max(label.length * charW + padX * 2, small ? 120 : 140);
  const h = small ? 40 : 46;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={10}
        fill={TILE_BG}
        stroke={ORANGE}
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      <circle cx={x - w / 2 + 14} cy={y} r={4} fill={ORANGE} />
      <text
        x={x + 6}
        y={y + (small ? 4 : 5)}
        textAnchor="middle"
        fill="#e9edf3"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={small ? 13 : 14}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

/** Producer / Stats tile with a small icon glyph. */
function IconTile({
  x,
  y,
  label,
  variant,
}: {
  x: number;
  y: number;
  label: string;
  variant: "producer" | "stats";
}) {
  const w = 135;
  const h = 100;
  const color = variant === "stats" ? MSG.STATS : MSG.SUBMIT;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={12}
        fill={TILE_BG}
        stroke={color}
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      {/* Glyph */}
      <g transform={`translate(${x - 18}, ${y - 28})`}>
        {variant === "producer" ? (
          <>
            {/* stacked "card" motif for producer */}
            <rect
              x={0}
              y={0}
              width={36}
              height={28}
              rx={4}
              fill="#0a1a22"
              stroke={color}
              strokeOpacity={0.9}
              strokeWidth={1.2}
            />
            <rect
              x={0}
              y={8}
              width={36}
              height={20}
              rx={4}
              fill="#0a1a22"
              stroke={color}
              strokeOpacity={0.9}
              strokeWidth={1.2}
            />
            <rect x={4} y={13} width={10} height={2} fill={color} />
            <rect x={4} y={18} width={20} height={2} fill={color} opacity={0.6} />
          </>
        ) : (
          <>
            {/* stats — small sparkline */}
            <path
              d="M 0 20 L 6 20 L 10 10 L 14 16 L 20 4 L 26 14 L 32 8 L 36 8"
              stroke={color}
              strokeWidth={1.8}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
      <text
        x={x}
        y={y + 28}
        textAnchor="middle"
        fill="#e9edf3"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={13}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

/** Worker tile — CPU-chip glyph. */
function WorkerTile({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label: string;
}) {
  const w = 135;
  const h = 100;
  const color = "#34D399";
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={12}
        fill={TILE_BG}
        stroke={color}
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      {/* CPU chip icon */}
      <g transform={`translate(${x - 18}, ${y - 30})`}>
        <rect
          x={4}
          y={4}
          width={28}
          height={28}
          rx={4}
          fill="#0a1a22"
          stroke={color}
          strokeOpacity={0.9}
          strokeWidth={1.4}
        />
        <rect
          x={10}
          y={10}
          width={16}
          height={16}
          rx={2}
          fill="transparent"
          stroke={color}
          strokeOpacity={0.7}
          strokeWidth={1}
        />
        {/* pins */}
        {[10, 18].map((px) => (
          <g key={`top${px}`}>
            <line x1={px} y1={0} x2={px} y2={4} stroke={color} strokeWidth={1.2} />
            <line x1={px} y1={32} x2={px} y2={36} stroke={color} strokeWidth={1.2} />
          </g>
        ))}
        {[10, 18].map((py) => (
          <g key={`side${py}`}>
            <line x1={0} y1={py} x2={4} y2={py} stroke={color} strokeWidth={1.2} />
            <line x1={32} y1={py} x2={36} y2={py} stroke={color} strokeWidth={1.2} />
          </g>
        ))}
      </g>
      <text
        x={x}
        y={y + 28}
        textAnchor="middle"
        fill="#e9edf3"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={13}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

/** 3×2 grid of memory slabs inside the PMAD box. */
function SlabGrid({ cx, cy }: { cx: number; cy: number }) {
  const size = 44;
  const gap = 7;
  const cols = 4;
  const rows = 2;
  const gridW = cols * size + (cols - 1) * gap;
  const gridH = rows * size + (rows - 1) * gap;
  const x0 = cx - gridW / 2;
  const y0 = cy - gridH / 2;
  // which cells have slab contents (emulates the real allocator's occupied vs free)
  const filled = [true, true, false, true, true, false, true, true];

  return (
    <g>
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
                rx={7}
                fill="transparent"
                stroke={MSG.DONE}
                strokeOpacity={0.4}
                strokeDasharray="3 4"
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
                rx={7}
                fill="#0a1a22"
                stroke={MSG.DONE}
                strokeOpacity={0.55}
              />
              {/* 3 slab bars */}
              <rect
                x={x + 7}
                y={y + 11}
                width={size - 14}
                height={3}
                rx={1.5}
                fill={ORANGE}
                fillOpacity={0.85}
              />
              <rect
                x={x + 7}
                y={y + 19}
                width={size - 18}
                height={3}
                rx={1.5}
                fill={ORANGE_BRIGHT}
                fillOpacity={0.55}
              />
              <rect
                x={x + 7}
                y={y + 27}
                width={size - 12}
                height={3}
                rx={1.5}
                fill={MSG.DONE}
                fillOpacity={0.65}
              />
            </g>
          );
        })
      )}
    </g>
  );
}

/** Legend box — bottom/right like the source diagram. */
function Legend({ x, y }: { x: number; y: number }) {
  const items: { key: keyof typeof MSG; label: string }[] = [
    { key: "SUBMIT", label: "MSG_SUBMIT  (producer → daemon)" },
    { key: "OK", label: "MSG_OK  (acknowledgment)" },
    { key: "TASK", label: "MSG_TASK  (task dispatch)" },
    { key: "DONE", label: "MSG_DONE  / memory alloc" },
    { key: "STATS", label: "MSG_STATS  / MSG_WAIT" },
  ];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={280}
        height={items.length * 26 + 24}
        rx={10}
        fill="#0a1a22"
        stroke={TILE_BORDER}
      />
      {items.map((it, i) => {
        const ly = y + 26 + i * 26;
        return (
          <g key={it.key}>
            <line
              x1={x + 16}
              y1={ly}
              x2={x + 56}
              y2={ly}
              stroke={MSG[it.key]}
              strokeWidth={1.6}
              strokeDasharray="4 3"
              markerEnd={`url(#arrow-${it.key})`}
            />
            <text
              x={x + 68}
              y={ly + 4}
              fill="#cbd1dc"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize={11}
            >
              {it.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Colored dotted path with arrowhead — used for every message flow. */
function PathEdge({
  d,
  color,
  arrow,
  opacity = 1,
}: {
  d: string;
  color: string;
  arrow?: keyof typeof MSG;
  opacity?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={1.5}
      strokeDasharray="5 5"
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd={arrow ? `url(#arrow-${arrow})` : undefined}
    />
  );
}
