import { cn } from "@/lib/utils";
import type { Feature } from "./featuresData";

export function FeatureCardChrome({ feature }: { feature: Feature }) {
  return (
    <>
      {/* Card tint — subtle radial glow in top-right */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 85% 0%, ${feature.tint.radial}, transparent 60%)`,
        }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent via-[color:var(--tw-grad)]",
          feature.tint.glow
        )}
        style={{ ["--tw-grad" as string]: feature.tint.accent + "55" }}
        aria-hidden
      />

      {/* Header row: title + expand */}
      <div className="relative flex items-start justify-between gap-3 p-6">
        <h3 className="max-w-[14rem] text-[19px] font-semibold leading-snug text-quicx-text">
          {feature.title}
        </h3>

        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/70",
            "transition-all duration-300",
            "group-hover:border-quicx-orange/50 group-hover:bg-quicx-orange/10 group-hover:text-quicx-orange-bright"
          )}
        >
          <ExpandIcon className="size-3.5" />
        </span>
      </div>
    </>
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
