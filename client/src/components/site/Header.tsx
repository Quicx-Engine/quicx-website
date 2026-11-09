import Image from "next/image";
import Link from "next/link";
import { Container, ButtonLink } from "./primitives";

const links = [
  { label: "Benchmarks", href: "/#measured" },
  { label: "Principles", href: "/#features" },
  { label: "Architecture", href: "/#architecture" },
  { label: "Limits", href: "/#limits" },
  { label: "Docs", href: "/docs/installation" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-quicx-line bg-quicx-bg/[0.92] supports-[backdrop-filter]:bg-quicx-bg/80 supports-[backdrop-filter]:backdrop-blur-md">
      <Container className="flex h-[var(--header-h)] items-center gap-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Quicx home">
          <Image
            src="/quicx-logo.svg"
            alt="Quicx"
            width={110}
            height={28}
            priority
            className="h-[26px] w-auto select-none"
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[14px] text-quicx-muted">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-quicx-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <a
            href="https://github.com/Quicx-Engine/Quicx-Releases"
            target="_blank"
            rel="noreferrer"
            className="hidden text-[14px] text-quicx-muted transition-colors hover:text-quicx-text sm:block"
          >
            Releases
          </a>
          <Link
            href="/docs/installation"
            className="text-[14px] text-quicx-muted transition-colors hover:text-quicx-text md:hidden"
          >
            Docs
          </Link>
          <ButtonLink href="/docs/quick-start" size="sm">
            Get started
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
