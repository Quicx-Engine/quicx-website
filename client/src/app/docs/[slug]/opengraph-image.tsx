import { ImageResponse } from "next/og";
import {
  sectionMeta,
  sectionSlugs,
} from "@/components/site/docs/sections-meta";
import { LOGO_RATIO, OG, OG_SIZE, loadOgFonts, loadOgLogo } from "@/lib/og";

export const alt = "Quicx documentation";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return sectionSlugs.map((slug) => ({ slug }));
}

const LOGO_H = 56;

// Mirrors the docs page header: breadcrumb, condensed display title, lede.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = sectionMeta[slug] ?? sectionMeta["installation"];
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: OG.ground,
          padding: "50px 64px 52px",
          fontFamily: "Archivo",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={logo} width={Math.round(LOGO_H * LOGO_RATIO)} height={LOGO_H} alt="" />
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: "17px",
              letterSpacing: "1px",
              color: OG.dim,
            }}
          >
            {meta.num}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "22px",
              fontWeight: 500,
              color: OG.dim,
            }}
          >
            <span>Docs</span>
            <span>/</span>
            <span style={{ color: OG.muted }}>{meta.kicker}</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "18px",
              fontWeight: 900,
              fontSize: "112px",
              lineHeight: 0.9,
              letterSpacing: "-0.5px",
              textTransform: "uppercase",
              color: OG.text,
            }}
          >
            {meta.title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "26px",
              maxWidth: "1040px",
              fontSize: "26px",
              fontWeight: 400,
              lineHeight: 1.45,
              color: OG.body,
            }}
          >
            {meta.lede}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "36px",
            paddingTop: "18px",
            borderTop: `1px solid ${OG.hairline}`,
            fontFamily: "JetBrains Mono",
            fontWeight: 500,
            fontSize: "17px",
            color: OG.dim,
          }}
        >
          {`quicx.dev/docs/${slug}`}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
