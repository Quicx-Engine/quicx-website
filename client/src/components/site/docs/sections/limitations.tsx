import Link from "next/link";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  Table,
} from "@/components/site/docs/_primitives";
import { LIMITATIONS, FEATURE_MATRIX } from "@/lib/benchmarks";

export function LimitationsSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="limitations" />

      <SubHeading id="not-implemented">What Quicx does not do</SubHeading>

      <Prose>
        <p>
          Quicx is a fast in-memory broker, not a durable one. Today it does not
          do:
        </p>
      </Prose>

      <ul className="space-y-3">
        {LIMITATIONS.map((l) => (
          <li
            key={l.title}
            className="rounded-lg border border-quicx-line bg-[#0a1a22] px-4 py-3.5"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-quicx-text">
                {l.title}
              </span>
              {"status" in l && l.status && (
                <span className="rounded border border-quicx-orange/40 bg-quicx-orange/10 px-2 py-0.5 font-[family-name:var(--font-barlow-condensed)] text-[10.5px] uppercase tracking-[0.26em] text-quicx-orange-bright">
                  {l.status}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-quicx-muted">
              {l.body}
            </p>
          </li>
        ))}
      </ul>

      <Callout
        variant="warn"
        title="Some of the speed is work that isn't happening"
      >
        A queue that never writes to disk, never tracks an in-flight lease and
        never retries has less to do per task than one that does. That is a real
        part of why the numbers on{" "}
        <Link
          href="/docs/benchmarks"
          className="text-quicx-orange-bright underline decoration-quicx-orange/40 underline-offset-4"
        >
          Benchmarks
        </Link>{" "}
        look the way they do. If you need at-least-once delivery, use{" "}
        <InlineCode>beanstalkd</InlineCode> or Redis Streams.
      </Callout>

      <SubHeading id="feature-matrix">Feature for feature</SubHeading>

      <Table
        headers={["", ...FEATURE_MATRIX.columns]}
        rows={FEATURE_MATRIX.rows.map((r) => [r.label, ...r.values])}
        highlight={1}
      />

      <SubHeading id="when-to-use">When Quicx is the right call</SubHeading>

      <Prose>
        <p>
          Quicx is the task queue you reach for when you need to know,{" "}
          <strong>exactly</strong>, how much memory the broker will use. A fixed
          pool declared at startup, exact per-size-class accounting, and no
          growth under load — that is the guarantee none of the systems in the
          table above make.
        </p>
        <p>
          Speed is the supporting evidence, not the headline. If your tasks are
          cheap, local, replayable from the source of truth, and you would
          rather have a hard memory ceiling than durable delivery, Quicx fits.
          If losing a task on a worker crash is unacceptable, it does not — and
          no benchmark number changes that.
        </p>
      </Prose>
    </section>
  );
}
