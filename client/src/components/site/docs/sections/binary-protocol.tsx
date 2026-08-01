import React from "react";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";
import { Callout } from "@/components/site/docs/Callout";

function FrameDiagram() {
  const fields: { label: string; sub: string; color: string; flex: string }[] = [
    { label: "version", sub: "1 byte", color: "#60a5fa", flex: "0 0 80px" },
    { label: "type", sub: "1 byte", color: "#FF7A33", flex: "0 0 80px" },
    { label: "length", sub: "4 bytes", color: "#5eead4", flex: "0 0 140px" },
    { label: "payload", sub: "length bytes", color: "#a78bfa", flex: "1 1 0%" },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px] overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
        <div
          className="flex"
          role="img"
          aria-label="Binary frame layout: version (1 byte), type (1 byte), length (4 bytes), payload (length bytes)"
        >
          {fields.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center justify-center gap-1 border-r border-quicx-line px-4 py-5 last:border-r-0"
              style={{ flex: f.flex }}
            >
              <span
                className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] font-semibold"
                style={{ color: f.color }}
              >
                {f.label}
              </span>
              <span className="text-[10.5px] tracking-wider text-quicx-dim">{f.sub}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-quicx-line bg-white/[0.02] px-4 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-quicx-dim">
          <span>
            total header = <span className="text-quicx-muted">6 bytes fixed</span>
          </span>
          <span>
            total message = <span className="text-quicx-muted">6 + length bytes</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
        <div className="flex items-center justify-between border-b border-quicx-line bg-white/[0.02] px-4 py-2.5">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-wide text-quicx-dim">
            one task, start to finish
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-relaxed text-quicx-muted">
          <code>{`Producer                Daemon                    Worker
   |--MSG_SUBMIT-------->|                            |
   |<--MSG_OK------------|                            |
   |                      |<--MSG_READY----------------|
   |                      |--MSG_TASK------------------>|
   |                      |<--MSG_DONE (or MSG_FAILED)--|
   |<--MSG_FAILED---------|  (only on failure; DONE is not forwarded)`}</code>
        </pre>
      </div>
    </div>
  );
}

function OpcodeTable() {
  const rows: [string, string, string][] = [
    ["0x01", "MSG_SUBMIT", "producer → daemon"],
    ["0x02", "MSG_OK", "daemon → producer"],
    ["0x03", "MSG_ERROR", "daemon → producer or worker"],
    ["0x04", "MSG_READY", "worker → daemon"],
    ["0x05", "MSG_DONE", "worker → daemon → producer"],
    ["0x06", "MSG_FAILED", "worker → daemon → producer"],
    ["0x07", "MSG_TASK", "daemon → worker"],
    ["0x08", "MSG_WAIT", "reserved, unused"],
    ["0x09", "MSG_HEARTBEAT", "worker → daemon"],
    ["0x0A", "MSG_PONG", "daemon → worker"],
    ["0x0B", "MSG_STATS", "CLI → daemon (unix socket)"],
    ["0x0C", "MSG_STATS_RESPONSE", "daemon → CLI (unix socket)"],
  ];

  return (
    <Table
      highlight={1}
      headers={["Type", "Name", "Direction"]}
      rows={rows.map(([hex, name, dir]) => [
        <InlineCode key={hex}>{hex}</InlineCode>,
        <span key={name} className="font-[family-name:var(--font-jetbrains-mono)]">
          {name}
        </span>,
        dir,
      ])}
    />
  );
}

function Payload({
  hex,
  name,
  direction,
  layout,
  example,
  extra,
}: {
  hex: string;
  name: string;
  direction: string;
  layout: string;
  example?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      id={`msg-${name.toLowerCase()}`}
      className="scroll-mt-24 rounded-lg border border-quicx-line bg-[#0a1a22] p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-quicx-orange/40 bg-quicx-orange/10 px-2 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] text-quicx-orange-bright">
          {hex}
        </span>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[15px] font-semibold text-quicx-text">
          {name}
        </span>
        <span className="font-[family-name:var(--font-barlow-condensed)] text-[11.5px] uppercase tracking-[0.2em] text-quicx-dim">
          {direction}
        </span>
      </div>
      <pre className="mt-4 overflow-x-auto rounded border border-white/5 bg-[#061219] px-3 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-relaxed text-quicx-text">
        <code>{layout}</code>
      </pre>
      {example && (
        <pre className="mt-3 overflow-x-auto rounded border border-white/5 bg-black/20 px-3 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] leading-relaxed text-quicx-muted">
          <code>{example}</code>
        </pre>
      )}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  );
}

export function BinaryProtocolSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="binary-protocol" />

      <SubHeading id="protocol-participants">Participants &amp; transport</SubHeading>

      <Prose>
        <p>
          Producer and Worker both connect to the <strong>same TCP port</strong> (
          <InlineCode>server_start</InlineCode>, <InlineCode>server.c:233</InlineCode>). There is
          no separate producer port or worker port — a connection starts as{" "}
          <InlineCode>CONN_UNKNOWN</InlineCode> and only becomes{" "}
          <InlineCode>CONN_PRODUCER</InlineCode> or <InlineCode>CONN_WORKER</InlineCode> once the
          daemon sees its first <InlineCode>MSG_SUBMIT</InlineCode> or{" "}
          <InlineCode>MSG_READY</InlineCode>.
        </p>
        <p>
          The CLI (<InlineCode>quicx status</InlineCode>) is a different client on a different
          transport: it connects to a separate Unix socket (
          <InlineCode>/tmp/quicx.sock</InlineCode>) and only ever does one exchange —{" "}
          <InlineCode>MSG_STATS</InlineCode> → <InlineCode>MSG_STATS_RESPONSE</InlineCode>.
        </p>
        <p>
          The daemon is the process in the middle running the event loop; every message below is
          either read by <InlineCode>handle_readable</InlineCode> (<InlineCode>server.c</InlineCode>)
          or written by <InlineCode>daemon_handle_message</InlineCode> (
          <InlineCode>daemon.c</InlineCode>).
        </p>
        <p>
          Connections aren&rsquo;t only producer or worker, either. As of v1.0.3 the TCP
          listener and the Unix listener get their own roles —{" "}
          <InlineCode>CONN_SERVER</InlineCode> and <InlineCode>CONN_CLI</InlineCode> — instead
          of being lumped under <InlineCode>CONN_UNKNOWN</InlineCode> like every other
          not-yet-registered socket.
        </p>
      </Prose>

      <Callout variant="warn" title="Role isn't enforced">
        Nothing ties a connection&rsquo;s registered role to which message types it&rsquo;s
        allowed to send afterward. A connection that already registered as a worker (
        <code>CONN_WORKER</code>) can still send <code>MSG_SUBMIT</code>, and the daemon will
        process it exactly like a producer would.
      </Callout>

      <SubHeading id="protocol-frame-header">Frame header</SubHeading>

      <FrameDiagram />

      <KeyList
        items={[
          {
            term: "version",
            def: "Protocol revision. Currently 0x01. The daemon rejects any other version with MSG_ERROR 0x02 so protocol evolution is additive and opt-in.",
          },
          {
            term: "type",
            def: "Message opcode — one of the 12 types below. The daemon routes on type alone; producers and workers speak the same header shape.",
          },
          {
            term: "length",
            def: "32-bit big-endian unsigned integer: the payload size in bytes. Zero is legal for MSG_READY, MSG_WAIT, MSG_HEARTBEAT, MSG_PONG and MSG_STATS.",
          },
          {
            term: "payload",
            def: (
              <>
                Exactly length bytes, capped at <InlineCode>PROTOCOL_MAX_PAYLOAD</InlineCode> —{" "}
                <strong>1024 bytes</strong> as of v1.0.3 (previously 1 MiB). The cap matches
                the allocator&rsquo;s largest size class, so every accepted payload fits in
                exactly one PMAD block. Oversized frames get a clean{" "}
                <InlineCode>MSG_ERROR</InlineCode> (<InlineCode>ERR_PAYLOAD_TOO_BIG</InlineCode>
                ) instead of being truncated or read past the buffer.
              </>
            ),
          },
        ]}
      />

      <Callout variant="note" title="Message is a tagged union on the daemon side">
        This only affects the daemon&rsquo;s C code, not the bytes on the wire: <code>Message</code>{" "}
        used to be one flat struct carrying every field for every type. It&rsquo;s now{" "}
        <code>type</code> + <code>version</code> + a union of per-type bodies (
        <code>SubmitBody</code>, <code>OkBody</code>, <code>TaskBody</code>, <code>ErrorBody</code>,{" "}
        <code>DoneBody</code>, <code>FailedBody</code>). Field access moved from{" "}
        <code>msg-&gt;task_id</code> to <code>msg-&gt;as.done.task_id</code>.
      </Callout>

      <SubHeading id="protocol-message-types">Message types</SubHeading>

      <OpcodeTable />

      <SubHeading id="payload-formats">Payload formats</SubHeading>

      <div className="space-y-6">
        <Payload hex="0x01" name="MSG_SUBMIT" direction="producer → daemon"
          layout={`[type_len : 1 byte][task_type : type_len bytes][payload : rest of bytes]`}
          example={`type = "send_email"\npayload = {"to":"user@gmail.com"}\nbytes   = [10][send_email][{"to":"user@gmail.com"}]`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Parsed specially in <InlineCode>server.c</InlineCode> — the daemon needs the
              length-prefix byte before it knows how much more to read. On accept, the daemon
              queues a <InlineCode>Task</InlineCode>, tags the connection{" "}
              <InlineCode>CONN_PRODUCER</InlineCode>, replies <InlineCode>MSG_OK</InlineCode>, and
              calls <InlineCode>try_dispach</InlineCode>.
            </p>
          }
        />
        <Payload hex="0x02" name="MSG_OK" direction="daemon → producer"
          layout={`[task_id : 4 bytes]`}
          example={`task_id = 0x00000A42  →  accepted task id = 2626`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Acknowledges that the task was accepted into the queue — not that it ran. Outbound
              only: the daemon never parses an inbound <InlineCode>MSG_OK</InlineCode>.
            </p>
          }
        />
        <Payload hex="0x03" name="MSG_ERROR" direction="daemon → producer or worker"
          layout={`[error_code : 1 byte][message : rest of bytes]`}
          extra={
            <div className="space-y-3">
              <Table
                headers={["Code", "Meaning"]}
                rows={[
                  [<InlineCode key="1">0x01</InlineCode>, "queue full — PMAD pool exhausted"],
                  [<InlineCode key="2">0x02</InlineCode>, "invalid message (bad version / length / type)"],
                  [<InlineCode key="3">0x03</InlineCode>, "payload too large for the largest size class (1024 bytes, as of v1.0.3)"],
                  [<InlineCode key="4">0x04</InlineCode>, "unknown task type"],
                ]}
              />
              <p className="text-[13.5px] leading-relaxed text-quicx-muted">
                Generic failure reply, sent to whichever peer tripped it. Outbound only — if a
                peer ever sent <InlineCode>MSG_ERROR</InlineCode> to the daemon it&rsquo;d fail
                parsing (not a recognized inbound case) and the connection gets closed.
              </p>
            </div>
          }
        />
        <Payload hex="0x04" name="MSG_READY" direction="worker → daemon"
          layout={`(no payload — length = 0)`}
          example={`Sent once per connection, immediately after connect, to register\nthe socket as an idle worker.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Registers the connection (<InlineCode>worker_add</InlineCode>) and tags it{" "}
              <InlineCode>CONN_WORKER</InlineCode>, then calls{" "}
              <InlineCode>try_dispach</InlineCode> in case work is already queued — if a task is
              waiting, <InlineCode>MSG_TASK</InlineCode> follows immediately. There&rsquo;s no ack
              on success; if nothing is queued, the worker just stays blocked reading until a
              task arrives later.
            </p>
          }
        />
        <Payload hex="0x05" name="MSG_DONE" direction="worker → daemon → producer"
          layout={`[task_id : 4 bytes]`}
          example={`Worker reports success for task_id.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              The daemon marks the worker idle, clears <InlineCode>current_fd</InlineCode>, bumps{" "}
              <InlineCode>stats_task_completed</InlineCode>, redispatches, and forwards{" "}
              <InlineCode>protocol_send_done(producer_fd, task_id)</InlineCode> to the producer
              that submitted the task. Parsing is now strict — exactly 4 bytes, or the frame is
              rejected.
            </p>
          }
        />

        <Callout variant="tip" title="Fixed in v1.0.3 — producers now hear about success">
          Until this release, <code>MSG_DONE</code> only updated the daemon&rsquo;s internal
          state — the producer was never told and got silence on a completed task. It now
          receives the same completion signal a failure would have gotten all along.
        </Callout>

        <Payload hex="0x06" name="MSG_FAILED" direction="worker → daemon → producer"
          layout={`[task_id : 4 bytes][reason : rest of bytes, max 64]`}
          example={`reason is a UTF-8 string propagated verbatim to the producer,\nand logged by the daemon.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Worker reports failure with a reason string. The daemon forwards it as-is to the
              producer via <InlineCode>Worker.current_fd</InlineCode> (
              <InlineCode>protocol_send_failed</InlineCode>, <InlineCode>daemon.c:87</InlineCode>
              ), bumps <InlineCode>stats_task_failed</InlineCode>, and redispatches the worker.
              The reason is capped at <InlineCode>PROTOCOL_MAX_FAIL_REASON_MSG</InlineCode> (64
              bytes), validated against the buffer bound, and NUL-terminated by the daemon
              before forwarding.
            </p>
          }
        />
        <Payload hex="0x07" name="MSG_TASK" direction="daemon → worker"
          layout={`[task_id : 4 bytes][type_len : 1 byte][task_type : type_len bytes][payload : rest]`}
          example={`Mirror of MSG_SUBMIT with the task id prepended. The worker dispatches\nby type and replies with MSG_DONE or MSG_FAILED carrying the same id.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Sent by <InlineCode>try_dispach</InlineCode> (<InlineCode>dispacher.c:22</InlineCode>
              ) when a queued task is handed to an idle worker.
            </p>
          }
        />
        <Payload hex="0x08" name="MSG_WAIT" direction="reserved, unused"
          layout={`(no payload — length = 0)`}
          example={`Defined and accepted by server.c's parser, but daemon_handle_message\nhas no case for it — falls through to default → ERR_UNKNOWN_TYPE.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Nothing in production code calls <InlineCode>protocol_send_wait</InlineCode> either.
              Effectively dead in the current build.
            </p>
          }
        />

        <Callout variant="warn" title="MSG_WAIT was never wired up">
          This looks like a planned &ldquo;no work right now, hold on&rdquo; signal that was
          never finished. A worker that registers with no task queued doesn&rsquo;t get an
          explicit wait reply — it just stays blocked until <code>MSG_TASK</code> arrives later.
        </Callout>

        <Payload hex="0x09" name="MSG_HEARTBEAT" direction="worker → daemon"
          layout={`(no payload — length = 0)`}
          example={`Liveness probe sent by the worker. The daemon immediately replies\nMSG_PONG on the same fd.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              <InlineCode>PROTOCOL_TIMEOUT_MS</InlineCode> and{" "}
              <InlineCode>PROTOCOL_HEARTBEAT_MS</InlineCode> are defined, but nothing actually
              tracks last-heartbeat time to drop stale connections — the daemon only responds to
              heartbeats, it doesn&rsquo;t enforce the timeout itself.
            </p>
          }
        />
        <Payload hex="0x0A" name="MSG_PONG" direction="daemon → worker"
          layout={`(no payload — length = 0)`}
          example={`The only valid reply to MSG_HEARTBEAT.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Outbound only, like <InlineCode>MSG_OK</InlineCode> /{" "}
              <InlineCode>MSG_ERROR</InlineCode> — the daemon has no inbound case for it.
            </p>
          }
        />
        <Payload hex="0x0B" name="MSG_STATS" direction="CLI → daemon (unix socket)"
          layout={`(no payload — length = 0)`}
          example={`Request for pool / queue / PMAD stats.`}
          extra={
            <p className="text-[13.5px] leading-relaxed text-quicx-muted">
              Sent over the Unix socket at <InlineCode>/tmp/quicx.sock</InlineCode> — not the TCP
              port producers and workers use. <InlineCode>quicx status</InlineCode> is the only
              sender.
            </p>
          }
        />
        <Payload hex="0x0C" name="MSG_STATS_RESPONSE" direction="daemon → CLI (unix socket)"
          layout={`[StatsHeader : 73 bytes, packed, network order][StatsClass : repeated class_count times]`}
          extra={
            <div className="space-y-3">
              <Table
                headers={["Block", "Contents"]}
                rows={[
                  [
                    "StatsHeader",
                    "idle / busy worker counts, workers_registered (ever registered, not just live), queue depth, submitted / completed / failed task counters, uptime, pool_size, usable_bytes, used_bytes, and class_count",
                  ],
                  [
                    "StatsClass × class_count",
                    "one block per PMAD size class — that class's allocator stats",
                  ],
                ]}
              />
              <p className="text-[13.5px] leading-relaxed text-quicx-muted">
                <InlineCode>_Static_assert(sizeof(StatsHeader) == 73)</InlineCode> locks the
                layout. <InlineCode>class_count</InlineCode> is a <InlineCode>uint8_t</InlineCode>{" "}
                with no byte-swap — it used to be a <InlineCode>uint32_t</InlineCode> sent
                through <InlineCode>htonl</InlineCode>, with the daemon and the reader each
                hardcoding a different, mismatched cap (32 and 16) on how many classes they&rsquo;d
                parse.
              </p>
            </div>
          }
        />
      </div>

      <Callout variant="warn" title="Stats wire format is incompatible with v1.0.2">
        <code>StatsHeader</code> grew from 48 to 73 bytes in v1.0.3. A v1.0.3{" "}
        <code>quicx status</code> talking to a v1.0.2 daemon (or the reverse) degrades
        gracefully — it detects the length mismatch and prints{" "}
        <code>daemon speaks a different stats format — restart the daemon to match</code> rather
        than misparsing the response. Keep the CLI and the daemon on the same release.
      </Callout>

      <SubHeading id="protocol-flow">End-to-end flow</SubHeading>

      <FlowDiagram />
    </section>
  );
}
