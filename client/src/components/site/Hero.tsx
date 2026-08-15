import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HEADLINE } from "@/lib/benchmarks";

const heroStats = [
  { value: HEADLINE.throughput, unit: "tasks/sec", note: "end to end, 1 thread" },
  { value: HEADLINE.latency, unit: "p50", note: "submit → done" },
  { value: HEADLINE.memoryDelta, unit: "growth", note: "over 443,912 tasks" },
  { value: HEADLINE.binary, unit: "binary", note: "zero dependencies" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background layers */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 radial-hero-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quicx-line-strong to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-quicx-orange/30 to-transparent"
        aria-hidden
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:px-10 lg:py-32">
        {/* Headline */}
        <h1 className="hero-display mx-auto max-w-6xl text-[clamp(2.5rem,7.5vw,7.5rem)] text-white">
          <span className="block">Never asks the OS</span>
          <span className="block">for another byte</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-16 max-w-2xl text-[15px] leading-relaxed text-quicx-muted sm:text-[17px]">
          A deterministic-memory task queue, written in C. You give it a memory
          budget at startup — it uses exactly that, tells you precisely what it
          is using, and never grows.
        </p>

        {/* Measured stat strip */}
        <div className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-quicx-line bg-quicx-line sm:grid-cols-4">
          {heroStats.map((s) => (
            <div
              key={s.unit}
              className="flex flex-col items-center gap-1 bg-[#0a1a22] px-3 py-4"
            >
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[19px] font-semibold tabular-nums text-quicx-text sm:text-[22px]">
                {s.value}
              </span>
              <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.22em] text-quicx-orange-bright">
                {s.unit}
              </span>
              <span className="text-[11px] text-quicx-dim">{s.note}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] text-quicx-dim">
          Measured on one machine with{" "}
          <Link
            href="/docs/benchmarks"
            className="text-quicx-muted underline decoration-quicx-orange/40 underline-offset-4 hover:text-quicx-text"
          >
            bench/run.sh
          </Link>
          . Nothing here is estimated.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/docs/quick-start">
            <Button
              size="lg"
              className="h-12 rounded bg-quicx-orange px-7 font-[family-name:var(--font-barlow-condensed)] text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_0_1px_rgba(255,87,0,0.5),0_10px_30px_-10px_rgba(255,87,0,0.55)] hover:bg-quicx-orange-bright"
            >
              Start with Quicx
            </Button>
          </a>
          <a href="/docs">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded border-quicx-orange/60 bg-transparent px-7 font-[family-name:var(--font-barlow-condensed)] text-base font-semibold uppercase tracking-wider text-quicx-orange hover:border-quicx-orange hover:bg-quicx-orange/10 hover:text-quicx-orange-bright"
            >
              Explore Docs
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
