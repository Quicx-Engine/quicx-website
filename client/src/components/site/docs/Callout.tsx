import { Info, Lightbulb, TriangleAlert, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "note" | "tip" | "warn" | "perf";

const variants: Record<
  Variant,
  { icon: typeof Info; ring: string; accent: string; label: string }
> = {
  note: {
    icon: Info,
    ring: "border-sky-400/25 bg-sky-400/[0.04]",
    accent: "text-sky-300",
    label: "NOTE",
  },
  tip: {
    icon: Lightbulb,
    ring: "border-emerald-400/25 bg-emerald-400/[0.04]",
    accent: "text-emerald-300",
    label: "TIP",
  },
  warn: {
    icon: TriangleAlert,
    ring: "border-amber-400/25 bg-amber-400/[0.04]",
    accent: "text-amber-300",
    label: "HEADS UP",
  },
  perf: {
    icon: Zap,
    ring: "border-quicx-orange/35 bg-quicx-orange/[0.05]",
    accent: "text-quicx-orange-bright",
    label: "PERFORMANCE",
  },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div
      className={cn(
        "relative rounded-lg border px-4 py-3.5",
        v.ring
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 inline-flex", v.accent)}>
          <Icon className="size-4" />
        </span>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-[family-name:var(--font-barlow-condensed)] text-[11px] font-semibold uppercase tracking-[0.22em]",
                v.accent
              )}
            >
              {v.label}
            </span>
            {title && (
              <span className="text-[13.5px] font-medium text-quicx-text">
                {title}
              </span>
            )}
          </div>
          <div className="text-[13.5px] leading-relaxed text-quicx-muted [&_code]:font-[family-name:var(--font-jetbrains-mono)] [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[12.5px] [&_code]:text-quicx-text">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
