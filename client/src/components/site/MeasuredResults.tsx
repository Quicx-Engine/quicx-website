import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  REFERENCE_RUN,
  LATENCY_PERCENTILES,
  LATENCY_BY_LOAD,
  THROUGHPUT_RUN,
  MEMORY_RUN,
  METHODOLOGY,
} from "@/lib/benchmarks";

const maxUs = Math.max(...LATENCY_PERCENTILES.map((p) => p.us));

export function MeasuredResults() {
  return (
    <section
      id="measured"
      className="relative border-t border-quicx-line bg-quicx-bg"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quicx-orange/30 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {/* Section head */}
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-quicx-orange/60"
            />
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.34em] text-quicx-orange-bright">
              <span className="text-quicx-dim">§ 02</span>
              <span className="text-quicx-dim">/</span>
              <span>Measured</span>
            </span>
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-l from-transparent to-quicx-orange/60"
            />
          </div>

          <h2 className="mt-7 text-center">
            <span className="hero-display block text-[clamp(2.25rem,6vw,4.25rem)] text-quicx-text">
              Every number here
            </span>
            <span className="mt-2 block font-[family-name:var(--font-archivo)] text-balance text-[clamp(1.25rem,2.6vw,1.85rem)] font-medium leading-[1.25] text-quicx-muted">
              came off a run you can repeat.
            </span>
          </h2>

          <div
            aria-hidden
            className="mx-auto mt-8 flex items-center justify-center gap-2"
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-quicx-orange/50" />
            <span className="size-1.5 rotate-45 bg-quicx-orange" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-quicx-orange/50" />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-quicx-muted">
            One machine, one build, one afternoon — reproducible with{" "}
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13.5px] text-quicx-orange-bright">
              bench/run.sh
            </span>
            . Nothing below is estimated, extrapolated, or taken from
            documentation.
          </p>
        </div>

        {/* Reference run */}
        <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-quicx-line bg-quicx-line sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(REFERENCE_RUN).map(([k, v]) => (
            <div key={k} className="bg-[#0a1a22] px-4 py-3">
              <dt className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.22em] text-quicx-dim">
                {k}
              </dt>
              <dd className="mt-1 text-[13px] leading-relaxed text-quicx-muted">
                {v}
              </dd>
            </div>
          ))}
        </dl>

        {/* Three result panels */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Throughput */}
          <div className="rounded-2xl border border-quicx-line bg-[#0a1a22] p-6">
            <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.28em] text-quicx-orange-bright">
              Throughput
            </div>
            <div className="mt-4 flex items-baseline gap-2 font-[family-name:var(--font-jetbrains-mono)]">
              <span className="text-[34px] font-semibold leading-none tabular-nums text-quicx-text">
                74,300
              </span>
              <span className="text-[13px] text-quicx-dim">tasks/sec</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-quicx-muted">
              End to end, single thread. {THROUGHPUT_RUN.window}.{" "}
              {THROUGHPUT_RUN.tasks} tasks in the measured window,{" "}
              {THROUGHPUT_RUN.errors}. {THROUGHPUT_RUN.spread}
            </p>
            <p className="mt-3 border-t border-quicx-line pt-3 text-[12.5px] leading-relaxed text-quicx-dim">
              One task is a full lifecycle — submit, ack, dispatch, parse, done,
              notify. Five protocol messages, not one enqueue.
            </p>
          </div>

          {/* Latency */}
          <div className="rounded-2xl border border-quicx-line bg-[#0a1a22] p-6">
            <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.28em] text-quicx-orange-bright">
              Latency · submit → done
            </div>
            <div className="mt-4 flex items-baseline gap-2 font-[family-name:var(--font-jetbrains-mono)]">
              <span className="text-[34px] font-semibold leading-none tabular-nums text-quicx-text">
                51
              </span>
              <span className="text-[13px] text-quicx-dim">µs p50</span>
            </div>
            <ul className="mt-4 space-y-2">
              {LATENCY_PERCENTILES.map((p) => (
                <li key={p.label} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] text-quicx-dim">
                    {p.label}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-quicx-orange to-quicx-orange-bright"
                      style={{ width: `${(p.us / maxUs) * 100}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] tabular-nums text-quicx-text">
                    {p.value}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-quicx-line pt-3 text-[12.5px] leading-relaxed text-quicx-dim">
              Open loop at 40k/s offered, timed from the scheduled send — stalls
              are charged in full, not hidden.
            </p>
          </div>

          {/* Memory */}
          <div className="rounded-2xl border border-quicx-line bg-[#0a1a22] p-6">
            <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.28em] text-quicx-orange-bright">
              Memory
            </div>
            <div className="mt-4 flex items-baseline gap-2 font-[family-name:var(--font-jetbrains-mono)]">
              <span className="text-[34px] font-semibold leading-none tabular-nums text-quicx-text">
                0 KB
              </span>
              <span className="text-[13px] text-quicx-dim">growth</span>
            </div>
            <dl className="mt-4 space-y-2 font-[family-name:var(--font-jetbrains-mono)] text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-quicx-dim">idle RSS</dt>
                <dd className="tabular-nums text-quicx-text">
                  {MEMORY_RUN.idleRss}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-quicx-dim">
                  after {THROUGHPUT_RUN.tasks} tasks
                </dt>
                <dd className="tabular-nums text-quicx-text">
                  {MEMORY_RUN.finalRss}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-quicx-dim">
                  peak of {MEMORY_RUN.poolSize} pool
                </dt>
                <dd className="tabular-nums text-quicx-text">
                  {MEMORY_RUN.poolPeakPct}%
                </dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-quicx-line pt-3 text-[12.5px] leading-relaxed text-quicx-dim">
              Not low growth — no growth. The pool is mapped once at startup and
              every allocation comes out of it.
            </p>
          </div>
        </div>

        {/* Latency vs offered load */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-quicx-line px-6 py-4">
            <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.28em] text-quicx-orange-bright">
              Latency vs offered load
            </span>
            <span className="text-[12.5px] text-quicx-dim">
              Flat from 10k/s to 40k/s — the daemon is not straining anywhere in
              that range.
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-quicx-line bg-white/[0.02]">
                  {["offered", "p50", "p99", "p99.9"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 font-[family-name:var(--font-barlow-condensed)] text-[11.5px] font-semibold uppercase tracking-[0.22em] text-quicx-dim"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-[family-name:var(--font-jetbrains-mono)]">
                {LATENCY_BY_LOAD.map((r) => (
                  <tr
                    key={r.offered}
                    className="border-b border-quicx-line/70 last:border-b-0"
                  >
                    <td className="px-6 py-3 text-quicx-text">{r.offered}</td>
                    <td className="px-6 py-3 tabular-nums text-quicx-orange-bright">
                      {r.p50}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-quicx-muted">
                      {r.p99}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-quicx-muted">
                      {r.p999}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-8 rounded-2xl border border-quicx-line bg-[#0a1a22] p-6 sm:p-8">
          <h3 className="font-[family-name:var(--font-archivo)] text-[20px] font-semibold text-quicx-text">
            How it was measured
          </h3>
          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-quicx-muted">
            The methodology is the difference between a benchmark and a
            marketing claim, so it belongs here and not in a footnote.
          </p>
          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            {METHODOLOGY.map((m) => (
              <div key={m.title}>
                <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] text-quicx-orange-bright">
                  {m.title}
                </dt>
                <dd className="mt-1.5 text-[13.5px] leading-relaxed text-quicx-muted">
                  {m.body}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/docs/benchmarks"
            className="mt-8 inline-flex items-center gap-2 rounded border border-quicx-orange/60 px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-[14px] font-semibold uppercase tracking-wide text-quicx-orange transition hover:border-quicx-orange hover:bg-quicx-orange/10 hover:text-quicx-orange-bright"
          >
            Full benchmark write-up
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
