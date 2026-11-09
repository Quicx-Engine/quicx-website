export type Feature = {
  id: string;
  title: string;
  modalTitle: string;
  shortSummary: string;
  description: string;
  bullets: string[];
  footnotes: { title: string; body: string }[];
};

export const features: Feature[] = [
  {
    id: "observability",
    title: "Observe the engine in real time",
    modalTitle: "Observe the engine in real time",
    shortSummary:
      "A first-class CLI gives you a deterministic view of every moving part — without touching runtime performance.",
    description:
      "The quicx CLI gives you a complete, deterministic view of the engine: pages in use, the block sizes holding them, worker states, queue depth and task counts — read straight from the daemon over a side-channel that never competes with the hot path.",
    bullets: [
      "Pages in use out of the budget, live",
      "Every block size that holds pages: live blocks, capacity, page count",
      "Worker pool state — idle, busy, total",
      "Tasks submitted, completed, failed, in flight",
    ],
    footnotes: [
      {
        title: "Zero-overhead introspection",
        body: "Monitoring runs out-of-band. It never blocks or slows down task processing.",
      },
      {
        title: "Human-readable output",
        body: "Plain aligned text in the terminal. It exits non-zero when the daemon is unreachable, so it is safe to script.",
      },
      {
        title: "Built into the binary",
        body: "No sidecar, no agent, no separate monitoring stack to deploy.",
      },
    ],
  },
  {
    id: "configurability",
    title: "One .conf file. Zero guesswork.",
    modalTitle: "One budget. The allocator does the rest.",
    shortSummary:
      "Set a memory budget and nothing else. apool hands 16 KiB pages to whatever sizes arrive, so the same 8 MiB holds 46,593 tasks of 100 B instead of 655.",
    description:
      "Quicx 2.0 is built on apool, an adaptive page allocator inside one fixed budget. You declare the budget in quicx.conf, or keep the 8 MiB default; pages go to the block sizes your traffic actually sends and come back when they empty. Every allocator feature has its own switch and a measured default.",
    bullets: [
      "Fixed pool_size cap, mapped once and never exceeded",
      "Pages move between sizes as the traffic changes — no size classes to tune",
      "Switches for reserve, hardening, purge and fullest-first",
      "O(1) allocation and free — no GC, no block headers",
    ],
    footnotes: [
      {
        title: "Follows the traffic",
        body: "100 B, then 900 B, then 40 B tasks on one daemon: each size gets nearly the whole budget in turn.",
      },
      {
        title: "Strict on purpose",
        body: "An unknown key or a bad value stops the daemon with the file and line — never a silent default.",
      },
      {
        title: "Old files still load",
        body: "A 1.x quicx.conf starts as it is; its size-class lines are ignored with a note.",
      },
    ],
  },
  {
    id: "lightweight",
    title: "One binary, one memory budget.",
    modalTitle: "One binary. One memory budget. No surprises.",
    shortSummary:
      "A single 54.9 KB binary that never goes past the memory budget you set — and gives back what a burst used. Measured: 1,056 KB idle, 2,080 KB after a full burst drains.",
    description:
      "Quicx ships as a single 54.9 KB binary built at -O2, with nothing stripped and no runtime dependencies. There's no VM, no JVM, no scheduler to tune. You set a pool_size and that is the memory ceiling — enforced by the allocator, not by hope — and memory a burst touched goes back to the OS once the queue drains.",
    bullets: [
      "54.9 KB binary, ~2,800 lines of C, no runtime dependencies",
      "1,056 KB idle, 9,088 KB with the queue full, 2,080 KB after it drains",
      "v1.0.4 held 9,200 KB from the moment it started",
      "Peak use 2.8 % of the default 8 MiB budget under the throughput load",
    ],
    footnotes: [
      {
        title: "No runtime dependencies",
        body: "Just a binary. No interpreter, no VM, no package manager.",
      },
      {
        title: "Measured, not asserted",
        body: "Physical memory sampled idle, full and drained, on macOS and Linux — see the Benchmarks page.",
      },
      {
        title: "Co-locate safely",
        body: "A broker whose ceiling you declared can share a VM with your backend.",
      },
    ],
  },
  {
    id: "performance",
    title: "Timed end to end.",
    modalTitle: "Measured end to end, not at the enqueue",
    shortSummary:
      "81,900 tasks/sec end to end on one thread, 49 µs median from submit to done. Measured with C clients on an Apple M4 Pro and a 2011 Linux PC — reproducible with bench/run.sh.",
    description:
      "One Quicx task is a full lifecycle: producer submits → daemon acks → daemon dispatches → worker parses the payload → worker reports done → producer is notified. Five protocol messages. Every figure below times that whole round trip, not a single enqueue.",
    bullets: [
      "81,900 tasks/sec end to end, single thread, 0 errors",
      "49 µs p50 · 64 µs p90 · 98 µs p99 · 143 µs p99.9",
      "Open loop at 40k/s offered — stalls charged in full",
      "Same speed as 1.0.4: the new allocator costs nanoseconds",
    ],
    footnotes: [
      {
        title: "submit → done, not submit → ack",
        body: "An ack only means the daemon received the frame. These numbers wait for a worker to finish the work.",
      },
      {
        title: "C clients, not Python",
        body: "A Python client saturates before the daemon does and ends up measuring itself.",
      },
      {
        title: "Coordinated omission corrected",
        body: "Latency is timed from the scheduled send, so a stall cannot hide behind a client that slows down too.",
      },
    ],
  },
  {
    id: "protocol",
    title: "QXP, a tight binary protocol.",
    modalTitle: "A binary wire, designed for the hot path",
    shortSummary:
      "Quicx speaks QXP, the Quicx Protocol: its own compact binary protocol — opcodes, lengths, and payloads moving at line rate. No JSON, no bloat.",
    description:
      "QXP, the Quicx Protocol, is a fixed-layout binary wire format designed for Quicx: a 6-byte header — version (1B), type (1B), length (4B) — followed by a payload of up to 1,024 bytes that lands in the one allocator block holding its task. Producers, daemon, and workers all speak it directly.",
    bullets: [
      "6-byte header: version (1B), type (1B), length (4B)",
      "Variable-length payload, read straight into the task's block",
      "Twelve opcodes cover the entire protocol surface",
      "Versioned from byte 0, forward-compatible by design",
    ],
    footnotes: [
      {
        title: "Zero-copy wire",
        body: "Frames are consumed directly from the network buffer.",
      },
      {
        title: "Minimal opcode surface",
        body: "Twelve opcodes — no JSON layer, no accidental polymorphism.",
      },
      {
        title: "Versioned",
        body: "A version byte in every frame — forward-compatible from day one.",
      },
    ],
  },
  {
    id: "setup",
    title: "Queueing in five minutes.",
    modalTitle: "From zero to a submitted task in five minutes",
    shortSummary:
      "Install the binary, drop in the Java client (quicx-client), and submit your first task — on Linux, macOS, or wherever your backend runs.",
    description:
      "Quicx was designed to disappear. A one-line install, a default-good quicx.conf, a Maven-published Java client, and a tiny API surface. From nothing to a submitted task in about five minutes.",
    bullets: [
      "One-line installer — no build toolchain required",
      "Start from the reference quicx.conf in the docs",
      "Java client (quicx-client) is Maven/Gradle-ready",
      "Submit your first task in under five minutes",
    ],
    footnotes: [
      {
        title: "One-line install",
        body: "curl | sh, or grab the prebuilt static binary — your call.",
      },
      {
        title: "Batteries-included client",
        body: "The Java client is published to Maven Central — just add the dep.",
      },
      {
        title: "Sensible defaults",
        body: "Start with the default config and tune only what you need later.",
      },
    ],
  },
];
