import type { TocEntry } from "@/components/site/docs/DocsSidebar";

export type SectionMeta = {
  num: string;
  kicker: string;
  title: string;
  lede: string;
  /** Meta description override, for ledes too long for a search snippet (~160 chars). */
  description?: string;
  /** Date of the last meaningful content change (YYYY-MM-DD) — feeds sitemap lastmod and TechArticle dateModified. */
  updated: string;
  toc: TocEntry[];
};

export const sectionMeta: Record<string, SectionMeta> = {
  "installation": {
    num: "§ 01.01",
    kicker: "Getting Started",
    title: "Installation",
    lede: "Quicx ships as a single static binary. One curl command detects your OS and architecture, verifies the checksum, and drops the daemon into your PATH.",
    updated: "2026-08-02",
    toc: [
      { id: "what-installer-does", label: "What the installer does" },
      { id: "verify-installation", label: "Verify it worked" },
    ],
  },
  "quick-start": {
    num: "§ 01.02",
    kicker: "Getting Started",
    title: "Quick Start",
    lede: "Start the daemon with quicx start, pull the Java client from Maven Central, and submit your first task. End-to-end in under a minute.",
    updated: "2026-08-02",
    toc: [],
  },
  "configuration": {
    num: "§ 01.03",
    kicker: "Getting Started",
    title: "Configuration",
    lede: "A Quicx daemon reads its entire runtime shape from a single quicx.conf file. Every number is exact — block counts, pool share, port — and is resolved before a byte of task traffic moves.",
    description: "Quicx reads its entire runtime shape from one quicx.conf file — block counts, pool share, port — all exact and resolved before any task traffic moves.",
    updated: "2026-08-02",
    toc: [
      { id: "server-block", label: "[server]" },
      { id: "allocator-block", label: "[allocator]" },
      { id: "tuning-rules", label: "Tuning rules of thumb" },
    ],
  },
  "architecture": {
    num: "§ 02.01",
    kicker: "Core Concepts",
    title: "Architecture",
    lede: "One daemon, three role-based endpoints, one allocator. Every moving piece is visible in a single diagram — and intentionally, no piece is optional.",
    updated: "2026-08-15",
    toc: [{ id: "single-daemon-design", label: "Why a single daemon?" }],
  },
  "pmad-allocator": {
    num: "§ 02.02",
    kicker: "Core Concepts",
    title: "PMAD — Pool-based Memory Allocator",
    lede: "A slab allocator written in C that delivers O(1) allocation and deallocation with zero fragmentation and zero system calls at runtime. Every allocation the daemon makes — task envelopes, wire buffers, worker registration slots — comes out of PMAD. Fragmentation is 0 % by design: every block is pre-sized to a declared class, so there is no splitting, no coalescing, and no wasted space.",
    description: "PMAD is a slab allocator in C with O(1) allocation and free, zero fragmentation and zero runtime system calls. Every Quicx allocation comes out of it.",
    updated: "2026-08-15",
    toc: [
      { id: "pmad-architecture", label: "Architecture" },
      { id: "pmad-benchmarks", label: "Benchmarks" },
      { id: "pmad-configurations", label: "Reference configurations" },
      { id: "pmad-teardown", label: "Tear-down" },
    ],
  },
  "binary-protocol": {
    num: "§ 02.03",
    kicker: "Core Concepts",
    title: "Binary Protocol",
    lede: "Every frame on the wire is a 6-byte header followed by a variable-length payload. No framing ambiguity, no partial reads, no text encoding — parsing is a couple of pointer reads.",
    description: "Every Quicx frame is a 6-byte header plus a variable-length payload. No framing ambiguity, no partial reads, no text encoding — just pointer reads.",
    updated: "2026-08-02",
    toc: [
      { id: "protocol-participants", label: "Participants & transport" },
      { id: "protocol-frame-header", label: "Frame header" },
      { id: "protocol-message-types", label: "Message types" },
      { id: "payload-formats", label: "Payload formats" },
      { id: "protocol-flow", label: "End-to-end flow" },
    ],
  },
  "benchmarks": {
    num: "§ 02.04",
    kicker: "Core Concepts",
    title: "Benchmarks",
    lede: "74,300 tasks/sec end to end at 51 µs median, with zero memory growth over 443,912 tasks. Every figure here was measured on one machine with the harness in bench/, and anything that was not measured is labelled with its provenance.",
    description: "Quicx benchmarks: 74,300 tasks/sec end to end at 51 µs median, zero memory growth over 443,912 tasks. Measured with bench/run.sh, methodology included.",
    updated: "2026-08-15",
    toc: [
      { id: "reference-run", label: "Reference run" },
      { id: "bench-throughput", label: "Throughput" },
      { id: "bench-latency", label: "Latency" },
      { id: "bench-memory", label: "Memory" },
      { id: "bench-footprint", label: "Footprint" },
      { id: "bench-methodology", label: "Methodology" },
      { id: "bench-comparison", label: "Comparison" },
    ],
  },
  "limitations": {
    num: "§ 02.05",
    kicker: "Core Concepts",
    title: "Limitations",
    lede: "Quicx is a fast in-memory broker, not a durable one. No persistence, no redelivery, no retries, one global FIFO, one core. Part of the latency advantage is work Quicx is not doing — here is exactly which work.",
    description: "Quicx is a fast in-memory broker, not a durable one: no persistence, no redelivery, no retries, one global FIFO, one core. Exactly what it does not do.",
    updated: "2026-08-15",
    toc: [
      { id: "not-implemented", label: "What Quicx does not do" },
      { id: "feature-matrix", label: "Feature for feature" },
      { id: "when-to-use", label: "When Quicx is the right call" },
    ],
  },
  "cli-reference": {
    num: "§ 03.01",
    kicker: "Reference",
    title: "CLI Reference",
    lede: "quicx is the single binary that ships with the release. It is self-documenting — running it with no arguments prints the same usage you see below.",
    updated: "2026-08-02",
    toc: [],
  },
  "java-client": {
    num: "§ 03.02",
    kicker: "Reference",
    title: "Java Client",
    lede: "dev.quicx:quicx-client is a small, dependency-free Java 11+ library. Two classes carry the whole surface area: QuicxClient for producers, QuicxWorker for consumers.",
    description: "dev.quicx:quicx-client is a small, dependency-free Java 11+ library. QuicxClient submits tasks, QuicxWorker consumes them — that is the whole API.",
    updated: "2026-05-28",
    toc: [
      { id: "java-build-setup", label: "Add it to your build" },
      { id: "QuicxClient", label: "QuicxClient — producers" },
      { id: "QuicxWorker", label: "QuicxWorker — consumers" },
      { id: "QuicxException", label: "QuicxException" },
    ],
  },
  "changelog": {
    num: "§ 03.03",
    kicker: "Reference",
    title: "Changelog",
    lede: "Quicx follows semver. Breaking protocol changes bump the major version; new message types are additive and bump minor. Patch releases are build-or-docs-only.",
    updated: "2026-08-02",
    toc: [],
  },
};

export const sectionSlugs = Object.keys(sectionMeta);
