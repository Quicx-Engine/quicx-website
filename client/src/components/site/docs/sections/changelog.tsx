import { Callout } from "@/components/site/docs/Callout";
import { DocsPageFooterCta } from "@/components/site/docs/DocsPageFooterCta";
import {
  SectionHeaderFor,
  InlineCode,
} from "@/components/site/docs/_primitives";

function Release({
  version,
  date,
  status,
  highlights,
}: {
  version: string;
  date: string;
  status: string;
  highlights: string[];
}) {
  return (
    <li className="rounded-lg border border-quicx-line bg-[#0a1a22] p-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[18px] font-semibold text-quicx-text">
          {version}
        </span>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-quicx-dim">
          {date}
        </span>
        <span className="rounded border border-quicx-orange/40 bg-quicx-orange/10 px-2 py-0.5 font-[family-name:var(--font-barlow-condensed)] text-[10.5px] uppercase tracking-[0.26em] text-quicx-orange-bright">
          {status}
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-[13.5px] text-quicx-muted">
        {highlights.map((h, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-quicx-orange" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function ChangelogSection() {
  return (
    <>
      <section className="space-y-8">
        <SectionHeaderFor slug="changelog" />

        <ul className="space-y-6">
          <Release
            version="v1.0.2"
            date="2026-05-31"
            status="Current"
            highlights={[
              "Failed sends are now reported to the producer — no silent drops. When a task cannot be delivered, the daemon replies with MSG_FAILED so the producer is always informed.",
              "Fixed a bug where providing a config file would merge its size classes with the built-in defaults instead of replacing them. Size classes now come exclusively from the supplied config.",
            ]}
          />
          <Release
            version="v1.0.1"
            date="2026-05-19"
            status="Stable"
            highlights={[
              "quicx start now accepts --config as optional. When omitted, the daemon boots with the built-in default configuration (port 16381, 1 MiB pool, six size classes: 32, 64, 128, 256, 512, 1024 bytes).",
              "Default config is documented in the Configuration section.",
            ]}
          />
          <Release
            version="v1.0.0"
            date="2026-04-21"
            status="Stable"
            highlights={[
              "First public release.",
              "Binary protocol frozen — 12 message types, 6-byte header, versioned.",
              "PMAD v1 — O(1) slab allocator with user-defined size classes.",
              "Java client published to Maven Central as dev.quicx:quicx-client.",
              "Install script for Linux (x86_64, arm64) and macOS (Intel, Apple Silicon).",
            ]}
          />
        </ul>

        <Callout variant="tip" title="Subscribe to release notes">
          The canonical source of release notes is the{" "}
          <a target="_blank" href="https://github.com/Quicx-Engine/Quicx-Releases">GitHub releases page</a>. Watch
          the repository for notifications — every release bundles a signed tarball plus the
          matching <InlineCode>SHA256SUMS</InlineCode>.
        </Callout>
      </section>

      <div className="mt-16">
        <DocsPageFooterCta />
      </div>
    </>
  );
}
