"use client"

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
        // ignore — clipboard access may be denied in sandboxes
        }
    };

    return (
        <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10.5px] uppercase tracking-wider text-quicx-dim transition hover:border-quicx-orange/40 hover:text-quicx-orange-bright"
            aria-label="Copy code"
        >
            {copied ? (
                <>
                    <Check className="size-3 text-quicx-orange-bright" />
                    copied
                </>
            ) : (
                <>
                    <Copy className="size-3" />
                    copy
                </>
            )}
        </button>
    )
}