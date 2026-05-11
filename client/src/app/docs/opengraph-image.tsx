import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quicx Documentation — Install, configure and extend Quicx";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const sections = [
    "Installation",
    "Quick Start",
    "Configuration",
    "Architecture",
    "PMAD Allocator",
    "Binary Protocol",
    "CLI Reference",
    "Java Client",
  ];

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
        {/* Orange radial glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(255,87,0,0.18), transparent 65%)",
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

        {/* Section pills — top right */}
        <div
          style={{
            position: "absolute",
            top: "52px",
            right: "64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          {sections.map((s) => (
            <div
              key={s}
              style={{
                fontSize: "11px",
                color: "rgba(138,155,168,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                padding: "5px 12px",
                borderRadius: "4px",
                fontFamily: "monospace",
                letterSpacing: "0.4px",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Diamond + label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
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
            Documentation
          </span>
        </div>

        {/* Breadcrumb */}
        <div
          style={{
            fontSize: "14px",
            color: "rgba(138,155,168,0.5)",
            fontFamily: "monospace",
            marginBottom: "16px",
            letterSpacing: "1px",
          }}
        >
          quicx.dev / docs
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: "76px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.0,
            letterSpacing: "-2px",
            fontFamily: "Arial Black, Arial, sans-serif",
            marginBottom: "20px",
          }}
        >
          Quicx Docs
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "#8a9ba8",
            fontFamily: "Arial, sans-serif",
            maxWidth: "640px",
            lineHeight: 1.5,
          }}
        >
          Install, configure and extend Quicx — the PMAD-backed task queue
          engine with a binary protocol.
        </div>
      </div>
    ),
    { ...size }
  );
}
