import { ArrowRight, BookOpen } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden border-t border-quicx-line bg-quicx-bg">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_110%,rgba(255,87,0,0.13),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quicx-orange/30 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-10 lg:py-32">
        {/* Section marker */}
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-r from-transparent to-quicx-orange/60"
          />
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.34em] text-quicx-orange-bright">
            <span className="text-quicx-dim">§ 04</span>
            <span className="text-quicx-dim">/</span>
            <span>Get started</span>
          </span>
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-l from-transparent to-quicx-orange/60"
          />
        </div>

        {/* Headline */}
        <h2 className="mt-7">
          <span className="hero-display block text-[clamp(2.5rem,6.5vw,5.5rem)] text-quicx-text">
            One command away.
          </span>
        </h2>

        {/* Brand rule */}
        <div
          aria-hidden
          className="mx-auto mt-6 flex items-center justify-center gap-2"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-quicx-orange/50" />
          <span className="size-1.5 rotate-45 bg-quicx-orange" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-quicx-orange/50" />
        </div>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-lg text-[15px] leading-relaxed text-quicx-muted sm:text-[17px]">
          Install the daemon, pull the Java client from Maven Central, and
          submit your first task — no managed service, no account, no
          surprises.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="/docs#installation">
            <button className="inline-flex h-12 items-center gap-2 rounded bg-quicx-orange px-8 font-[family-name:var(--font-barlow-condensed)] text-[15px] font-semibold uppercase tracking-wider text-white shadow-[0_0_0_1px_rgba(255,87,0,0.5),0_10px_30px_-10px_rgba(255,87,0,0.55)] transition hover:bg-quicx-orange-bright">
              Install Quicx
              <ArrowRight className="size-4" />
            </button>
          </a>
          <a href="/docs">
            <button className="inline-flex h-12 items-center gap-2 rounded border border-quicx-orange/60 bg-transparent px-8 font-[family-name:var(--font-barlow-condensed)] text-[15px] font-semibold uppercase tracking-wider text-quicx-orange transition hover:border-quicx-orange hover:bg-quicx-orange/10 hover:text-quicx-orange-bright">
              <BookOpen className="size-4" />
              Read the docs
            </button>
          </a>
        </div>

        {/* Install snippet */}
        <div className="mt-10 flex items-center gap-3 rounded border border-quicx-line bg-[#0a1a22] px-5 py-3">
          <span className="select-none font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-quicx-dim">
            $
          </span>
          <code className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-quicx-text">
            curl -fsSL https://quicx.dev/install.sh | sh
          </code>
        </div>
      </div>
    </section>
  );
}
