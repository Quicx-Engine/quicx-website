import Image from "next/image";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";

export function PmadSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="pmad-allocator" />

      <Prose>
        <p>
          PMAD pre-allocates a contiguous pool of memory with a single{" "}
          <InlineCode>mmap</InlineCode> call at startup, then partitions it into user-defined
          size classes. Standard allocators (ptmalloc, jemalloc v5.3, tcmalloc v2026) optimise
          for average-case throughput — PMAD optimises for{" "}
          <strong>worst-case determinism</strong> and predictable latency budgets.
        </p>
      </Prose>

      <Table
        headers={["Domain", "Why PMAD fits"]}
        rows={[
          ["Real-time systems", "Guaranteed O(1) response — no lock contention, no syscalls at runtime"],
          ["Embedded / RTOS", "Minimal footprint, no heap fragmentation, fully configurable memory layout"],
          ["Game engines", "Predictable frame-time budgets with zero allocation jitter"],
          ["High-frequency trading", "Nanosecond-class allocation latency under sustained throughput"],
        ]}
      />

      <SubHeading id="pmad-architecture">Architecture</SubHeading>

      <Prose>
        <p>
          Every allocation is a single lookup-table index followed by a free-list pop. Every
          deallocation is a free-list push keyed by the block&rsquo;s own header. Both
          operations have no conditional branch paths — the fast path <em>is</em> the only
          path.
        </p>
      </Prose>

      <div className="relative overflow-hidden rounded-2xl border border-quicx-line bg-white p-4 sm:p-6">
        <Image
          src="/pmad-architecture.svg"
          alt="PMAD — Pool-based Memory Allocator architecture overview"
          width={1920}
          height={1760}
          className="h-auto w-full"
          priority={false}
        />
      </div>

      <KeyList
        items={[
          {
            term: "Public API",
            def: (
              <>
                The thin facade in <InlineCode>incPMAD.h</InlineCode> —{" "}
                <InlineCode>pmad_init</InlineCode>, <InlineCode>pmad_alloc</InlineCode>,{" "}
                <InlineCode>pmad_free</InlineCode>, <InlineCode>pmad_destroy</InlineCode>.
                This is the entire contract the daemon consumes.
              </>
            ),
          },
          {
            term: "Size Class Table",
            def: (
              <>
                A flat array <InlineCode>[MAX_SIZE / ALIGNMENT]</InlineCode> maps a requested
                byte-count directly to the correct size-class descriptor — an O(1) table
                lookup, no branches.
              </>
            ),
          },
          {
            term: "Free Lists",
            def: (
              <>
                Each size class owns a singly-linked intrusive free list. A pop is a pointer
                dereference; a push is a pointer swap. No atomics on the fast path — the
                daemon serialises through its own router, so locks are structurally
                unnecessary.
              </>
            ),
          },
          {
            term: "Memory Pool",
            def: (
              <>
                One <InlineCode>mmap</InlineCode> region split into contiguous runs of blocks,
                one run per class, sized by the user percentages. Each block carries a 16-byte{" "}
                <InlineCode>BlockHeader</InlineCode> (<InlineCode>next</InlineCode> pointer +
                class ID) so deallocations need no external metadata.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="pmad-benchmarks">Benchmarks</SubHeading>

      <Prose>
        <p>
          Measured on Apple Silicon (<InlineCode>-O3 -march=native</InlineCode>). Full
          benchmark source and reproduction instructions are available on{" "}
          <a href="https://github.com/anastassow/PMAD">github.com/anastassow/PMAD</a>.
        </p>
      </Prose>

      <Table
        headers={["Metric", "Value"]}
        rows={[
          ["P50 allocation latency", <strong key="p50">2.59 ns</strong>],
          ["P99.9 allocation latency", "6.50 ns"],
          ["Latency vs block size", "Flat — 2.59 ns P50 from 16B to 4096B (O(1) guarantee, demonstrated)"],
          ["Peak throughput", "748.9 Mops/s @ 16B · 690.6 Mops/s @ 64B"],
          ["Worst-case under churn (1024B)", "~40 µs (system allocator: 6.95 ms)"],
          ["Fragmentation", "0 %"],
          ["Runtime syscalls", "Zero"],
          ["Correctness", "19/19 tests pass"],
        ]}
      />

      <SubHeading id="pmad-configurations">Reference configurations</SubHeading>

      <Table
        headers={["Profile", "Size classes (B)", "Split (%)", "Suitability"]}
        rows={[
          ["Max throughput", <InlineCode key="a">{"{16}"}</InlineCode>, "100", "Small-object velocity"],
          ["Min overhead", <InlineCode key="b">{"{4096}"}</InlineCode>, "100", "Bulk data density"],
          ["Balanced", <InlineCode key="c">{"{64, 256, 1024}"}</InlineCode>, "60 / 30 / 10", "Mixed workloads"],
          ["Latency-optimised", <InlineCode key="d">{"{32, 128}"}</InlineCode>, "80 / 20", "Critical signalling"],
          ["HFT / network", <InlineCode key="e">{"{32, 128, 512, …}"}</InlineCode>, "60 / 20 / …", "L3 packet processing"],
          ["Embedded / RTOS", <InlineCode key="f">{"{8, 16, 32, …}"}</InlineCode>, "30 / 30 / …", "Deterministic control"],
        ]}
      />

      <Callout variant="perf" title="What these numbers actually mean">
        <strong className="text-quicx-text">Flat tail</strong> — PMAD moves only 2.5× from P50
        to P99.9 (2.59 → 6.50 ns), the tightest spread of every allocator tested. jemalloc fans
        out 18.5× over the same range; the system allocator 15.3×. The remaining variance is
        OS scheduling noise, not allocator behaviour.{" "}
        <strong className="text-quicx-text">Zero runtime syscalls</strong> means the kernel never
        interrupts an allocation — your millionth{" "}
        <InlineCode>pmad_alloc</InlineCode> is as fast as your first.
      </Callout>

      <SubHeading id="pmad-teardown">Tear-down</SubHeading>

      <Prose>
        <p>
          A single <InlineCode>munmap</InlineCode> returns the entire pool to the OS in O(1) —
          there are no individual blocks to walk, no fragmented regions to compact. Shutdown is
          symmetric with startup: one syscall in, one syscall out.
        </p>
      </Prose>
    </section>
  );
}
