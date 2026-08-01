import React from "react";
import { CURRENT_VERSION } from "@/lib/version";
import { Terminal as TerminalIcon } from "lucide-react";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
} from "@/components/site/docs/_primitives";

function CliCommand({
  cmd,
  title,
  children,
}: {
  cmd: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-quicx-line bg-[#0a1a22] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex size-7 items-center justify-center rounded border border-quicx-orange/40 bg-quicx-orange/10 text-quicx-orange-bright">
          <TerminalIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <code className="block font-[family-name:var(--font-jetbrains-mono)] text-[13.5px] text-quicx-text">
            {cmd}
          </code>
          <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.24em] text-quicx-dim">
            {title}
          </div>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function CliReferenceSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="cli-reference" />

      <CodeBlock
        window
        filename="~ $ quicx"
        language="sh"
        code={`quicx v${CURRENT_VERSION} — lightweight task queue daemon

usage:
  quicx start --config FILE
  quicx stop
  quicx status
  quicx version`}
      />

      <div className="space-y-6">
        <CliCommand cmd="quicx start --config FILE" title="start the daemon in the foreground">
          <Prose>
            <p>
              Binds the port declared in <InlineCode>[server]</InlineCode>, maps the PMAD
              pool, and begins accepting connections. Runs in the foreground — the calling
              shell owns the process. Pair with systemd, <InlineCode>tmux</InlineCode>,{" "}
              <InlineCode>launchd</InlineCode> or your container supervisor for lifecycle
              management.
            </p>
            <p>
              <InlineCode>--config</InlineCode> is optional. When omitted, the daemon starts
              with the built-in default configuration (port <InlineCode>16381</InlineCode>,
              8 MiB pool, 64 exact-fit size classes from 16 to 1024 bytes). Pass a path to
              override any or all values.
            </p>
          </Prose>
        </CliCommand>

        <CliCommand cmd="quicx stop" title="gracefully stop the local daemon">
          <Prose>
            <p>
              Sends <InlineCode>SIGTERM</InlineCode> to the pid recorded in{" "}
              <InlineCode>/var/run/quicx.pid</InlineCode>. The daemon drains in-flight tasks,{" "}
              <InlineCode>munmap</InlineCode>s the PMAD pool and exits cleanly.
            </p>
          </Prose>
        </CliCommand>

        <CliCommand cmd="quicx status" title="live observation of the running daemon">
          <Prose>
            <p>
              Opens a short-lived control connection over the{" "}
              <InlineCode>/tmp/quicx.sock</InlineCode> Unix socket and sends{" "}
              <InlineCode>MSG_STATS</InlineCode>, then renders the{" "}
              <InlineCode>MSG_STATS_RESPONSE</InlineCode> as a human-readable table. Shows{" "}
              <strong>uptime</strong>, <strong>task counters</strong> (including{" "}
              <strong>in-flight</strong>, derived as submitted − completed − failed),{" "}
              <strong>memory usage</strong> against your configured pool, and a{" "}
              <strong>per-size-class utilization</strong> breakdown. Safe to script — exits
              non-zero if the daemon is unreachable.
            </p>
          </Prose>

          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx status

  quicx v${CURRENT_VERSION}  ·  pid 3709  ·  up 0h 0m 02s

  tasks     submitted           0
            completed           0   ░░░░░░░░░░░░░░░░░░░░     0.0%
            in flight           0   = 0 queued + 0 running

  memory    592.8 KiB / 8.00 MiB    █░░░░░░░░░░░░░░░░░░░     7.2%
            usable 8.00 MiB · 64 size classes

            16B        1 /   5,241  ░░░░░░░░░░░░░░░░░░░░     0.0%
            64B        0 /  12,580  ░░░░░░░░░░░░░░░░░░░░     0.0%
            ...        (62 more size classes)

user@host ~ $`}
          />

          <p className="mt-3 text-[13.5px] leading-relaxed text-quicx-muted">
            Redesigned in v1.0.3 — bar charts, thousands separators and human-readable byte
            sizes replace the raw counters from earlier releases. New fields exposed on the
            wire: <InlineCode>workers_registered</InlineCode> (ever registered, not just
            currently live), <InlineCode>pool_size</InlineCode> (bytes requested from the OS),{" "}
            <InlineCode>usable_bytes</InlineCode> (after the metadata carve-out) and{" "}
            <InlineCode>used_bytes</InlineCode> (metadata + live blocks).
          </p>

          <Callout variant="warn" title="CLI and daemon must match versions">
            The stats wire format grew in v1.0.3 (<InlineCode>StatsHeader</InlineCode>: 48 → 73
            bytes). If <InlineCode>quicx status</InlineCode> and the daemon it&rsquo;s talking to
            are different releases, it detects the length mismatch and prints{" "}
            <InlineCode>daemon speaks a different stats format — restart the daemon to match</InlineCode>{" "}
            instead of misparsing the response.
          </Callout>
        </CliCommand>

        <CliCommand cmd="quicx version" title="print the binary version + build metadata">
          <Prose>
            <p>
              Prints the semver, build date and target triple. Machine-parsable if you pipe
              it — one line, space-separated.
            </p>
          </Prose>
        </CliCommand>
      </div>
    </section>
  );
}
