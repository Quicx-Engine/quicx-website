import { Info, Lightbulb, TriangleAlert, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "note" | "tip" | "warn" | "perf";

const variants: Record<
  Variant,
  { icon: typeof Info; frame: string; accent: string; label: string }
> = {
  note: {
    icon: Info,
    frame: "border-[#7fb4d9]/30 bg-[#7fb4d9]/[0.05]",
    accent: "text-[#9cc8e6]",
    label: "Note",
  },
  tip: {
    icon: Lightbulb,
    frame: "border-[#6fcf9f]/30 bg-[#6fcf9f]/[0.05]",
    accent: "text-[#8edbb3]",
    label: "Tip",
  },
  warn: {
    icon: TriangleAlert,
    frame: "border-[#e8b54a]/35 bg-[#e8b54a]/[0.05]",
    accent: "text-[#f0c66b]",
    label: "Heads up",
  },
  perf: {
    icon: Gauge,
    frame: "border-quicx-orange/40 bg-quicx-orange/[0.06]",
    accent: "text-quicx-orange-bright",
    label: "Performance",
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
    <aside className={cn("max-w-[70ch] rounded-[3px] border px-5 py-4", v.frame)}>
      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <Icon aria-hidden className={cn("size-4 shrink-0", v.accent)} />
        <span className={cn("caps-label", v.accent)}>{v.label}</span>
        {title && (
          <span className="text-[15px] font-semibold leading-snug text-quicx-text">{title}</span>
        )}
      </p>
      <div className="mt-2 text-[15px] leading-[1.7] text-quicx-body [&_a]:text-quicx-orange-bright [&_a]:underline [&_a]:decoration-quicx-orange/40 [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-quicx-text">
        {children}
      </div>
    </aside>
  );
}
