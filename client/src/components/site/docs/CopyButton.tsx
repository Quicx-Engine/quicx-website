"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore — clipboard access may be denied in sandboxes
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex h-7 items-center gap-1.5 rounded-[2px] px-2.5 font-control text-[11.5px] text-quicx-dim transition-colors hover:bg-white/[0.05] hover:text-quicx-text"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <>
          <Check aria-hidden className="size-3.5 text-quicx-orange-bright" />
          Copied
        </>
      ) : (
        <>
          <Copy aria-hidden className="size-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
