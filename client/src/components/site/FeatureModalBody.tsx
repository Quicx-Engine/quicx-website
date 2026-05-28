import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { features, type Feature } from "./featuresData";
import { VisualFor } from "./FeatureVisual";
import { MoreToDiscoverItem } from "./MoreToDiscoverItem";

export function FeatureModalBody({ feature }: { feature: Feature }) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-10 sm:px-10 sm:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h2 className="text-balance font-[family-name:var(--font-archivo)] text-3xl font-semibold leading-[1.1] text-quicx-text sm:text-4xl">
              {feature.modalTitle}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-quicx-muted">
              {feature.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/docs/quick-start">
                <Button
                  size="lg"
                  className="h-11 rounded bg-quicx-orange px-5 font-[family-name:var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wider text-white hover:bg-quicx-orange-bright"
                >
                  Start with Quicx
                </Button>
              </a>
              <a href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded border-white/15 bg-transparent px-5 font-[family-name:var(--font-barlow-condensed)] text-sm font-semibold uppercase tracking-wider text-quicx-text hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
                >
                  See the Docs
                </Button>
              </a>
            </div>
          </div>

          <ul className="flex flex-col justify-center gap-3">
            {feature.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-[14.5px] leading-relaxed text-quicx-text"
              >
                <CheckDot accent={feature.tint.accent} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            "relative mt-12 overflow-hidden rounded border border-quicx-line bg-quicx-bg-2",
            feature.id === "observability" ? "min-h-[650px]" : ""
          )}
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${feature.tint.radial}, var(--quicx-bg-2) 70%)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
          <div className="relative h-full">
            <VisualFor id={feature.id} active={true} expanded={true} />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-quicx-line pt-10 sm:grid-cols-3">
          {feature.footnotes.map((f) => (
            <div key={f.title}>
              <div
                className="mb-3 inline-flex size-8 items-center justify-center rounded border"
                style={{
                  borderColor: feature.tint.accent + "55",
                  background: feature.tint.accent + "12",
                  color: feature.tint.accent,
                }}
              >
                <DotIcon className="size-3" />
              </div>
              <h4 className="font-[family-name:var(--font-archivo)] text-[15px] font-semibold text-quicx-text">
                {f.title}
              </h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-quicx-muted">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <MoreToDiscover currentId={feature.id} />
    </>
  );
}

function MoreToDiscover({ currentId }: { currentId: string }) {
  const related = features.filter((f) => f.id !== currentId).slice(0, 3);
  return (
    <section className="border-t border-quicx-line px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <h3 className="font-[family-name:var(--font-archivo)] text-2xl font-semibold text-quicx-text">
          More to discover
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {related.map((f) => (
            <MoreToDiscoverItem
              key={f.id}
              id={f.id}
              className="group relative h-56 overflow-hidden rounded border border-quicx-line bg-quicx-bg-2 text-left transition-all hover:border-white/15 hover:bg-quicx-bg-3"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 50% at 85% 0%, ${f.tint.radial}, transparent 60%)`,
                }}
              />
              <div className="relative flex h-full flex-col p-5">
                <h4 className="text-[16px] font-semibold text-quicx-text">
                  {f.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-[13px] text-quicx-muted">
                  {f.shortSummary}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 font-[family-name:var(--font-barlow-condensed)] text-[12px] uppercase tracking-wider text-quicx-orange-bright">
                  Open
                  <ExpandIcon className="size-3" />
                </span>
              </div>
            </MoreToDiscoverItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckDot({ accent }: { accent: string }) {
  return (
    <span
      className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full"
      style={{
        background: accent + "22",
        border: `1px solid ${accent}55`,
        color: accent,
      }}
    >
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-2.5"
      >
        <path d="M2 6l2.5 2.5L10 3" />
      </svg>
    </span>
  );
}

function DotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" {...props}>
      <circle cx="6" cy="6" r="3" />
    </svg>
  );
}

function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 3h3v3" />
      <path d="M13 3l-5 5" />
      <path d="M6 13H3v-3" />
      <path d="M3 13l5-5" />
    </svg>
  );
}
