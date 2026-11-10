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
  SECOND_RUN,
  HEADLINE,
  LATENCY_PERCENTILES,
  LATENCY_BY_MACHINE,
  THROUGHPUT_RUN,
  MEMORY_RUN,
  CAPACITY,
  MEMORY_BY_MACHINE,
  FOOTPRINT,
  METHODOLOGY,
  COMPARISON,
  REDIS_DEFAULTS,
  REDIS_SAME_LIMIT,
  ADMISSION_RUN,
} from "@/lib/benchmarks";

export function BenchmarksSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="benchmarks" />

      <Callout variant="note" title="What &ldquo;measured&rdquo; means on this page">
        Every figure below came off Quicx 2.0 on two machines,
        built with the same flags and driven by the same scripts, and is reproducible with{" "}
        <InlineCode>bench/run.sh</InlineCode>. Each one is the median of several interleaved
        runs, next to v1.0.4 measured the same way. Numbers that were not measured here
        appear only in the comparison table at the bottom, labelled with their provenance.
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

      <Prose>
        <p>
          The second machine is a 2011 desktop: {SECOND_RUN.machine}, {SECOND_RUN.os},{" "}
          {SECOND_RUN.build}. It runs the same suite, so an effect that shows on both is not a
          property of one CPU or one kernel.
        </p>
      </Prose>

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
          <strong>{HEADLINE.throughput} tasks/sec</strong> — end to end, single thread, median
          of 5 runs on the M4 Pro. {THROUGHPUT_RUN.window}, {THROUGHPUT_RUN.errors}.{" "}
          {THROUGHPUT_RUN.spread} The allocator did not change the speed: its share of a round
          trip is about 15 ns.
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
          Open loop at 40,000 tasks/sec offered on the M4 Pro, median of 5 runs. Tasks are due
          on a fixed schedule and latency is measured from the <em>scheduled</em> time, so any
          stall is charged in full rather than hidden by a client that slows down along with the
          server.
        </p>
      </Prose>

      <Table
        headers={["Percentile", "submit → done"]}
        rows={LATENCY_PERCENTILES.map((p) => [
          p.label,
          p.label === "p50" ? <strong key={p.label}>{p.value}</strong> : p.value,
        ])}
      />

      <SubHeading id="bench-machines">Two machines</SubHeading>

      <Prose>
        <p>
          Each machine is offered a rate it handles comfortably. The i3 tops out at 19.0k
          tasks/sec in the closed loop because eleven processes — the daemon, 8 workers and 2
          producers — share its four hardware threads. On both machines v1.0.4 and v2.0.0 are
          inside each other&rsquo;s run-to-run range.
        </p>
      </Prose>

      <Table
        headers={["machine", "offered", "p50", "p99", "p99.9", "closed loop"]}
        rows={LATENCY_BY_MACHINE.map((r) => [r.machine, r.offered, r.p50, r.p99, r.p999, r.throughput])}
      />

      <Callout variant="warn" title="submit → ack is not the number that matters">
        A submit → ack measurement times how long the daemon takes to say
        &ldquo;received&rdquo;. It never touches a worker. Every latency figure on this page
        is submit → done: the producer is notified only after a worker has actually parsed
        the payload and reported completion.
      </Callout>

      <SubHeading id="bench-capacity">Capacity</SubHeading>

      <Prose>
        <p>
          How many tasks the daemon accepts in the default {MEMORY_RUN.poolSize} before it
          answers <InlineCode>ERROR 0x01</InlineCode>. The sizes are sent one after another to
          the same daemon and the queue is drained in between, so v2 has to follow each change.
          The counts are identical on both machines.
        </p>
      </Prose>

      <Table
        headers={["payload", "v1.0.4", "v2.0.0"]}
        rows={CAPACITY.map((r) => [r.payload, r.v104, <strong key={r.payload}>{r.v2}</strong>])}
      />

      <SubHeading id="bench-memory">Memory</SubHeading>

      <Prose>
        <p>
          v2 maps the budget once and never grows it, but it only touches the pages it hands
          out, and pages that empty after a burst give their memory back to the OS
          (<InlineCode>MADV_FREE_REUSABLE</InlineCode> on macOS,{" "}
          <InlineCode>MADV_DONTNEED</InlineCode> on Linux). v1.0.4 wrote a header into every
          block at startup, so it held the whole pool from the first second.
        </p>
      </Prose>

      <Table
        headers={["physical memory, KB", "v1.0.4 Mac", "v2.0.0 Mac", "v1.0.4 Linux", "v2.0.0 Linux"]}
        rows={MEMORY_BY_MACHINE.map((r) => [r.stage, r.macV104, r.macV2, r.linuxV104, r.linuxV2])}
      />

      <Prose>
        <p>
          macOS measures <InlineCode>phys_footprint</InlineCode> and Linux the resident set
          size, so compare within one machine. Under the throughput load v2 used at most{" "}
          {MEMORY_RUN.poolPeakPct}% of the pool (14 of 508 pages);{" "}
          <InlineCode>quicx status</InlineCode> shows the pages each size holds, live.
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

      <SubHeading id="next-to-redis">Next to Redis</SubHeading>

      <Prose>
        <p>
          Redis is where most task queues live, so Quicx and Redis 7 ran side by side: each in a
          Docker container limited to 64 MB, both sent the same 100-byte tasks at 40,000 a second
          by one producer. Redis stored them in a list, the most compact way it can hold a queue.
          Memory is what each container actually used.
        </p>
        <p>
          With each program&rsquo;s defaults, Redis has no memory limit. It took{" "}
          {REDIS_DEFAULTS.redisAccepted} tasks and kept growing until Linux killed it at{" "}
          {REDIS_DEFAULTS.redisKilledAt}, and every task in the queue went with it. Quicx took{" "}
          {REDIS_DEFAULTS.quicxAccepted}, answered <InlineCode>ERROR 0x01</InlineCode> to the next{" "}
          {REDIS_DEFAULTS.quicxRefused}, never went past {REDIS_DEFAULTS.quicxPeak}, and was back to{" "}
          {REDIS_DEFAULTS.quicxAfter} once eight workers had emptied it.
        </p>
        <p>Given the same limit, Redis holds more tasks:</p>
      </Prose>

      <Table
        headers={["limit", "Redis tasks", "Quicx tasks", "Redis peak memory", "Quicx peak memory"]}
        rows={REDIS_SAME_LIMIT.map((r) => [r.limit, r.redisTasks, r.quicxTasks, r.redisPeak, r.quicxPeak])}
      />

      <Prose>
        <p>
          A Redis list keeps a 100-byte item in about 103 bytes. Quicx keeps each task in a
          176-byte block: the payload plus a 64-byte record with the task&rsquo;s id, its type and
          the connection its result goes back to. Both refuse new work once full and keep
          running; the difference is what the limit means. <InlineCode>maxmemory</InlineCode>{" "}
          counts Redis&rsquo;s data, not the process: set to 56 MiB, Redis peaked at 63.7 MiB,
          0.3 MiB short of being killed. Quicx&rsquo;s budget is all of its task memory. The
          scripts and raw results are in <InlineCode>docs/report/scripts/redis</InlineCode> in the
          repository, and one command repeats the run.
        </p>
      </Prose>

      <SubHeading id="when-full">When the budget is full</SubHeading>

      <Prose>
        <p>
          With <InlineCode>admission = value</InlineCode>, producers give each task a value level
          (<InlineCode>MSG_SUBMIT_VALUED</InlineCode>) and the queue spends its budget on the most
          valuable work: higher levels go first, and a full budget evicts a waiting task of a lower
          level, but only one whose memory apool proves the new task can use. The real daemon ran
          over budget (256 KiB, one worker at 500 tasks a second). Steady: 2,000 tasks a second for
          15 s, one in ten valuable at random. Burst: valuable tasks at 1,000 a second for 3 s, then
          ordinary ones at 2,000 a second for 9 s. Median of 3 runs.
        </p>
      </Prose>

      <Table
        headers={["", "steady: valuable done", "steady: valuable wait", "steady: evicted", "burst: valuable done"]}
        rows={ADMISSION_RUN.map((r) => [r.config, r.steadyDone, r.steadyWait, r.steadyEvicted, r.burstDone])}
      />

      <Prose>
        <p>
          Dropping the oldest task keeps the valuable ones in the steady run but evicts ten times as
          many tasks, and in the burst the ordinary flood pushes out 1,062 valuable tasks still
          waiting. Only value-aware admission keeps all of them in both. Throughput is the same in
          every configuration.
        </p>
      </Prose>

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
        <InlineCode>LPUSH</InlineCode> + <InlineCode>BRPOP</InlineCode>{" "}+ an ack. Normalised
        per completed job, Redis&rsquo;s ~161k commands/sec is on the order of 50k jobs/sec.
        Putting 81.9k tasks/s next to 161k LPUSH/s directly would flatter Redis by roughly
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
