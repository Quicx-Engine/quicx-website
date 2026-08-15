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
  allocator: "Default 8 MB PMAD pool",
  transport: "Loopback TCP, no network hop",
  load: "8 worker processes, 8 producer connections, C clients",
} as const;

export const HEADLINE = {
  throughput: "74,300",
  throughputUnit: "tasks/sec",
  throughputNote: "end to end, single thread",
  latency: "51 µs",
  latencyNote: "p50 submit → done",
  memoryDelta: "0 KB",
  memoryNote: "growth over 443,912 tasks",
  binary: "54 KB",
  binaryNote: "no runtime dependencies",
} as const;

/** Open loop, 40,000 tasks/sec offered. Latency is submit → done. */
export const LATENCY_PERCENTILES = [
  { label: "p50", value: "51 µs", us: 51 },
  { label: "p90", value: "67 µs", us: 67 },
  { label: "p99", value: "111 µs", us: 111 },
  { label: "p99.9", value: "174 µs", us: 174 },
] as const;

/** Same open-loop harness, three offered rates. p50 is flat across all three. */
export const LATENCY_BY_LOAD = [
  { offered: "10k/s", p50: "52 µs", p99: "116 µs", p999: "157 µs", p50us: 52 },
  { offered: "20k/s", p50: "52 µs", p99: "99 µs", p999: "163 µs", p50us: 52 },
  { offered: "40k/s", p50: "51 µs", p99: "111 µs", p999: "174 µs", p50us: 51 },
] as const;

export const THROUGHPUT_RUN = {
  tasks: "443,912",
  window: "Closed loop, 8 connections × 32 in flight, 8 workers",
  errors: "0 errors, 0 dropped connections",
  spread: "Repeat runs land between 74k and 75k.",
} as const;

export const MEMORY_RUN = {
  idleRss: "9,584 KB",
  finalRss: "9,584 KB",
  delta: "0 KB",
  poolPeakPct: 10.7,
  poolSize: "8 MB",
} as const;

export const FOOTPRINT = [
  { label: "binary", value: "54.4 KB", note: "-O2, stripped of nothing" },
  { label: "runtime dependencies", value: "none", note: "" },
  { label: "source", value: "~2,480 lines", note: "of C" },
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
    title: "One machine, loopback TCP",
    body: "No network hop. Real deployments will be slower.",
  },
  {
    title: "The harness checks itself",
    body: "256 outstanding requests ÷ 74.3k/s = 3.4 ms, and measured closed-loop p50 was 3.6 ms. Little's Law agrees, so the instrument is measuring queueing and not itself.",
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
    body: "PROTOCOL_MAX_PAYLOAD is 1024 bytes, matching the largest PMAD size class. Oversized frames get a clean MSG_ERROR.",
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
    throughput: "74.3k tasks/s (1 thread)",
    latency: "51 µs p50 end-to-end",
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
    { label: "binary size", values: ["54 KB", "~", "~1 MB+", "large"] },
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
