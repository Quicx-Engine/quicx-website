import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-quicx-line bg-quicx-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#" className="flex items-center" aria-label="Quicx home">
          <Image
            src="/quicx-logo.svg"
            alt="Quicx"
            width={110}
            height={28}
            priority
            className="h-7 w-auto select-none"
          />
        </a>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-quicx-muted md:flex">
          <a
            className="transition hover:text-quicx-text"
            href="#features"
          >
            Features
          </a>
          <a
            className="transition hover:text-quicx-text"
            href="#architecture"
          >
            Architecture
          </a>
          <a
            className="transition hover:text-quicx-text"
            href="#performance"
          >
            Performance
          </a>
          <a
            className="transition hover:text-quicx-text"
            href="#docs"
          >
            Docs
          </a>
        </nav>

        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded border-quicx-orange/60 bg-transparent px-4 font-[family-name:var(--font-barlow-condensed)] text-[15px] font-semibold uppercase tracking-wide text-quicx-orange hover:border-quicx-orange hover:bg-quicx-orange/10 hover:text-quicx-orange-bright"
        >
          Try Quicx
        </Button>
      </div>
    </header>
  );
}
