import Image from "next/image";
import Link from "next/link";
import { CURRENT_VERSION } from "@/lib/version";
import { Container } from "./primitives";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.38 6.84 9.74.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.2-3.37-1.2-.46-1.17-1.12-1.49-1.12-1.49-.92-.64.07-.63.07-.63 1.01.07 1.55 1.06 1.55 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05.8-.23 1.65-.34 2.5-.35.85 0 1.7.12 2.5.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.56 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.58.69.48C19.14 20.62 22 16.78 22 12.25 22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const nav: { title: string; items: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Benchmarks", href: "/#measured" },
      { label: "Principles", href: "/#features" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Limits", href: "/#limits" },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Documentation", href: "/docs/installation" },
      { label: "Quick start", href: "/docs/quick-start" },
      { label: "CLI reference", href: "/docs/cli-reference" },
      { label: "Java client", href: "/docs/java-client" },
    ],
  },
  {
    title: "Releases",
    items: [
      { label: "Changelog", href: "/docs/changelog" },
      { label: "Binaries on GitHub", href: "https://github.com/Quicx-Engine/Quicx-Releases", external: true },
      { label: "Maven Central", href: "https://central.sonatype.com/artifact/dev.quicx/quicx-client", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-quicx-bg">
      <Container className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="col-span-2 md:col-span-5">
          <Image src="/quicx-logo.svg" alt="Quicx" width={130} height={34} className="h-8 w-auto" />
          <p className="mt-5 max-w-[36ch] text-[15px] leading-[1.6] text-quicx-muted">
            A deterministic task queue engine, built around an adaptive page allocator, a fixed
            memory budget and QXP, its own binary protocol.
          </p>
          <p className="mt-6 text-[14px] text-quicx-dim">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/dimitar-anastasov-339a94310/"
              className="text-quicx-body underline decoration-quicx-line-strong hover:text-quicx-text hover:decoration-quicx-orange"
            >
              Dimitar Anastasov
            </a>
          </p>
          <div className="mt-4 flex items-center gap-2">
            <FooterIconLink href="https://github.com/anastassow" label="GitHub">
              <GithubIcon className="size-4" />
            </FooterIconLink>
            <FooterIconLink href="https://www.linkedin.com/in/dimitar-anastasov-339a94310/" label="LinkedIn">
              <LinkedInIcon className="size-[14px]" />
            </FooterIconLink>
          </div>
        </div>

        {nav.map((col) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className={col.title === "Releases" ? "col-span-2 md:col-span-3" : "md:col-span-2"}
          >
            <h3 className="caps-label text-quicx-dim">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.items.map((it) => (
                <li key={it.label}>
                  {it.external ? (
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[14.5px] text-quicx-body transition-colors hover:text-quicx-text"
                    >
                      {it.label}
                    </a>
                  ) : (
                    <Link
                      href={it.href}
                      className="text-[14.5px] text-quicx-body transition-colors hover:text-quicx-text"
                    >
                      {it.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-quicx-line">
        <Container className="flex flex-col gap-2 py-6 text-[13px] text-quicx-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Quicx</p>
          <p className="font-mono text-[12px]">
            v{CURRENT_VERSION} · Linux · macOS
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex size-9 items-center justify-center rounded-[3px] border border-quicx-line-strong text-quicx-muted transition-colors hover:border-quicx-text/40 hover:text-quicx-text"
    >
      {children}
    </a>
  );
}
