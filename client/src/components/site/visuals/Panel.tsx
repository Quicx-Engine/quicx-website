import { cn } from "@/lib/utils";

/**
 * One division of an instrument: a mono title strip over its body. Panels sit
 * inside a single framed well and are separated by hairlines, never boxed.
 */
export function Panel({
  title,
  meta,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex min-h-0 min-w-0 flex-col", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-quicx-line px-4 py-2.5 font-mono text-[11.5px]">
        <span className="truncate text-quicx-dim">{title}</span>
        {meta && <span className="shrink-0 text-quicx-orange-bright">{meta}</span>}
      </header>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
