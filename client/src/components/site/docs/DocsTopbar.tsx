import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { CURRENT_VERSION } from "@/lib/version";

export function DocsTopbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-[200] flex h-14 items-center gap-3 border-b border-quicx-line bg-quicx-bg/95 px-4 supports-[backdrop-filter]:bg-quicx-bg/85 supports-[backdrop-filter]:backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="-ml-1 flex size-9 items-center justify-center rounded-[3px] text-quicx-muted transition-colors hover:bg-white/[0.04] hover:text-quicx-text lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>
      <Link href="/" className="flex shrink-0 items-center" aria-label="Quicx home">
        <Image
          src="/quicx-logo.svg"
          alt="Quicx"
          width={90}
          height={24}
          priority
          className="h-6 w-auto select-none"
        />
      </Link>
      <span aria-hidden className="h-5 w-px bg-quicx-line-strong" />
      <Link
        href="/docs/installation"
        className="display text-[19px] leading-none text-quicx-text transition-colors hover:text-quicx-orange-bright"
      >
        Docs
      </Link>

      <div className="ml-auto flex items-center gap-5 text-[14px]">
        <Link href="/" className="hidden text-quicx-muted transition-colors hover:text-quicx-text sm:block">
          Home
        </Link>
        <a
          href="https://github.com/Quicx-Engine/Quicx-Releases"
          target="_blank"
          rel="noreferrer"
          className="hidden text-quicx-muted transition-colors hover:text-quicx-text sm:block"
        >
          Releases
        </a>
        <Link
          href="/docs/changelog"
          className="rounded-[2px] border border-quicx-orange/45 px-2 py-0.5 font-mono text-[12px] text-quicx-orange-bright transition-colors hover:border-quicx-orange hover:bg-quicx-orange/10"
          aria-label={`Version ${CURRENT_VERSION}, see changelog`}
        >
          v{CURRENT_VERSION}
        </Link>
      </div>
    </header>
  );
}
