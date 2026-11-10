import Link from "next/link";
import React from "react";
import { CURRENT_VERSION } from "@/lib/version";
import { Terminal as TerminalIcon } from "lucide-react";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
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
    <div className="border-t border-quicx-line pt-7 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
        <code className="flex items-center gap-2.5 font-mono text-[16px] text-quicx-text">
          <TerminalIcon aria-hidden className="size-4 shrink-0 translate-y-px text-quicx-orange" />
          {cmd}
        </code>
        <span className="text-[14px] text-quicx-dim">{title}</span>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
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
  quicx start [--config FILE] [--port N]
  quicx stop [--port N]
  quicx status [--port N]
  quicx version`}
      />

      <div className="space-y-12">
        <CliCommand cmd="quicx start [--config FILE] [--port N]" title="start the daemon in the foreground">
          <Prose>
            <p>
              Binds the port, maps the memory budget once, and begins accepting connections. Runs in the foreground — the calling
              shell owns the process. Pair with systemd, <InlineCode>tmux</InlineCode>,{" "}
              <InlineCode>launchd</InlineCode> or your container supervisor for lifecycle
              management.
            </p>
            <p>
              <InlineCode>--config</InlineCode> is optional. When omitted, the daemon starts
              with the built-in defaults (port <InlineCode>16381</InlineCode>, an 8 MiB budget,
              apool with reserve, hardening and purge on). Pass a{" "}
              <Link href="/docs/configuration">quicx.conf</Link> to override any or all values;{" "}
              <InlineCode>--port</InlineCode> overrides the file&rsquo;s port.
            </p>
          </Prose>
        </CliCommand>

        <CliCommand cmd="quicx stop [--port N]" title="gracefully stop the local daemon">
          <Prose>
            <p>
              Sends <InlineCode>SIGTERM</InlineCode> to the pid recorded in{" "}
              <InlineCode>/tmp/quicx.pid</InlineCode>, or in{" "}
              <InlineCode>/tmp/quicx-&lt;port&gt;.pid</InlineCode> for a daemon on another port. The daemon exits and the OS takes its
              memory back. Tasks still in the queue are lost, as on any restart (see{" "}
              <Link href="/docs/limitations">Limitations</Link>).
            </p>
          </Prose>
        </CliCommand>

        <CliCommand cmd="quicx status [--port N]" title="live observation of the running daemon">
          <Prose>
            <p>
              Opens a short-lived control connection over the{" "}
              <InlineCode>/tmp/quicx.sock</InlineCode> Unix socket (
              <InlineCode>/tmp/quicx-&lt;port&gt;.sock</InlineCode> with{" "}
              <InlineCode>--port</InlineCode>) and sends{" "}
              <InlineCode>MSG_STATS</InlineCode>, then renders the{" "}
              <InlineCode>MSG_STATS_RESPONSE</InlineCode> as a human-readable table. Shows{" "}
              <strong>uptime</strong>, <strong>task counters</strong> (including{" "}
              <strong>in-flight</strong>, derived as submitted − completed − failed),{" "}
              <strong>pages in use</strong> out of the pool, and every{" "}
              <strong>block size that holds pages</strong> with its live blocks, capacity and
              page count. Safe to script — exits
              non-zero if the daemon is unreachable.
            </p>
          </Prose>

          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx status

  quicx v${CURRENT_VERSION}  ·  pid 8278  ·  up 0h 0m 00s

  tasks     submitted       1,500
            completed           0   ░░░░░░░░░░░░░░░░░░░░     0.0%
            failed              0                            0.0%
            in flight       1,500   = 1500 queued + 0 running
            queued          1,500

  workers   busy                0   ░░░░░░░░░░░░░░░░░░░░     0.0%
            idle                0
            total               0   · 0 registered since start

  memory    32 / 508 pages          █░░░░░░░░░░░░░░░░░░░     6.3%
            pool 7.95 MiB, 16 KiB pages · 2 sizes in use

           176B    1,200 /   1,209  ███████████████████░    99.3%    13 pages
           976B      300 /     304  ███████████████████░    98.7%    19 pages

user@host ~ $`}
          />

          <p className="mt-3 text-[13.5px] leading-relaxed text-quicx-muted">
            Above: 1,200 tasks of 100 B and 300 of 900 B waiting, no worker connected. Since
            2.0 the memory block counts pages — a size appears only while it holds some, and
            its capacity grows and shrinks with the pages it owns. Redesigned in v1.0.3 — bar
            charts, thousands separators and human-readable byte sizes replace the raw counters
            from earlier releases. New fields exposed on the
            wire: <InlineCode>workers_registered</InlineCode> (ever registered, not just
            currently live), <InlineCode>pool_size</InlineCode> (bytes requested from the OS),{" "}
            <InlineCode>usable_bytes</InlineCode> (after the metadata carve-out) and{" "}
            <InlineCode>used_bytes</InlineCode> (metadata + live blocks).
          </p>

          <Callout variant="warn" title="CLI and daemon must match versions">
            The stats wire format grew in v1.0.3 (<InlineCode>StatsHeader</InlineCode>: 48 → 73
            bytes). If <InlineCode>quicx status</InlineCode>{" "}and the daemon it&rsquo;s talking to
            are different releases, it detects the length mismatch and prints{" "}
            <InlineCode>daemon speaks a different stats format — restart the daemon to match</InlineCode>{" "}
            instead of misparsing the response.
          </Callout>
        </CliCommand>

        <CliCommand cmd="quicx version" title="print the binary version">
          <Prose>
            <p>
              Prints the version on one line, for example{" "}
              <InlineCode>quicx v{CURRENT_VERSION}</InlineCode>.
            </p>
          </Prose>
        </CliCommand>
      </div>

      <SubHeading id="several-daemons">Several daemons on one machine</SubHeading>

      <Prose>
        <p>
          Each daemon has its own port, memory budget, CLI socket and pid file, so one machine can
          run a queue per application or per customer, each held to its own limit. The default
          port keeps <InlineCode>/tmp/quicx.sock</InlineCode> and{" "}
          <InlineCode>/tmp/quicx.pid</InlineCode>; any other port uses{" "}
          <InlineCode>/tmp/quicx-&lt;port&gt;.sock</InlineCode> and{" "}
          <InlineCode>/tmp/quicx-&lt;port&gt;.pid</InlineCode>.
        </p>
      </Prose>

      <CodeBlock
        filename="~ $ two customers, one machine"
        language="sh"
        code={`quicx start --port 16401 --config customer-a.conf
quicx start --port 16402 --config customer-b.conf
quicx status --port 16401
quicx stop --port 16402`}
      />

      <Prose>
        <p>
          Measured with ten daemons of 8 MiB on one Mac: filling one to its limit (46,593 tasks,
          then <InlineCode>ERROR 0x01</InlineCode>) left the other nine accepting every task, and
          each <InlineCode>quicx status --port</InlineCode> reported its own daemon. An idle
          daemon takes about 1.4 MiB. Memory is fenced per daemon; CPU and network are shared as
          usual.
        </p>
      </Prose>
    </section>
  );
}
