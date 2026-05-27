export type FeatureTint = {
  glow: string;
  radial: string;
  accent: string;
};

export type Feature = {
  id: string;
  title: string;
  modalTitle: string;
  shortSummary: string;
  description: string;
  bullets: string[];
  tint: FeatureTint;
  footnotes: { title: string; body: string }[];
};

const orangeTint: FeatureTint = {
  glow: "from-quicx-orange/25 via-quicx-orange/5 to-transparent",
  radial: "rgba(255,87,0,0.18)",
  accent: "#FF7A33",
};
const violetTint: FeatureTint = {
  glow: "from-[#a78bfa]/25 via-[#a78bfa]/5 to-transparent",
  radial: "rgba(167,139,250,0.18)",
  accent: "#a78bfa",
};
const tealTint: FeatureTint = {
  glow: "from-[#5eead4]/25 via-[#5eead4]/5 to-transparent",
  radial: "rgba(94,234,212,0.18)",
  accent: "#5eead4",
};
const amberTint: FeatureTint = {
  glow: "from-[#fbbf24]/25 via-[#fbbf24]/5 to-transparent",
  radial: "rgba(251,191,36,0.18)",
  accent: "#fbbf24",
};
const blueTint: FeatureTint = {
  glow: "from-[#60a5fa]/25 via-[#60a5fa]/5 to-transparent",
  radial: "rgba(96,165,250,0.18)",
  accent: "#60a5fa",
};
const roseTint: FeatureTint = {
  glow: "from-[#f472b6]/25 via-[#f472b6]/5 to-transparent",
  radial: "rgba(244,114,182,0.18)",
  accent: "#f472b6",
};

export const features: Feature[] = [
  {
    id: "observability",
    title: "Observe the engine in real time",
    modalTitle: "Observe the engine in real time",
    shortSummary:
      "A first-class CLI gives you a deterministic view of every moving part — without touching runtime performance.",
    description:
      "The quicx CLI gives you a complete, deterministic view of the engine: PMAD slabs, worker states, queue depth, and task counts — read straight from the daemon over a side-channel that never competes with the hot path.",
    bullets: [
      "Per-size-class PMAD usage in real time",
      "Worker pool state — idle, busy, total",
      "Tasks submitted, completed, failed",
      "Live pool_size utilization, versus your configured ceiling",
    ],
    tint: orangeTint,
    footnotes: [
      {
        title: "Zero-overhead introspection",
        body: "Monitoring runs out-of-band. It never blocks or slows down task processing.",
      },
      {
        title: "Human-readable output",
        body: "Clean text formatting — no log parsers, no JSON, no dashboards required.",
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
    modalTitle: "Configure memory exactly the way you want it",
    shortSummary:
      "Declare a pool size and a size-class mix. PMAD lays out memory exactly as you asked — no guesswork, no fragmentation.",
    description:
      "Quicx is built on PMAD, a custom deterministic slab allocator. You declare your memory ceiling and your size-class distribution in a single .conf file; PMAD carves up the pool at startup and hands out slots in O(1), every time.",
    bullets: [
      "Fixed pool_size cap, enforced from process start",
      "Tunable size classes (e.g. 32B, 64B, 128B, 256B, 512B, 1024B)",
      "Size-class percentages tuned to your payload shape",
      "O(1) allocation and free — no GC, no fragmentation",
    ],
    tint: violetTint,
    footnotes: [
      {
        title: "Deterministic layout",
        body: "Memory is carved up exactly as configured — same layout every time you boot.",
      },
      {
        title: "No fragmentation",
        body: "Known payload shapes map to the right size class; no wasted bytes.",
      },
      {
        title: "Tunable per workload",
        body: "Different configs for different services, all in a single .conf file.",
      },
    ],
  },
  {
    id: "lightweight",
    title: "63 KB. Bounded memory.",
    modalTitle: "One binary. One memory budget. No surprises.",
    shortSummary:
      "A single ~63 KB static binary that never drifts past the memory budget you set. Drop it next to your backend — bounded by design.",
    description:
      "Quicx ships as a single ~63 KB static binary. There's no runtime, no JVM, no scheduler to tune. You set a pool_size and that is the memory ceiling — enforced by PMAD, not by hope.",
    bullets: [
      "Single static binary, no runtime dependencies",
      "Hard memory ceiling, enforced by the allocator",
      "Instant boot — no warmup, no profile-guided jitter",
      "Safe to co-locate on the same VM as your backend",
    ],
    tint: tealTint,
    footnotes: [
      {
        title: "No runtime dependencies",
        body: "Just a binary. No interpreter, no VM, no package manager.",
      },
      {
        title: "Bounded at all times",
        body: "Configured ceiling, enforced by the allocator — never swell.",
      },
      {
        title: "Co-locate safely",
        body: "Runs happily on the same VM as your backend without stealing memory.",
      },
    ],
  },
  {
    id: "performance",
    title: "0.181 ms. 21,000 tasks/s.",
    modalTitle: "Throughput without tail latency",
    shortSummary:
      "0.181 ms average latency, 21,000 tasks per second, sustained on a single node. No GC pauses, no allocator jitter.",
    description:
      "Deterministic memory layout means deterministic performance. The same task walks the same code path every time. No GC pauses, no arena resizes — just predictable hundreds-of-microseconds latency.",
    bullets: [
      "0.181 ms average end-to-end latency",
      "21,000 tasks per second, sustained",
      "No GC pauses or allocator jitter",
      "Predictable p99 under load",
    ],
    tint: amberTint,
    footnotes: [
      {
        title: "Deterministic hot path",
        body: "Same allocation path every time. No branching for slow cases.",
      },
      {
        title: "Sustained, not peak",
        body: "Throughput holds steady — no warmup cliffs, no degradation curve.",
      },
      {
        title: "Written close to the metal",
        body: "Pure native code. No runtime overhead between your task and the CPU.",
      },
    ],
  },
  {
    id: "protocol",
    title: "Tight binary protocol.",
    modalTitle: "A binary wire, designed for the hot path",
    shortSummary:
      "Quicx speaks its own compact binary protocol — opcodes, lengths, and payloads moving at line rate. No JSON, no bloat.",
    description:
      "The Quicx protocol is a fixed-layout binary wire format: a 6-byte header — version (1B), type (1B), length (4B) — followed by a payload sized exactly to the PMAD slot that holds it. Producers, daemon, and workers all speak it directly.",
    bullets: [
      "6-byte header: version (1B), type (1B), length (4B)",
      "Variable-length payload, sized to the PMAD slot",
      "Twelve opcodes cover the entire protocol surface",
      "Versioned from byte 0, forward-compatible by design",
    ],
    tint: blueTint,
    footnotes: [
      {
        title: "Zero-copy wire",
        body: "Frames are consumed directly from the network buffer.",
      },
      {
        title: "Minimal opcode surface",
        body: "Five opcodes — no JSON layer, no accidental polymorphism.",
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
      "Generate a sensible default quicx.conf with quicx init",
      "Java client (quicx-client) is Maven/Gradle-ready",
      "Submit your first task in under five minutes",
    ],
    tint: roseTint,
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
