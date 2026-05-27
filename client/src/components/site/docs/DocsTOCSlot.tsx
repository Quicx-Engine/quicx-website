"use client";

import { usePathname } from "next/navigation";
import { DocsTOC } from "@/components/site/docs/DocsTOC";
import { sectionMeta } from "@/components/site/docs/sections";

export function DocsTOCSlot() {
  const pathname = usePathname();
  const slug = pathname?.startsWith("/docs/")
    ? pathname.slice("/docs/".length).split("/")[0].split("#")[0]
    : "";
  const entries = sectionMeta[slug]?.toc ?? [];
  return <DocsTOC entries={entries} />;
}
