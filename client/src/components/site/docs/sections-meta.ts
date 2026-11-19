import type { TocEntry } from "@/components/site/docs/DocsSidebar";

export type SectionMeta = {
  num: string;
  kicker: string;
  title: string;
  lede: string;
  /** Meta description override, for ledes too long for a search snippet (~160 chars). */
  description?: string;
  /** The whole <title>, for pages that target a search query of their own. Default: "<title> - Quicx Docs". */
  seoTitle?: string;
  /**
   * Date of the last meaningful change to the page (YYYY-MM-DD): its main content, its links or
   * its structured data. Feeds the sitemap lastmod, TechArticle dateModified and og:modified_time,
   * so bump it in the same commit as the change. Not the commit time: one copy-editing commit
   * touches every page without changing what any of them says.
   */
  updated: string;
  toc: TocEntry[];
};

export const sectionMeta: Record<string, SectionMeta> = {
  "installation": {
    num: "§ 01.01",
    kicker: "Getting Started",
    title: "Installation",
    lede: "Quicx ships as a single static binary. One curl command detects your OS and architecture, downloads the matching release from GitHub, and drops the daemon into your PATH.",
    updated: "2026-11-20",
    toc: [
      { id: "what-installer-does", label: "What the installer does" },
      { id: "verify-installation", label: "Verify it worked" },
    ],
  },
  "quick-start": {
    num: "§ 01.02",
    kicker: "Getting Started",
    title: "Quick Start in Java",
    lede: "Start the daemon with a 256 KiB memory budget, run a Java worker and a producer that gives its tasks value levels, then fill the budget and watch Quicx keep the valuable task. About a minute, with no build tool: Java 11 runs each file straight from source.",
    description: "Run Quicx in a minute: start the daemon with a memory budget, submit Java tasks with value levels, run a worker, then watch a full budget evict.",
    seoTitle: "Quicx Quick Start: First Task Queue in Java in 60 Seconds",
    updated: "2026-11-20",
    toc: [
      { id: "qs-daemon", label: "Start the daemon" },
      { id: "qs-client", label: "Get the Java client" },
      { id: "qs-worker", label: "Run a worker" },
      { id: "qs-producer", label: "Submit tasks with levels" },
      { id: "qs-budget-full", label: "When the budget is full" },
      { id: "qs-errors", label: "Common errors" },
      { id: "qs-next", label: "Next steps" },
    ],
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
      { id: "capacity", label: "How many tasks fit" },
      { id: "allocator-block", label: "[allocator]" },
      { id: "upgrading", label: "Upgrading from 1.x" },
    ],
  },
  "architecture": {
    num: "§ 02.01",
    kicker: "Core Concepts",
    title: "Architecture",
    lede: "One daemon, three role-based endpoints, one allocator. Every piece is in one diagram, and none of them is optional.",
    updated: "2026-11-20",
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
    title: "QXP Protocol",
    lede: "QXP, the Quicx Protocol, is the wire format designed for Quicx. Every frame is a 6-byte header followed by a variable-length payload. The daemon reads the length first, so parsing a frame is a couple of pointer reads.",
    description: "QXP, the Quicx Protocol: every frame is a 6-byte header plus a variable-length payload. No framing ambiguity, no text encoding, just pointer reads.",
    updated: "2026-11-20",
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
    updated: "2026-11-20",
    toc: [
      { id: "reference-run", label: "Reference run" },
      { id: "bench-throughput", label: "Throughput" },
      { id: "bench-latency", label: "Latency" },
      { id: "bench-machines", label: "Two machines" },
      { id: "bench-capacity", label: "Capacity" },
      { id: "bench-memory", label: "Memory" },
      { id: "bench-footprint", label: "Footprint" },
      { id: "next-to-redis", label: "Next to Redis" },
      { id: "when-full", label: "When the budget is full" },
      { id: "bench-methodology", label: "Methodology" },
      { id: "bench-comparison", label: "Comparison" },
    ],
  },
  "limitations": {
    num: "§ 02.05",
    kicker: "Core Concepts",
    title: "Limitations",
    lede: "Quicx is a fast in-memory broker, not a durable one. No persistence, no redelivery, no retries, no delays, one core per daemon. Part of the latency advantage is work Quicx is not doing, and this page lists it.",
    description: "Quicx is a fast in-memory broker, not a durable one: no persistence, no redelivery, no retries, no delays, one core per daemon. Exactly what it does not do.",
    updated: "2026-11-11",
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
    lede: "quicx is the single binary that ships with the release. Running it with no arguments prints the same usage you see below.",
    updated: "2026-11-10",
    toc: [{ id: "several-daemons", label: "Several daemons on one machine" }],
  },
  "java-client": {
    num: "§ 03.02",
    kicker: "Reference",
    title: "Java Client",
    lede: "dev.quicx:quicx-client 2.1.0 is a small, dependency-free Java 11+ library. QuicxClient submits tasks, with value levels if you want, and can wait for their result; QuicxWorker runs them, reconnecting and reporting on its own.",
    description: "dev.quicx:quicx-client 2.1.0 for Maven and Gradle, Java 11+: QuicxClient and QuicxWorker API, error handling, threading and compatibility.",
    seoTitle: "Quicx Java Client (Maven/Gradle): Setup and API Reference",
    updated: "2026-11-20",
    toc: [
      { id: "java-build-setup", label: "Add it to your build" },
      { id: "java-compatibility", label: "Compatibility" },
      { id: "QuicxClient", label: "QuicxClient for producers" },
      { id: "QuicxWorker", label: "QuicxWorker for consumers" },
      { id: "java-threading", label: "Threading model" },
      { id: "QuicxException", label: "Error handling" },
      { id: "java-limits", label: "Limits and delivery" },
    ],
  },
  "changelog": {
    num: "§ 03.03",
    kicker: "Reference",
    title: "Changelog",
    lede: "Quicx follows semver. A breaking change to the wire protocol, the config file or the memory model bumps the major version; new message types are additive and bump minor. Patch releases are build-or-docs-only.",
    updated: "2026-11-11",
    toc: [],
  },
};

export const sectionSlugs = Object.keys(sectionMeta);
