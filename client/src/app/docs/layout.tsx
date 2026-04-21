import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — Quicx",
  description:
    "Install, configure and extend Quicx — the deterministic task queue engine built around the PMAD slab allocator and a compact binary protocol.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
