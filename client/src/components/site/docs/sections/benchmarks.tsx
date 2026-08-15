import Link from "next/link";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";
import {
  REFERENCE_RUN,
  LATENCY_PERCENTILES,
  LATENCY_BY_LOAD,
  THROUGHPUT_RUN,
  MEMORY_RUN,
  FOOTPRINT,
  METHODOLOGY,
  COMPARISON,
} from "@/lib/benchmarks";

export function BenchmarksSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="benchmarks" />

      <Callout variant="note" title="What &ldquo;measured&rdquo; means on this page">
        Every figure below came off one machine, one build, one afternoon, and is
        reproducible with <InlineCode>bench/run.sh</InlineCode>. Numbers that were not
        measured here appear only in the comparison table at the bottom, and are labelled
        with their provenance every time they appear.
      </Callout>

      <SubHeading id="reference-run">Reference run</SubHeading>

      <Table
        headers={["", "Configuration"]}
        rows={[
          ["machine", REFERENCE_RUN.machine],
          ["os", REFERENCE_RUN.os],
          ["build", REFERENCE_RUN.build],
          ["allocator", REFERENCE_RUN.allocator],
          ["transport", REFERENCE_RUN.transport],
          ["load", REFERENCE_RUN.load],
        ]}
      />

      <Callout variant="warn" title="Earlier figures were withdrawn">
        Anything measured before the <InlineCode>send_frame_v</InlineCode> fix is
        unverifiable and has been removed from this site.{" "}
        <InlineCode>protocol.c</InlineCode> wrote one <InlineCode>struct iovec</InlineCode>{" "}
        past the end of a stack array on every task dispatch that carried a payload —
        undefined behaviour. One build aborted on the first task; another silently corrupted
        adjacent stack slots and kept running. A measurement taken before the fix may be fine
        or may be garbage, and there is no way to tell retroactively, so everything was
        retaken on a fixed build. The fix itself is free: 46.8k/s fixed versus 46.4k/s
        unfixed at identical settings.
      </Callout>

      <SubHeading id="bench-throughput">Throughput</SubHeading>

      <Prose>
        <p>
          <strong>74,300 tasks/sec</strong> — end to end, single thread.{" "}
          {THROUGHPUT_RUN.window}. {THROUGHPUT_RUN.tasks} tasks in the measured window,{" "}
          {THROUGHPUT_RUN.errors}. {THROUGHPUT_RUN.spread}
        </p>
        <p>
          One Quicx task is a full lifecycle: producer submits → daemon acks → daemon
          dispatches → worker parses the payload → worker reports done → producer is
          notified. <strong>Five protocol messages.</strong> This is not a single enqueue
          operation, and it should not be compared against one.
        </p>
      </Prose>

      <SubHeading id="bench-latency">Latency</SubHeading>

      <Prose>
        <p>
          Open loop at 40,000 tasks/sec offered. Tasks are due on a fixed schedule and
          latency is measured from the <em>scheduled</em> time, so any stall is charged in
          full rather than hidden by a client that slows down along with the server.
        </p>
      </Prose>

      <Table
        headers={["Percentile", "submit → done"]}
        rows={LATENCY_PERCENTILES.map((p) => [
          p.label,
          p.label === "p50" ? <strong key={p.label}>{p.value}</strong> : p.value,
        ])}
      />

      <Prose>
        <p>
          Latency stays flat from 10k/s to 40k/s — the daemon is not straining anywhere in
          that range.
        </p>
      </Prose>

      <Table
        headers={["offered", "p50", "p99", "p99.9"]}
        rows={LATENCY_BY_LOAD.map((r) => [r.offered, r.p50, r.p99, r.p999])}
      />

      <Callout variant="warn" title="submit → ack is not the number that matters">
        A submit → ack measurement times how long the daemon takes to say
        &ldquo;received&rdquo;. It never touches a worker. Every latency figure on this page
        is submit → done: the producer is notified only after a worker has actually parsed
        the payload and reported completion.
      </Callout>

      <SubHeading id="bench-memory">Memory</SubHeading>

      <Prose>
        <p>
          Idle RSS <strong>{MEMORY_RUN.idleRss}</strong>. After {THROUGHPUT_RUN.tasks}{" "}
          tasks: <strong>{MEMORY_RUN.finalRss}</strong>. Delta:{" "}
          <strong>{MEMORY_RUN.delta}</strong>.
        </p>
        <p>
          Not &ldquo;low growth&rdquo; — no growth. The pool is mapped once at startup and
          every allocation comes out of it. <InlineCode>quicx status</InlineCode> reports
          live usage per size class, so you can see exactly which classes your workload
          consumes. At the default {MEMORY_RUN.poolSize} pool under this load, peak usage was{" "}
          {MEMORY_RUN.poolPeakPct}% of the pool.
        </p>
      </Prose>

      <SubHeading id="bench-footprint">Footprint</SubHeading>

      <Table
        headers={["", "Value"]}
        rows={FOOTPRINT.map((f) => [
          f.label,
          f.note ? `${f.value} (${f.note})` : f.value,
        ])}
      />

      <SubHeading id="bench-methodology">Methodology</SubHeading>

      <Prose>
        <p>
          The harness lives in <InlineCode>bench/</InlineCode> and you can run it yourself.
          The choices below are the difference between a benchmark and a marketing claim.
        </p>
      </Prose>

      <KeyList items={METHODOLOGY.map((m) => ({ term: m.title, def: m.body }))} />

      <SubHeading id="bench-comparison">Comparison with other queues</SubHeading>

      <Callout variant="warn" title="Only the Quicx row was measured here">
        Every other figure comes from vendor documentation or third-party benchmarks on
        unknown hardware. They are included for rough orientation, not as a head-to-head
        result.
      </Callout>

      <Table
        headers={["", "throughput", "latency", "provenance"]}
        rows={COMPARISON.map((c) => [
          c.measured ? <strong key={c.system}>{c.system}</strong> : c.system,
          c.throughput,
          c.latency,
          c.provenance,
        ])}
      />

      <Callout variant="perf" title="The unit trap">
        A Quicx task is five protocol messages across two connections. A Redis{" "}
        <InlineCode>LPUSH</InlineCode> is one command — and a real Redis job queue needs{" "}
        <InlineCode>LPUSH</InlineCode> + <InlineCode>BRPOP</InlineCode> + an ack. Normalised
        per completed job, Redis&rsquo;s ~161k commands/sec is on the order of 50k jobs/sec.
        Putting 74.3k tasks/s next to 161k LPUSH/s directly would flatter Redis by roughly
        3×.
      </Callout>

      <Prose>
        <p>
          Part of Quicx&rsquo;s latency advantage is work it is not doing. Before you take
          these numbers as a reason to switch, read{" "}
          <Link href="/docs/limitations">Limitations</Link> — it lists exactly which work that is.
        </p>
      </Prose>
    </section>
  );
}
