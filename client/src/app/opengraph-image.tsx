import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quicx — Deterministic task queue engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#060d10",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-60px",
            width: "720px",
            height: "720px",
            background:
              "radial-gradient(circle, rgba(255,87,0,0.22), transparent 65%)",
          }}
        />
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #FF5700 25%, #FF7A33 50%, #FF5700 75%, transparent)",
          }}
        />
        {/* Diamond + label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "9px",
              height: "9px",
              background: "#FF5700",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              color: "#FF7A33",
              fontSize: "13px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
              fontWeight: 600,
            }}
          >
            Task Queue Engine
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.0,
            letterSpacing: "-3px",
            fontFamily: "Arial Black, Arial, sans-serif",
            marginBottom: "20px",
          }}
        >
          Quicx
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#8a9ba8",
            fontFamily: "Arial, sans-serif",
            marginBottom: "44px",
            maxWidth: "760px",
            lineHeight: 1.45,
          }}
        >
          Deterministic task queue. PMAD slab allocator. Zero jitter. 63 KB.
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
    { ...size }
  );
}
