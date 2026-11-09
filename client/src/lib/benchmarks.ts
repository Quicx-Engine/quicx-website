/**
 * Every figure in this file comes from one measured run of `bench/run.sh` on a
 * single machine. Nothing here is estimated, extrapolated, or copied out of
 * documentation — anything that was not measured lives in COMPARISON below and
 * is labelled with its provenance.
 *
 * Rule for this file: if you cannot point at a run that produced the number,
 * it does not belong here.
 */

export const REFERENCE_RUN = {
  machine: "Apple M4 Pro (12 cores), 24 GB",
  os: "macOS 26.5.1, arm64",
  build: "Apple clang 17, quicxd built -O2",
  allocator: "Default 8 MiB budget, apool v2",
  transport: "Loopback TCP, no network hop",
  load: "8 worker processes, 8 producer connections, C clients",
} as const;

/** The second machine: same scripts, same build flags, its own compiler. */
export const SECOND_RUN = {
  machine: "Intel Core i3-2100 (2011), 2 cores / 4 threads, 8 GB",
  os: "Ubuntu 24.04, Linux 6.8, x86-64",
  build: "gcc 13.3, quicxd built -O2",
} as const;

export const HEADLINE = {
  throughput: "81,900",
  throughputUnit: "tasks/sec",
  throughputNote: "end to end, single thread",
  latency: "49 µs",
  latencyUs: "49",
  latencyNote: "p50 submit → done",
  capacity: "46,593",
  capacityNote: "tasks of 100 B in 8 MiB",
  capacityBefore: "655",
  memoryAfterBurst: "2,080 KB",
  memoryNote: "held after a burst drains",
  binary: "55 KB",
  binaryNote: "no runtime dependencies",
} as const;

/** Open loop, 40,000 tasks/sec offered on the Mac. Latency is submit → done. Median of 5 runs. */
export const LATENCY_PERCENTILES = [
  { label: "p50", value: "49 µs", us: 49 },
  { label: "p90", value: "64 µs", us: 64 },
  { label: "p99", value: "98 µs", us: 98 },
  { label: "p99.9", value: "143 µs", us: 143 },
] as const;

/**
 * Both machines, median of 5 interleaved runs per version. Each machine is
 * offered a fixed rate it handles comfortably: 40k/s on the Mac, 9k/s on the
 * i3, whose closed-loop ceiling is 19k/s.
 */
export const LATENCY_BY_MACHINE = [
  { machine: "Apple M4 Pro", short: "M4 Pro", offered: "40k/s", p50us: 49, p50: "49 µs", p99: "98 µs", p999: "143 µs", throughput: "81.9k/s" },
  { machine: "Intel i3-2100", short: "i3-2100", offered: "9k/s", p50us: 123, p50: "123 µs", p99: "198 µs", p999: "208 µs", throughput: "19.0k/s" },
] as const;

export const THROUGHPUT_RUN = {
  window: "Closed loop, 8 connections × 32 in flight, 8 workers, 10 s",
  errors: "0 errors, 0 dropped connections",
  spread: "Five runs landed between 77.8k and 85.4k; v1.0.4 measured 82.4k the same way.",
} as const;

/** Physical memory of the daemon, KB (macOS phys_footprint), median of 3 runs. */
export const MEMORY_RUN = {
  idle: "1,056 KB",
  full: "9,088 KB",
  afterBurst: "2,080 KB",
  v104: "9,200 KB",
  poolPeakPct: 2.8,
  poolSize: "8 MiB",
} as const;

/** Tasks the daemon accepts before it answers ERROR 0x01, the same on both machines. */
export const CAPACITY = [
  { payload: "100 B", v104: "655", v2: "46,593" },
  { payload: "900 B", v104: "180", v2: "8,016" },
  { payload: "40 B", v104: "1,310", v2: "73,146" },
  { payload: "300 B", v104: "262", v2: "22,044" },
  { payload: "nginx lines, avg 188 B", v104: "1,433", v2: "30,947" },
] as const;

/** Physical memory in KB: macOS phys_footprint, Linux resident set size. Median of 3 runs. */
export const MEMORY_BY_MACHINE = [
  { stage: "idle, just started", macV104: "9,200", macV2: "1,056", linuxV104: "9,928", linuxV2: "1,796" },
  { stage: "queue full", macV104: "9,200", macV2: "9,088", linuxV104: "9,928", linuxV2: "9,816" },
  { stage: "after the burst drains", macV104: "9,200", macV2: "2,080", linuxV104: "9,928", linuxV2: "2,736" },
] as const;

export const FOOTPRINT = [
  { label: "binary", value: "54.9 KB", note: "-O2, stripped of nothing" },
  { label: "runtime dependencies", value: "none", note: "" },
  { label: "source", value: "~2,800 lines", note: "of C" },
  { label: "threads", value: "1", note: "" },
] as const;

export const METHODOLOGY = [
  {
    title: "C clients, not Python",
    body: "A Python client tops out around 50–100k socket ops/sec and contends on the GIL across threads, so it saturates before the daemon does and ends up measuring itself.",
  },
  {
    title: "Latency is submit → done",
    body: "Not submit → ack. An ack only means the daemon received the frame; it never touches a worker. For a task queue, the number that matters is when the work is finished.",
  },
  {
    title: "Open loop for latency, closed loop for throughput",
    body: "Latency runs put tasks on a fixed schedule and charge stalls against the scheduled send time — the standard correction for coordinated omission. Closed-loop latency is not quoted, because a client that backs off when the server slows cannot measure the server slowing.",
  },
  {
    title: "Real payloads, really parsed",
    body: "nginx combined-format access-log lines, 120–260 bytes. Workers parse them — IP, method, path hash, status, bytes — and report per-status totals, so a run can be verified rather than trusted.",
  },
  {
    title: "Two machines, loopback TCP",
    body: "An Apple M4 Pro on macOS and a 2011 Intel Core i3 on Linux, same scripts, same -O2 build. Clients and daemon share each machine over loopback, so there is no network hop. Real deployments will be slower.",
  },
  {
    title: "The harness checks itself",
    body: "256 outstanding requests ÷ 81.9k/s = 3.1 ms, and the measured closed-loop p50 was 3.3 ms (median of 5 runs). Little's Law agrees, so the instrument is measuring queueing and not itself.",
  },
] as const;

export const LIMITATIONS = [
  {
    title: "Persistence",
    body: "A restart loses everything queued.",
  },
  {
    title: "Redelivery",
    body: "If a worker dies mid-task, the task is lost and the producer is not notified.",
    status: "In progress",
  },
  {
    title: "Retries",
    body: "No automatic retry, no dead-lettering.",
  },
  {
    title: "Priorities, delays, named queues",
    body: "One global FIFO.",
  },
  {
    title: "Client libraries beyond Java",
    body: "dev.quicx:quicx-client is the only one. Every other language talks the wire protocol directly — it is documented and small.",
  },
  {
    title: "Payloads above 1 KB",
    body: "PROTOCOL_MAX_PAYLOAD is 1,024 bytes: a task is one block of a 64 B record plus its payload, at most 1,088 B. Oversized frames get a clean MSG_ERROR.",
  },
  {
    title: "Multiple cores",
    body: "Single-threaded today. Scale out by running several daemons behind a TCP load balancer.",
    status: "In progress",
  },
] as const;

/** Only the Quicx row was measured here. Everything else is reported elsewhere. */
export const COMPARISON = [
  {
    system: "Quicx",
    throughput: "81.9k tasks/s (1 thread)",
    latency: "49 µs p50 end-to-end",
    provenance: "measured here",
    measured: true,
  },
  {
    system: "Redis (LPUSH)",
    throughput: "~161k commands/s",
    latency: "0.30 ms p50, one command",
    provenance: "reported",
    measured: false,
  },
  {
    system: "RabbitMQ",
    throughput: "~40k msg/s",
    latency: "—",
    provenance: "reported",
    measured: false,
  },
  {
    system: "Kafka",
    throughput: ">1M msg/s, batched",
    latency: "~ms",
    provenance: "reported",
    measured: false,
  },
  {
    system: "beanstalkd",
    throughput: "—",
    latency: "—",
    provenance: "no comparable figure found",
    measured: false,
  },
] as const;

export const FEATURE_MATRIX = {
  columns: ["Quicx", "beanstalkd", "Redis Streams", "RabbitMQ"],
  rows: [
    { label: "memory bound", values: ["exact, configured", "none", "cap + eviction", "none"] },
    { label: "binary size", values: ["55 KB", "~", "~1 MB+", "large"] },
    { label: "dependencies", values: ["none", "libevent", "none", "Erlang/OTP"] },
    {
      label: "delivery",
      values: ["at-most-once", "at-least-once", "at-least-once", "at-least-once"],
    },
    { label: "survives worker crash", values: ["no", "yes (TTR)", "yes", "yes"] },
    { label: "persistence", values: ["no", "optional", "yes", "yes"] },
    { label: "multi-core", values: ["no", "no", "partial", "yes"] },
  ],
} as const;
