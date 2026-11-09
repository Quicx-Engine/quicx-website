"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { HEADLINE, MEMORY_RUN } from "@/lib/benchmarks";
import { cn } from "@/lib/utils";
import { Odometer } from "./motion";

/**
 * The hero's signature: the apool budget drawn as a fixed frame. Each band is
 * one size and holds the slots of the pages that size's traffic has taken; apool
 * hands pages to the sizes that arrive, so the bands follow the illustrated
 * traffic mix instead of a split fixed at startup. On first sight the pool is
 * mapped in one sweep; after that, tasks run in along each size's bus, claim a
 * slot, and leave for a worker, and the slot goes back to the pool. Thousands of
 * claims, and the frame never grows, which is the whole claim of the product.
 *
 * The visitor can test that claim. Pressing and holding the pool (or the
 * "Hold to flood" control, or Space / Enter on it) submits faster than the
 * workers drain, so every slot fills. Once the pool is exhausted, further
 * submits bounce back the way the daemon answers them, MSG_ERROR 0x01 (queue
 * full), and "asked the OS" stays at 0 B. On release the workers drain the
 * flood in FIFO order, because Quicx runs one global FIFO.
 *
 * The idle traffic is an illustration (labelled as such) and is held under
 * the measured peak of 2.8 % (14 of 508 pages during the throughput run) so the
 * picture never shows something the reference run did not. The flood is the
 * visitor's own.
 */

const CLASSES = [
  { label: "32 B", share: 0.05 },
  { label: "64 B", share: 0.25 },
  { label: "128 B", share: 0.3 },
  { label: "256 B", share: 0.25 },
  { label: "512 B", share: 0.1 },
  { label: "1024 B", share: 0.05 },
] as const;

const ROWS = 3;
const CELL = 6;
const GAP = 3;
const PITCH = CELL + GAP;
// Each band sits under its own bus: a gutter whose centre line carries traffic.
const BUS = 12;
const BAND_H = ROWS * CELL + (ROWS - 1) * GAP;
const BAND_STEP = BUS + BAND_H;
const CANVAS_H = CLASSES.length * BAND_STEP;

const TARGET_OCCUPANCY = 0.025;
const MEAN_LIFE_MS = 3400;
const SPEED = 0.95; // px per ms along a bus
const TAIL = 56;
const IGNITE_MS = 260;
const AFTERGLOW_MS = 700;
const BOOT_MS = 1100;

// The flood: rate ramps up over FLOOD_RAMP_MS; at full rate an empty pool
// fills in about FLOOD_FILL_MS, on any width (the rate scales with the slots).
const FLOOD_RAMP_MS = 1400;
const FLOOD_FILL_MS = 1800;
const FLOOD_SPEED = 1.55;
const TAP_BURST = 10;
// A touch has to rest this long before it floods, so a scroll that starts on
// the pool does not.
const TOUCH_HOLD_MS = 140;
// The drain: workers start after a beat and empty a full pool in DRAIN_FILL_MS.
const DRAIN_DELAY_MS = 380;
const DRAIN_FILL_MS = 2200;
// Rejected submits are all counted; at most one is drawn per this many ms.
const REJECT_DRAW_MS = 22;

const ERROR_RGB = "242, 107, 91";

const readouts = [
  { value: HEADLINE.throughput, unit: "tasks/s", note: "end to end, one thread" },
  { value: HEADLINE.latencyUs, unit: "µs p50", note: "submit → done" },
  { value: HEADLINE.capacity, unit: "tasks", note: `of 100 B in 8 MiB (v1.0.4: ${HEADLINE.capacityBefore})` },
  { value: "55", unit: "KB binary", note: "no dependencies" },
];

// Literal classes for the 2- and 4-column hairlines (readouts and counters).
const QUAD_CELL = [
  "",
  "border-l",
  "border-t sm:border-t-0 sm:border-l",
  "border-t border-l sm:border-t-0",
];

const FREE = 0;
const INCOMING = 1;
const LIVE = 2;

type Mode = "idle" | "flood" | "drain";

type Band = {
  state: Uint8Array;
  held: Uint8Array; // 1 while the slot holds one of the visitor's tasks
  since: Float64Array; // arrival time while live, release time while free
  expiry: Float64Array;
  free: number;
};

type Packet = {
  kind: "in" | "out" | "reject";
  band: number;
  slot: number;
  t0: number;
  speed: number;
  // "in": along the bus, then a short drop into the slot.
  // "out": a short rise out of the slot, then along the bus and away.
  // "reject": along the bus to bx, then straight back out to ax.
  ax: number;
  bx: number;
  busY: number;
  slotY: number;
  length: number;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

export function PoolInstrument() {
  const hintId = useId();
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const claimedRef = useRef<HTMLSpanElement>(null);
  const returnedRef = useRef<HTMLSpanElement>(null);
  const rejectedRef = useRef<HTMLSpanElement>(null);
  const osRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonLabelRef = useRef<HTMLSpanElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const announceRef = useRef<HTMLParagraphElement>(null);
  const labelRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const figure = figureRef.current;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const button = buttonRef.current;
    if (!figure || !canvas || !wrap || !button) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(7);

    let width = 0;
    let cols = 0;
    let bands: Band[] = [];
    let packets: Packet[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let bootStart = -1;
    let spawnDebt = 0;
    let claimed = 0;
    let returned = 0;
    let rejected = 0;
    let hover = -1;
    let lastCounter = 0;

    let mode: Mode = "idle";
    let holding = false;
    let floodStart = 0;
    let floodDebt = 0;
    let drainAt = 0;
    let drainDebt = 0;
    let full = false;
    let lastRejectDrawn = 0;
    // FIFO of the visitor's tasks, encoded band << 16 | slot.
    let queue: number[] = [];
    let qHead = 0;

    const slotX = (i: number) => (i % cols) * PITCH;
    const slotY = (b: number, i: number) => b * BAND_STEP + BUS + Math.floor(i / cols) * PITCH;
    const busY = (b: number) => b * BAND_STEP + BUS / 2;
    const totalSlots = () => cols * ROWS * CLASSES.length;
    const totalFree = () => bands.reduce((n, band) => n + band.free, 0);

    const setText = (el: HTMLElement | null, text: string) => {
      if (el && el.textContent !== text) el.textContent = text;
    };
    const announce = (text: string) => setText(announceRef.current, text);

    const setFull = (on: boolean) => {
      if (full === on) return;
      full = on;
      figure.toggleAttribute("data-full", on);
      setText(osRef.current, on ? "still 0 B" : "0 B");
      if (on) {
        announce(
          "Pool full. New submits are rejected with MSG_ERROR 0x01, queue full. Memory asked of the OS: 0 bytes."
        );
      }
    };

    const layout = () => {
      width = wrap.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cols = Math.max(8, Math.floor((width + GAP) / PITCH));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(CANVAS_H * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${CANVAS_H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = cols * ROWS;
      bands = CLASSES.map(() => ({
        state: new Uint8Array(n),
        held: new Uint8Array(n),
        since: new Float64Array(n),
        expiry: new Float64Array(n),
        free: n,
      }));
      packets = [];
      queue = [];
      qHead = 0;
      if (mode !== "idle" && !holding) mode = "idle";
      setFull(false);
    };

    const pickBand = () => {
      let r = rand();
      let b = 0;
      for (; b < CLASSES.length - 1; b++) {
        r -= CLASSES[b].share;
        if (r <= 0) break;
      }
      return b;
    };

    const findFree = (band: Band, exhaustive = false) => {
      if (band.free === 0) return -1;
      const n = band.state.length;
      for (let tries = 0; tries < 12; tries++) {
        const i = Math.floor(rand() * n);
        if (band.state[i] === FREE) return i;
      }
      if (!exhaustive) return -1;
      let i = Math.floor(rand() * n);
      for (let k = 0; k < n; k++, i = (i + 1) % n) {
        if (band.state[i] === FREE) return i;
      }
      return -1;
    };

    const send = (kind: Packet["kind"], b: number, i: number, now: number, speed: number) => {
      const by = busY(b);
      if (kind === "reject") {
        const bx = width * (0.16 + rand() * 0.5);
        packets.push({
          kind, band: b, slot: -1, t0: now, speed,
          ax: -TAIL, bx, busY: by, slotY: by,
          length: 2 * (bx + TAIL),
        });
        return;
      }
      const x = slotX(i) + CELL / 2;
      const out = kind === "out";
      const ax = out ? x : -TAIL;
      const bx = out ? width + TAIL : x;
      const sy = slotY(b, i) + CELL / 2;
      packets.push({
        kind, band: b, slot: i, t0: now, speed,
        ax, bx, busY: by, slotY: sy,
        length: Math.abs(bx - ax) + Math.abs(sy - by),
      });
    };

    const land = (b: number, i: number, now: number) => {
      const band = bands[b];
      band.state[i] = LIVE;
      band.since[i] = reduce ? -1e9 : now;
      band.expiry[i] = band.held[i]
        ? Number.POSITIVE_INFINITY
        : now + MEAN_LIFE_MS * (0.45 + rand() * 1.1);
    };

    const release = (b: number, i: number, now: number, speed: number) => {
      const band = bands[b];
      band.state[i] = FREE;
      band.held[i] = 0;
      band.since[i] = reduce ? 0 : now;
      band.free++;
      returned++;
      if (!reduce) send("out", b, i, now, speed);
    };

    // Idle traffic: one task in, at the measured mix of size classes.
    const claim = (now: number) => {
      const b = pickBand();
      const band = bands[b];
      const i = findFree(band);
      if (i < 0) return;
      band.state[i] = INCOMING;
      band.free--;
      claimed++;
      if (reduce) land(b, i, now);
      else send("in", b, i, now, SPEED);
    };

    // The visitor's traffic. Classes fill in step with their free space, so
    // the whole pool runs out at once; after that every submit is refused.
    const floodClaim = (now: number) => {
      const free = totalFree();
      if (free === 0) {
        rejected++;
        setFull(true);
        if (!reduce && now - lastRejectDrawn >= REJECT_DRAW_MS) {
          lastRejectDrawn = now;
          send("reject", pickBand(), -1, now, FLOOD_SPEED);
        }
        return;
      }
      let r = rand() * free;
      let b = 0;
      for (; b < bands.length - 1; b++) {
        r -= bands[b].free;
        if (r < 0) break;
      }
      const band = bands[b];
      const i = findFree(band, true);
      if (i < 0) return;
      band.state[i] = INCOMING;
      band.held[i] = 1;
      band.free--;
      queue.push((b << 16) | i);
      claimed++;
      if (reduce) land(b, i, now);
      else send("in", b, i, now, FLOOD_SPEED);
    };

    // A point `s` px along a packet's route.
    const along = (p: Packet, s: number): [number, number] => {
      const run = Math.abs(p.bx - p.ax);
      if (p.kind === "reject") {
        return s <= run ? [p.ax + s, p.busY] : [p.bx - (s - run), p.busY];
      }
      const drop = Math.abs(p.slotY - p.busY);
      if (p.kind === "in") {
        if (s <= run) return [p.ax + s, p.busY];
        return [p.bx, p.busY + Math.min(s - run, drop)];
      }
      if (s <= drop) return [p.ax, p.slotY - s];
      return [p.ax + Math.min(s - drop, run), p.busY];
    };

    const drawPacket = (p: Packet, now: number) => {
      const head = (now - p.t0) * p.speed;
      const fast = p.speed > SPEED;
      const segs = fast ? 6 : 9;
      const rgb =
        p.kind === "reject" ? ERROR_RGB : p.kind === "out" ? "195, 206, 213" : "255, 122, 51";
      ctx.lineWidth = 1.75;
      ctx.lineCap = "butt";
      let [px, py] = along(p, Math.max(0, head - TAIL));
      for (let k = 1; k <= segs; k++) {
        const s = head - TAIL + (TAIL * k) / segs;
        if (s < 0) {
          [px, py] = along(p, 0);
          continue;
        }
        const [x, y] = along(p, Math.min(s, p.length));
        ctx.strokeStyle = `rgba(${rgb}, ${(k / segs) ** 2 * 0.95})`;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        px = x;
        py = y;
      }
      if (head <= p.length) {
        const [hx, hy] = along(p, head);
        ctx.fillStyle =
          p.kind === "reject" ? "#ffc4bb" : p.kind === "out" ? "#edf2f5" : "#ffd9c4";
        ctx.fillRect(hx - 1.5, hy - 1.5, 3, 3);
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, CANVAS_H);

      // Boot: the pool is mapped in one sweep, left to right.
      let scanX = Number.POSITIVE_INFINITY;
      if (bootStart >= 0) {
        const t = Math.min(1, (now - bootStart) / BOOT_MS);
        if (t < 1) scanX = easeOut(t) * (width + 40) - 20;
      }

      for (let b = 0; b < CLASSES.length; b++) {
        const band = bands[b];
        const hot = b === hover;
        if (hot) {
          ctx.fillStyle = "rgba(255, 87, 0, 0.05)";
          ctx.fillRect(-2, b * BAND_STEP + BUS - 3, width + 4, BAND_H + 6);
        }
        // The bus itself: a hairline the packets run along.
        ctx.fillStyle = hot ? "rgba(255, 122, 51, 0.22)" : "rgba(190, 222, 236, 0.06)";
        ctx.fillRect(0, Math.round(busY(b)), Math.min(width, scanX), 1);

        for (let i = 0; i < band.state.length; i++) {
          const x = slotX(i);
          if (x > scanX) continue;
          const y = slotY(b, i);
          const st = band.state[i];
          if (st === LIVE) {
            const age = now - band.since[i];
            if (age < IGNITE_MS) {
              const k = age / IGNITE_MS;
              // white-hot to orange
              const g = Math.round(241 - (241 - 87) * k);
              const bl = Math.round(232 - 232 * k);
              ctx.fillStyle = `rgb(255, ${g}, ${bl})`;
            } else {
              ctx.fillStyle = "#ff5700";
            }
            ctx.fillRect(x, y, CELL, CELL);
            continue;
          }
          // Freshly mapped cells flash as the sweep passes them.
          const behind = scanX - x;
          let a = hot ? 0.14 : 0.075;
          if (behind < 90) a += (1 - behind / 90) * 0.35;
          ctx.fillStyle = `rgba(190, 222, 236, ${a})`;
          ctx.fillRect(x, y, CELL, CELL);
          const since = band.since[i];
          if (st === FREE && since > 0) {
            const fade = 1 - (now - since) / AFTERGLOW_MS;
            if (fade > 0) {
              ctx.fillStyle = `rgba(255, 122, 51, ${fade * 0.6})`;
              ctx.fillRect(x, y, CELL, CELL);
            }
          }
        }
      }

      if (scanX < width + 20) {
        ctx.fillStyle = "#ff5700";
        ctx.fillRect(Math.round(scanX) + 2, 0, 1, CANVAS_H);
      }

      for (const p of packets) drawPacket(p, now);
    };

    const updateReadouts = (now: number, force = false) => {
      if (!force && now - lastCounter <= 90) return;
      lastCounter = now;
      setText(claimedRef.current, claimed.toLocaleString("en-US"));
      setText(returnedRef.current, returned.toLocaleString("en-US"));
      setText(rejectedRef.current, rejected.toLocaleString("en-US"));
      rejectedRef.current?.toggleAttribute("data-on", rejected > 0);

      const total = totalSlots();
      const used = total - totalFree();
      const pct = Math.round((used / total) * 100);
      if (meterRef.current) meterRef.current.style.transform = `scaleX(${used / total})`;

      const booted = bootStart >= 0 && now - bootStart >= BOOT_MS * 0.7;
      let status = booted || reduce ? "8 MiB, mapped once at startup" : "mapping 8 MiB…";
      // Never longer than the idle status, so the header never rewraps.
      if (mode === "flood") status = full ? "full · 8 of 8 MiB in use" : `flooding · ${pct} % in use`;
      else if (mode === "drain") status = `FIFO drain · ${pct} % in use`;
      setText(statusRef.current, status);
    };

    const step = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (bootStart < 0) bootStart = now;
      const booted = now - bootStart >= BOOT_MS * 0.7;

      let live = 0;
      for (let b = 0; b < bands.length; b++) {
        const band = bands[b];
        for (let i = 0; i < band.state.length; i++) {
          const st = band.state[i];
          if (st === LIVE) {
            if (band.expiry[i] <= now) release(b, i, now, SPEED);
            else live++;
          } else if (st === INCOMING) {
            live++;
          }
        }
      }

      // Land packets that reached their slot; drop the ones that left the frame.
      packets = packets.filter((p) => {
        const done = (now - p.t0) * p.speed >= p.length + (p.kind === "in" ? 0 : TAIL);
        if (!done) return true;
        if (p.kind === "in") land(p.band, p.slot, now);
        return false;
      });

      const total = totalSlots();
      if (mode === "flood") {
        const t = Math.min(1, (now - floodStart) / FLOOD_RAMP_MS);
        floodDebt += (total / FLOOD_FILL_MS) * (0.18 + 0.82 * t * t) * dt;
        while (floodDebt >= 1) {
          floodClaim(now);
          floodDebt -= 1;
        }
      } else if (mode === "drain" && now >= drainAt) {
        drainDebt += (total / DRAIN_FILL_MS) * dt;
        while (drainDebt >= 1 && qHead < queue.length) {
          const code = queue[qHead];
          const b = code >> 16;
          const i = code & 0xffff;
          // Still in transit: FIFO means nobody behind it goes first.
          if (bands[b].state[i] === INCOMING) break;
          if (bands[b].state[i] === LIVE && bands[b].held[i]) release(b, i, now, FLOOD_SPEED);
          qHead++;
          drainDebt -= 1;
        }
        if (full && totalFree() > 0) setFull(false);
        if (qHead >= queue.length) {
          queue = [];
          qHead = 0;
          drainDebt = 0;
          mode = "idle";
          setFull(false);
          announce("Drained in FIFO order. The pool never grew.");
        }
      } else if (mode === "idle" && booted && !reduce) {
        const target = total * TARGET_OCCUPANCY;
        const rate = (target / MEAN_LIFE_MS) * (live < target ? 1.6 : 0.6);
        spawnDebt += rate * dt;
        while (spawnDebt >= 1) {
          claim(now);
          spawnDebt -= 1;
        }
      }

      draw(now);
      updateReadouts(now, mode === "idle" && raf === 0);

      const busy = mode !== "idle" || packets.length > 0;
      raf = visible && (!reduce || busy) ? requestAnimationFrame(step) : 0;
      if (!raf) updateReadouts(now, true);
    };

    // Reduced motion: one still frame of a working pool, counters to match.
    const seedStatic = () => {
      const count = Math.round(totalSlots() * TARGET_OCCUPANCY);
      let held = 0;
      for (let k = 0; k < count; k++) {
        const b = pickBand();
        const i = findFree(bands[b]);
        if (i >= 0) {
          bands[b].state[i] = LIVE;
          bands[b].since[i] = -1e9;
          bands[b].expiry[i] = Number.POSITIVE_INFINITY;
          bands[b].free--;
          held++;
        }
      }
      claimed = held;
      updateReadouts(performance.now(), true);
      draw(performance.now());
    };

    const start = () => {
      if (raf || !visible) return;
      if (reduce && mode === "idle" && packets.length === 0) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    // Flood control, shared by the pool itself, the button and the keyboard.
    const setHolding = (on: boolean) => {
      holding = on;
      button.toggleAttribute("data-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
      setText(buttonLabelRef.current, on ? "Flooding" : "Hold to flood");
    };

    const beginFlood = () => {
      if (holding) return;
      const now = performance.now();
      if (mode !== "flood") {
        mode = "flood";
        floodStart = now;
        floodDebt = 0;
      }
      setHolding(true);
      for (let k = 0; k < TAP_BURST; k++) floodClaim(now);
      start();
    };

    const endFlood = () => {
      if (!holding) return;
      setHolding(false);
      if (mode === "flood") {
        mode = "drain";
        drainAt = performance.now() + DRAIN_DELAY_MS;
        drainDebt = 0;
      }
      start();
    };

    layout();
    if (reduce) {
      seedStatic();
    } else {
      setText(statusRef.current, "mapping 8 MiB…");
      draw(performance.now());
      start();
    }

    const ro = new ResizeObserver(() => {
      if (wrap.clientWidth === width) return;
      layout();
      if (reduce) seedStatic();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) start();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else endFlood();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const setHover = (b: number) => {
      if (b === hover) return;
      labelRefs.current.forEach((el, k) => el?.toggleAttribute("data-hot", k === b));
      hover = b;
      if (!raf) draw(performance.now());
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      const b = Math.floor(y / BAND_STEP);
      setHover(b >= 0 && b < CLASSES.length ? b : -1);
    };
    const onLeave = () => setHover(-1);

    // Pressing the pool: a mouse floods at once; a touch waits a beat so a
    // scroll that starts on the pool stays a scroll (it cancels the pointer).
    let pending = 0;
    const onPoolDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (e.pointerType === "mouse") {
        e.preventDefault();
        beginFlood();
        return;
      }
      window.clearTimeout(pending);
      pending = window.setTimeout(() => {
        pending = 0;
        beginFlood();
      }, TOUCH_HOLD_MS);
    };
    const onPoolUp = () => {
      if (pending) {
        // A tap: one short burst.
        window.clearTimeout(pending);
        pending = 0;
        beginFlood();
      }
      endFlood();
    };
    const onPoolCancel = () => {
      window.clearTimeout(pending);
      pending = 0;
      endFlood();
    };

    const onButtonDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      button.setPointerCapture(e.pointerId);
      beginFlood();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      e.preventDefault();
      if (!e.repeat) beginFlood();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      e.preventDefault();
      endFlood();
    };
    const preventMenu = (e: Event) => e.preventDefault();

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onPoolDown);
    wrap.addEventListener("contextmenu", preventMenu);
    button.addEventListener("pointerdown", onButtonDown);
    button.addEventListener("contextmenu", preventMenu);
    button.addEventListener("keydown", onKeyDown);
    button.addEventListener("keyup", onKeyUp);
    button.addEventListener("blur", endFlood);
    window.addEventListener("pointerup", onPoolUp);
    window.addEventListener("pointercancel", onPoolCancel);
    window.addEventListener("blur", endFlood);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pending);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onPoolDown);
      wrap.removeEventListener("contextmenu", preventMenu);
      button.removeEventListener("pointerdown", onButtonDown);
      button.removeEventListener("contextmenu", preventMenu);
      button.removeEventListener("keydown", onKeyDown);
      button.removeEventListener("keyup", onKeyUp);
      button.removeEventListener("blur", endFlood);
      window.removeEventListener("pointerup", onPoolUp);
      window.removeEventListener("pointercancel", onPoolCancel);
      window.removeEventListener("blur", endFlood);
    };
  }, []);

  return (
    <figure
      ref={figureRef}
      className="pool enter overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well"
      style={{ "--d": "260ms" } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-quicx-line px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-3">
          <span className="caps-label text-quicx-text">apool</span>
          <span ref={statusRef} className="font-mono text-[12px] tabular-nums text-quicx-dim">
            8 MiB, mapped once at startup
          </span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[12px] text-quicx-dim">
          <span aria-hidden data-loop className="live-dot size-1.5 rounded-full bg-quicx-orange" />
          6 of 68 sizes, illustrated
        </span>
      </div>

      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 px-4 pb-4 pt-3 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:px-5">
        <span aria-hidden />
        <div
          aria-hidden
          className="mb-1 flex items-center justify-between gap-3 font-mono text-[11px] text-quicx-dim"
        >
          <span className="flex items-center gap-2">
            <span className="h-px w-5 bg-linear-to-r from-transparent to-quicx-orange-bright" />
            MSG_SUBMIT in
          </span>
          <span className="flex items-center gap-2">
            MSG_TASK out
            <span className="h-px w-5 bg-linear-to-r from-transparent to-quicx-body" />
          </span>
        </div>

        <ul aria-hidden className="flex flex-col font-mono text-[11px] leading-none text-quicx-dim">
          {CLASSES.map((c, i) => (
            <li
              key={c.label}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="flex items-center justify-end whitespace-nowrap transition-colors duration-150 data-[hot]:text-quicx-orange-bright"
              style={{ height: BAND_H, marginTop: BUS }}
            >
              {c.label}
            </li>
          ))}
        </ul>
        <div
          ref={wrapRef}
          aria-hidden
          className="pool-canvas min-w-0 cursor-crosshair select-none"
          style={{ height: CANVAS_H }}
        >
          <canvas ref={canvasRef} className="block" style={{ height: CANVAS_H }} />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-quicx-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5">
        <p id={hintId} className="max-w-[52ch] text-[12.5px] leading-snug text-quicx-dim">
          Press and hold to submit faster than the workers drain. The pool fills to its last
          slot, refuses the rest, and never grows.
        </p>
        <button
          ref={buttonRef}
          type="button"
          aria-pressed="false"
          aria-describedby={hintId}
          className="pool-flood group relative inline-flex h-9 shrink-0 select-none items-center gap-2.5 self-start overflow-hidden rounded-[3px] border border-quicx-line-strong px-3.5 font-control text-[12.5px] text-quicx-text transition-colors duration-200 hover:border-quicx-text/45 hover:bg-white/[0.03] data-[on]:border-quicx-orange/70 sm:self-auto"
        >
          <span aria-hidden className="size-1.5 rounded-[1px] bg-quicx-orange" />
          <span ref={buttonLabelRef}>Hold to flood</span>
          <span
            ref={meterRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-quicx-orange"
            style={{ transform: "scaleX(0)" }}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 border-t border-quicx-line font-mono text-[12px] sm:grid-cols-4">
        <Counter label="claimed" className={QUAD_CELL[0]}>
          <span ref={claimedRef} className="text-quicx-text">
            0
          </span>
        </Counter>
        <Counter label="returned" className={QUAD_CELL[1]}>
          <span ref={returnedRef} className="text-quicx-text">
            0
          </span>
        </Counter>
        <Counter label="MSG_ERROR 0x01" className={QUAD_CELL[2]}>
          <span ref={rejectedRef} className="pool-rejected text-quicx-text">
            0
          </span>
        </Counter>
        <Counter label="asked the OS" className={QUAD_CELL[3]}>
          <span ref={osRef} className="text-quicx-orange-bright">
            0 B
          </span>
        </Counter>
      </div>

      <dl className="odo-run grid grid-cols-2 border-t border-quicx-line sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {readouts.map((r, i) => (
          <div key={r.unit} className={cn("border-quicx-line px-4 py-3.5 sm:px-5", QUAD_CELL[i])}>
            <dt className="sr-only">{r.unit}</dt>
            <dd>
              <span className="flex items-baseline gap-1.5 font-mono">
                <Odometer
                  value={r.value}
                  delay={700 + i * 120}
                  className="text-[24px] font-medium leading-none tracking-[-0.02em] text-quicx-text"
                />
                <span className="text-[12px] text-quicx-orange-bright">{r.unit}</span>
              </span>
              <span className="mt-2 block text-[12.5px] leading-snug text-quicx-dim">{r.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <figcaption className="border-t border-quicx-line px-4 py-3 text-[12.5px] leading-relaxed text-quicx-dim sm:px-5">
        Idle traffic stays under the measured {MEMORY_RUN.poolPeakPct} % peak; the flood is
        yours. Figures are medians of the reference runs of{" "}
        <Link
          href="/docs/benchmarks"
          className="font-mono text-quicx-muted underline decoration-quicx-orange/50 hover:text-quicx-text hover:decoration-quicx-orange"
        >
          bench/run.sh
        </Link>
        ; nothing estimated.
      </figcaption>

      <p ref={announceRef} role="status" aria-live="polite" className="sr-only" />
    </figure>
  );
}

function Counter({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("flex flex-col gap-1 border-quicx-line px-4 py-2.5 sm:px-5", className)}>
      <span className="text-[11px] text-quicx-dim sm:text-[12px]">{label}</span>
      <span className="text-[13px] tabular-nums">{children}</span>
    </p>
  );
}
