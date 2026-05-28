import type { ComponentType } from "react";
import type { DocsNavGroup } from "@/components/site/docs/DocsSidebar";
import { InstallationSection } from "@/components/site/docs/sections/installation";
import { QuickStartSection } from "@/components/site/docs/sections/quick-start";
import { ConfigurationSection } from "@/components/site/docs/sections/configuration";
import { ArchitectureSection } from "@/components/site/docs/sections/architecture";
import { PmadSection } from "@/components/site/docs/sections/pmad-allocator";
import { BinaryProtocolSection } from "@/components/site/docs/sections/binary-protocol";
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
