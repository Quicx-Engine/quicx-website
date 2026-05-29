import type { TocEntry } from "@/components/site/docs/DocsSidebar";

export type SectionMeta = {
  num: string;
  kicker: string;
  title: string;
  lede: string;
  toc: TocEntry[];
};

export const sectionMeta: Record<string, SectionMeta> = {
  "installation": {
    num: "§ 01.01",
    kicker: "Getting Started",
    title: "Installation",
    lede: "Quicx ships as a single static binary. One curl command detects your OS and architecture, verifies the checksum, and drops the daemon into your PATH.",
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
    toc: [],
  },
  "configuration": {
    num: "§ 01.03",
    kicker: "Getting Started",
    title: "Configuration",
    lede: "A Quicx daemon reads its entire runtime shape from a single quicx.conf file. Every number is exact — block counts, pool share, port — and is resolved before a byte of task traffic moves.",
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
    toc: [{ id: "single-daemon-design", label: "Why a single daemon?" }],
  },
  "pmad-allocator": {
    num: "§ 02.02",
    kicker: "Core Concepts",
    title: "PMAD — Predictive Memory Allocator",
    lede: "A slab allocator written in C that delivers O(1) allocation and deallocation with zero fragmentation and zero system calls at runtime. Every allocation the daemon makes — task envelopes, wire buffers, worker registration slots — comes out of PMAD. Fragmentation is 0 % by design: every block is pre-sized to a declared class, so there is no splitting, no coalescing, and no wasted space.",
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
    toc: [
      { id: "protocol-frame-header", label: "Frame header" },
      { id: "protocol-message-types", label: "Message types" },
      { id: "payload-formats", label: "Payload formats" },
    ],
  },
  "cli-reference": {
    num: "§ 03.01",
    kicker: "Reference",
    title: "CLI Reference",
    lede: "quicx is the single binary that ships with the release. It is self-documenting — running it with no arguments prints the same usage you see below.",
    toc: [],
  },
  "java-client": {
    num: "§ 03.02",
    kicker: "Reference",
    title: "Java Client",
    lede: "dev.quicx:quicx-client is a small, dependency-free Java 11+ library. Two classes carry the whole surface area: QuicxClient for producers, QuicxWorker for consumers.",
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
    toc: [],
  },
};

export const sectionSlugs = Object.keys(sectionMeta);
