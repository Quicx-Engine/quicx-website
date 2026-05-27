import React from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import {
  SectionHeader,
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
      <SectionHeader
        num="§ 03.01"
        kicker="Reference"
        title="CLI Reference"
        id="cli-reference"
        lede="quicx is the single binary that ships with the release. It is self-documenting — running it with no arguments prints the same usage you see below."
      />

      <CodeBlock
        window
        filename="~ $ quicx"
        language="sh"
        code={`quicx v1.0.1 — lightweight task queue daemon

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
              1 MiB pool, six size classes). Pass a path to override any or all values.
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
              <strong>uptime</strong>, <strong>worker pool state</strong>,{" "}
              <strong>queue depth</strong>, <strong>task counters</strong>,{" "}
              <strong>memory usage</strong> and a per-size-class{" "}
              <strong>PMAD slab breakdown</strong>. Safe to script — exits non-zero if the
              daemon is unreachable.
            </p>
          </Prose>

          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx status

  quicx v1.0.1
  ─────────────────────────────────────────
  uptime     0h 0m 6s

  workers    idle: 0     busy: 0     total: 0
  queue      waiting: 0

  tasks      submitted: 0
             completed: 0
             failed:    0

  memory     32 / 913408 bytes (0.0%)

  PMAD:
      32B  [░░░░░░░░░░░░░░░░░░░░]  1 / 2184
      64B  [░░░░░░░░░░░░░░░░░░░░]  0 / 3276
     128B  [░░░░░░░░░░░░░░░░░░░░]  0 / 1820
     256B  [░░░░░░░░░░░░░░░░░░░░]  0 / 770
     512B  [░░░░░░░░░░░░░░░░░░░░]  0 / 238
    1024B  [░░░░░░░░░░░░░░░░░░░░]  0 / 80

user@host ~ $`}
          />
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
