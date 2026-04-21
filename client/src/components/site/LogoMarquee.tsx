"use client";

import Image from "next/image";
import { useState } from "react";

type Item =
  | { kind: "nefara" }
  | { kind: "tag"; text: string };

const items: Item[] = [
  { kind: "tag", text: "Deterministic by design" },
  { kind: "nefara" },
  { kind: "tag", text: "From developers, by developers" },
  { kind: "tag", text: "0.181 ms avg latency" },
  { kind: "nefara" },
  { kind: "tag", text: "63 KB single binary" },
  { kind: "tag", text: "Bounded memory — always" },
];

export function LogoMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Brand marquee"
      className="relative overflow-hidden border-y border-quicx-line bg-quicx-bg-2"
    >
      {/* subtle top/bottom separators */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-quicx-bg-2 via-quicx-bg-2/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-quicx-bg-2 via-quicx-bg-2/80 to-transparent" />

      {/* label */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-10 text-center lg:px-10">
        <p className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.35em] text-quicx-dim">
          Trusted primitives · built to last
        </p>
      </div>

      <div
        className="relative mt-6 flex w-max animate-marquee items-center gap-14 pb-10"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[...items, ...items].map((it, i) => (
          <MarqueeItem key={i} item={it} onHover={setPaused} />
        ))}
      </div>
    </section>
  );
}

function MarqueeItem({
  item,
  onHover,
}: {
  item: Item;
  onHover: (paused: boolean) => void;
}) {
  if (item.kind === "nefara") {
    return (
      <a
        href="https://nefara.org"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className="flex items-center justify-center rounded-full bg-white px-7 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
      >
        <Image
          src="/nefara-logo.svg"
          alt="Nefara"
          width={140}
          height={32}
          className="h-7 w-auto"
        />
      </a>
    );
  }

  return (
    <span className="inline-flex items-center gap-4 whitespace-nowrap font-[family-name:var(--font-barlow-condensed)] text-[13px] uppercase tracking-[0.32em] text-quicx-muted">
      <DiamondGlyph className="size-2 text-quicx-orange-bright" />
      <span>{item.text}</span>
      <DiamondGlyph className="size-2 text-quicx-orange-bright" />
    </span>
  );
}

function DiamondGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden {...props}>
      <path d="M4 0l4 4-4 4-4-4z" />
    </svg>
  );
}
