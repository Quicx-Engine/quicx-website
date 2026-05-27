import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export function DocsPageFooterCta() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22] p-8 sm:p-12">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(255,87,0,0.08),transparent_60%)]" />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.3em] text-quicx-orange-bright">
            Ready to run it?
          </div>
          <h3 className="mt-3 font-[family-name:var(--font-archivo)] text-[22px] font-semibold leading-tight text-quicx-text">
            Configure it once. Run it forever.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-quicx-muted">
            One binary, one TOML file, a Java jar on Maven Central. The rest is just taking
            tasks off a queue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-2 rounded border border-quicx-orange bg-quicx-orange/10 px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-[14px] font-semibold uppercase tracking-wide text-quicx-orange-bright transition hover:bg-quicx-orange/20"
          >
            Install Quicx <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://github.com/anastassow/Quicx"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded border border-quicx-line px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-[14px] font-semibold uppercase tracking-wide text-quicx-muted transition hover:border-white/20 hover:text-quicx-text"
          >
            GitHub <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
