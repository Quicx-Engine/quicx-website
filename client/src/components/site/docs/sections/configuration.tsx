import Link from "next/link";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeader,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";

export function ConfigurationSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 01.03"
        kicker="Getting Started"
        title="Configuration"
        id="configuration"
        lede="A Quicx daemon reads its entire runtime shape from a single quicx.conf file. Every number is exact — block counts, pool share, port — and is resolved before a byte of task traffic moves."
      />

      <CodeBlock
        filename="quicx.conf"
        language="conf"
        code={`# Quicx config
[server]
port = 16381

[allocator]
pool_size = 1048576
class = 32,10
class = 64,25
class = 128,25
class = 256,20
class = 512,12
class = 1024,8`}
      />

      <Callout variant="note" title="Default configuration">
        This is the built-in default. When you run{" "}
        <InlineCode>quicx start</InlineCode> without a{" "}
        <InlineCode>--config</InlineCode> flag, the daemon uses these exact values — no file
        needed to get started.
      </Callout>

      <SubHeading id="server-block">[server]</SubHeading>

      <KeyList
        items={[
          {
            term: "port",
            def: (
              <>
                TCP port the daemon binds to. Producers and workers both dial the same port —
                routing is decided by the first message they send (
                <InlineCode>MSG_SUBMIT</InlineCode> vs <InlineCode>MSG_READY</InlineCode>).
                Default: <InlineCode>16381</InlineCode>.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="allocator-block">[allocator]</SubHeading>

      <Prose>
        <p>
          The <InlineCode>allocator</InlineCode> block is parsed directly into the{" "}
          <Link href="/docs/pmad-allocator">PMAD</Link> initializer. You own every byte of the pool —
          no hidden reserves, no growth. All arithmetic is performed at startup so the daemon
          either boots with the layout you asked for or refuses to start.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "pool_size",
            def: (
              <>
                Total bytes reserved via a single <InlineCode>mmap</InlineCode> call. Default
                is <InlineCode>1048576</InlineCode> (1 MiB). The allocator never grows past
                this number — if you exhaust it, new <InlineCode>MSG_SUBMIT</InlineCode>{" "}
                frames are rejected with{" "}
                <InlineCode>MSG_ERROR&nbsp;0x01&nbsp;(queue full)</InlineCode>.
              </>
            ),
          },
          {
            term: "class = SIZE,PCT",
            def: (
              <>
                Declares one size class: <strong>SIZE</strong> is the block size in bytes,{" "}
                <strong>PCT</strong> is the percentage of the pool that belongs to that class.
                Declare the classes in ascending <strong>SIZE</strong> order. The percentages
                must sum to <InlineCode>100</InlineCode>; if they don&rsquo;t, the daemon
                refuses to start.
              </>
            ),
          },
        ]}
      />

      <Callout variant="note" title="How the example pool is carved up">
        <InlineCode>pool_size = 1 MiB</InlineCode> with the six classes above resolves to
        exactly <InlineCode>3 276 · 32B</InlineCode> +{" "}
        <InlineCode>4 096 · 64B</InlineCode> + <InlineCode>2 048 · 128B</InlineCode> +{" "}
        <InlineCode>819 · 256B</InlineCode> + <InlineCode>245 · 512B</InlineCode> +{" "}
        <InlineCode>82 · 1024B</InlineCode> — all computed before the daemon accepts its first
        connection.
      </Callout>

      <SubHeading id="tuning-rules">Tuning rules of thumb</SubHeading>

      <Table
        headers={["Workload", "Recommended shape", "Why"]}
        rows={[
          [
            "Short JSON payloads (webhooks, emails)",
            <InlineCode key="a">32, 64, 128</InlineCode>,
            "Most MSG_SUBMIT frames land between 40–120 bytes; three tight classes eat the long tail with <5 % slack.",
          ],
          [
            "Mixed media (thumbnails, ML prompts)",
            <InlineCode key="b">128, 512, 2048</InlineCode>,
            "Two orders of magnitude spread — weight the biggest class heaviest.",
          ],
          [
            "Uniform binary blobs",
            <InlineCode key="c">one class at 100 %</InlineCode>,
            "Zero internal fragmentation. Highest throughput — see the PMAD benchmarks.",
          ],
        ]}
      />

      <Callout variant="warn" title="Validation is strict on purpose">
        If <InlineCode>pool_size</InlineCode> is not a multiple of every declared class size,
        or if the percentages don&rsquo;t sum to 100, the daemon exits with a precise error
        pointing at the offending line. This is deliberate — Quicx refuses to start in a
        &ldquo;mostly-correct&rdquo; state.
      </Callout>
    </section>
  );
}
