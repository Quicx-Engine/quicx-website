import { ArchitectureDiagram } from "./ArchitectureDiagram";

export { ArchitectureDiagram };

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
      className="relative overflow-hidden border-t border-quicx-line bg-[#112a3c]"
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,87,0,0.09),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-3xl">
          {/* Editorial section marker */}
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-quicx-orange/60"
            />
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.34em] text-quicx-orange-bright">
              <span className="text-quicx-dim">§ 02</span>
              <span className="text-quicx-dim">/</span>
              <span>Under the hood</span>
            </span>
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-l from-transparent to-quicx-orange/60"
            />
          </div>

          {/* Split headline — display face on top, sans beneath */}
          <h2 className="mt-7 text-center">
            <span className="hero-display block text-[clamp(2.25rem,6vw,4.25rem)] text-quicx-text">
              One daemon.
            </span>
            <span className="mt-2 block font-[family-name:var(--font-archivo)] text-balance text-[clamp(1.25rem,2.6vw,1.85rem)] font-medium leading-[1.25] text-quicx-muted">
              Every piece in its place.
            </span>
          </h2>

          {/* Brand rule */}
          <div
            aria-hidden
            className="mx-auto mt-8 flex items-center justify-center gap-2"
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-quicx-orange/50" />
            <span className="size-1.5 rotate-45 bg-quicx-orange" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-quicx-orange/50" />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-quicx-muted">
            Producers submit tasks over a compact binary protocol. The Quicx
            daemon routes, queues and dispatches work to a fixed pool of workers
            {" "}— all backed by{" "}
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13.5px] text-quicx-orange-bright">
              PMAD
            </span>
            , our deterministic slab allocator.
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
