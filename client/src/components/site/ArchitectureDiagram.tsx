"use client";

import { useEffect, useRef, useState } from "react";
import { ArchitectureFlow } from "./ArchitectureFlow";

/* ─────────────────── Design tokens ─────────────────── */

// Canvas
const W = 1600;
const H = 900;

// Quicx brand
const ORANGE = "#FF5700";
const ORANGE_BRIGHT = "#FF7A33";

// Surface
const TILE_BG = "#0d1c23";
const TILE_BORDER = "rgba(190,222,236,0.14)";

// Knock-out fill for labels that sit on top of flow lines.
const LABEL_BG = "#061015";

// Message-type colors (from the legend in the source diagram),
// tuned to the Quicx palette so they harmonise with the orange daemon.
// One accent: the hot path (submit, dispatch) is orange; replies are ink;
// the side channels are dimmer. Edge labels name every message, so hue is
// never the only carrier of meaning.
const INK = "#c3ced5";
const DIM = "#7f909a";
const MUTED = "#a1b0b9";
const CLUSTER = "rgba(190,222,236,0.3)";
// Cluster frames are solid, so they sit at the strong-hairline strength.
const CLUSTER_FRAME = "rgba(190,222,236,0.16)";

const MSG = {
  SUBMIT: ORANGE_BRIGHT, // producer → daemon
  OK: INK, // acknowledgment
  TASK: ORANGE_BRIGHT, // task dispatch
  DONE: INK, // worker finished
  STATS: DIM, // stats request from the CLI
  ALLOC: MUTED, // apool alloc / free
};

/* ─────────────────── Main diagram ─────────────────── */

/**
 * The wide diagram from md up; below that (and wherever the caller asks for
 * it) the same topology as a stacked, text-set flow.
 */
export function ArchitectureDiagram({ variant = "auto" }: { variant?: "auto" | "flow" }) {
  if (variant === "flow") return <ArchitectureFlow />;
  return (
    <>
      <div className="hidden md:block">
        <ArchitectureSvg />
      </div>
      <div className="md:hidden">
        <ArchitectureFlow />
      </div>
    </>
  );
}

function ArchitectureSvg() {
  const svgRef = useRef<SVGSVGElement>(null);
  // inView latches on first sight (reveal); onScreen tracks it (pause the trace).
  const [inView, setInView] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting);
        if (e.isIntersecting && e.intersectionRatio >= 0.2) setInView(true);
      },
      { threshold: [0, 0.2] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={onScreen ? "relative" : "relative is-paused"}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label="Quicx system architecture, with one task traced: a producer submits it, the daemon acknowledges and claims one apool block for it, the dispatcher hands it to a worker and frees the block, and the worker's MSG_DONE goes back to the producer."
        style={{ "--cycle": `${CYCLE_S}s` } as React.CSSProperties}
      >
        <defs>

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
             1. apool allocator — satellite, top-left
            ════════════════════════════════════════════════════════ */}
        <g>
          {/* surrounding box: a solid hairline; only message paths are dashed */}
          <rect
            x={70}
            y={70}
            width={340}
            height={210}
            rx={3}
            fill="transparent"
            stroke={CLUSTER_FRAME}
          />
          <ClusterLabel
            x={100}
            y={92}
            text="APOOL ALLOCATOR"
            color={MUTED}
          />
          <SlabGrid cx={240} cy={185} inView={inView} />
        </g>

        {/* apool → daemon: horizontal then down */}
        <PathEdge
          d={`M 410 175
              L 650 175
              L 650 290`}
          color={MSG.ALLOC}
          arrow="ALLOC"
          revealIndex={0}
          inView={inView}
        />
        <EdgeLabel x={540} y={156} text="O(1) alloc / free" color={MSG.ALLOC} />

        {/* ════════════════════════════════════════════════════════
             2. PRODUCERS cluster — left side
            ════════════════════════════════════════════════════════ */}
        <g>
          <rect
            x={70}
            y={360}
            width={340}
            height={500}
            rx={3}
            fill="transparent"
            stroke={CLUSTER_FRAME}
          />
          <ClusterLabel x={100} y={385} text="PRODUCERS" color={MUTED} />

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
          {/* Container */}
          <rect
            x={520}
            y={290}
            width={700}
            height={550}
            rx={3}
            fill="rgba(255,87,0,0.04)"
            stroke={ORANGE}
            strokeOpacity={0.45}
          />
          <ClusterLabel
            x={550}
            y={315}
            text="QUICX DAEMON"
            color={ORANGE_BRIGHT}
            accent
          />

          {/* Connection Router — entry on left inside daemon */}
          <Pill x={640} y={620} label="Connection Router" hitAt={inView ? HIT.router : undefined} />

          {/* Processing sub-group */}
          <g>
            <rect
              x={800}
              y={420}
              width={260}
              height={310}
              rx={3}
              fill="rgba(255,255,255,0.02)"
              stroke={TILE_BORDER}
            />
            <ClusterLabel
              x={820}
              y={445}
              text="PROCESSING"
              color={MUTED}
              size={16}
            />
            <Pill x={930} y={510} label="Task Queue" small hitAt={inView ? HIT.queue : undefined} />
            <Pill x={930} y={600} label="Dispatcher" small hitAt={inView ? HIT.dispatcher : undefined} />
            {/* internal flow: queue → dispatcher */}
            <PathEdge
              d={`M 930 530 L 930 580`}
              color={ORANGE_BRIGHT}
              arrow="TASK"
            />
          </g>

          {/* Worker Pool — exit on right inside daemon */}
          <Pill x={1130} y={620} label="Worker Pool" hitAt={inView ? HIT.pool : undefined} />

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
            rx={3}
            fill="transparent"
            stroke={CLUSTER_FRAME}
          />
          <ClusterLabel x={1348} y={385} text="WORKERS" color={MUTED} />

          <WorkerTile x={1425} y={470} label="Worker 1" hitAt={inView ? HIT.worker : undefined} />
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
          revealIndex={1}
          inView={inView}
        />
        <EdgeLabel x={388} y={455} text="MSG_STATS" color={MSG.STATS} />

        {/* MSG_SUBMIT : Producer B → Connection Router */}
        <PathEdge
          d={`M 307 620 L 571 620`}
          color={MSG.SUBMIT}
          arrow="SUBMIT"
          revealIndex={2}
          inView={inView}
        />
        <EdgeLabel x={440} y={605} text="MSG_SUBMIT" color={MSG.SUBMIT} />

        {/* MSG_SUBMIT : Producer A → Connection Router */}
        <PathEdge
          d={`M 307 770 L 470 770 L 470 640 L 571 640`}
          color={MSG.SUBMIT}
          arrow="SUBMIT"
          revealIndex={3}
          inView={inView}
        />

        {/* MSG_OK : Connection Router → Producers (back) */}
        <PathEdge
          d={`M 571 660 L 450 660 L 450 830 L 307 830`}
          color={MSG.OK}
          arrow="OK"
          revealIndex={4}
          inView={inView}
        />
        <EdgeLabel x={385} y={845} text="MSG_OK" color={MSG.OK} />

        {/* MSG_TASK : Worker Pool → Workers */}
        <PathEdge
          d={`M 1192 600 L 1270 600 L 1270 470 L 1358 470`}
          color={MSG.TASK}
          arrow="TASK"
          revealIndex={5}
          inView={inView}
        />
        <PathEdge
          d={`M 1192 620 L 1358 620`}
          color={MSG.TASK}
          arrow="TASK"
          revealIndex={6}
          inView={inView}
        />
        <PathEdge
          d={`M 1192 640 L 1270 640 L 1270 730 L 1358 730`}
          color={MSG.TASK}
          arrow="TASK"
          revealIndex={7}
          inView={inView}
        />
        <EdgeLabel x={1270} y={690} text="MSG_TASK" color={MSG.TASK} />

        {/* MSG_DONE : Workers → Worker Pool */}
        <PathEdge
          d={`M 1492 490 L 1570 490 L 1570 535 L 1230 535 L 1230 580 L 1192 580`}
          color={MSG.DONE}
          arrow="DONE"
          opacity={0.85}
          revealIndex={8}
          inView={inView}
        />
        <EdgeLabel x={1425} y={535} text="MSG_DONE" color={MSG.DONE} />

        {/* ════════════════════════════════════════════════════════
             6. The trace: one task's messages, lit in order
            ════════════════════════════════════════════════════════ */}
        {inView && <Trace />}
        <g>
          <circle cx={78} cy={34} r={4} fill={ORANGE} className="node-pulse" />
          <text
            x={92}
            y={39}
            fill={MUTED}
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize={16}
          >
            one task, traced, slowed down from 49 µs
          </text>
        </g>

        {/* ════════════════════════════════════════════════════════
             7. Legend — top right
            ════════════════════════════════════════════════════════ */}
        <Legend x={W - 470} y={40} />
      </svg>
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
  size = 16,
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
        y={y - 15}
        width={text.length * (size * 0.66) + 34}
        height={26}
        rx={3}
        fill={LABEL_BG}
        stroke={color}
        strokeOpacity={accent ? 0.6 : 0.4}
        strokeWidth={1}
      />
      <circle cx={x + 4} cy={y - 2} r={4} fill={color} />
      <text
        x={x + 14}
        y={y + 3}
        fill={color}
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={size}
        fontWeight={620}
        letterSpacing={1.4}
        style={{ fontStretch: "78%" }}
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
  color = "#c3ced5",
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
}) {
  const w = text.length * 9.8 + 22;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 14}
        width={w}
        height={28}
        rx={3}
        fill={LABEL_BG}
        stroke={color}
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill={color}
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize={16}
        letterSpacing={0}
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
  hitAt,
}: {
  x: number;
  y: number;
  label: string;
  small?: boolean;
  hitAt?: number;
}) {
  const padX = 24;
  const charW = small ? 9.2 : 9.6;
  const w = Math.max(label.length * charW + padX * 2, small ? 140 : 160);
  const h = small ? 46 : 52;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
        fill={TILE_BG}
        stroke={ORANGE}
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      {hitAt !== undefined && <NodeHit x={x - w / 2} y={y - h / 2} w={w} h={h} at={hitAt} />}
      <circle
        cx={x - w / 2 + 14}
        cy={y}
        r={4}
        fill={ORANGE}
        className="node-pulse"
      />
      <text
        x={x + 6}
        y={y + (small ? 5 : 6)}
        textAnchor="middle"
        fill="#edf2f5"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={small ? 16 : 17}
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
  const color = variant === "stats" ? DIM : INK;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
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
              fill={LABEL_BG}
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
              fill={LABEL_BG}
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
        fill="#edf2f5"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={16}
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
  hitAt,
}: {
  x: number;
  y: number;
  label: string;
  hitAt?: number;
}) {
  const w = 135;
  const h = 100;
  const color = INK;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
        fill={TILE_BG}
        stroke={color}
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      {hitAt !== undefined && <NodeHit x={x - w / 2} y={y - h / 2} w={w} h={h} at={hitAt} />}
      {/* CPU chip icon */}
      <g transform={`translate(${x - 18}, ${y - 30})`}>
        <rect
          x={4}
          y={4}
          width={28}
          height={28}
          rx={4}
          fill={LABEL_BG}
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
        fill="#edf2f5"
        fontFamily="var(--font-archivo), sans-serif"
        fontSize={16}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

/** 3×2 grid of pages inside the apool box. */
function SlabGrid({
  cx,
  cy,
  inView,
}: {
  cx: number;
  cy: number;
  inView?: boolean;
}) {
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
  // The free cell the traced task claims.
  const traced = 2;

  return (
    <g>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const i = r * cols + c;
          const x = x0 + c * (size + gap);
          const y = y0 + r * (size + gap);
          if (!filled[i]) {
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={size}
                  height={size}
                  rx={3}
                  fill="transparent"
                  stroke={CLUSTER}
                  strokeDasharray="3 4"
                />
                {inView && i === traced && (
                  <g className="slot-hold">
                    <rect
                      x={x}
                      y={y}
                      width={size}
                      height={size}
                      rx={3}
                      fill="rgba(255,87,0,0.16)"
                      stroke={ORANGE}
                      strokeWidth={1.5}
                    />
                    <rect x={x + 7} y={y + 11} width={size - 14} height={3} rx={1.5} fill={ORANGE} />
                    <rect x={x + 7} y={y + 19} width={size - 18} height={3} rx={1.5} fill={ORANGE_BRIGHT} />
                    <rect x={x + 7} y={y + 27} width={size - 12} height={3} rx={1.5} fill={ORANGE_BRIGHT} fillOpacity={0.6} />
                  </g>
                )}
              </g>
            );
          }
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                rx={3}
                fill={LABEL_BG}
                stroke={CLUSTER}
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
                fill={INK}
                fillOpacity={0.5}
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
    { key: "SUBMIT", label: "MSG_SUBMIT  producer → daemon" },
    { key: "OK", label: "MSG_OK      acknowledgment" },
    { key: "TASK", label: "MSG_TASK    daemon → worker" },
    { key: "DONE", label: "MSG_DONE    worker finished" },
    { key: "STATS", label: "MSG_STATS   stats request" },
    { key: "ALLOC", label: "O(1) alloc / free from apool" },
  ];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={440}
        height={items.length * 32 + 22}
        rx={4}
        fill={LABEL_BG}
        stroke={TILE_BORDER}
      />
      {items.map((it, i) => {
        const ly = y + 30 + i * 32;
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
              x={x + 72}
              y={ly + 5}
              fill="#c3ced5"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize={16}
              style={{ whiteSpace: "pre" }}
            >
              {it.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Per-message-type flow speeds — varied so the diagram breathes rather than
 *  ticks metronomically. Faster for hot-path flows (TASK, SUBMIT), slower for
 *  the infrequent ones (STATS, OK). */
const FLOW_DURATION: Record<keyof typeof MSG, string> = {
  SUBMIT: "1.2s",
  OK: "1.8s",
  TASK: "1.0s",
  DONE: "1.6s",
  STATS: "2.4s",
  ALLOC: "2s",
};

/** Colored dotted path with arrowhead + animated dash-flow. Every message
 *  line in the diagram animates along its own direction of travel.
 *
 *  When `revealIndex` is provided, the line starts invisible and fades in
 *  (staggered by index) once the diagram scrolls into view. */
function PathEdge({
  d,
  color,
  arrow,
  opacity = 1,
  animated = false,
  revealIndex,
  inView,
}: {
  d: string;
  color: string;
  arrow?: keyof typeof MSG;
  opacity?: number;
  animated?: boolean;
  revealIndex?: number;
  inView?: boolean;
}) {
  const duration = arrow ? FLOW_DURATION[arrow] : "1.4s";
  const reveal = typeof revealIndex === "number";
  const delay = reveal ? `${(revealIndex as number) * 0.12}s` : "0s";
  const classes = [
    animated ? "path-flow" : "",
    reveal ? "path-reveal" : "",
    reveal && inView ? "is-visible" : "",
  ]
    .filter(Boolean)
    .join(" ");

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
      className={classes || undefined}
      style={
        {
          ...(animated
            ? { ["--flow-duration" as string]: duration }
            : undefined),
          ...(reveal
            ? { ["--reveal-delay" as string]: delay }
            : undefined),
        } as React.CSSProperties
      }
    />
  );
}

/* ─────────────────── The trace ─────────────────── */

/** One full lap of the trace, in seconds. Each hop takes 10 % of it. */
const CYCLE_S = 7;

/** When the traced packet reaches each node (seconds into the lap). */
const HIT = {
  router: 0.7,
  queue: 1.45,
  dispatcher: 2.2,
  pool: 2.95,
  worker: 3.7,
};

/**
 * The traced task's hops, in order. Routes repeat the drawn wires exactly;
 * `at` is when the packet leaves (each hop takes 10 % of the lap). The apool block is claimed at 0.35 s and
 * returned when MSG_DONE lands (the slot-hold keyframes in globals.css).
 */
const TRACE: { d: string; at: number; tail: string; head: string }[] = [
  // MSG_SUBMIT, Producer A → Connection Router
  { d: "M 307 770 L 470 770 L 470 640 L 571 640", at: 0, tail: ORANGE_BRIGHT, head: "#ffd9c4" },
  // apool block claimed
  { d: "M 410 175 L 650 175 L 650 290", at: 0.35, tail: MUTED, head: "#edf2f5" },
  // MSG_OK back to the producer
  { d: "M 571 660 L 450 660 L 450 830 L 307 830", at: 0.75, tail: INK, head: "#ffffff" },
  // Router → Task Queue → Dispatcher → Worker Pool
  { d: "M 710 620 L 760 620 L 760 510 L 862 510", at: 0.75, tail: ORANGE_BRIGHT, head: "#ffd9c4" },
  { d: "M 930 530 L 930 580", at: 1.5, tail: ORANGE_BRIGHT, head: "#ffd9c4" },
  { d: "M 998 600 L 1040 600 L 1040 620 L 1068 620", at: 2.25, tail: ORANGE_BRIGHT, head: "#ffd9c4" },
  // MSG_TASK to Worker 1
  { d: "M 1192 600 L 1270 600 L 1270 470 L 1358 470", at: 3.0, tail: ORANGE_BRIGHT, head: "#ffd9c4" },
  // MSG_DONE back to the pool
  { d: "M 1492 490 L 1570 490 L 1570 535 L 1230 535 L 1230 580 L 1192 580", at: 3.85, tail: INK, head: "#ffffff" },
  // Meanwhile, the CLI asks for stats
  { d: "M 307 470 L 470 470 L 470 600 L 571 600", at: 5.3, tail: DIM, head: INK },
];

/** Length of an M/L polyline, in viewBox units. */
function polylineLength(d: string) {
  const n = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  let len = 0;
  for (let i = 2; i + 1 < n.length; i += 2) {
    len += Math.hypot(n[i] - n[i - 2], n[i + 1] - n[i - 1]);
  }
  return len;
}

function Trace() {
  return (
    <g aria-hidden>
      {TRACE.map((t, i) => {
        const style = {
          "--at": `${t.at}s`,
          "--len": `${polylineLength(t.d)}px`,
        } as React.CSSProperties;
        return (
          <g key={i} style={style}>
            <path d={t.d} className="packet-tail" stroke={t.tail} strokeWidth={4.5} strokeLinejoin="round" />
            <path d={t.d} className="packet-head" stroke={t.head} strokeWidth={7} strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

/** A node's outline lights for a beat when the trace reaches it. */
function NodeHit({ x, y, w, h, at }: { x: number; y: number; w: number; h: number; at: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={4}
      fill="rgba(255,87,0,0.1)"
      stroke={ORANGE_BRIGHT}
      strokeWidth={2}
      className="node-hit"
      style={{ "--at": `${at}s` } as React.CSSProperties}
    />
  );
}
