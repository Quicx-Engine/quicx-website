import React from "react";

export function SectionHeader({
  num,
  kicker,
  title,
  id,
  lede,
}: {
  num: string;
  kicker: string;
  title: string;
  id: string;
  lede?: string;
}) {
  return (
    <header className="scroll-mt-24 border-b border-quicx-line pb-6" id={id}>
      <div className="flex items-center gap-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.3em]">
        <span className="text-quicx-dim">{num}</span>
        <span className="h-px w-8 bg-gradient-to-r from-quicx-orange/70 to-transparent" />
        <span className="text-quicx-orange-bright">{kicker}</span>
      </div>
      <h2 className="mt-3 font-[family-name:var(--font-archivo)] text-[clamp(1.75rem,3.6vw,2.4rem)] font-semibold leading-[1.1] text-quicx-text">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-quicx-muted">
          {lede}
        </p>
      )}
    </header>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-[14.5px] leading-relaxed text-quicx-muted [&_strong]:font-semibold [&_strong]:text-quicx-text [&_a]:text-quicx-orange-bright [&_a]:underline [&_a]:decoration-quicx-orange/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-quicx-orange">
      {children}
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] text-quicx-text">
      {children}
    </code>
  );
}

export function SubHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="scroll-mt-24 font-[family-name:var(--font-archivo)] text-[20px] font-semibold text-quicx-text"
    >
      {children}
    </h3>
  );
}

export function KeyList({
  items,
}: {
  items: { term: string; def: React.ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-quicx-line overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
      {items.map((it) => (
        <div
          key={it.term}
          className="grid grid-cols-1 gap-2 px-4 py-3.5 md:grid-cols-[200px_1fr] md:gap-6"
        >
          <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] text-quicx-orange-bright">
            {it.term}
          </dt>
          <dd className="text-[13.5px] leading-relaxed text-quicx-muted">
            {it.def}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Table({
  headers,
  rows,
  highlight,
}: {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  highlight?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-quicx-line bg-white/[0.02]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 font-[family-name:var(--font-barlow-condensed)] text-[11.5px] font-semibold uppercase tracking-[0.22em] text-quicx-dim"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-quicx-line/70 last:border-b-0">
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={
                      j === highlight
                        ? "px-4 py-3 text-quicx-orange-bright"
                        : "px-4 py-3 text-quicx-muted"
                    }
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
