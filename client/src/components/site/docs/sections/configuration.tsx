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
import { CAPACITY_CHECK } from "@/lib/benchmarks";

export function ConfigurationSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="configuration" />

      <CodeBlock
        filename="quicx.conf"
        language="conf"
        code={`# quicx.conf: every key is optional; these are the built-in defaults
[server]
port = 16381            # TCP port for producers and workers

[memory]
pool_size = 8M          # the whole budget, never exceeded (K, M, G)

[allocator]
reserve       = on      # last free pages only for sizes that own none
hardening     = on      # encoded free lists; double frees caught
purge         = on      # empty pages give memory back after a burst
fullest_first = off     # Hoard's idea; no gain on queue traffic
warm_pages    = auto    # empty pages kept before purging (1/8)
reserve_pages = auto    # pages the reserve holds back (1/64)
admission     = value   # when full: refuse, oldest or value`}
      />

      <Callout variant="note" title="Default configuration">
        Running <InlineCode>quicx start</InlineCode> without <InlineCode>--config</InlineCode>{" "}
        gives exactly the file above. Order of precedence: the built-in defaults, then the
        file, then the command line. <InlineCode>--port</InlineCode> always wins.
      </Callout>

      <Prose>
        <p>On start, the daemon prints what it is running with:</p>
      </Prose>

      <CodeBlock
        filename="quicx start"
        language="text"
        code={`config loaded: /etc/quicx/quicx.conf
quicx v2.1.0 starting
  port:    16381
  pool:    8388608 bytes, 16 KiB pages given to block sizes on demand
  apool:   reserve, hardening, purge
  pages:   508 for tasks (63 kept warm, 7 reserved), 3 for connections and workers`}
      />

      <SubHeading id="server-block">[server]</SubHeading>

      <KeyList
        items={[
          {
            term: "port",
            def: (
              <>
                TCP port the daemon binds to, 1–65535. Producers and workers both dial the same
                port, and the first message they send decides the routing (
                <InlineCode>MSG_SUBMIT</InlineCode> vs <InlineCode>MSG_READY</InlineCode>).
                Default: <InlineCode>16381</InlineCode>.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="memory-block">[memory]</SubHeading>

      <KeyList
        items={[
          {
            term: "pool_size",
            def: (
              <>
                The whole memory budget, mapped once with <InlineCode>mmap</InlineCode> at
                startup and never grown. Bytes, or with a <InlineCode>K</InlineCode>,{" "}
                <InlineCode>M</InlineCode> or <InlineCode>G</InlineCode> suffix (1024-based;{" "}
                <InlineCode>8MB</InlineCode> is refused as ambiguous). Default{" "}
                <InlineCode>8M</InlineCode>. Three pages of it hold connections and workers, the
                rest holds tasks; when it is full, new <InlineCode>MSG_SUBMIT</InlineCode> frames
                get <InlineCode>MSG_ERROR&nbsp;0x01&nbsp;(queue full)</InlineCode>.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="capacity">How many tasks fit</SubHeading>

      <Prose>
        <p>
          Every task takes a known amount of memory, so the capacity of a budget can be worked
          out before the daemon starts. A task is a 64-byte record plus its payload, rounded up
          to 16 bytes. A 16 KiB page holds as many of those blocks as fit whole. Three pages hold
          connections and workers, each page has a 32-byte record, and 1/64 of the task pages are
          kept for a size that has none yet.
        </p>
      </Prose>

      <CodeBlock
        filename="capacity"
        language="text"
        code={`block      = ceil((64 + payload) / 16) * 16
per page   = floor(16384 / block)
task pages = pool / 16 KiB - 3 - (one page of records per 512)
tasks      = (task pages - task pages / 64) * per page`}
      />

      <Table
        headers={["pool_size", "payload", "calculated", "measured"]}
        rows={CAPACITY_CHECK.map((r) => [r.budget, r.payload, r.predicted, r.measured])}
      />

      <Prose>
        <p>
          A worked example: a camera makes 30 frames a second and a model analyses 10, so 20
          more wait every second. Each task carries a 48-byte frame reference and takes a
          112-byte block. If 64 MB is set aside for waiting frames of about 50 KB, about 1,300
          frames can wait. <InlineCode>pool_size = 208K</InlineCode> holds exactly 1,314 tasks,
          the queue itself costs 208 KB, and it fills in about 65 seconds. From then on the
          camera gets <InlineCode>ERROR 0x01</InlineCode> and skips frames instead of the
          device running out of memory.
        </p>
      </Prose>

      <SubHeading id="allocator-block">[allocator]</SubHeading>

      <Prose>
        <p>
          Switches for the features of <Link href="/docs/allocator">apool v2</Link>, each taken
          from a published allocator and measured on its own. The defaults are the measured
          best for a task queue; change them to trade capacity, safety or memory against each
          other.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "reserve = on | off",
            def: (
              <>
                With <InlineCode>reserve_pages</InlineCode> or fewer pages free, only a size that
                owns no page yet may take one, so a flood of one size cannot lock every other
                size out. Costs about 1.4 % of capacity.
              </>
            ),
          },
          {
            term: "hardening = on | off",
            def: (
              <>
                Free-list links are XOR-encoded with a per-pool key; an overwritten link is
                caught before it is followed and a double free is refused and counted. About
                1 ns per task on an Apple M4 Pro, 13 ns on a 2011 Intel i3.
              </>
            ),
          },
          {
            term: "purge = on | off",
            def: (
              <>
                Empty pages are reused newest first; beyond <InlineCode>warm_pages</InlineCode>{" "}
                of them, the oldest gives its memory back to the OS. Off keeps the memory of the
                biggest burst for the life of the process.
              </>
            ),
          },
          {
            term: "fullest_first = on | off",
            def: (
              <>
                Allocate from the fullest page of a size first, so emptier pages drain. Off by
                default: queue traffic frees in arrival order, so pages drain on their own and
                the extra bookkeeping only costs time.
              </>
            ),
          },
          {
            term: "warm_pages = auto | N",
            def: (
              <>
                Empty pages kept backed and ready before purging starts.{" "}
                <InlineCode>auto</InlineCode> is 1/8 of the pages (63 at 8 MiB). Needs{" "}
                <InlineCode>purge = on</InlineCode>.
              </>
            ),
          },
          {
            term: "reserve_pages = auto | N",
            def: (
              <>
                Pages the reserve holds back. <InlineCode>auto</InlineCode> is 1/64 of the pages
                (7 at 8 MiB). Needs <InlineCode>reserve = on</InlineCode>.
              </>
            ),
          },
          {
            term: "admission = refuse | oldest | value",
            def: (
              <>
                What a full budget does with a new task. <InlineCode>refuse</InlineCode> answers{" "}
                <InlineCode>ERROR 0x01</InlineCode>. <InlineCode>oldest</InlineCode> evicts the
                oldest waiting task. <InlineCode>value</InlineCode> (default) evicts the oldest task
                of the lowest value level below the new one, and only when its memory fits the new
                task: the same block size, or the last block of a page. Tasks sent with{" "}
                <InlineCode>MSG_SUBMIT_VALUED</InlineCode> carry a level from 0 to 15; plain ones
                are level 8, so with plain SUBMITs <InlineCode>value</InlineCode> behaves like{" "}
                <InlineCode>refuse</InlineCode>. Level 15 is never evicted. Results:{" "}
                <Link href="/docs/benchmarks#when-full">Benchmarks</Link>.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="upgrading">Upgrading from 1.x</SubHeading>

      <Prose>
        <p>
          A 1.x file still loads. Its <InlineCode>class = SIZE,PCT</InlineCode> lines laid out
          the old fixed size classes; apool sizes itself, so they are ignored with a note, and{" "}
          <InlineCode>pool_size</InlineCode> is still read under <InlineCode>[allocator]</InlineCode>.
          Nothing about the pool needs tuning per workload any more.
        </p>
      </Prose>

      <Callout variant="warn" title="Validation is strict on purpose">
        An unknown section or key, a key in the wrong section, or a value that cannot be used
        stops the daemon with the file and the line, for example{" "}
        <InlineCode>quicx.conf:14: purge must be on or off, not &apos;sometimes&apos;</InlineCode>.
        A typo never silently falls back to a default.
      </Callout>
    </section>
  );
}
