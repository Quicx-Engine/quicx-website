import React from "react";
import {
  SectionHeader,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";

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

function OpcodeTable() {
  const rows: [string, string, string][] = [
    ["0x01", "MSG_SUBMIT", "producer → daemon"],
    ["0x02", "MSG_OK", "daemon → producer"],
    ["0x03", "MSG_ERROR", "daemon → producer"],
    ["0x04", "MSG_READY", "worker → daemon"],
    ["0x05", "MSG_TASK", "daemon → worker"],
    ["0x06", "MSG_DONE", "worker → daemon"],
    ["0x07", "MSG_FAILED", "worker → daemon"],
    ["0x08", "MSG_WAIT", "daemon → worker"],
    ["0x09", "MSG_HEARTBEAT", "either direction"],
    ["0x0A", "MSG_PONG", "either direction"],
    ["0x0B", "MSG_STATS", "monitor → daemon"],
    ["0x0C", "MSG_STATS_RESPONSE", "daemon → monitor"],
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
      <SectionHeader
        num="§ 02.03"
        kicker="Core Concepts"
        title="Binary Protocol"
        id="binary-protocol"
        lede="Every frame on the wire is a 6-byte header followed by a variable-length payload. No framing ambiguity, no partial reads, no text encoding — parsing is a couple of pointer reads."
      />

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
            def: "Message opcode — one of the 11 types below. The daemon routes on type alone; producers and workers speak the same header shape.",
          },
          {
            term: "length",
            def: "32-bit big-endian unsigned integer: the payload size in bytes. Zero is legal for MSG_READY, MSG_WAIT, MSG_HEARTBEAT, MSG_PONG and MSG_STATS.",
          },
          {
            term: "payload",
            def: "Exactly length bytes. The per-type layouts below are the full contract — there is no escaping, no delimiters and no padding.",
          },
        ]}
      />

      <SubHeading id="protocol-message-types">Message types</SubHeading>

      <OpcodeTable />

      <SubHeading id="payload-formats">Payload formats</SubHeading>

      <div className="space-y-6">
        <Payload hex="0x01" name="MSG_SUBMIT" direction="producer → daemon"
          layout={`[type_len : 1 byte][type : type_len bytes][payload : rest of bytes]`}
          example={`type = "send_email"\npayload = {"to":"user@gmail.com"}\nbytes   = [10][send_email][{"to":"user@gmail.com"}]`}
        />
        <Payload hex="0x02" name="MSG_OK" direction="daemon → producer"
          layout={`[task_id : 4 bytes]`}
          example={`task_id = 0x00000A42  →  accepted task id = 2626`}
        />
        <Payload hex="0x03" name="MSG_ERROR" direction="daemon → producer"
          layout={`[error_code : 1 byte][message : rest of bytes]`}
          extra={
            <Table
              headers={["Code", "Meaning"]}
              rows={[
                [<InlineCode key="1">0x01</InlineCode>, "queue full — PMAD pool exhausted"],
                [<InlineCode key="2">0x02</InlineCode>, "invalid message (bad version / length / type)"],
                [<InlineCode key="3">0x03</InlineCode>, "payload too large for the largest size class"],
                [<InlineCode key="4">0x04</InlineCode>, "unknown task type"],
              ]}
            />
          }
        />
        <Payload hex="0x04" name="MSG_READY" direction="worker → daemon"
          layout={`(no payload — length = 0)`}
          example={`Sent once per connection, immediately after connect, to register\nthe socket as an idle worker. The daemon replies with MSG_TASK or\nMSG_WAIT.`}
        />
        <Payload hex="0x05" name="MSG_TASK" direction="daemon → worker"
          layout={`[task_id : 4 bytes][type_len : 1 byte][type : type_len bytes][payload : rest]`}
          example={`Mirror of MSG_SUBMIT with the task id prepended. The worker dispatches\nby type and replies with MSG_DONE or MSG_FAILED carrying the same id.`}
        />
        <Payload hex="0x06" name="MSG_DONE" direction="worker → daemon"
          layout={`[task_id : 4 bytes]`}
          example={`Confirms successful completion. The daemon frees the task slot back\nto PMAD before responding to any producer waiting on this id.`}
        />
        <Payload hex="0x07" name="MSG_FAILED" direction="worker → daemon"
          layout={`[task_id : 4 bytes][reason : rest of bytes]`}
          example={`reason is a UTF-8 string propagated verbatim to producers that\nobserve the task, and logged by the daemon.`}
        />
        <Payload hex="0x08" name="MSG_WAIT" direction="daemon → worker"
          layout={`(no payload — length = 0)`}
          example={`Sent in place of MSG_TASK when the queue is empty. The worker keeps\nthe socket open and issues another MSG_READY after a short backoff.`}
        />
        <Payload hex="0x09" name="MSG_HEARTBEAT" direction="both directions"
          layout={`(no payload — length = 0)`}
          example={`Liveness probe. Either side may send it; the receiver replies with\nMSG_PONG. Intended for long-idle worker sockets behind stateful\nload balancers.`}
        />
        <Payload hex="0x0A" name="MSG_PONG" direction="both directions"
          layout={`(no payload — length = 0)`}
          example={`The only valid reply to MSG_HEARTBEAT. Shape-symmetric with\nMSG_HEARTBEAT for trivial framing.`}
        />
        <Payload hex="0x0B" name="MSG_STATS" direction="monitor → daemon"
          layout={`(no payload — length = 0)`}
          example={`Requests a one-shot metrics snapshot. The daemon responds with\nMSG_STATS_RESPONSE.`}
        />
        <Payload hex="0x0C" name="MSG_STATS_RESPONSE" direction="daemon → monitor"
          layout={`[queue_depth : 4 bytes][workers_total : 4 bytes][workers_idle : 4 bytes][pmad_bytes_used : 8 bytes][pmad_bytes_total : 8 bytes]`}
          example={`All integers are big-endian. The 28-byte body is a fixed shape so\ndashboards can parse it without a schema.`}
        />
      </div>
    </section>
  );
}
