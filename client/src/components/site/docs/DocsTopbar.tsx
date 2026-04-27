import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function DocsTopbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-[200] flex h-[52px] items-center gap-5 border-b border-quicx-line bg-quicx-bg/95 px-6 backdrop-blur-xl">
      <a href="/" className="flex shrink-0 items-center" aria-label="Quicx home">
        <Image
          src="/quicx-logo.svg"
          alt="Quicx"
          width={90}
          height={24}
          priority
          className="h-6 w-auto select-none"
        />
      </a>
      <div className="h-5 w-px bg-quicx-line" />
      <span className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.28em] text-quicx-dim">
        Documentation
      </span>
      <div className="ml-auto flex items-center gap-5">
        <a
          href="/"
          className="group flex items-center gap-1.5 font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.08em] text-quicx-muted transition hover:text-quicx-text"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Home
        </a>
        <a
          href="https://github.com/anastassow/Quicx"
          target="_blank"
          rel="noreferrer"
          className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.08em] text-quicx-muted transition hover:text-quicx-text"
        >
          GitHub
        </a>
        <span className="border border-quicx-orange/30 px-2 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[10.5px] text-quicx-orange">
          v1.0.0
        </span>
      </div>
    </header>
  );
}
