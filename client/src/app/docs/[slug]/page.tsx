import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  sectionComponents,
  sectionMeta,
  sectionSlugs,
} from "@/components/site/docs/sections";
import { SITE_URL, baseOpenGraph, baseTwitter } from "@/lib/seo";

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
  const url = `${SITE_URL}/docs/${slug}`;
  const title = `${meta.title} - Quicx Docs`;
  const description = meta.description ?? meta.lede;
  return {
    // absolute: the root template would otherwise append a second "| Quicx"
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      url,
      type: "article",
      publishedTime: "2026-04-21",
      modifiedTime: meta.updated,
    },
    twitter: {
      ...baseTwitter,
      card: "summary_large_image",
      title,
      description,
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
    "headline": `${meta.title} - Quicx Documentation`,
    "description": meta.description ?? meta.lede,
    "url": `https://quicx.dev/docs/${slug}`,
    "mainEntityOfPage": `https://quicx.dev/docs/${slug}`,
    "image": `https://quicx.dev/docs/${slug}/opengraph-image`,
    "inLanguage": "en-US",
    "author": {
      "@type": "Person",
      "name": "Dimitar Anastasov",
      "url": "https://www.linkedin.com/in/dimitar-anastasov-339a94310/",
    },
    "publisher": {
      "@id": "https://quicx.dev/#organization"
    },
    "datePublished": "2026-04-21",
    "dateModified": meta.updated,
    "about": {
      "@id": "https://quicx.dev/#software"
    },
    "isPartOf": {
      "@id": "https://quicx.dev/#website"
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
