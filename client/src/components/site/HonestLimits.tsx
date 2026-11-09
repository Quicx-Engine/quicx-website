import { X } from "lucide-react";
import { LIMITATIONS, COMPARISON } from "@/lib/benchmarks";
import { Container, TextLink } from "./primitives";

export function HonestLimits() {
  return (
    <section id="limits" aria-labelledby="limits-title" className="border-b border-quicx-line">
      <Container className="py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <h2
                id="limits-title"
                className="display text-[clamp(2.75rem,5vw,4.5rem)] text-quicx-text"
              >
                What Quicx does not do.
              </h2>
              <p className="mt-6 max-w-[34ch] text-[19px] font-medium leading-[1.45] text-quicx-text">
                Some of the speed is work it is skipping.
              </p>
              <p className="mt-4 max-w-[40ch] text-[15.5px] leading-[1.65] text-quicx-muted">
                Quicx is a fast in-memory broker, not a durable one. If you need at-least-once
                delivery, use beanstalkd or Redis Streams. If you need an exact memory ceiling, keep
                reading.
              </p>
            </div>
          </div>

        <ul className="border-t border-quicx-line-strong lg:col-span-8">
          {LIMITATIONS.map((l) => (
            <li
              key={l.title}
              className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-b border-quicx-line py-5 md:grid-cols-[1.5rem_minmax(0,4fr)_minmax(0,6fr)_7.5rem] md:items-baseline md:gap-x-6"
            >
              <X aria-hidden className="size-4 translate-y-[3px] text-quicx-orange" strokeWidth={2.25} />
              <h3 className="text-[17px] font-semibold leading-snug text-quicx-text">{l.title}</h3>
              <p className="col-start-2 text-[15px] leading-[1.6] text-quicx-muted md:col-start-auto">
                {l.body}
              </p>
              <div className="col-start-2 md:col-start-auto md:text-right">
                {"status" in l && l.status && (
                  <span className="inline-flex items-center gap-2 caps-label text-quicx-orange-bright">
                    <span aria-hidden data-loop className="live-dot size-1.5 rounded-full bg-quicx-orange" />
                    {l.status}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
        </div>

        {/* Comparison, with provenance on every row */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-quicx-text">
              Against other queues
            </h3>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.65] text-quicx-muted">
              Only the Quicx row was measured here. Every other figure comes from vendor
              documentation or third-party benchmarks on unknown hardware, and is included for
              rough orientation, not as a head-to-head result.
            </p>
            <TextLink href="/docs/limitations" className="mt-6">
              Feature-for-feature comparison
            </TextLink>
          </div>

          <div className="lg:col-span-8">
            {/* Phones: one block per system, provenance first-class */}
            <dl className="border-t border-quicx-line-strong md:hidden">
              {COMPARISON.map((c) => (
                <div
                  key={c.system}
                  className={
                    c.measured
                      ? "border-b border-quicx-line bg-quicx-bg-3 px-3 py-4"
                      : "border-b border-quicx-line px-3 py-4"
                  }
                >
                  <dt className="flex items-baseline justify-between gap-4">
                    <span
                      className={
                        c.measured ? "font-semibold text-quicx-text" : "text-quicx-body"
                      }
                    >
                      {c.system}
                    </span>
                    <span
                      className={
                        c.measured
                          ? "text-[13px] text-quicx-orange-bright"
                          : "text-[13px] text-quicx-dim"
                      }
                    >
                      {c.provenance}
                    </span>
                  </dt>
                  <dd className="mt-2 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-[12.5px]">
                    <span className="font-sans text-[13px] text-quicx-dim">Throughput</span>
                    <span className={c.measured ? "text-quicx-text" : "text-quicx-muted"}>
                      {c.throughput}
                    </span>
                    <span className="font-sans text-[13px] text-quicx-dim">Latency</span>
                    <span className={c.measured ? "text-quicx-text" : "text-quicx-muted"}>
                      {c.latency}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[620px] text-left text-[14px]">
                <thead>
                  <tr className="border-b border-quicx-line-strong">
                    {["System", "Throughput", "Latency", "Provenance"].map((h) => (
                      <th key={h} scope="col" className="py-3 pr-4 caps-label font-normal text-quicx-dim">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((c) => (
                    <tr
                      key={c.system}
                      className={
                        c.measured
                          ? "border-b border-quicx-line bg-quicx-bg-3"
                          : "border-b border-quicx-line"
                      }
                    >
                      <th
                        scope="row"
                        className={
                          c.measured
                            ? "py-3.5 pl-3 pr-4 font-semibold text-quicx-text"
                            : "py-3.5 pl-3 pr-4 font-normal text-quicx-body"
                        }
                      >
                        {c.system}
                      </th>
                      <td
                        className={`py-3.5 pr-4 font-mono text-[13px] ${c.measured ? "text-quicx-text" : "text-quicx-muted"}`}
                      >
                        {c.throughput}
                      </td>
                      <td
                        className={`py-3.5 pr-4 font-mono text-[13px] ${c.measured ? "text-quicx-text" : "text-quicx-muted"}`}
                      >
                        {c.latency}
                      </td>
                      <td
                        className={
                          c.measured
                            ? "py-3.5 pr-3 text-quicx-orange-bright"
                            : "py-3.5 pr-3 text-quicx-dim"
                        }
                      >
                        {c.provenance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 max-w-[70ch] text-[14px] leading-[1.65] text-quicx-muted">
              <strong className="font-semibold text-quicx-text">The unit trap.</strong> A Quicx
              task is five protocol messages across two connections. A Redis{" "}
              <code className="font-mono text-[13px] text-quicx-text">LPUSH</code>{"\u00a0"}is one command,
              and a real Redis job queue needs LPUSH + BRPOP + an ack. Normalised per completed job,
              Redis&rsquo;s ~161k commands/sec is on the order of 50k jobs/sec.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
