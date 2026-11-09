import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { Container, TextLink } from "./primitives";

export { ArchitectureDiagram };

/**
 * Architecture diagram for Quicx — accurate to the internal daemon topology.
 *
 *   ┌─ APOOL ┐                    (satellite, top-left)
 *   │ pages  │─── O(1) alloc/free ────────────────────────┐
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
      aria-labelledby="architecture-title"
      className="border-b border-quicx-line"
    >
      <Container className="py-24 lg:py-32">
        <h2
          id="architecture-title"
          className="display text-[clamp(2.75rem,6.4vw,5.5rem)] text-quicx-text"
        >
          One daemon.
        </h2>

        <figure className="mt-12 overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well">
          <div className="px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
            <ArchitectureDiagram />
          </div>
          <figcaption className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-quicx-line px-4 py-5 sm:px-6 lg:grid-cols-12 lg:items-end">
            <p className="max-w-[72ch] text-[15px] leading-[1.65] text-quicx-muted lg:col-span-9">
              Producers submit tasks over QXP, Quicx&rsquo;s own compact binary protocol. The daemon routes, queues and
              dispatches them to a fixed pool of workers. Every task on that path is one block from{" "}
              <code className="font-mono text-[14px] text-quicx-orange-bright">apool</code>, its
              page allocator, inside one fixed budget. One daemon, three role-based endpoints, one
              allocator.
            </p>
            <div className="lg:col-span-3 lg:justify-self-end">
              <TextLink href="/docs/architecture">Architecture in the docs</TextLink>
            </div>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
