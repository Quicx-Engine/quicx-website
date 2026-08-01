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
            version="v1.0.3"
            date="2026-08-01"
            status="Current"
            highlights={[
              "⚠️ Breaking: max payload cut from 1 MiB to 1024 bytes (PROTOCOL_MAX_PAYLOAD). It now matches the allocator's largest size class, so every accepted payload fits in exactly one PMAD block — oversized frames get a clean MSG_ERROR instead of being truncated.",
              "Producers are now told when their task completes. MSG_DONE used to only update the daemon's internal state, leaving the producer with silence; it's now forwarded to the producer the same way MSG_FAILED always was.",
              "Real failure reasons reach the producer. MSG_FAILED used to send a hardcoded \"Worker Failed\" regardless of what the worker actually reported — the real reason (up to 64 bytes) is now read off the wire, bounds-checked and forwarded.",
              "New default allocator layout: 64 exact-fit size classes from 16 to 1024 bytes on an 8 MiB pool (up from 6 classes on 1 MiB), weighted so the Task, Connection and Worker classes get the share their traffic actually needs and no class is ever carved to zero.",
              "⚠️ Allocator ceiling lowered: MAX_SIZE_OF_SIZE_CLASS is now 1024 bytes (was 4096) and MAX_PMAD_CLASSES is 64 (was 32). Allocations above 1024 bytes are rejected outright.",
              "Memory accounting is real. pool->used sat at 0 forever in earlier releases; it's now maintained on every alloc and free path, which is what makes quicx status's memory numbers trustworthy.",
              "pmad_alloc returns a PmadStatus instead of a bare pointer, with five distinct error codes replacing an undifferentiated NULL.",
              "⚠️ Stats wire format changed and is incompatible with v1.0.2: StatsHeader grew from 48 to 73 bytes, and class_count is now a uint8_t instead of a uint32_t that the daemon and the reader used to cap at two different, hardcoded values. A version-mismatched quicx status now prints a clear message instead of misparsing the response — keep the CLI and the daemon on the same release.",
              "Redesigned quicx status output — bar charts, thousands separators, human-readable byte sizes, uptime, per-class utilization, and an in-flight count derived as submitted − completed − failed.",
              "Sharding groundwork: a new Quicx context bundles the allocator, task queue, worker pool and counters into one struct that's passed explicitly instead of living behind process-global singletons (PMAD, the worker pool, stats). The daemon still runs exactly one shard today — this is what lets a future daemon run several.",
              "Connections gained real types: CONN_SERVER and CONN_CLI now identify the TCP and Unix listeners, instead of every non-producer/worker socket being lumped under CONN_UNKNOWN.",
              "install.sh pointed at the old anastassow/Quicx/releases path and 404'd for every user since binaries moved out of the source repo. Fixed to target Quicx-Engine/Quicx-Releases, with latest → v1.0.3 and version arguments now accepting 1.0.3 or v1.0.3 alike.",
              "Hygiene: static asserts now lock every wire and memory struct size, main.c dropped from 380 to 22 lines (CLI handling and config parsing split into cli.c / config.c), dead code and magic numbers were removed, and a new stats.txt catalogues every exposed metric.",
            ]}
          />
          <Release
            version="v1.0.2"
            date="2026-05-31"
            status="Stable"
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
