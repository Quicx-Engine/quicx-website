import Image from "next/image";
import { BookOpen } from "lucide-react";

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

const nav: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "#features" },
      { label: "Architecture", href: "#architecture" },
      { label: "Performance", href: "#performance" },
      { label: "Changelog", href: "/docs#changelog" },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "Quick start", href: "/docs#quick-start" },
      { label: "CLI reference", href: "/docs#cli-reference" },
      { label: "Java client", href: "/docs#java-client" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Nefara", href: "https://www.nefara.org" },
      { label: "Contact", href: "https://www.nefara.org/en#contact" },
      { label: "Security", href: "#" },
      { label: "License", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-quicx-line bg-quicx-bg">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

      {/* Main footer */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-2 gap-10 px-6 py-16 lg:grid-cols-5 lg:gap-16 lg:px-10">
        {/* Brand column */}
        <div className="col-span-2 lg:col-span-2">
          <Image
            src="/quicx-logo.svg"
            alt="Quicx"
            width={130}
            height={34}
            className="h-8 w-auto"
          />
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-quicx-muted">
            A deterministic task queue engine, built around a custom slab
            allocator and a tight binary protocol. From developers, by
            developers.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <FooterIconLink href="https://github.com/anastassow" label="GitHub">
              <GithubIcon className="size-4" />
            </FooterIconLink>
            <FooterIconLink href="https://www.linkedin.com/in/dimitar-anastasov-339a94310/" label="LinkedIn">
              <LinkedInIcon className="size-[14px]" />
            </FooterIconLink>
            <FooterIconLink href="/docs" label="Documentation">
              <BookOpen className="size-4" />
            </FooterIconLink>
          </div>
        </div>

        {/* Nav columns */}
        {nav.map((col) => (
          <div key={col.title}>
            <h4 className="font-[family-name:var(--font-barlow-condensed)] text-xs uppercase tracking-[0.28em] text-quicx-orange-bright">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    className="text-[14px] text-quicx-muted transition hover:text-quicx-text"
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Built-by strip — Nefara logo MUST sit on white */}
      <div className="relative border-t border-quicx-line bg-quicx-bg">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 lg:flex-row lg:px-10">
          <p className="font-[family-name:var(--font-barlow-condensed)] text-sm uppercase tracking-[0.3em] text-quicx-dim">
            <span className="text-quicx-orange-bright">“</span>
            Never Far Away
            <span className="text-quicx-orange-bright">”</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[12px] uppercase tracking-[0.24em] text-quicx-dim">
              Built by
            </span>
            {/* White surface for Nefara */}
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <Image
                src="/nefara-logo.svg"
                alt="Nefara"
                width={110}
                height={28}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="relative border-t border-quicx-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[12px] text-quicx-dim sm:flex-row lg:px-10">
          <p>
            © {new Date().getFullYear()} Nefara. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a className="hover:text-quicx-text" href="#">
              Privacy
            </a>
            <a className="hover:text-quicx-text" href="#">
              Terms
            </a>
            <a className="hover:text-quicx-text" href="#">
              License
            </a>
          </div>
        </div>
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
      className="inline-flex size-9 items-center justify-center rounded-md border border-quicx-line bg-white/[0.02] text-quicx-muted transition hover:border-white/20 hover:text-quicx-text"
    >
      {children}
    </a>
  );
}
