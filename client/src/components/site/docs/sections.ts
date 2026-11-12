import type { ComponentType } from "react";
import type { DocsNavGroup } from "@/components/site/docs/DocsSidebar";
import { InstallationSection } from "@/components/site/docs/sections/installation";
import { QuickStartSection } from "@/components/site/docs/sections/quick-start";
import { ConfigurationSection } from "@/components/site/docs/sections/configuration";
import { ArchitectureSection } from "@/components/site/docs/sections/architecture";
import { AllocatorSection } from "@/components/site/docs/sections/allocator";
import { BinaryProtocolSection } from "@/components/site/docs/sections/binary-protocol";
import { BenchmarksSection } from "@/components/site/docs/sections/benchmarks";
import { LimitationsSection } from "@/components/site/docs/sections/limitations";
import { CliReferenceSection } from "@/components/site/docs/sections/cli-reference";
import { JavaClientSection } from "@/components/site/docs/sections/java-client";
import { ChangelogSection } from "@/components/site/docs/sections/changelog";

export { sectionMeta, sectionSlugs } from "@/components/site/docs/sections-meta";
export type { SectionMeta } from "@/components/site/docs/sections-meta";

export const nav: DocsNavGroup[] = [
  {
    label: "Getting Started",
    items: [
      {
        id: "installation",
        label: "Installation",
        toc: [
          { id: "what-installer-does", label: "What the installer does" },
          { id: "verify-installation", label: "Verify it worked" },
        ],
      },
      {
        id: "quick-start",
        label: "Quick Start",
        toc: [],
      },
      {
        id: "configuration",
        label: "Configuration",
        toc: [
          { id: "server-block", label: "[server]" },
          { id: "memory-block", label: "[memory]" },
          { id: "allocator-block", label: "[allocator]" },
          { id: "upgrading", label: "Upgrading from 1.x" },
        ],
      },
    ],
  },
  {
    label: "Core Concepts",
    items: [
      {
        id: "architecture",
        label: "Architecture",
        toc: [{ id: "single-daemon-design", label: "Why a single daemon?" }],
      },
      {
        id: "allocator",
        label: "apool Allocator",
        toc: [
          { id: "allocator-architecture", label: "Architecture" },
          { id: "allocator-features", label: "Ideas from the literature" },
          { id: "allocator-benchmarks", label: "Benchmarks" },
          { id: "allocator-tuning", label: "Settings" },
        ],
      },
      {
        id: "binary-protocol",
        label: "QXP Protocol",
        toc: [
          { id: "protocol-frame-header", label: "Frame header" },
          { id: "protocol-message-types", label: "Message types" },
          { id: "payload-formats", label: "Payload formats" },
        ],
      },
      {
        id: "benchmarks",
        label: "Benchmarks",
        toc: [
          { id: "bench-throughput", label: "Throughput" },
          { id: "bench-latency", label: "Latency" },
          { id: "bench-machines", label: "Two machines" },
          { id: "bench-capacity", label: "Capacity" },
          { id: "bench-memory", label: "Memory" },
          { id: "bench-methodology", label: "Methodology" },
          { id: "bench-comparison", label: "Comparison" },
        ],
      },
      {
        id: "limitations",
        label: "Limitations",
        toc: [
          { id: "not-implemented", label: "What Quicx does not do" },
          { id: "feature-matrix", label: "Feature for feature" },
        ],
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        id: "cli-reference",
        label: "CLI Reference",
        toc: [],
      },
      {
        id: "java-client",
        label: "Java Client",
        toc: [
          { id: "java-build-setup", label: "Add it to your build" },
          { id: "QuicxClient", label: "QuicxClient for producers" },
          { id: "QuicxWorker", label: "QuicxWorker for consumers" },
          { id: "QuicxException", label: "Errors and limits" },
        ],
      },
      {
        id: "changelog",
        label: "Changelog",
        toc: [],
      },
    ],
  },
];

export const sectionComponents: Record<string, ComponentType> = {
  "installation": InstallationSection,
  "quick-start": QuickStartSection,
  "configuration": ConfigurationSection,
  "architecture": ArchitectureSection,
  "allocator": AllocatorSection,
  "binary-protocol": BinaryProtocolSection,
  "benchmarks": BenchmarksSection,
  "limitations": LimitationsSection,
  "cli-reference": CliReferenceSection,
  "java-client": JavaClientSection,
  "changelog": ChangelogSection,
};
