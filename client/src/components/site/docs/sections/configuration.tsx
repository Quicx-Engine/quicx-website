import Link from "next/link";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";

export function ConfigurationSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="configuration" />

      <CodeBlock
        filename="quicx.conf"
        language="conf"
        code={`# Quicx config — built-in default (no --config needed)
[server]
port = 16381

[allocator]
pool_size = 8388608
class = 16,2     # Connection — bounded by MAX_CONNECTIONS
class = 32,2     # Worker — bounded by MAX_CONNECTIONS
class = 48,1
class = 64,12    # Task — queue depth is uncapped, so this class IS the queue depth
class = 80,1
class = 96,1
# ... every other class up to 1024B keeps a 1% floor ...
# ... leftover percentage points are folded into the widest classes ...
class = 1008,1
class = 1024,1`}
      />

      <Callout variant="note" title="Default configuration">
        This is the built-in default as of v1.0.3. When you run{" "}
        <InlineCode>quicx start</InlineCode> without a{" "}
        <InlineCode>--config</InlineCode> flag, the daemon uses these exact values — no file
        needed to get started: an 8 MiB pool split into all 64 exact-fit size classes from 16
        bytes to 1024 bytes, in 16-byte steps.
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
                is <InlineCode>8388608</InlineCode> (8 MiB), up from 1 MiB before v1.0.3. The
                allocator never grows past this number — if you exhaust it, new{" "}
                <InlineCode>MSG_SUBMIT</InlineCode> frames are rejected with{" "}
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
                refuses to start. <strong>SIZE</strong> may not exceed{" "}
                <InlineCode>1024</InlineCode> bytes and at most <InlineCode>64</InlineCode>{" "}
                classes may be declared — both hard ceilings in the allocator as of v1.0.3.
              </>
            ),
          },
        ]}
      />

      <Callout variant="note" title="Why the default split is weighted, not flat">
        A percentage buys bytes, not blocks — 1% of the 8 MiB default pool is 2,620 blocks at
        16B but only 80 at 1024B. So the split isn&rsquo;t even: <InlineCode>64B</InlineCode>{" "}
        gets <InlineCode>12%</InlineCode> (the <strong>Task</strong> class — queue depth is
        uncapped, so this class <em>is</em> the queue depth), <InlineCode>16B</InlineCode> and{" "}
        <InlineCode>32B</InlineCode> get <InlineCode>2%</InlineCode> each (
        <strong>Connection</strong> and <strong>Worker</strong>, both bounded by{" "}
        <InlineCode>MAX_CONNECTIONS</InlineCode>), and every remaining class keeps a{" "}
        <InlineCode>1%</InlineCode> floor — at <InlineCode>0%</InlineCode> a class would be
        carved zero blocks and every allocation of that size would fail outright. Leftover
        percentage points are folded into the widest classes, which lifts the worst-off class
        the most. At the default 8 MiB pool, no payload class holds fewer than{" "}
        <strong>124 blocks</strong> — all computed before the daemon accepts its first
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
            <InlineCode key="b">128, 512, 1024</InlineCode>,
            "Wide spread within the 1024-byte ceiling — weight the biggest class heaviest.",
          ],
          [
            "Uniform binary blobs",
            <InlineCode key="c">one class at 100 %</InlineCode>,
            "Zero internal fragmentation. Highest throughput — see the PMAD benchmarks.",
          ],
        ]}
      />

      <Callout variant="warn" title="Validation is strict on purpose">
        If <InlineCode>pool_size</InlineCode> is not a multiple of every declared class size, if
        the percentages don&rsquo;t sum to 100, if a class exceeds 1024 bytes, or if more than
        64 classes are declared, the daemon exits with a precise error pointing at the
        offending line. This is deliberate — Quicx refuses to start in a
        &ldquo;mostly-correct&rdquo; state.
      </Callout>
    </section>
  );
}
