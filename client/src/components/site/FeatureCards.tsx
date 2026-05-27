import { FeatureCardsGrid } from "./FeatureCardsClient";

export function FeatureCards() {
  return (
    <section
      id="features"
      className="relative border-t border-quicx-line bg-quicx-bg"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quicx-orange/30 to-transparent" />
      <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {/* Section head — static, server-rendered */}
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-quicx-orange/60"
            />
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.34em] text-quicx-orange-bright">
              <span className="text-quicx-dim">§ 03</span>
              <span className="text-quicx-dim">/</span>
              <span>Principles</span>
            </span>
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-l from-transparent to-quicx-orange/60"
            />
          </div>

          <h2 className="mt-7 text-center">
            <span className="hero-display block text-[clamp(2.25rem,6vw,4.25rem)] text-quicx-text">
              Six opinions.
            </span>
            <span className="mt-2 block font-[family-name:var(--font-archivo)] text-balance text-[clamp(1.25rem,2.6vw,1.85rem)] font-medium leading-[1.25] text-quicx-muted">
              So you don&apos;t have to make them.
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

          <p className="mx-auto mt-8 max-w-xl text-center text-[15px] leading-relaxed text-quicx-muted">
            What makes Quicx,{" "}
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13.5px] text-quicx-text">
              Quicx
            </span>
            {" "}— six deliberate choices, baked into every frame, every slab,
            every byte.
          </p>
        </div>

        {/* Cards grid + modal — client interactive */}
        <FeatureCardsGrid />
      </div>
    </section>
  );
}
