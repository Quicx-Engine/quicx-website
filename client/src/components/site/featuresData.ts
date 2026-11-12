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
      "quicx status shows pages, block sizes, workers and tasks, read from the daemon on its own socket while tasks keep running.",
    description:
      "quicx status reads the daemon over a separate Unix socket and prints the pages in use, the block sizes holding them, worker states, queue depth and task counts. Producers and workers use the TCP port, so the two never share a connection.",
    bullets: [
      "Pages in use out of the budget, live",
      "Every block size that holds pages: live blocks, capacity, page count",
      "Worker pool state: idle, busy, total",
      "Tasks submitted, completed, failed, in flight",
    ],
    footnotes: [
      {
        title: "Its own socket",
        body: "The CLI talks to the daemon over a Unix socket, apart from the port that carries tasks.",
      },
      {
        title: "Human-readable output",
        body: "Plain aligned text in the terminal. It exits non-zero when the daemon is unreachable, so it is safe to script.",
      },
      {
        title: "Built into the binary",
        body: "The status view is part of the quicx binary. There is nothing else to deploy.",
      },
    ],
  },
  {
    id: "configurability",
    title: "Memory that follows the traffic.",
    modalTitle: "One budget. The allocator does the rest.",
    shortSummary:
      "Set a memory budget and nothing else. apool hands 16 KiB pages to whatever sizes arrive, so the same 8 MiB holds 46,593 tasks of 100 B instead of 655.",
    description:
      "Quicx 2.0 is built on apool, an adaptive page allocator inside one fixed budget. You declare the budget in quicx.conf, or keep the 8 MiB default; pages go to the block sizes your traffic actually sends and come back when they empty. Every allocator feature has its own switch and a measured default.",
    bullets: [
      "Fixed pool_size cap, mapped once and never exceeded",
      "Pages move between sizes as the traffic changes, so there are no size classes to tune",
      "Switches for reserve, hardening, purge and fullest-first",
      "O(1) allocation and free, with no GC and no block headers",
    ],
    footnotes: [
      {
        title: "Follows the traffic",
        body: "100 B, then 900 B, then 40 B tasks on one daemon: each size gets nearly the whole budget in turn.",
      },
      {
        title: "Strict on purpose",
        body: "An unknown key or a bad value stops the daemon with the file and line instead of falling back to a default.",
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
    modalTitle: "One binary and one memory budget",
    shortSummary:
      "A single binary of about 36 KB on Linux that never goes past the memory budget you set and gives back what a burst used. Measured: 1,056 KB idle, 2,080 KB after a full burst drains.",
    description:
      "Quicx ships as a single stripped binary of about 36 KB on Linux, with no runtime dependencies and nothing else to install. You set a pool_size and the allocator holds the daemon to it. Memory a burst touched goes back to the OS once the queue drains.",
    bullets: [
      "About 36 KB on Linux, ~3,200 lines of C, no runtime dependencies",
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
        title: "Measured on two systems",
        body: "Physical memory sampled idle, full and drained, on macOS and Linux. The Benchmarks page has the runs.",
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
      "81,900 tasks/sec end to end on one thread, 49 µs median from submit to done. Measured with C clients on an Apple M4 Pro and a 2011 Linux PC; bench/run.sh repeats it.",
    description:
      "One Quicx task is a full lifecycle. The producer submits, the daemon acks and dispatches, the worker parses the payload and reports done, and the producer is notified. That is five protocol messages, and every figure below times the whole round trip.",
    bullets: [
      "81,900 tasks/sec end to end, single thread, 0 errors",
      "49 µs p50 · 64 µs p90 · 98 µs p99 · 143 µs p99.9",
      "Open loop at 40k/s offered, stalls charged in full",
      "Same speed as 1.0.4: the new allocator costs nanoseconds",
    ],
    footnotes: [
      {
        title: "Timed to done, not to the ack",
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
    title: "QXP, its own binary protocol.",
    modalTitle: "A binary wire, designed for the hot path",
    shortSummary:
      "Quicx speaks QXP, the Quicx Protocol: a 6-byte header and the payload, read straight into the memory of the task it belongs to.",
    description:
      "QXP, the Quicx Protocol, is a fixed-layout binary wire format designed for Quicx. A 6-byte header holds the version (1B), type (1B) and length (4B). The payload of up to 1,024 bytes lands in the one allocator block holding its task. Producers, the daemon and workers all speak it directly.",
    bullets: [
      "6-byte header: version (1B), type (1B), length (4B)",
      "Variable-length payload, read straight into the task's block",
      "Thirteen message types cover the whole protocol",
      "The first byte of every frame is the protocol version",
    ],
    footnotes: [
      {
        title: "No extra copy",
        body: "The payload is read from the socket straight into the task's block.",
      },
      {
        title: "Small on purpose",
        body: "Thirteen message types, all documented on one docs page.",
      },
      {
        title: "Versioned",
        body: "Every frame carries a version byte, and the daemon rejects versions it does not know.",
      },
    ],
  },
  {
    id: "setup",
    title: "Queueing in five minutes.",
    modalTitle: "From zero to a submitted task in five minutes",
    shortSummary:
      "Install the binary, add the Java client (quicx-client) and submit your first task, on Linux or macOS.",
    description:
      "Setup is a one-line install, a working default quicx.conf and a Java client on Maven Central. Getting to a first submitted task takes about five minutes.",
    bullets: [
      "One-line installer, no build toolchain required",
      "Start from the reference quicx.conf in the docs",
      "Java client (quicx-client) is Maven/Gradle-ready",
      "Submit your first task in under five minutes",
    ],
    footnotes: [
      {
        title: "One-line install",
        body: "curl | sh, or download the prebuilt binary yourself.",
      },
      {
        title: "Java client",
        body: "The Java client is on Maven Central as dev.quicx:quicx-client.",
      },
      {
        title: "Sensible defaults",
        body: "The default config works. Change only what you need later.",
      },
    ],
  },
];
