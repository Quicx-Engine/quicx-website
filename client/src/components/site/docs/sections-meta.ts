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
    lede: "Quicx ships as a single static binary. One curl command detects your OS and architecture, downloads the matching release from GitHub, and drops the daemon into your PATH.",
    updated: "2026-11-04",
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
    updated: "2026-11-09",
    toc: [],
  },
  "configuration": {
    num: "§ 01.03",
    kicker: "Getting Started",
    title: "Configuration",
    lede: "One optional quicx.conf: the port, the memory budget and a switch for every allocator feature. Every key has a measured default, and a typo stops the daemon with the file and line instead of falling back silently.",
    description: "Configure Quicx with one optional quicx.conf: port, memory budget and a switch for every apool feature. Strict validation, measured defaults.",
    updated: "2026-11-09",
    toc: [
      { id: "server-block", label: "[server]" },
      { id: "memory-block", label: "[memory]" },
      { id: "allocator-block", label: "[allocator]" },
      { id: "upgrading", label: "Upgrading from 1.x" },
    ],
  },
  "architecture": {
    num: "§ 02.01",
    kicker: "Core Concepts",
    title: "Architecture",
    lede: "One daemon, three role-based endpoints, one allocator. Every moving piece is visible in a single diagram — and intentionally, no piece is optional.",
    updated: "2026-11-09",
    toc: [{ id: "single-daemon-design", label: "Why a single daemon?" }],
  },
  "allocator": {
    num: "§ 02.02",
    kicker: "Core Concepts",
    title: "apool v2 Allocator",
    lede: "apool v2 hands 16 KiB pages to the block sizes that are actually arriving and takes them back when they empty. The same 8 MiB that held 655 tasks of 100 B under the old fixed split now holds 46,593, and gives its memory back to the OS after a burst.",
    description: "apool v2, Quicx's adaptive allocator: pages go to the sizes that arrive. 46,593 tasks of 100 B in 8 MiB instead of 655, memory returned after bursts.",
    updated: "2026-11-09",
    toc: [
      { id: "allocator-architecture", label: "Architecture" },
      { id: "allocator-features", label: "Ideas from the literature" },
      { id: "allocator-benchmarks", label: "Benchmarks" },
      { id: "allocator-tuning", label: "Settings" },
    ],
  },
  "binary-protocol": {
    num: "§ 02.03",
    kicker: "Core Concepts",
    title: "Binary Protocol",
    lede: "Every frame on the wire is a 6-byte header followed by a variable-length payload. No framing ambiguity, no partial reads, no text encoding — parsing is a couple of pointer reads.",
    description: "Every Quicx frame is a 6-byte header plus a variable-length payload. No framing ambiguity, no partial reads, no text encoding — just pointer reads.",
    updated: "2026-11-09",
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
    lede: "81,900 tasks/sec end to end at 49 µs median, and 46,593 tasks of 100 B in 8 MiB where 1.0.4 held 655. Measured on an Apple M4 Pro and a 2011 Intel i3 on Linux with the same scripts; anything not measured here is labelled with its provenance.",
    description: "Quicx 2.0 benchmarks on macOS and Linux: 81,900 tasks/sec at 49 µs median, 71× the capacity of 1.0.4 in 8 MiB, memory returned after bursts.",
    updated: "2026-11-09",
    toc: [
      { id: "reference-run", label: "Reference run" },
      { id: "bench-throughput", label: "Throughput" },
      { id: "bench-latency", label: "Latency" },
      { id: "bench-machines", label: "Two machines" },
      { id: "bench-capacity", label: "Capacity" },
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
    updated: "2026-11-09",
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
    updated: "2026-11-09",
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
    lede: "Quicx follows semver. A breaking change to the wire protocol, the config file or the memory model bumps the major version; new message types are additive and bump minor. Patch releases are build-or-docs-only.",
    updated: "2026-11-09",
    toc: [],
  },
};

export const sectionSlugs = Object.keys(sectionMeta);
