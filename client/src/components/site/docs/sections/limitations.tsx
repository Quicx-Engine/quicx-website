import Link from "next/link";
import { X } from "lucide-react";
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

      <ul className="border-t border-quicx-line-strong">
        {LIMITATIONS.map((l) => (
          <li
            key={l.title}
            className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-quicx-line py-4"
          >
            <X aria-hidden className="size-4 translate-y-[3px] text-quicx-orange" strokeWidth={2.25} />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[16px] font-semibold text-quicx-text">{l.title}</span>
              {"status" in l && l.status && (
                <span className="caps-label text-quicx-orange-bright">{l.status}</span>
              )}
            </div>
            <p className="col-start-2 text-[15px] leading-[1.65] text-quicx-body">{l.body}</p>
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
          budget declared at startup and never exceeded, every page accounted
          for, and the memory of a burst given back once it drains. None of the
          systems in the table above make that guarantee.
        </p>
        <p>
          If your tasks are
          cheap, local, replayable from the source of truth, and you would
          rather have a hard memory ceiling than durable delivery, Quicx fits.
          If losing a task on a worker crash is unacceptable, it does not, whatever the
          benchmarks say.
        </p>
      </Prose>
    </section>
  );
}
