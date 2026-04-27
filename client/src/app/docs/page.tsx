import { DocsContent } from "@/components/site/docs/DocsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | Quicx",
  description:
    "Official documentation for Quicx. Learn how to install, configure, and scale your task queue engine.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  return <DocsContent />;
}
