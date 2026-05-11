import { DocsContent } from "@/components/site/docs/DocsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Official documentation for Quicx — install the daemon, configure the PMAD allocator, learn the binary protocol, and integrate the Java client.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Quicx Documentation",
    description:
      "Install, configure and extend Quicx — the deterministic task queue engine built on the PMAD slab allocator and a compact binary protocol.",
    url: "https://quicx.dev/docs",
    type: "website",
  },
  twitter: {
    title: "Quicx Documentation",
    description:
      "Install, configure and extend Quicx — PMAD slab allocator, binary protocol, Java client, CLI reference.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://quicx.dev",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Documentation",
      "item": "https://quicx.dev/docs",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Quicx Documentation",
  "description":
    "Official documentation for Quicx — install the daemon, configure the PMAD allocator, learn the binary protocol, and integrate the Java client.",
  "url": "https://quicx.dev/docs",
  "inLanguage": "en-US",
  "author": {
    "@type": "Person",
    "name": "Dimitar Anastasov",
    "url": "https://www.linkedin.com/in/dimitar-anastasov-339a94310/",
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nefara",
    "url": "https://www.nefara.org",
  },
  "datePublished": "2026-04-21",
  "dateModified": "2026-05-11",
  "about": {
    "@type": "SoftwareApplication",
    "name": "Quicx",
    "url": "https://quicx.dev",
  },
};

export default function DocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <DocsContent />
    </>
  );
}
