import { TriangleAlert } from "lucide-react";
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
    <li className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-quicx-line pt-7 first:border-t-0 first:pt-0 md:grid-cols-[9rem_minmax(0,1fr)]">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 md:flex-col md:gap-1.5">
        <span className="font-mono text-[20px] font-medium tracking-[-0.02em] text-quicx-text">
          {version}
        </span>
        <time dateTime={date} className="font-mono text-[12.5px] text-quicx-dim">
          {date}
        </time>
        <span
          className={
            status === "Current"
              ? "mt-1 inline-flex w-fit items-center gap-1.5 caps-label text-quicx-orange-bright"
              : "mt-1 inline-flex w-fit caps-label text-quicx-dim"
          }
        >
          {status === "Current" && <span aria-hidden className="size-1.5 rounded-full bg-quicx-orange" />}
          {status}
        </span>
      </div>
      <ul className="space-y-3 text-[15px] leading-[1.7] text-quicx-body">
        {highlights.map((h, i) => {
          // Breaking changes are flagged in the source text with a warning sign;
          // draw it as an icon rather than an emoji.
          const breaking = h.startsWith("⚠️");
          const text = breaking ? h.replace(/^⚠️\s*/, "") : h;
          return (
            <li key={i} className="flex gap-3">
              <span className="flex h-[1.7em] w-4 shrink-0 items-center justify-center">
                {breaking ? (
                  <TriangleAlert aria-label="Breaking change" className="size-4 text-[#f0c66b]" />
                ) : (
                  <span aria-hidden className="size-1.5 bg-quicx-orange/80" />
                )}
              </span>
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function ChangelogSection() {
  return (
    <>
      <section className="space-y-8">
        <SectionHeaderFor slug="changelog" />

        <ul className="space-y-10">
          <Release
            version="v2.1.0"
            date="2026-11-10"
            status="Current"
            highlights={[
              "Value-aware admission: MSG_SUBMIT_VALUED (0x0D) carries a level from 0 to 15, higher levels are dispatched first, and with admission = value a full budget evicts a waiting task of a lower level, but only when apool proves its memory fits the new task. Level 15 is never evicted. 100 % of valuable tasks done under overload, against 31.6 % for a queue that refuses.",
              "Each port has its own CLI socket and pid file, and status and stop take --port, so several daemons run side by side; on two cores, two pinned daemons did 1.92 times the work of one.",
              "make MAX_PAYLOAD=N builds a daemon for payloads above 1,024 bytes (up to 16,320); 1,002 tasks of 8,000 B fit in 8 MiB, exactly what the capacity formula gives.",
              "A disconnecting producer is forgotten, so results never reach a later connection on the same descriptor; quicx status shows evicted tasks.",
            ]}
          />
          <Release
            version="v2.0.0"
            date="2026-11-09"
            status="Stable"
            highlights={[
              "New allocator, apool v2. 16 KiB pages go to the block sizes that are actually arriving and come back when they empty, instead of a split fixed at startup. The default 8 MiB now holds 46,593 tasks of 100 B instead of 655 and 30,947 nginx log lines instead of 1,433, measured the same on macOS and Linux.",
              "Memory goes back to the OS after a burst: about 2 MB held once the queue drains, where 1.0.4 held the whole 9 MB from startup. Throughput and latency are unchanged.",
              "Each allocator idea from the literature has its own switch — reserve, hardening, purge, fullest-first — measured one by one; see the apool v2 Allocator page.",
              "Fixed: in 1.0.4 a queue full of 16 B or 32 B tasks could lock out every new worker until a restart, because connections, workers and tasks shared size classes. Connections and workers now have their own pool.",
              "One block per task: the payload sits right behind the 64 B Task record, so a task is one allocation and one free, and a SUBMIT that does not fit is refused in one place.",
              "⚠️ quicx.conf has [memory] and [allocator] sections and is validated strictly: an unknown key or a bad value stops the daemon with the file and line. Old files still load; their class lines are ignored with a note.",
              "--port on the command line now wins over the config file, and the start lines reach a log file.",
              "The wire protocol now has a name: QXP, the Quicx Protocol. Its format is unchanged, so 1.x clients and workers work with 2.0.",
            ]}
          />
          <Release
            version="v1.0.4"
            date="2026-11-05"
            status="Stable"
            highlights={[
              "Fixed: tasks with a payload were never delivered in v1.0.3. The frame writer had room for three pieces while TASK and SUBMIT send four, so the payload was dropped (release binaries) or the daemon aborted (clang -O2). Every payload task is delivered again, and a wire-level test now checks the exact bytes sent.",
              "Fixed: a client could crash the daemon by sending DONE without READY on a connection whose memory had last held a payload. New connections are now zeroed before use.",
              "Fixed: when a payload does not fit in the pool, its bytes are read off the socket before the error reply. Previously the next message on that connection was misread and answered with \"bad version\".",
              "Fixed: when the Task record does not fit after its payload did, the payload is freed instead of leaked.",
            ]}
          />
          <Release
            version="v1.0.3"
            date="2026-08-01"
            status="Stable"
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
