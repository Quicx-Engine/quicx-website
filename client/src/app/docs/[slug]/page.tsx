import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  sectionComponents,
  sectionMeta,
  sectionSlugs,
} from "@/components/site/docs/sections";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return sectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = sectionMeta[slug];
  if (!meta) return {};
  const url = `https://quicx.dev/docs/${slug}`;
  return {
    title: `${meta.title} — Quicx Docs`,
    description: meta.description,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: {
      title: `${meta.title} — Quicx Docs`,
      description: meta.description,
      url,
      type: "article",
    },
    twitter: {
      title: `${meta.title} — Quicx Docs`,
      description: meta.description,
    },
  };
}

export default async function DocsSectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const Section = sectionComponents[slug];
  const meta = sectionMeta[slug];
  if (!Section || !meta) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://quicx.dev" },
      { "@type": "ListItem", "position": 2, "name": "Documentation", "item": "https://quicx.dev/docs" },
      {
        "@type": "ListItem",
        "position": 3,
        "name": meta.title,
        "item": `https://quicx.dev/docs/${slug}`,
      },
    ],
  };

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${meta.title} — Quicx Documentation`,
    "description": meta.description,
    "url": `https://quicx.dev/docs/${slug}`,
    "inLanguage": "en-US",
    "author": {
      "@type": "Person",
      "name": "Dimitar Anastasov",
      "url": "https://www.linkedin.com/in/dimitar-anastasov-339a94310/",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Quicx",
      "url": "https://quicx.dev",
    },
    "datePublished": "2026-04-21",
    "dateModified": "2026-05-11",
    "about": {
      "@type": "SoftwareApplication",
      "name": "Quicx",
      "url": "https://quicx.dev",
    },
  };

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
      <Section />
    </>
  );
}
