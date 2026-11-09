import Image from "next/image";
import Link from "next/link";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";

export function AllocatorSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="allocator" />

      <Prose>
        <p>
          Quicx 2.0 keeps its promise — one budget, mapped once, never exceeded — and changes
          what happens inside it. Up to 1.0.4 the budget was split between block sizes by fixed
          percentages (PMAD), decided before the first task arrived. apool lets the traffic
          decide instead: the diagram below follows one page, page 4, through every part of it.
        </p>
      </Prose>

      <SubHeading id="allocator-architecture">Architecture</SubHeading>

      <div className="relative overflow-hidden rounded-[3px] border border-quicx-line bg-quicx-well">
        <Image
          src="/apool-architecture.png"
          alt="apool v2 allocator diagram: one mapping of 508 pages of 16 KiB followed by 32-byte page records; size classes own lists of pages; freed blocks inside a page form an encoded free list; empty pages stay warm, then give their memory back to the OS."
          width={3840}
          height={2160}
          sizes="(min-width: 1024px) 860px, 100vw"
          className="h-auto w-full"
        />
      </div>

      <KeyList
        items={[
          {
            term: "One mapping",
            def: (
              <>
                The budget is one <InlineCode>mmap</InlineCode> at startup, never grown or
                moved: 508 pages of 16 KiB, then one 32-byte record per page. Pages come first,
                so every page starts on an OS page boundary and can be given back.
              </>
            ),
          },
          {
            term: "No block headers",
            def: (
              <>
                A block&rsquo;s page is <InlineCode>(address − start) / 16 KiB</InlineCode>, and
                that page&rsquo;s record holds everything else: the size it serves, how many
                blocks are live, its free list and its bump offset. A 100 B request costs a
                112 B block, nothing more.
              </>
            ),
          },
          {
            term: "Pages per size",
            def: (
              <>
                68 sizes, 16 B to 1,088 B in steps of 16. A size takes a free page only when
                it has no room left, and a page whose last block is freed goes back to a shared
                list where any size can take it next. Live blocks never move.
              </>
            ),
          },
          {
            term: "Inside a page",
            def: (
              <>
                Freed blocks form a list through their own first 8 bytes; blocks never used
                yet are handed out from a bump offset. Both are O(1).
              </>
            ),
          },
          {
            term: "One block per task",
            def: (
              <>
                A task is the 64 B <InlineCode>Task</InlineCode> record with its payload right
                behind it — one allocation, one free, freed the moment{" "}
                <InlineCode>MSG_TASK</InlineCode> is sent. Connections and workers come from a
                separate 3-page control pool, so a full task pool can never lock a worker out.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="allocator-features">Ideas from the literature</SubHeading>

      <Prose>
        <p>
          Every idea in apool v2 comes from a published allocator and sits behind its own
          switch, so its effect could be measured on its own. Each one can be turned on or off
          in the <Link href="/docs/configuration">[allocator] section</Link> of{" "}
          <InlineCode>quicx.conf</InlineCode>.
        </p>
      </Prose>

      <Table
        headers={["Feature", "Idea from", "What it buys", "Default"]}
        rows={[
          ["Pages move between sizes", "slab allocator (Bonwick 1994), mimalloc, memcached", "46,593 tasks of 100 B instead of 655; follows size changes without a restart", "always"],
          ["Reserve", "Linux zone watermarks, memcached", "after a flood of one size, a new size still gets room (16 tasks of 900 B instead of 0); costs 1.4 % of capacity", "on"],
          ["Hardening", "mimalloc secure mode", "free-list links XOR-encoded with a per-pool key; double frees and overwritten links are caught; about 1 ns per task (M4 Pro)", "on"],
          ["Purge with a warm list", "jemalloc, mimalloc", "beyond 63 empty pages the oldest gives its memory back to the OS; 1,104 KB held after a drain instead of 8,096 KB", "on"],
          ["Lifetime classes", "LLAMA (Maas et al. 2020)", "long-lived blocks get their own pages; 7,648 instead of 16 tasks fit after a pinning pattern — when a caller passes a hint", "available, unused"],
          ["Fullest page first", "Hoard (Berger et al. 2000)", "measured: no gain on queue traffic, 5 ns slower per task", "off"],
        ]}
      />

      <SubHeading id="allocator-benchmarks">Benchmarks</SubHeading>

      <Prose>
        <p>
          The allocator on its own, with the same workloads on PMAD, the first adaptive pool and
          apool v2, on the default 8 MiB. Capacity and the queue depths are identical on the
          Apple M4 Pro and the Intel i3-2100; the time per task is the median of 5 runs.
        </p>
      </Prose>

      <Table
        headers={["", "PMAD (1.0.4)", "apool v1", "apool v2"]}
        rows={[
          ["100 B tasks that fit", "655", "47,450", "46,872"],
          ["900 B after a flood of 40 B", "180", "0", "16"],
          ["900 B with 1 in 20 tasks pinned", "180", "0", "7,648"],
          ["deepest mixed FIFO queue", "5,312", "30,720", "29,952"],
          ["ns per task, M4 Pro", "13.3", "24.9", "14.8"],
          ["ns per task, i3-2100", "43.3", "103.3", "72.8"],
        ]}
      />

      <Callout variant="perf" title="What these numbers mean for the daemon">
        PMAD&rsquo;s fixed lists are still the fastest per allocation. A round trip through the
        daemon takes tens of microseconds, though, and the allocator&rsquo;s share of it is
        nanoseconds: throughput and latency are the same for 1.0.4 and 2.0 on both machines (
        <Link href="/docs/benchmarks">Benchmarks</Link>). What changed is how much fits and
        how much memory stays in use.
      </Callout>

      <SubHeading id="allocator-tuning">Settings</SubHeading>

      <Prose>
        <p>
          The defaults are the measured best: 16 KiB pages (4–64 KiB were compared), 63 warm
          pages and 7 reserved pages at the default budget. <InlineCode>warm_pages</InlineCode>{" "}
          and <InlineCode>reserve_pages</InlineCode> in <InlineCode>quicx.conf</InlineCode>{" "}
          override the last two; the page size is fixed at build time.
        </p>
      </Prose>
    </section>
  );
}
