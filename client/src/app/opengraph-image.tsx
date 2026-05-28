import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quicx — Deterministic task queue engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })
  ).text();
  const match = css.match(
    /src: url\((https:\/\/[^)]+\.(?:ttf|otf))\) format/
  );
  if (!match) throw new Error(`Could not extract font URL for ${family}`);
  return await (await fetch(match[1])).arrayBuffer();
}

export default async function Image() {
  const [archivo400, archivo600, jetbrains500] = await Promise.all([
    loadGoogleFont("Archivo", 400),
    loadGoogleFont("Archivo", 600),
    loadGoogleFont("JetBrains Mono", 500),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b1920",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* bg-grid (opacity 0.5) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            display: "flex",
          }}
        />
        {/* radial-hero-glow — top ellipse */}
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "1200px",
            height: "600px",
            transform: "translateY(-50%)",
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(255,87,0,0.12) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        {/* radial-hero-glow — bottom ellipse */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0px",
            width: "1200px",
            height: "550px",
            transform: "translateY(50%)",
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(255,87,0,0.05) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        {/* Top hairline — via-quicx-line-strong */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "1px",
            backgroundImage:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)",
            display: "flex",
          }}
        />
        {/* Bottom hairline — via-quicx-orange/30 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "1200px",
            height: "2px",
            backgroundImage:
              "linear-gradient(to right, transparent, rgba(255,87,0,0.3), transparent)",
            display: "flex",
          }}
        />
        {/* Docs-style kicker: num — gradient line — label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "16px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "4.8px",
          }}
        >
          <span style={{ color: "#6a7487" }}>Quicx</span>
          <div
            style={{
              display: "flex",
              width: "48px",
              height: "2px",
              flexShrink: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(255,87,0,0.7), transparent)",
            }}
          />
          <span style={{ color: "#ff7a33" }}>Configure it once. Run it forever.</span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 600,
            color: "#f4f6fb",
            lineHeight: 1.1,
            fontFamily: "Archivo, Arial, sans-serif",
            marginBottom: "20px",
          }}
        >
          Quicx - Deterministic Task Queue Engine
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#8a9ba8",
            fontFamily: "Archivo, Arial, sans-serif",
            marginBottom: "44px",
            maxWidth: "760px",
            lineHeight: 1.45,
          }}
        >
          PMAD slab allocator. Zero jitter. 63 KB. 
        </div>

        {/* Stats badges */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "nowrap" }}>
          {["19.1 ns alloc", ">460 M ops/s", "63 KB binary", "0% fragmentation"].map(
            (stat) => (
              <div
                key={stat}
                style={{
                  fontSize: "13px",
                  color: "#FF7A33",
                  border: "1px solid rgba(255,87,0,0.38)",
                  background: "rgba(255,87,0,0.07)",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  letterSpacing: "0.6px",
                  whiteSpace: "nowrap",
                }}
              >
                {stat}
              </div>
            )
          )}
        </div>

        {/* URL watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            right: "64px",
            fontSize: "16px",
            color: "rgba(138,155,168,0.5)",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "2px",
          }}
        >
          quicx.dev
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Archivo",
          data: archivo400,
          weight: 400,
          style: "normal",
        },
        {
          name: "Archivo",
          data: archivo600,
          weight: 600,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: jetbrains500,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
