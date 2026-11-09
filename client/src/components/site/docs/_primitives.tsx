import React from "react";
import { sectionMeta } from "@/components/site/docs/sections-meta";

export function SectionHeaderFor({ slug }: { slug: string }) {
  const m = sectionMeta[slug];
  if (!m) return null;
  return (
    <SectionHeader
      num={m.num}
      kicker={m.kicker}
      title={m.title}
      id={slug}
      lede={m.lede}
    />
  );
}

/**
 * The page title block: where the reader stands (section group and its manual
 * number), the title in the display voice, and the lede that answers what the
 * page is for.
 */
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
    <header className="scroll-mt-24 border-b border-quicx-line pb-9" id={id}>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 text-[13px] text-quicx-dim">
          <li>Docs</li>
          <li aria-hidden>/</li>
          <li>{kicker}</li>
          <li aria-hidden className="ml-auto font-mono text-[12px] text-quicx-dim">
            {num}
          </li>
        </ol>
      </nav>
      <h1 className="display mt-5 text-[clamp(2.5rem,5.2vw,3.75rem)] text-quicx-text">{title}</h1>
      {lede && (
        <p className="mt-6 max-w-[64ch] text-[18px] leading-[1.6] text-quicx-body">{lede}</p>
      )}
    </header>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[70ch] space-y-5 text-[16px] leading-[1.75] text-quicx-body [&_a]:text-quicx-orange-bright [&_a]:underline [&_a]:decoration-quicx-orange/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-quicx-orange [&_em]:text-quicx-text [&_strong]:font-semibold [&_strong]:text-quicx-text">
      {children}
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[3px] border border-quicx-line bg-white/[0.045] px-[0.35em] py-[0.1em] font-mono text-[0.86em] text-quicx-text [overflow-wrap:anywhere]">
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
      className="group scroll-mt-24 pt-6 text-[24px] font-semibold leading-tight tracking-[-0.015em] text-quicx-text"
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 font-mono text-[0.7em] text-quicx-dim opacity-0 transition-opacity hover:text-quicx-orange-bright focus-visible:opacity-100 group-hover:opacity-100"
        >
          #
        </a>
      )}
    </h3>
  );
}

export function KeyList({
  items,
}: {
  items: { term: string; def: React.ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-quicx-line border-y border-quicx-line">
      {items.map((it) => (
        <div
          key={it.term}
          className="grid grid-cols-1 gap-1.5 py-4 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-6"
        >
          <dt className="font-mono text-[13.5px] leading-[1.7] text-quicx-orange-bright [overflow-wrap:anywhere]">
            {it.term}
          </dt>
          <dd className="text-[15px] leading-[1.7] text-quicx-body">{it.def}</dd>
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
    <div className="overflow-x-auto border-y border-quicx-line">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-quicx-line-strong">
            {headers.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="whitespace-nowrap py-3 pr-5 caps-label font-normal text-quicx-dim last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular">
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-quicx-line last:border-b-0">
              {r.map((c, j) => (
                <td
                  key={j}
                  className={
                    j === highlight
                      ? "py-3 pr-5 align-top text-quicx-orange-bright last:pr-0"
                      : j === 0
                        ? "py-3 pr-5 align-top text-quicx-text last:pr-0"
                        : "py-3 pr-5 align-top text-quicx-body last:pr-0"
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
  );
}
