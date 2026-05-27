import type { ComponentType } from "react";
import type { DocsNavGroup, TocEntry } from "@/components/site/docs/DocsSidebar";
import { InstallationSection } from "@/components/site/docs/sections/installation";
import { QuickStartSection } from "@/components/site/docs/sections/quick-start";
import { ConfigurationSection } from "@/components/site/docs/sections/configuration";
import { ArchitectureSection } from "@/components/site/docs/sections/architecture";
import { PmadSection } from "@/components/site/docs/sections/pmad-allocator";
import { BinaryProtocolSection } from "@/components/site/docs/sections/binary-protocol";
import { CliReferenceSection } from "@/components/site/docs/sections/cli-reference";
import { JavaClientSection } from "@/components/site/docs/sections/java-client";
import { ChangelogSection } from "@/components/site/docs/sections/changelog";

export type SectionMeta = {
  title: string;
  description: string;
  toc: TocEntry[];
};

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
          { id: "allocator-block", label: "[allocator]" },
          { id: "tuning-rules", label: "Tuning rules of thumb" },
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
        id: "pmad-allocator",
        label: "PMAD Allocator",
        toc: [
          { id: "pmad-architecture", label: "Architecture" },
          { id: "pmad-benchmarks", label: "Benchmarks" },
          { id: "pmad-configurations", label: "Reference configurations" },
          { id: "pmad-teardown", label: "Tear-down" },
        ],
      },
      {
        id: "binary-protocol",
        label: "Binary Protocol",
        toc: [
          { id: "protocol-frame-header", label: "Frame header" },
          { id: "protocol-message-types", label: "Message types" },
          { id: "payload-formats", label: "Payload formats" },
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
          { id: "QuicxClient", label: "QuicxClient — producers" },
          { id: "QuicxWorker", label: "QuicxWorker — consumers" },
          { id: "QuicxException", label: "QuicxException" },
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
  "pmad-allocator": PmadSection,
  "binary-protocol": BinaryProtocolSection,
  "cli-reference": CliReferenceSection,
  "java-client": JavaClientSection,
  "changelog": ChangelogSection,
};

export const sectionMeta: Record<string, SectionMeta> = {
  "installation": {
    title: "Installation",
    description:
      "Install the Quicx daemon with a single curl command. POSIX install script for Linux (x86_64, arm64) and macOS (Intel, Apple Silicon).",
    toc: [
      { id: "what-installer-does", label: "What the installer does" },
      { id: "verify-installation", label: "Verify it worked" },
    ],
  },
  "quick-start": {
    title: "Quick Start",
    description:
      "Start the Quicx daemon, add the Java client to your build, and submit your first task end-to-end in under a minute.",
    toc: [],
  },
  "configuration": {
    title: "Configuration",
    description:
      "Configure the Quicx daemon via quicx.conf — server port, PMAD pool size and size-class layout. Tuning rules included.",
    toc: [
      { id: "server-block", label: "[server]" },
      { id: "allocator-block", label: "[allocator]" },
      { id: "tuning-rules", label: "Tuning rules of thumb" },
    ],
  },
  "architecture": {
    title: "Architecture",
    description:
      "Quicx architecture: one daemon, three role-based endpoints, one PMAD allocator. Producer, worker and monitor message paths explained.",
    toc: [{ id: "single-daemon-design", label: "Why a single daemon?" }],
  },
  "pmad-allocator": {
    title: "PMAD Allocator",
    description:
      "PMAD — the O(1) slab allocator behind Quicx. Zero fragmentation, zero runtime syscalls, deterministic 19 ns allocations.",
    toc: [
      { id: "pmad-architecture", label: "Architecture" },
      { id: "pmad-benchmarks", label: "Benchmarks" },
      { id: "pmad-configurations", label: "Reference configurations" },
      { id: "pmad-teardown", label: "Tear-down" },
    ],
  },
  "binary-protocol": {
    title: "Binary Protocol",
    description:
      "Quicx wire protocol: 6-byte header plus variable payload, 12 message types, big-endian fields. Full opcode and payload reference.",
    toc: [
      { id: "protocol-frame-header", label: "Frame header" },
      { id: "protocol-message-types", label: "Message types" },
      { id: "payload-formats", label: "Payload formats" },
    ],
  },
  "cli-reference": {
    title: "CLI Reference",
    description:
      "Complete reference for the quicx command-line interface: start, stop, status and version.",
    toc: [],
  },
  "java-client": {
    title: "Java Client",
    description:
      "dev.quicx:quicx-client — a small, dependency-free Java 11+ library. QuicxClient for producers, QuicxWorker for consumers.",
    toc: [
      { id: "java-build-setup", label: "Add it to your build" },
      { id: "QuicxClient", label: "QuicxClient — producers" },
      { id: "QuicxWorker", label: "QuicxWorker — consumers" },
      { id: "QuicxException", label: "QuicxException" },
    ],
  },
  "changelog": {
    title: "Changelog",
    description:
      "Quicx release notes — semver versioning, breaking and additive protocol changes, current and historical releases.",
    toc: [],
  },
};

export const sectionSlugs = Object.keys(sectionComponents);
