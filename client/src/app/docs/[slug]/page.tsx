import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import {
  sectionComponents,
  sectionMeta,
  sectionSlugs,
} from "@/components/site/docs/sections";
import { SITE_URL, baseOpenGraph } from "@/lib/seo";

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

  // /docs is a 308 to installation, so the "Documentation" crumb points
  // straight at the destination. On the installation page itself that crumb
  // and the page crumb would be the same URL twice, so it is left out there.
  const docsHome = `${SITE_URL}/docs/installation`;
  const pageUrl = `${SITE_URL}/docs/${slug}`;
  const crumbs = [
    { name: "Home", item: SITE_URL },
    ...(pageUrl === docsHome ? [] : [{ name: "Documentation", item: docsHome }]),
    { name: meta.title, item: pageUrl },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": c.name,
      "item": c.item,
    })),
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
      {/* Same place, different content: the article cross-fades on navigation
          while the sidebar and header stay put. */}
      <ViewTransition key={slug} enter="docs-in" exit="docs-out" default="none">
        <Section />
      </ViewTransition>
    </>
  );
}
