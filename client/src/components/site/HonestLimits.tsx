import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { LIMITATIONS, COMPARISON } from "@/lib/benchmarks";

export function HonestLimits() {
  return (
    <section
      id="limits"
      className="relative overflow-hidden border-t border-quicx-line bg-[#112a3c]"
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {/* Section head */}
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-quicx-orange/60"
            />
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.34em] text-quicx-orange-bright">
              <span className="text-quicx-dim">§ 05</span>
              <span className="text-quicx-dim">/</span>
              <span>Honest limits</span>
            </span>
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-l from-transparent to-quicx-orange/60"
            />
          </div>

          <h2 className="mt-7 text-center">
            <span className="hero-display block text-[clamp(2.25rem,6vw,4.25rem)] text-quicx-text">
              What Quicx does not do.
            </span>
            <span className="mt-2 block font-[family-name:var(--font-archivo)] text-balance text-[clamp(1.25rem,2.6vw,1.85rem)] font-medium leading-[1.25] text-quicx-muted">
              Because some of the speed is work it is skipping.
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
            Quicx is a fast in-memory broker, not a durable one. If you need
            at-least-once delivery, use beanstalkd or Redis Streams — and if you
            need an exact memory ceiling, keep reading.
          </p>
        </div>

        {/* Limitation grid */}
        <ul className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LIMITATIONS.map((l) => (
            <li
              key={l.title}
              className="rounded-xl border border-quicx-line bg-[#0a1a22] p-5"
            >
              <div className="flex items-start gap-3">
                <X className="mt-0.5 size-4 shrink-0 text-quicx-orange" />
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-[family-name:var(--font-archivo)] text-[15px] font-semibold text-quicx-text">
                      {l.title}
                    </span>
                    {"status" in l && l.status && (
                      <span className="rounded border border-quicx-orange/40 bg-quicx-orange/10 px-1.5 py-0.5 font-[family-name:var(--font-barlow-condensed)] text-[10px] uppercase tracking-[0.24em] text-quicx-orange-bright">
                        {l.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-quicx-muted">
                    {l.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Comparison with provenance */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22]">
          <div className="border-b border-quicx-line px-6 py-4">
            <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.28em] text-quicx-orange-bright">
              Against other queues
            </div>
            <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-quicx-muted">
              Only the Quicx row was measured here. Every other figure comes
              from vendor documentation or third-party benchmarks on unknown
              hardware, and is included for rough orientation — not as a
              head-to-head result.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-quicx-line bg-white/[0.02]">
                  {["", "throughput", "latency", "provenance"].map((h, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 font-[family-name:var(--font-barlow-condensed)] text-[11.5px] font-semibold uppercase tracking-[0.22em] text-quicx-dim"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((c) => (
                  <tr
                    key={c.system}
                    className="border-b border-quicx-line/70 last:border-b-0"
                  >
                    <td
                      className={
                        c.measured
                          ? "px-6 py-3 font-semibold text-quicx-text"
                          : "px-6 py-3 text-quicx-muted"
                      }
                    >
                      {c.system}
                    </td>
                    <td className="px-6 py-3 font-[family-name:var(--font-jetbrains-mono)] text-quicx-muted">
                      {c.throughput}
                    </td>
                    <td className="px-6 py-3 font-[family-name:var(--font-jetbrains-mono)] text-quicx-muted">
                      {c.latency}
                    </td>
                    <td
                      className={
                        c.measured
                          ? "px-6 py-3 text-quicx-orange-bright"
                          : "px-6 py-3 text-quicx-dim"
                      }
                    >
                      {c.provenance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-quicx-line px-6 py-4 text-[13px] leading-relaxed text-quicx-muted">
            <span className="font-semibold text-quicx-text">
              The unit trap:
            </span>{" "}
            a Quicx task is five protocol messages across two connections. A
            Redis <code className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-quicx-text">LPUSH</code>{" "}
            is one command, and a real Redis job queue needs LPUSH + BRPOP + an
            ack. Normalised per completed job, Redis&rsquo;s ~161k commands/sec
            is on the order of 50k jobs/sec.
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/docs/limitations"
            className="inline-flex items-center gap-2 rounded border border-quicx-orange/60 px-5 py-2.5 font-[family-name:var(--font-barlow-condensed)] text-[14px] font-semibold uppercase tracking-wide text-quicx-orange transition hover:border-quicx-orange hover:bg-quicx-orange/10 hover:text-quicx-orange-bright"
          >
            Feature-for-feature comparison
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
