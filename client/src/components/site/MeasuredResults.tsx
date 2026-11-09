import {
  REFERENCE_RUN,
  LATENCY_PERCENTILES,
  LATENCY_BY_MACHINE,
  THROUGHPUT_RUN,
  HEADLINE,
  MEMORY_RUN,
  METHODOLOGY,
} from "@/lib/benchmarks";
import { NumberReveal, Reveal } from "./motion";
import { Container, SectionHead, TextLink } from "./primitives";

const AXIS_MAX_US = 200;
const AXIS_TICKS = [0, 50, 100, 150, 200];

const LIFECYCLE = ["submit", "ack", "dispatch", "done", "notify"];

/** Hairlines for the six reference-run cells at 1, 2, 3 and 6 columns. */
const REFERENCE_CELL = [
  "",
  "border-t sm:border-t-0 sm:border-l sm:pl-4",
  "border-t lg:border-t-0 lg:border-l lg:pl-4",
  "border-t sm:border-l sm:pl-4 lg:border-l-0 lg:pl-0 xl:border-t-0 xl:border-l xl:pl-4",
  "border-t lg:border-l lg:pl-4 xl:border-t-0",
  "border-t sm:border-l sm:pl-4 xl:border-t-0",
];

function referenceCellClass(i: number) {
  return `border-quicx-line py-4 pr-4 xl:py-5 ${REFERENCE_CELL[i] ?? ""}`;
}

function Figure({
  label,
  value,
  unit,
  delay,
}: {
  label: string;
  value: string;
  unit: string;
  delay: number;
}) {
  return (
    <div>
      <h3 className="caps-label text-quicx-dim">{label}</h3>
      <p className="mt-4 flex items-baseline gap-2 font-mono">
        <NumberReveal
          value={value}
          delay={delay}
          className="text-[clamp(2.75rem,4.6vw,3.75rem)] font-medium leading-none tracking-[-0.04em] text-quicx-text"
        />
        <span className="text-[14px] text-quicx-orange-bright">{unit}</span>
      </p>
    </div>
  );
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function MeasuredResults() {
  return (
    <section id="measured" aria-labelledby="measured-title" className="border-b border-quicx-line">
      <Container className="py-24 lg:py-32">
        <SectionHead
          id="measured-title"
          title="Every number here"
          continuation="came off a run you can repeat."
        >
          <p>
            Two machines, one -O2 build, every run repeatable with{" "}
            <code className="font-mono text-[14px] text-quicx-orange-bright">bench/run.sh</code>.
            Nothing below is estimated, extrapolated, or taken from documentation.
          </p>
        </SectionHead>

        {/* Reference run — the conditions, stated before the results */}
        <dl className="mt-16 grid grid-cols-1 border-y border-quicx-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Object.entries(REFERENCE_RUN).map(([k, v], i) => (
            <div
              key={k}
              className={referenceCellClass(i)}
            >
              <dt className="caps-label text-quicx-dim">{k}</dt>
              <dd className="mt-1.5 text-[14.5px] leading-snug text-quicx-body">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Results */}
        <Reveal threshold={0.2} className="mt-px grid grid-cols-1 lg:grid-cols-3">
          {/* Throughput */}
          <article className="flex flex-col border-b border-quicx-line py-10 lg:border-b-0 lg:pr-10">
            <Figure label="Throughput" value={HEADLINE.throughput} unit="tasks/sec" delay={0} />
            <p className="mt-6 text-[15px] leading-[1.65] text-quicx-muted">
              End to end, single thread, median of 5 runs. {THROUGHPUT_RUN.window},{" "}
              {THROUGHPUT_RUN.errors}. {THROUGHPUT_RUN.spread}
            </p>
            <div className="mt-auto pt-8">
              <p className="text-[13px] text-quicx-dim">One task, five protocol messages:</p>
              <ol data-loop className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[12.5px]">
                {LIFECYCLE.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-2"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="lifecycle-step text-quicx-body">{step}</span>
                    {i < LIFECYCLE.length - 1 && (
                      <span aria-hidden className="lifecycle-arrow text-quicx-orange">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </article>

          {/* Latency */}
          <article className="flex flex-col border-b border-quicx-line py-10 lg:border-b-0 lg:border-l lg:px-10">
            <Figure label="Latency, submit → done" value={HEADLINE.latencyUs} unit="µs p50" delay={150} />
            <p className="mt-6 text-[15px] leading-[1.65] text-quicx-muted">
              Open loop at 40k/s offered, timed from the scheduled send, so stalls are charged in
              full rather than hidden.
            </p>
            <figure className="mt-auto pt-8">
              <ul className="space-y-3">
                {LATENCY_PERCENTILES.map((p, i) => (
                  <li
                    key={p.label}
                    className="grid grid-cols-[3rem_minmax(0,1fr)_4rem] items-center gap-3 font-mono text-[12.5px]"
                  >
                    <span className="text-quicx-dim">{p.label}</span>
                    <span className="relative h-2 bg-white/[0.05]">
                      <span
                        className="grow-x absolute inset-y-0 left-0 bg-quicx-orange"
                        style={{ width: `${(p.us / AXIS_MAX_US) * 100}%`, ...d(400 + i * 110) }}
                      />
                    </span>
                    <span className="reveal-fade text-right text-quicx-text" style={d(750 + i * 110)}>
                      {p.value}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                aria-hidden
                className="mt-2 grid grid-cols-[3rem_minmax(0,1fr)_4rem] gap-3 font-mono text-[11px] text-quicx-dim"
              >
                <span />
                <span className="relative h-4 border-t border-quicx-line-strong">
                  {AXIS_TICKS.map((t) => (
                    <span
                      key={t}
                      className="absolute top-0 -translate-x-1/2 pt-1.5"
                      style={{ left: `${(t / AXIS_MAX_US) * 100}%` }}
                    >
                      {t}
                    </span>
                  ))}
                </span>
                <span className="pt-1.5 text-right">µs</span>
              </div>
              <figcaption className="sr-only">
                Latency percentiles at 40k tasks per second offered, median of 5 runs: p50 49 µs,
                p90 64 µs, p99 98 µs, p99.9 143 µs.
              </figcaption>
            </figure>
          </article>

          {/* Capacity and memory */}
          <article className="flex flex-col py-10 lg:border-l lg:pl-10">
            <Figure label="Capacity of 8 MiB" value={HEADLINE.capacity} unit="tasks of 100 B" delay={300} />
            <p className="mt-6 text-[15px] leading-[1.65] text-quicx-muted">
              v1.0.4 split the pool between sizes in fixed shares and held {HEADLINE.capacityBefore}. v2
              gives 16 KiB pages to the sizes that arrive, and gives the memory back after a burst.
            </p>
            <dl className="mt-auto space-y-3 pt-8 font-mono text-[12.5px]">
              {[
                { k: "idle", v: MEMORY_RUN.idle, kb: 1056 },
                { k: "queue full", v: MEMORY_RUN.full, kb: 9088 },
                { k: "after the burst", v: MEMORY_RUN.afterBurst, kb: 2080 },
              ].map((row, i) => (
                <div key={row.k}>
                  <div className="flex justify-between gap-3">
                    <dt className="text-quicx-dim">{row.k}</dt>
                    <dd className="text-quicx-text">{row.v}</dd>
                  </div>
                  <div aria-hidden className="relative mt-1.5 h-2 bg-white/[0.05]">
                    <span
                      className="grow-x absolute inset-y-0 left-0 bg-quicx-body/70"
                      style={{ width: `${(row.kb / 9200) * 100}%`, ...d(500 + i * 160) }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between gap-3">
                  <dt className="text-quicx-dim">peak use of the {MEMORY_RUN.poolSize} pool, under load</dt>
                  <dd className="text-quicx-orange-bright">{MEMORY_RUN.poolPeakPct} %</dd>
                </div>
                <div aria-hidden className="relative mt-1.5 h-2 bg-white/[0.05]">
                  <span
                    className="grow-x absolute inset-y-0 left-0 bg-quicx-orange"
                    style={{ width: `${MEMORY_RUN.poolPeakPct}%`, ...d(900) }}
                  />
                  <span className="absolute -top-1 bottom-[-4px] right-0 w-px bg-quicx-text/60" />
                </div>
              </div>
              <p className="pt-1 font-sans text-[12.5px] leading-snug text-quicx-dim">
                Physical memory (macOS phys_footprint), median of 3 runs. v1.0.4 held {MEMORY_RUN.v104} from the
                moment it started.
              </p>
            </dl>
          </article>
        </Reveal>

        {/* Two machines */}
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-quicx-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-quicx-text">
              Two machines, same scripts
            </h3>
            <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.65] text-quicx-muted">
              A 2024 Mac and a 2011 Linux PC, each offered a rate it handles comfortably. On the
              i3, eleven processes share four hardware threads, so its CPU is the ceiling.
            </p>
          </div>
          <div className="overflow-x-auto lg:col-span-8">
            <table className="w-full min-w-[520px] text-left font-mono text-[14px]">
              <thead>
                <tr className="border-b border-quicx-line-strong">
                  {["machine", "offered", "p50", "p99", "p99.9", "closed loop"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`py-3 font-sans caps-label font-normal text-quicx-dim ${i > 0 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LATENCY_BY_MACHINE.map((r) => (
                  <tr key={r.machine} className="border-b border-quicx-line">
                    <th scope="row" className="py-3.5 font-normal text-quicx-text">
                      {r.machine}
                    </th>
                    <td className="py-3.5 text-right text-quicx-body">{r.offered}</td>
                    <td className="py-3.5 text-right text-quicx-orange-bright">{r.p50}</td>
                    <td className="py-3.5 text-right text-quicx-body">{r.p99}</td>
                    <td className="py-3.5 text-right text-quicx-body">{r.p999}</td>
                    <td className="py-3.5 text-right text-quicx-body">{r.throughput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-quicx-text">
              How it was measured
            </h3>
            <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.65] text-quicx-muted">
              The methodology is the difference between a benchmark and a marketing claim, so it
              belongs here and not in a footnote.
            </p>
            <TextLink href="/docs/benchmarks" className="mt-6">
              Full benchmark write-up
            </TextLink>
          </div>
          <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {METHODOLOGY.map((m) => (
              <div key={m.title} className="border-t border-quicx-line py-5">
                <dt className="text-[15.5px] font-semibold leading-snug text-quicx-text">
                  {m.title}
                </dt>
                <dd className="mt-2 text-[14.5px] leading-[1.65] text-quicx-muted">{m.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
