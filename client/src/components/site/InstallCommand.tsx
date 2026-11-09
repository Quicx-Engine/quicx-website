"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const INSTALL_COMMAND = "curl -fsSL https://quicx.dev/install.sh | sh";

/** The install one-liner as a working control: the whole bar copies. */
export function InstallCommand({
  tone = "default",
  emphasis = false,
  className,
}: {
  tone?: "default" | "onOrange";
  /** The page's primary action: the copy control carries the accent. */
  emphasis?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be denied (insecure context, sandboxed frame); the
      // command stays selectable as text.
    }
  };

  const onOrange = tone === "onOrange";

  return (
    <div
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-[3px] border font-mono text-[13.5px]",
        onOrange
          ? "border-quicx-on-orange bg-quicx-on-orange text-quicx-text"
          : emphasis
            ? "border-quicx-orange/70 bg-quicx-well text-quicx-text"
            : "border-quicx-line-strong bg-quicx-well text-quicx-text",
        className
      )}
    >
      <code className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 sm:items-center sm:whitespace-nowrap">
        <span aria-hidden className="select-none text-quicx-orange">
          $
        </span>
        <span className="min-w-0">{INSTALL_COMMAND}</span>
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Install command copied" : "Copy install command"}
        className={cn(
          "flex shrink-0 items-center justify-center gap-1.5 border-l px-3.5 font-control text-[12px] transition-colors",
          emphasis
            ? "border-quicx-orange bg-quicx-orange px-4 text-quicx-on-orange hover:bg-quicx-orange-bright active:bg-quicx-orange-deep"
            : onOrange
              ? "border-white/10 text-quicx-muted hover:bg-white/[0.04] hover:text-quicx-text"
              : "border-quicx-line-strong text-quicx-muted hover:bg-white/[0.04] hover:text-quicx-text"
        )}
      >
        {copied ? (
          <>
            <Check aria-hidden className={emphasis ? "copy-check size-3.5" : "copy-check size-3.5 text-quicx-orange-bright"} />
            Copied
          </>
        ) : (
          <>
            <Copy aria-hidden className="size-3.5" />
            Copy
          </>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
