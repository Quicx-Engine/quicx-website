import Image from "next/image";

/**
 * A balanced marquee that works with only two brand logos.
 *
 * The row alternates between the Quicx wordmark, a Nefara lockup on a white
 * pill (Nefara is magenta-on-white and must NEVER sit on a dark surface),
 * and short Barlow-Condensed taglines separated by a diamond glyph. The
 * whole strip is duplicated and slides seamlessly — the gradient masks at
 * each edge hide the seam.
 */

type Item =
  | { kind: "quicx" }
  | { kind: "nefara" }
  | { kind: "tag"; text: string };

const items: Item[] = [
  { kind: "quicx" },
  { kind: "tag", text: "Deterministic by design" },
  { kind: "nefara" },
  { kind: "tag", text: "From developers, by developers" },
  { kind: "quicx" },
  { kind: "tag", text: "0.181 ms avg latency" },
  { kind: "nefara" },
  { kind: "tag", text: "60 KB single binary" },
  { kind: "quicx" },
  { kind: "tag", text: "Bounded memory — always" },
];

export function LogoMarquee() {
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

      {/* Optional label centered above the track */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-10 text-center lg:px-10">
        <p className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.35em] text-quicx-dim">
          Trusted primitives · built to last
        </p>
      </div>

      <div className="relative mt-6 flex w-max animate-marquee items-center gap-14 pb-10">
        {[...items, ...items].map((it, i) => (
          <MarqueeItem key={i} item={it} />
        ))}
      </div>
    </section>
  );
}

function MarqueeItem({ item }: { item: Item }) {
  if (item.kind === "quicx") {
    return (
      <div className="flex items-center justify-center px-4">
        <Image
          src="/quicx-logo.svg"
          alt="Quicx"
          width={150}
          height={36}
          className="h-8 w-auto opacity-70"
        />
      </div>
    );
  }

  if (item.kind === "nefara") {
    return (
      <div className="flex items-center justify-center rounded-full bg-white px-7 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
        <Image
          src="/nefara-logo.svg"
          alt="Nefara"
          width={140}
          height={32}
          className="h-7 w-auto"
        />
      </div>
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
