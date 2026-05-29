import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  /** Show the one-dark-ish trio of window dots like the terminal */
  window?: boolean;
  copyable?: boolean;
  className?: string;
};

/**
 * A branded, monospace code block. Matches the card surfaces used elsewhere
 * on the site (`#061219` inside the tiles on the landing page) so code in
 * the docs feels like it's part of the same product.
 */
export function CodeBlock({
  code,
  language,
  filename,
  window: showWindow,
  copyable = true,
  className,
}: CodeBlockProps) {

  const label = filename ?? language ?? "";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/10 bg-[#061219] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className
      )}
    >
      {(label || showWindow || copyable) && (
        <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-3 py-2">
          <div className="flex items-center gap-2">
            {showWindow && (
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
                <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
                <span className="size-2.5 rounded-full bg-[#28c840]/80" />
              </div>
            )}
            {label && (
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-wide text-quicx-dim">
                {label}
              </span>
            )}
          </div>
          {copyable && (
            <CopyButton code={code} />
          )}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] leading-relaxed text-quicx-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}
