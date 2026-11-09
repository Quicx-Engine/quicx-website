import Link from "next/link";
import { ArchitectureDiagram } from "@/components/site/Architecture";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
} from "@/components/site/docs/_primitives";

export function ArchitectureSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="architecture" />

      <figure className="overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well">
        <div className="px-4 py-5 sm:px-6">
          <ArchitectureDiagram variant="flow" />
        </div>
        <figcaption className="border-t border-quicx-line px-4 py-3 text-[13px] text-quicx-dim">
          The daemon, its three role-based endpoints and the allocator behind them.
        </figcaption>
      </figure>

      <Prose>
        <p>
          Quicx is deliberately flat. A single <strong>daemon</strong>{" "}process owns the task
          queue, the worker pool and the <Link href="/docs/allocator">apool allocator</Link>. Producers and workers are plain TCP
          clients that speak the same binary protocol — the first frame they send tells the
          daemon which role they&rsquo;re playing.
        </p>
        <p>There are four message paths, one in each direction across the two hops in the diagram:</p>
      </Prose>

      <KeyList
        items={[
          {
            term: "producer → daemon",
            def: (
              <>
                <InlineCode>MSG_SUBMIT</InlineCode> lands a new task. The daemon responds with
                either <InlineCode>MSG_OK&nbsp;{"{task_id}"}</InlineCode> or{" "}
                <InlineCode>MSG_ERROR&nbsp;{"{code}"}</InlineCode> — always, within one
                round-trip.
              </>
            ),
          },
          {
            term: "daemon → worker",
            def: (
              <>
                Workers announce themselves with <InlineCode>MSG_READY</InlineCode> and block
                reading. The daemon pushes <InlineCode>MSG_TASK</InlineCode> frames to the
                first idle worker as soon as one is queued. If the queue is empty, the worker
                simply stays blocked — <InlineCode>MSG_WAIT</InlineCode> is defined on the wire
                but nothing in the daemon actually sends it.
              </>
            ),
          },
          {
            term: "worker → daemon",
            def: (
              <>
                <InlineCode>MSG_DONE&nbsp;{"{task_id}"}</InlineCode> on success,{" "}
                <InlineCode>MSG_FAILED&nbsp;{"{task_id, reason}"}</InlineCode> on failure.{" "}
                <InlineCode>MSG_HEARTBEAT</InlineCode> / <InlineCode>MSG_PONG</InlineCode>{" "}
                keep the socket from half-closing under long idle.
              </>
            ),
          },
          {
            term: "daemon → producer",
            def: (
              <>
                As of v1.0.3, the daemon forwards the worker&rsquo;s outcome back over the
                producer&rsquo;s original connection —{" "}
                <InlineCode>MSG_DONE&nbsp;{"{task_id}"}</InlineCode> or{" "}
                <InlineCode>MSG_FAILED&nbsp;{"{task_id, reason}"}</InlineCode>{" "}with the
                worker&rsquo;s real reason. A producer&rsquo;s socket now spans the task&rsquo;s
                full lifetime, not just the initial submit.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="single-daemon-design">Why a single daemon?</SubHeading>

      <Prose>
        <p>
          Multi-node queues pay a tax in the form of leader elections, replication logs and
          consistent hashing. Quicx is optimised for the much more common case where your
          queue lives on the <strong>same host</strong> (or at worst, the same availability
          zone) as your producers and workers. One daemon measured{" "}
          <strong>81,900 tasks/sec end to end</strong> on a single thread over loopback, at a
          49 µs median — see <Link href="/docs/benchmarks">Benchmarks</Link> for the harness and the
          caveats. It does that inside one fixed memory budget: allocation is O(1), and memory a
          burst used goes back to the OS once the queue drains.
        </p>
        <p>
          Scaling horizontally means running multiple independent Quicx daemons behind a
          simple TCP load balancer. A task never crosses daemons — it&rsquo;s queued, run and
          completed on whichever instance the producer happened to land on — so there&rsquo;s
          still no replication to coordinate. The one thing that changed in v1.0.3: since
          completion is now reported back on the producer&rsquo;s original connection, that
          socket has to stay pinned to its daemon for the life of the task, not just for the
          initial submit.
        </p>
      </Prose>
    </section>
  );
}
